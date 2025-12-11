"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase-audit"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function NewAuditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()

  const [formData, setFormData] = useState({
    title: "",
    reference_number: `AUD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
    type: "internal",
    scope: "",
    objectives: "",
    client_id: "00000000-0000-0000-0000-000000000000", // Placeholder, needs real client selector
    auditor_id: "00000000-0000-0000-0000-000000000000" // Placeholder, needs auth user id
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current session (more resilient than getUser on client)
      const { data: { session } } = await supabase.auth.getSession()
      
      // Fallback for development/demo if no real auth
      const userId = session?.user?.id || "00000000-0000-0000-0000-000000000000"
      
      // Only throw if we really want to enforce strict auth (optional for dev)
      // if (!session) throw new Error("Non authentifié")

      const { data, error } = await supabase
        .from('vch_audits')
        .insert({
          ...formData,
          client_id: userId, 
          auditor_id: userId,
          planned_date: date?.toISOString(),
          status: 'planned',
          criteria: ['ISO 9001:2015', 'Interne']
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Audit créé avec succès",
        description: `L'audit ${data.reference_number} a été planifié.`,
      })

      router.push(`/audits/${data.id}/execution`)
    } catch (error: any) {
      console.error('Error creating audit:', error)
      toast({
        variant: "destructive",
        title: "Erreur lors de la création",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-vyxo-navy dark:text-white">Nouvel Audit</h1>
          <p className="text-muted-foreground">Planifiez une nouvelle mission d'audit.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
          <CardDescription>Définissez le périmètre et les objectifs de l&apos;audit.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input 
                  id="reference" 
                  value={formData.reference_number}
                  disabled
                  className="bg-slate-50 font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type d&apos;Audit</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({...formData, type: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Interne</SelectItem>
                    <SelectItem value="external">Externe</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="supplier">Fournisseur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&apos;Audit</Label>
              <Input 
                id="title" 
                placeholder="Ex: Audit Processus Qualité Q3" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date Planifiée</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Client actuel (Demo)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Périmètre (Scope)</Label>
              <Textarea 
                id="scope" 
                placeholder="Définir le périmètre de l&apos;audit..." 
                className="min-h-[100px]"
                value={formData.scope}
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objectifs</Label>
              <Textarea 
                id="objectives" 
                placeholder="Quels sont les objectifs principaux ?" 
                className="min-h-[100px]"
                value={formData.objectives}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Créer l&apos;Audit
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
