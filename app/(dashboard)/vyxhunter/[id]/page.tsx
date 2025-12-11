'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  Linkedin, 
  MapPin, 
  Users, 
  Brain, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Mail, 
  History,
  Download,
  File,
  Presentation,
  UserPlus,

  Unlock,
  Lock
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmailPreviewDialog } from '@/components/vyxhunter/email-preview-dialog'
import { GammaCustomizationDialog, type GammaGenerationOptions } from '@/components/vyxhunter/gamma-customization-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function CompanyPage() {
  const { id: companyId } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [generatingGamma, setGeneratingGamma] = useState(false)
  const [generatingEmail, setGeneratingEmail] = useState(false)
  
  // Email Preview State
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<any>(null)

  // New state for email customization
  const [contactName, setContactName] = useState('')
  const [emailStyle, setEmailStyle] = useState<'short' | 'structured'>('structured')
  
  // Gamma customization state
  const [isGammaDialogOpen, setIsGammaDialogOpen] = useState(false)

  // Decision Makers State
  const [decisionMakers, setDecisionMakers] = useState<any[]>([])
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [unlockingContact, setUnlockingContact] = useState<string | null>(null)

  useEffect(() => {
    fetchCompany()
  }, [companyId])

  useEffect(() => {
    if (company?.website || company?.name) {
      fetchDecisionMakers()
    }
  }, [company])

  async function fetchCompany() {
    try {
      if (!companyId) return

      const res = await fetch(`/api/vyxhunter/companies/${companyId}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch company')
      }

      const data = await res.json()
      
      if (!data.company) {
        throw new Error('Company not found')
      }

      setCompany(data.company)
    } catch (error) {
      console.error('Error fetching company:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'entreprise"
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchDecisionMakers() {
    try {
      setLoadingPeople(true)
      const res = await fetch('/api/prospecting/apollo/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          domain: company.website,
          name: company.name 
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        setDecisionMakers(data.people || [])
      }
    } catch (error) {
      console.error("Failed to fetch people", error)
    } finally {
      setLoadingPeople(false)
    }
  }

  async function handleUnlockContact(person: any) {
    try {
      setUnlockingContact(person.id)
      
      let emailToUse = person.email

      // 1. Reveal Email if needed
      if (!person.is_email_unlocked) {
        const revealRes = await fetch('/api/prospecting/apollo/reveal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: person.id })
        })

        if (revealRes.ok) {
          const revealData = await revealRes.json()
          if (revealData.email) {
            emailToUse = revealData.email
            // Update local state
            setDecisionMakers(prev => prev.map(p => p.id === person.id ? { ...p, email: emailToUse, is_email_unlocked: true } : p))
            toast({ title: "Email débloqué !", description: emailToUse })
          }
        }
      }

      // 2. Add to CRM/Contacts associated with this company
      const clientRes = await fetch('/api/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${person.first_name} ${person.last_name}`,
          sector: company.sector || 'Unknown',
          status: 'lead',
          city: person.city || company.location,
          contactName: `${person.first_name} ${person.last_name}`,
          contact_email: emailToUse !== 'Not available' ? emailToUse : undefined,
          company_id: companyId, 
          notes: `Imported from VyxHunter Company Page. Title: ${person.title}. LinkedIn: ${person.linkedin_url}`
        })
      })

      if (clientRes.ok) {
        toast({ title: "Contact ajouté !", description: `${person.first_name} a été ajouté au CRM.` })
      }

    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de débloquer/ajouter le contact" })
    } finally {
      setUnlockingContact(null)
    }
  }

  async function unlockEmailOnly(person: any) {
    try {
      setUnlockingContact(person.id)
      const revealRes = await fetch('/api/prospecting/apollo/reveal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: person.id })
      })

      if (revealRes.ok) {
          const revealData = await revealRes.json()
          if (revealData.email) {
            setDecisionMakers(prev => prev.map(p => p.id === person.id ? { ...p, email: revealData.email, is_email_unlocked: true } : p))
            toast({ title: "Email débloqué !", description: revealData.email })
          }
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de débloquer l'email" })
    } finally {
      setUnlockingContact(null)
    }
  }

  async function handleAnalyze() {
    try {
      setAnalyzing(true)
      toast({ title: "🔍 Analyse en cours...", description: "L'IA étudie l'entreprise" })
      
      const res = await fetch(`/api/vyxhunter/companies/${companyId}/analyze`, {
        method: 'POST'
      })
      
      if (!res.ok) throw new Error('Analysis failed')
      
      toast({ title: "✅ Analyse terminée !", description: "Les données ont été mises à jour" })
      fetchCompany()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    } finally {
      setAnalyzing(false)
    }
  }

  // Poll for Gamma status if generating
  useEffect(() => {
    if (!company) return
    
    let interval: NodeJS.Timeout
    const latestGamma = company.gammaSlides?.[0]

    if (latestGamma?.status === 'generating' || generatingGamma) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/vyxhunter/companies/${companyId}/gamma/status`)
          if (res.ok) {
            const data = await res.json()
            if (data.status === 'ready') {
              toast({ title: "✅ Slide prête !", description: "La présentation est disponible" })
              fetchCompany() // Refresh to show the link
              setGeneratingGamma(false)
              clearInterval(interval)
            } else if (data.status === 'failed') {
              toast({ variant: "destructive", title: "Erreur", description: "La génération a échoué" })
              fetchCompany()
              setGeneratingGamma(false)
              clearInterval(interval)
            }
          }
        } catch (e) {
          console.error("Polling error", e)
        }
      }, 3000) // Check every 3 seconds
    }

    return () => clearInterval(interval)
  }, [companyId, company, generatingGamma, toast, fetchCompany])

  // Open customization dialog
  function handleGenerateGamma() {
    setIsGammaDialogOpen(true)
  }

  // Generate with custom options from dialog
  async function handleGenerateWithOptions(options: GammaGenerationOptions) {
    try {
      setGeneratingGamma(true)
      toast({ title: "✨ Génération Gamma...", description: "Création de la slide de présentation" })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}/gamma`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      })

      if (!res.ok) throw new Error('Gamma generation failed')

      toast({ title: "⏳ Génération lancée", description: "Veuillez patienter quelques instants..." })
      fetchCompany() // Will show "generating" status and trigger polling
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
      setGeneratingGamma(false)
    }
  }

  // Export Gamma presentation as PDF or PPTX
  async function handleExportGamma(format: 'pdf' | 'pptx') {
    try {
      toast({ title: `📥 Export ${format.toUpperCase()}...`, description: "Préparation du fichier" })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}/gamma/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      })

      if (!res.ok) throw new Error('Export failed')

      const data = await res.json()
      
      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank')
      
      toast({ title: "✅ Export réussi", description: `Fichier ${format.toUpperCase()} prêt` })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    }
  }

  async function handleGenerateEmail() {
    try {
      setGeneratingEmail(true)
      toast({ title: "✉️ Génération email...", description: "L'IA rédige l'email" })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: 'contact@example.com', // Placeholder, will be editable
          recipientName: contactName || company?.name,
          contactName: contactName,
          emailType: 'initial',
          emailStyle: emailStyle
        })
      })

      if (!res.ok) throw new Error('Email generation failed')

      toast({ title: "✅ Email généré !", description: "Brouillon créé" })
      fetchCompany()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    } finally {
      setGeneratingEmail(false)
    }
  }


  async function handleLogManualEmail() {
    try {
      if (!confirm("Confirmez-vous avoir envoyé un email manuellement à cette entreprise ?\n\nCela mettra à jour le statut en 'Contacté' et programmera la relance dans 7 jours.")) return

      toast({ title: "Enregistrement...", description: "Mise à jour du statut" })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}/log-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: contactName || company?.name,
          emailType: 'initial'
        })
      })

      if (!res.ok) throw new Error('Failed to log email')

      toast({ title: "✅ Email enregistré !", description: "Statut mis à jour : Contacté" })
      fetchCompany()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    }
  }

  function openEmailPreview(email: any) {
    // Find Gamma URL if available
    const gammaUrl = company.gammaSlides?.[0]?.gamma_url

    setSelectedEmail({
      id: email.id,
      subject: email.subject,
      body: email.body_text || email.body_html || '', // Use body_text or body_html
      gammaUrl
    })
    setIsEmailPreviewOpen(true)
  }

  async function handleSendEmail(id: string, subject: string, body: string) {
    try {
      // Send the email with updated content
      const res = await fetch(`/api/vyxhunter/emails/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body })
      })

      if (!res.ok) throw new Error('Failed to send email')

      toast({
        title: "Email envoyé !",
        description: "Le prospect a été contacté."
      })
      
      fetchCompany()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email."
      })
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-vyxo-navy" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Entreprise non trouvée</p>
        <Button onClick={() => router.push('/vyxhunter')} className="mt-4">
          Retour
        </Button>
      </div>
    )
  }

  const latestAnalysis = company.analyses?.[0]
  const latestGamma = company.gammaSlides?.[0]
  const emails = company.emails || []

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/vyxhunter')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-vyxo-navy dark:text-white">{company.name}</h2>
            <p className="text-muted-foreground">{company.sector} • {company.location}</p>
          </div>
        </div>
        <Badge variant={company.status === 'qualified' ? 'default' : 'outline'} className="text-lg px-4 py-2">
          {company.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Company Info & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* COMPANY INFO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations Entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {company.website}
                  </a>
                </div>
              )}
              {company.linkedin_url && (
                <div className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    LinkedIn
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{company.size_range} employés</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{company.location}</span>
              </div>
              {company.description && (
                <p className="text-sm text-muted-foreground mt-4">{company.description}</p>
              )}
            </CardContent>
          </Card>

          {/* DECISION MAKERS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Décideurs & Contacts ({decisionMakers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {loadingPeople ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : decisionMakers.length > 0 ? (
                  <div className="space-y-4">
                    {decisionMakers.map((person) => (
                      <div key={person.id} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                             <AvatarImage src={person.photo_url} />
                             <AvatarFallback className="bg-vyxo-navy text-white text-xs">
                               {person.first_name[0]}{person.last_name[0]}
                             </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{person.first_name} {person.last_name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1" title={person.title}>{person.title}</p>
                            
                            {/* Email Section */}
                            <div className="flex items-center gap-2 mt-1">
                                {person.email && !person.email.includes('email_not_unlocked') && person.email !== 'Not available' ? (
                                    <span className="text-xs text-emerald-600 flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                        <Mail className="h-3 w-3" /> {person.email}
                                    </span>
                                ) : (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-primary hover:bg-gray-100"
                                        onClick={() => unlockEmailOnly(person)}
                                        disabled={unlockingContact === person.id}
                                    >
                                        {unlockingContact === person.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3 mr-1" /> Déverouiller l'email
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {person.linkedin_url && (
                              <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                <Linkedin className="h-3 w-3" /> LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={person.is_email_unlocked ? "secondary" : "default"}
                          className={person.is_email_unlocked ? "" : "bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90"}
                          onClick={() => handleUnlockContact(person)}
                          disabled={unlockingContact === person.id}
                        >
                          {unlockingContact === person.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : person.is_email_unlocked ? (
                            <UserPlus className="h-3 w-3" />
                          ) : (
                            <>
                              <Unlock className="h-3 w-3 mr-1" />
                              <span className="text-xs">Débloquer</span>
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun décideur trouvé</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI ANALYSIS */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Analyse IA
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {latestAnalysis ? 'Re-analyser' : 'Analyser'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {latestAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Score de Pertinence</span>
                      <Badge variant="secondary" className="text-lg">
                        {latestAnalysis.relevance_score}/100
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${latestAnalysis.relevance_score}%` }}
                      />
                    </div>
                  </div>

                  {/* CASQUETTE RECOMMANDÉE */}
                  {(latestAnalysis.sector_specific_insights?.recommended_hat || latestAnalysis.recommended_hat) && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md border border-purple-100 dark:border-purple-800">
                      <h4 className="font-semibold text-sm mb-1 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                        <span>🧢 Casquette Recommandée</span>
                      </h4>
                      <p className="text-sm font-medium text-vyxo-navy dark:text-white">
                        {latestAnalysis.sector_specific_insights?.recommended_hat || latestAnalysis.recommended_hat}
                      </p>
                      {(latestAnalysis.sector_specific_insights?.skill_match_reasoning || latestAnalysis.skill_match_reasoning) && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          "{latestAnalysis.sector_specific_insights?.skill_match_reasoning || latestAnalysis.skill_match_reasoning}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* RESPONSABLE QUALITÉ DÉTECTÉ */}
                  <div className="flex items-center justify-between p-3 rounded-md border bg-gray-50 dark:bg-gray-900/50">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Responsable Qualité détecté
                    </span>
                    <Badge 
                      variant={latestAnalysis.sector_specific_insights?.quality_manager_detected ? "default" : "secondary"}
                      className={latestAnalysis.sector_specific_insights?.quality_manager_detected ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {latestAnalysis.sector_specific_insights?.quality_manager_detected ? "OUI ✅" : "NON ❌"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Résumé Business</h4>
                    <p className="text-sm text-muted-foreground">{latestAnalysis.business_summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Points de Douleur</h4>
                    <ul className="space-y-1">
                      {latestAnalysis.pains?.map((pain: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Opportunités</h4>
                    <ul className="space-y-1">
                      {latestAnalysis.opportunities?.map((opp: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Angle d'Entrée</h4>
                    <p className="text-sm text-muted-foreground italic">{latestAnalysis.entry_angle}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quick Wins</h4>
                    <ul className="space-y-1">
                      {latestAnalysis.quick_wins?.map((win: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune analyse disponible</p>
                  <p className="text-sm mt-1">Cliquez sur "Analyser" pour démarrer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Gamma & Emails */}
        <div className="space-y-6">
          {/* GAMMA SLIDE */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Gamma Slide
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleGenerateGamma}
                  disabled={generatingGamma || !latestAnalysis}
                >
                  {generatingGamma ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {latestGamma ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={latestGamma.status === 'ready' ? 'default' : latestGamma.status === 'failed' ? 'destructive' : 'secondary'}>
                      {latestGamma.status}
                    </Badge>
                    {latestGamma.status === 'failed' && latestGamma.error_message && (
                      <span className="text-xs text-red-500 font-mono bg-red-50 px-2 py-1 rounded">
                        {latestGamma.error_message}
                      </span>
                    )}
                  </div>
                  {latestGamma.gamma_url && latestGamma.status === 'ready' && (
                    <div className="space-y-2">
                      <a 
                        href={latestGamma.gamma_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Voir la présentation
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleExportGamma('pdf')}>
                            <File className="h-4 w-4 mr-2" />
                            PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportGamma('pptx')}>
                            <Presentation className="h-4 w-4 mr-2" />
                            PowerPoint
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Vues : {latestGamma.views_count || 0}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune présentation générée</p>
              )}
            </CardContent>
          </Card>

          {/* EMAILS */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-4 w-4" />
                  Emails ({emails.length})
                </CardTitle>
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Nom du contact</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Jean Dupont"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Style</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={emailStyle}
                      onChange={(e) => setEmailStyle(e.target.value as 'short' | 'structured')}
                    >
                      <option value="structured">Structuré</option>
                      <option value="short">Court</option>
                    </select>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  variant="outline"
                  onClick={handleGenerateEmail}
                  disabled={generatingEmail || !latestAnalysis}
                >
                  {generatingEmail ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Générer un brouillon
                </Button>
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  variant="secondary"
                  onClick={handleLogManualEmail}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  J'ai envoyé un email manuellement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {emails.length > 0 ? (
                  <div className="space-y-3">
                    {emails.map((email: any) => (
                      <div 
                        key={email.id} 
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => openEmailPreview(email)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={email.status === 'sent' ? 'default' : 'secondary'}>
                            {email.status === 'sent' ? 'Envoyé' : 'Brouillon'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1 truncate">{email.subject}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {email.body_text || "Pas de contenu"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Ouvertures: {email.open_count}</span>
                          <span>Clics: {email.click_count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun email généré</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* INTERACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                {company.interactions && company.interactions.length > 0 ? (
                  <div className="space-y-4">
                    {company.interactions.map((interaction: any) => (
                      <div key={interaction.id} className="flex gap-3 text-sm">
                        <div className="min-w-[80px] text-xs text-muted-foreground pt-0.5">
                          {new Date(interaction.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <p className="font-medium">{interaction.type}</p>
                          {interaction.details && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {JSON.stringify(interaction.details)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune interaction</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EMAIL PREVIEW DIALOG */}
      <EmailPreviewDialog 
        open={isEmailPreviewOpen}
        onOpenChange={setIsEmailPreviewOpen}
        email={selectedEmail}
        onSend={handleSendEmail}
      />

      {/* GAMMA CUSTOMIZATION DIALOG */}
      <GammaCustomizationDialog
        open={isGammaDialogOpen}
        onOpenChange={setIsGammaDialogOpen}
        companyId={companyId as string}
        companyName={company?.name || ''}
        onGenerate={handleGenerateWithOptions}
      />
    </div>
  )
}
