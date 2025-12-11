"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Target, TrendingUp, Mail, MessageSquare, Zap, Plus, 
  Search, Filter, ArrowUpRight, Loader2, Brain, Sparkles,
  ExternalLink, BarChart3, Trash2, Clock, AlertCircle, CheckCircle2
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddCompanyDialog } from "@/components/vyxhunter/add-company-dialog"
import type { VyxHunterCompany } from "@/lib/vyxhunter/types"

interface VyxHunterStats {
  newProspects: number
  analyzed: number
  emailsSent: number
  responses: number
  responseRate: number
  hotLeads: number
  followUpNeeded: number
}

export default function VyxHunterPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [stats, setStats] = useState<VyxHunterStats>({
    newProspects: 0,
    analyzed: 0,
    emailsSent: 0,
    responses: 0,
    responseRate: 0,
    hotLeads: 0,
    followUpNeeded: 0
  })
  
  const [companies, setCompanies] = useState<any[]>([])
  const [followUps, setFollowUps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsRes = await fetch('/api/vyxhunter/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }

      // Fetch companies
      const companiesRes = await fetch('/api/vyxhunter/companies')
      if (companiesRes.ok) {
        const companiesData = await companiesRes.json()
        setCompanies(companiesData.companies || [])
        setCompanies(companiesData.companies || [])
      }

      // Fetch follow-ups
      const followUpsRes = await fetch('/api/vyxhunter/stats') // Re-using stats endpoint which returns followUpNeeded count, but we need the list.
      // Actually, let's fetch the list directly from a new endpoint or filter locally if possible, 
      // but better to have a dedicated endpoint or use the companies endpoint with a filter.
      // For now, let's assume we can filter companies or fetch from a new endpoint.
      // Let's create a quick client-side filter or fetch from a new endpoint.
      // Wait, the stats endpoint only returns count.
      // I'll add a new fetch for follow-ups.
      const followUpsListRes = await fetch('/api/vyxhunter/follow-ups')
      if (followUpsListRes.ok) {
        const data = await followUpsListRes.json()
        setFollowUps(data.followUps || [])
      }
    } catch (error) {
      console.error('Error fetching VyxHunter data:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données VyxHunter"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyze(companyId: string) {
    try {
      toast({
        title: "🤖 Analyse en cours...",
        description: "L'IA analyse cette entreprise"
      })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}/analyze`, {
        method: 'POST'
      })

      if (!res.ok) throw new Error('Analysis failed')

      const data = await res.json()
      
      toast({
        title: "✅ Analyse terminée !",
        description: `Score de pertinence : ${data.analysis.relevance_score}/100`
      })

      fetchData() // Refresh data
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de l'analyse"
      })
    }
  }

  async function handleDelete(companyId: string, companyName: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${companyName}" ?\n\nCette action est irréversible.`)) {
      return
    }

    try {
      toast({
        title: "🗑️ Suppression en cours...",
        description: "Suppression de l'entreprise"
      })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Delete failed')

      toast({
        title: "✅ Entreprise supprimée !",
        description: `${companyName} a été supprimée`
      })

      fetchData() // Refresh data
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la suppression"
      })
    }
  }

  async function handleLogManualEmail(companyId: string, companyName: string) {
    if (!confirm(`Confirmez-vous avoir envoyé un email manuellement à "${companyName}" ?\n\nCela mettra à jour le statut en 'Contacté' et programmera la relance dans 7 jours.`)) {
      return
    }

    try {
      toast({ title: "Enregistrement...", description: "Mise à jour du statut" })

      const res = await fetch(`/api/vyxhunter/companies/${companyId}/log-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: companyName,
          emailType: 'initial'
        })
      })

      if (!res.ok) throw new Error('Failed to log email')

      toast({ title: "✅ Email enregistré !", description: "Statut mis à jour : Contacté" })
      fetchData()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-vyxo-navy mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement VyxHunter...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white flex items-center gap-2">
            <Target className="h-8 w-8 text-vyxo-gold" />
            VyxHunter
          </h2>
          <p className="text-muted-foreground">Agent de prospection IA - Automatisation complète</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push('/prospecting')}
          >
            <Search className="mr-2 h-4 w-4" />
            Importer depuis Apollo
          </Button>
          <Button 
            className="bg-vyxo-navy hover:bg-vyxo-navy/90 text-white"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Manuellement
          </Button>
        </div>
      </div>

      {/* ADD COMPANY DIALOG */}
      <AddCompanyDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchData}
      />

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-vyxo-navy">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vyxo-navy dark:text-white">{stats.newProspects}</div>
              <p className="text-xs text-muted-foreground mt-1">7 derniers jours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Analysés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vyxo-navy dark:text-white">{stats.analyzed}</div>
              <p className="text-xs text-muted-foreground mt-1">Par l'IA</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Emails Envoyés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vyxo-navy dark:text-white">{stats.emailsSent}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.responses} réponses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.responseRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.hotLeads} leads chauds</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FILTERS & SEARCH */}


      {/* TABS FOR PIPELINE & FOLLOW-UPS */}
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pipeline">Pipeline Global</TabsTrigger>
          <TabsTrigger value="followups" className="relative">
            Relances à valider
            {followUps.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {followUps.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pipeline de Prospection</CardTitle>
              <CardDescription>Gérez vos prospects et automatisez votre outreach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une entreprise..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="identified">Identifié</option>
                  <option value="analyzed">Analysé</option>
                  <option value="contacted">Contacté</option>
                  <option value="responded">Répondu</option>
                  <option value="qualified">Qualifié</option>
                </select>
              </div>

              {/* COMPANIES LIST */}
              <ScrollArea className="h-[500px]">
                {filteredCompanies.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Aucune entreprise trouvée</p>
                    <p className="text-sm mt-1">Importez des prospects depuis Apollo ou ajoutez-les manuellement</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCompanies.map((company) => (
                      <Card 
                        key={company.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/vyxhunter/${company.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-vyxo-navy dark:text-white">{company.name}</h3>
                                <Badge variant={
                                  company.status === 'qualified' ? 'default' :
                                  company.status === 'analyzed' ? 'secondary' :
                                  'outline'
                                }>
                                  {company.status}
                                </Badge>
                                {company.relevance_score && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    {company.relevance_score}/100
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{company.sector} • {company.size_range} • {company.location}</p>
                                {company.vch_vyxhunter_analyses?.[0]?.business_summary && (
                                  <p className="text-xs italic line-clamp-2">
                                    {company.vch_vyxhunter_analyses[0].business_summary}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {company.status === 'identified' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAnalyze(company.id)
                                  }}
                                >
                                  <Brain className="h-4 w-4 mr-1" />
                                  Analyser
                                </Button>
                              )}
                              {company.status === 'analyzed' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLogManualEmail(company.id, company.name)
                                  }}
                                  title="J'ai envoyé un email"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(company.id, company.name)
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followups">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Relances à effectuer
              </CardTitle>
              <CardDescription>Ces prospects ont été contactés il y a plus de 7 jours sans réponse.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {followUps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                    <p className="font-medium">Aucune relance en retard !</p>
                    <p className="text-sm mt-1">Vous êtes à jour dans vos suivis.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {followUps.map((company) => (
                      <Card 
                        key={company.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500"
                        onClick={() => router.push(`/vyxhunter/${company.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-vyxo-navy dark:text-white">{company.name}</h3>
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  Relance requise
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Dernier contact : {new Date(company.sent_at).toLocaleDateString()}
                                </p>
                                <p>{company.sector}</p>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => router.push(`/vyxhunter/${company.id}`)}>
                              Voir & Relancer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
