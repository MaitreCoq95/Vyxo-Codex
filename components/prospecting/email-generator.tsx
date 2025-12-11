"use client"

import { useState } from "react"
import { Loader2, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { EmailEditor } from "./email-editor"

interface EmailVariation {
  type: string
  subject: string
  body: string
}

interface SequenceStep {
  step: string
  subject: string
  body: string
}

interface AIResponse {
  analysis: string
  variations: EmailVariation[]
  sequence: SequenceStep[]
}

export function EmailGenerator() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResponse | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    prospectName: "",
    companyName: "",
    industry: "",
    triggerEvent: "",
    painPoint: "",
    valueProp: "",
    cta: "15-minute discovery call",
  })

  const handleGenerate = async () => {
    if (!formData.prospectName || !formData.companyName) {
      toast({
        variant: "destructive",
        title: t("email.missingInfo"),
        description: t("email.missingInfoDesc"),
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate")
      }

      const data = await response.json()
      setResult(data)
      toast({
        title: t("email.campaignGenerated"),
        description: t("email.campaignGeneratedDesc"),
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error("Generation error:", error)
      toast({
        variant: "destructive",
        title: t("email.generationFailed"),
        description: errorMessage || t("email.generationFailedDesc"),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToCRM = async () => {
    if (!result) return
    setLoading(true)

    try {
      // 1. Create Client (Lead)
      const clientRes = await fetch('/api/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.companyName,
          contact_email: '', // We don't have email in form yet, maybe add it?
          status: 'lead',
          notes: `Prospect: ${formData.prospectName}\nIndustry: ${formData.industry}\nPain Point: ${formData.painPoint}`
        })
      })

      if (!clientRes.ok) throw new Error('Failed to create client')
      const client = await clientRes.json()

      // 2. Log Activity (Campaign Generated)
      const activityRes = await fetch('/api/crm/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: 'client',
          entity_id: client.id,
          action: 'campaign_generated',
          description: `Generated outreach campaign for ${formData.prospectName}`,
          metadata: result
        })
      })

      if (!activityRes.ok) throw new Error('Failed to log activity')

      toast({
        title: t("email.savedToCrm"),
        description: `${formData.companyName} ${t("email.savedToCrmDesc")}`,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error("CRM Save error:", error)
      toast({
        variant: "destructive",
        title: t("email.saveFailed"),
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 h-[calc(100vh-200px)]">
      {/* Left Column: Inputs */}
      <Card className="lg:col-span-4 h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-vyxo-gold" />
            {t("email.campaignSetup")}
          </CardTitle>
          <CardDescription>
            {t("email.defineStrategy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("email.prospectName")}</Label>
            <Input 
              placeholder={t("email.prospectNamePlaceholder")} 
              value={formData.prospectName}
              onChange={(e) => setFormData({...formData, prospectName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("email.companyName")}</Label>
            <Input 
              placeholder={t("email.companyNamePlaceholder")} 
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("email.industry")}</Label>
            <Input 
              placeholder={t("email.industryPlaceholder")} 
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-vyxo-gold">{t("email.triggerEvent")}</Label>
            <Input 
              placeholder={t("email.triggerEventPlaceholder")} 
              value={formData.triggerEvent}
              onChange={(e) => setFormData({...formData, triggerEvent: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("email.painPoint")}</Label>
            <Input 
              placeholder={t("email.painPointPlaceholder")} 
              value={formData.painPoint}
              onChange={(e) => setFormData({...formData, painPoint: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("email.valueProp")}</Label>
            <Textarea 
              placeholder={t("email.valuePropPlaceholder")} 
              className="h-20 resize-none"
              value={formData.valueProp}
              onChange={(e) => setFormData({...formData, valueProp: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("email.cta")}</Label>
            <Input 
              placeholder={t("email.ctaPlaceholder")} 
              value={formData.cta}
              onChange={(e) => setFormData({...formData, cta: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("email.recipientEmail")}</Label>
            <Input 
              type="email"
              placeholder={t("email.recipientEmailPlaceholder")} 
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1 bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 font-semibold"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("email.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> {t("email.generateCampaign")}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="border-vyxo-gold text-vyxo-gold hover:bg-vyxo-gold/10"
              onClick={handleSaveToCRM}
              disabled={loading || !result}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> {t("email.saveToCrm")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Results */}
      <Card className="lg:col-span-8 h-full flex flex-col overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>{t("email.generatedCampaign")}</CardTitle>
          <CardDescription>
            {result ? result.analysis : t("email.strategyAppear")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Sparkles className="h-16 w-16 mb-4" />
              <p>{t("email.fillForm")}</p>
            </div>
          ) : (
            <Tabs defaultValue="variations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="variations">{t("email.emailVariations")}</TabsTrigger>
                <TabsTrigger value="sequence">{t("email.followUpSequence")}</TabsTrigger>
              </TabsList>

              <TabsContent value="variations" className="space-y-6">
                {result.variations.map((variation, index) => (
                  <EmailEditor
                    key={index}
                    initialSubject={variation.subject}
                    initialBody={variation.body}
                    type={variation.type}
                    onSave={(subject, body) => {
                      const updated = {...result}
                      updated.variations[index] = { ...variation, subject, body }
                      setResult(updated)
                    }}
                  />
                ))}
              </TabsContent>

              <TabsContent value="sequence" className="space-y-6">
                {result.sequence.map((step, index) => (
                  <EmailEditor
                    key={index}
                    initialSubject={step.subject}
                    initialBody={step.body}
                    type={step.step}
                    onSave={(subject, body) => {
                      const updated = {...result}
                      updated.sequence[index] = { ...step, subject, body }
                      setResult(updated)
                    }}
                  />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
