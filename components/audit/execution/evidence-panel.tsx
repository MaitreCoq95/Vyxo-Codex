"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase-audit"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Image as ImageIcon, Trash2, Eye, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface EvidencePanelProps {
  auditId: string
  findingId?: string
}

export function EvidencePanel({ auditId, findingId }: EvidencePanelProps) {
  const [evidence, setEvidence] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchEvidence = async () => {
      if (!auditId) return
      
      setLoading(true)
      try {
        let query = supabase
          .from('vch_audit_evidence')
          .select('*')
          .eq('audit_id', auditId)
          .order('created_at', { ascending: false })

        if (findingId) {
          query = query.eq('finding_id', findingId)
        }

        const { data, error } = await query

        if (error) throw error
        setEvidence(data || [])
      } catch (error) {
        console.error('Error fetching evidence:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvidence()
  }, [auditId, findingId, supabase])

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-l">
      <div className="p-4 border-b bg-white dark:bg-slate-950">
        <h2 className="font-semibold text-lg">Preuves & Documents</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : evidence.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground text-sm">
            Aucune preuve associée.
          </div>
        ) : (
          <div className="space-y-4">
            {evidence.map((item) => (
              <Card key={item.id} className="bg-white dark:bg-slate-950">
                <CardContent className="p-3 flex items-start gap-3">
                  <div className={`h-10 w-10 rounded flex items-center justify-center ${
                    item.file_type === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.file_type === 'image' ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-white dark:bg-slate-950">
        <div className="p-4 border-2 border-dashed rounded-lg text-center hover:bg-slate-50 transition-colors cursor-pointer">
          <p className="text-sm text-muted-foreground">
            Glissez vos fichiers ici ou cliquez pour uploader
          </p>
        </div>
      </div>
    </div>
  )
}
