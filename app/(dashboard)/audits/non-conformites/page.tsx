"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase-audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Search, Filter, AlertTriangle, XCircle, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type NC = Database['public']['Tables']['vch_non_conformities']['Row'] & {
  audit: { reference_number: string }
}

export default function NCListPage() {
  const [ncs, setNcs] = useState<NC[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchNCs()
  }, [])

  const fetchNCs = async () => {
    try {
      setLoading(true)
      // Note: This query assumes a join which Supabase handles via foreign keys
      // In a real app, you'd use the proper join syntax or fetch related data
      const { data, error } = await supabase
        .from('vch_non_conformities')
        .select(`
          *,
          audit:vch_audits(reference_number)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNcs(data as any || [])
    } catch (error) {
      console.error('Error fetching NCs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'minor': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200"><AlertTriangle className="h-3 w-3 mr-1" /> Mineure</Badge>
      case 'major': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Majeure</Badge>
      case 'critical': return <Badge variant="destructive">Critique</Badge>
      default: return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ouverte</Badge>
      case 'root_cause_analysis': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Analyse Cause</Badge>
      case 'action_plan': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Plan Action</Badge>
      case 'implementation': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En cours</Badge>
      case 'verification': return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Vérification</Badge>
      case 'closed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Clôturée</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">Non-Conformités</h1>
          <p className="text-muted-foreground mt-1">Suivez et traitez les écarts détectés lors des audits.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une NC..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="open">Ouverte</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="closed">Clôturée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-vyxo-gold" />
            </div>
          ) : ncs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Aucune non-conformité trouvée</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Audit</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sévérité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ncs.map((nc) => (
                    <TableRow key={nc.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell className="font-mono text-xs font-medium">{nc.reference_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {/* @ts-ignore - Supabase join typing is tricky without full generation */}
                        {nc.audit?.reference_number || '-'}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={nc.description}>
                        {nc.description}
                      </TableCell>
                      <TableCell>{getSeverityBadge(nc.severity)}</TableCell>
                      <TableCell>{getStatusBadge(nc.status)}</TableCell>
                      <TableCell>
                        {nc.due_date ? format(new Date(nc.due_date), 'dd MMM yyyy', { locale: fr }) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/audits/non-conformites/${nc.id}`}>
                          <Button variant="ghost" size="sm">
                            Gérer <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
