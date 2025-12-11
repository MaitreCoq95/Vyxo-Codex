"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase-audit"
import { ChecklistPanel } from "@/components/audit/execution/checklist-panel"
import { FindingEditor } from "@/components/audit/execution/finding-editor"
import { EvidencePanel } from "@/components/audit/execution/evidence-panel"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Default ISO 9001 Checklists for initialization
const DEFAULT_CHECKLISTS = [
  {
    title: "4. Contexte de l'organisme",
    description: "Compréhension de l'organisme et de son contexte",
    category: "ISO 9001",
    items: [
      { requirement: "L'organisme a-t-il déterminé les enjeux externes et internes ?", reference: "4.1", order_index: 1 },
      { requirement: "Les parties intéressées pertinentes sont-elles identifiées ?", reference: "4.2", order_index: 2 },
      { requirement: "Le domaine d'application du SMQ est-il déterminé et documenté ?", reference: "4.3", order_index: 3 },
    ]
  },
  {
    title: "5. Leadership",
    description: "Leadership et engagement",
    category: "ISO 9001",
    items: [
      { requirement: "La direction démontre-t-elle son leadership et son engagement ?", reference: "5.1", order_index: 1 },
      { requirement: "La politique qualité est-elle établie et communiquée ?", reference: "5.2", order_index: 2 },
      { requirement: "Les rôles et responsabilités sont-ils définis ?", reference: "5.3", order_index: 3 },
    ]
  },
  {
    title: "6. Planification",
    description: "Actions face aux risques et opportunités",
    category: "ISO 9001",
    items: [
      { requirement: "Les risques et opportunités sont-ils déterminés ?", reference: "6.1", order_index: 1 },
      { requirement: "Les objectifs qualité sont-ils établis ?", reference: "6.2", order_index: 2 },
    ]
  }
]

type ChecklistItemWithFinding = Database['public']['Tables']['vch_audit_checklist_items']['Row'] & {
  finding?: Database['public']['Tables']['vch_audit_findings']['Row']
}

type ChecklistWithItems = Database['public']['Tables']['vch_audit_checklists']['Row'] & {
  items: ChecklistItemWithFinding[]
}

export default function AuditExecutionPage({ params }: { params: { id: string } }) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [checklists, setChecklists] = useState<ChecklistWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [audit, setAudit] = useState<any>(null)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  const fetchAuditData = useCallback(async () => {
    try {
      setLoading(true)
      
      // 1. Fetch Audit Details
      const { data: auditData, error: auditError } = await supabase
        .from('vch_audits')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (auditError) throw auditError
      setAudit(auditData)

      // 2. Fetch Checklists
      const { data: existingChecklists, error: checklistsError } = await supabase
        .from('vch_audit_checklists')
        .select(`
          *,
          items:vch_audit_checklist_items(*)
        `)
        .eq('audit_id', params.id)
        .order('created_at', { ascending: true })

      if (checklistsError) throw checklistsError

      // 3. Initialize if empty
      if (!existingChecklists || existingChecklists.length === 0) {
        await initializeChecklists(params.id)
        return // Will re-fetch via recursion or state update
      }

      // 4. Fetch Findings
      const { data: findings, error: findingsError } = await supabase
        .from('vch_audit_findings')
        .select('*')
        .eq('audit_id', params.id)

      if (findingsError) throw findingsError

      // 5. Merge Findings into Items
      const mergedChecklists = existingChecklists.map(checklist => ({
        ...checklist,
        items: checklist.items.map((item: any) => ({
          ...item,
          finding: findings?.find(f => f.checklist_item_id === item.id)
        })).sort((a: any, b: any) => a.order_index - b.order_index)
      }))

      setChecklists(mergedChecklists)
    } catch (error) {
      console.error('Error fetching audit data:', error)
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les données de l'audit."
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, supabase, toast])

  const initializeChecklists = async (auditId: string) => {
    try {
      for (const template of DEFAULT_CHECKLISTS) {
        // Create Checklist
        const { data: checklist, error: clError } = await supabase
          .from('vch_audit_checklists')
          .insert({
            audit_id: auditId,
            title: template.title,
            description: template.description,
            category: template.category
          })
          .select()
          .single()

        if (clError) throw clError

        // Create Items
        const itemsToInsert = template.items.map(item => ({
          checklist_id: checklist.id,
          requirement: item.requirement,
          reference: item.reference,
          order_index: item.order_index
        }))

        const { error: itemsError } = await supabase
          .from('vch_audit_checklist_items')
          .insert(itemsToInsert)

        if (itemsError) throw itemsError
      }
      
      // Refresh data
      fetchAuditData()
    } catch (error) {
      console.error('Error initializing checklists:', error)
    }
  }

  useEffect(() => {
    fetchAuditData()
  }, [fetchAuditData])

  const handleSaveFinding = async (data: any) => {
    if (!selectedItemId || !audit) return

    try {
      // Check if finding exists for this item
      const currentChecklist = checklists.find(c => c.items.some(i => i.id === selectedItemId))
      const currentItem = currentChecklist?.items.find(i => i.id === selectedItemId)
      const existingFinding = currentItem?.finding

      let result

      if (existingFinding) {
        // Update
        result = await supabase
          .from('vch_audit_findings')
          .update({
            type: data.type,
            description: data.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingFinding.id)
          .select()
          .single()
      } else {
        // Insert
        // Get current session for created_by
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id || audit.auditor_id // Fallback to auditor_id

        result = await supabase
          .from('vch_audit_findings')
          .insert({
            audit_id: audit.id,
            checklist_item_id: selectedItemId,
            type: data.type,
            description: data.description,
            created_by: userId
          })
          .select()
          .single()
      }

      if (result.error) throw result.error

      // If it's a Non-Conformity, create/update NC record
      if (['nc_minor', 'nc_major'].includes(data.type)) {
        await handleNonConformity(result.data, data.type)
      }

      toast({
        title: "Constat enregistré",
        description: "Les modifications ont été sauvegardées."
      })

      // Refresh local state to show the checkmark/status
      fetchAuditData()

    } catch (error: any) {
      console.error('Error saving finding:', error)
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: error.message
      })
    }
  }

  const handleNonConformity = async (finding: any, severity: string) => {
    // Check if NC already exists
    const { data: existingNC } = await supabase
      .from('vch_non_conformities')
      .select('id')
      .eq('finding_id', finding.id)
      .single()

    if (!existingNC) {
      // Create new NC
      await supabase
        .from('vch_non_conformities')
        .insert({
          audit_id: audit.id,
          finding_id: finding.id,
          client_id: audit.client_id,
          reference_number: `NC-${finding.id.slice(0, 8)}`, // Simple ref generation
          status: 'open',
          severity: severity === 'nc_major' ? 'major' : 'minor',
          description: finding.description,
          requirement: 'Voir checklist'
        })
    } else {
      // Update existing NC severity/description
      await supabase
        .from('vch_non_conformities')
        .update({
          severity: severity === 'nc_major' ? 'major' : 'minor',
          description: finding.description
        })
        .eq('id', existingNC.id)
    }
  }

  // Find currently selected item's existing finding data
  const selectedItemFinding = checklists
    .flatMap(c => c.items)
    .find(i => i.id === selectedItemId)
    ?.finding

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vyxo-gold" />
        <span className="ml-2 text-muted-foreground">Chargement de l'audit...</span>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Left Column: Checklist (25%) */}
      <div className="w-1/4 min-w-[300px] max-w-[400px]">
        <ChecklistPanel 
          checklists={checklists}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
        />
      </div>

      {/* Center Column: Finding Editor (50%) */}
      <div className="flex-1 min-w-[500px] border-r">
        <FindingEditor 
          itemId={selectedItemId}
          initialData={selectedItemFinding}
          onSave={handleSaveFinding}
        />
      </div>

      {/* Right Column: Evidence (25%) */}
      <div className="w-1/4 min-w-[300px] max-w-[400px]">
        <EvidencePanel 
          auditId={params.id}
          findingId={selectedItemFinding?.id}
        />
      </div>
    </div>
  )
}
