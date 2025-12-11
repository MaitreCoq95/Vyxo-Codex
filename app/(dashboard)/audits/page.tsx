"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase-audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Filter, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type Audit = Database['public']['Tables']['vch_audits']['Row']

export default function AuditListPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('vch_audits')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAudits(data || [])
    } catch (error) {
      console.error('Error fetching audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.reference_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planifié</Badge>
      case 'in_progress': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En cours</Badge>
      case 'review': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Revue</Badge>
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Terminé</Badge>
      case 'archived': return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archivé</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">Audits</h1>
          <p className="text-muted-foreground mt-1">Gérez vos audits, planifiez les interventions et suivez la conformité.</p>
        </div>
        <Link href="/audits/nouveau">
          <Button className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Audit
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un audit..."
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
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="review">Revue</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-vyxo-gold" />
            </div>
          ) : filteredAudits.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Aucun audit trouvé</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date Planifiée</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudits.map((audit) => (
                    <TableRow key={audit.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell className="font-mono text-xs font-medium">{audit.reference_number}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/audits/${audit.id}`} className="hover:underline">
                          {audit.title}
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">{audit.type}</TableCell>
                      <TableCell>{getStatusBadge(audit.status)}</TableCell>
                      <TableCell>
                        {audit.planned_date ? format(new Date(audit.planned_date), 'dd MMM yyyy', { locale: fr }) : '-'}
                      </TableCell>
                      <TableCell>
                        {audit.conformity_score !== null ? (
                          <span className={`font-bold ${
                            audit.conformity_score >= 80 ? 'text-green-600' : 
                            audit.conformity_score >= 50 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {audit.conformity_score}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/audits/${audit.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir
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
