export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vch_audits: {
        Row: {
          id: string
          reference_number: string
          client_id: string
          title: string
          scope: string | null
          objectives: string | null
          criteria: string[] | null
          status: 'planned' | 'in_progress' | 'review' | 'completed' | 'archived'
          type: 'internal' | 'external' | 'certification' | 'supplier'
          auditor_id: string
          planned_date: string | null
          start_date: string | null
          end_date: string | null
          location: string | null
          conformity_score: number | null
          excellence_index: number | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          reference_number: string
          client_id: string
          title: string
          scope?: string | null
          objectives?: string | null
          criteria?: string[] | null
          status: 'planned' | 'in_progress' | 'review' | 'completed' | 'archived'
          type: 'internal' | 'external' | 'certification' | 'supplier'
          auditor_id: string
          planned_date?: string | null
          start_date?: string | null
          end_date?: string | null
          location?: string | null
          conformity_score?: number | null
          excellence_index?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          reference_number?: string
          client_id?: string
          title?: string
          scope?: string | null
          objectives?: string | null
          criteria?: string[] | null
          status?: 'planned' | 'in_progress' | 'review' | 'completed' | 'archived'
          type?: 'internal' | 'external' | 'certification' | 'supplier'
          auditor_id?: string
          planned_date?: string | null
          start_date?: string | null
          end_date?: string | null
          location?: string | null
          conformity_score?: number | null
          excellence_index?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      vch_audit_checklists: {
        Row: {
          id: string
          audit_id: string | null
          title: string
          description: string | null
          category: string | null
          is_template: boolean
          created_at: string
        }
        Insert: {
          id?: string
          audit_id?: string | null
          title: string
          description?: string | null
          category?: string | null
          is_template?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string | null
          title?: string
          description?: string | null
          category?: string | null
          is_template?: boolean
          created_at?: string
        }
      }
      vch_audit_checklist_items: {
        Row: {
          id: string
          checklist_id: string | null
          requirement: string
          guidance: string | null
          reference: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          checklist_id?: string | null
          requirement: string
          guidance?: string | null
          reference?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          checklist_id?: string | null
          requirement?: string
          guidance?: string | null
          reference?: string | null
          order_index?: number
          created_at?: string
        }
      }
      vch_audit_findings: {
        Row: {
          id: string
          audit_id: string
          checklist_item_id: string | null
          type: 'conformity' | 'observation' | 'improvement' | 'nc_minor' | 'nc_major'
          description: string
          evidence_notes: string | null
          site: string | null
          process: string | null
          interviewee: string | null
          severity_score: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          audit_id: string
          checklist_item_id?: string | null
          type: 'conformity' | 'observation' | 'improvement' | 'nc_minor' | 'nc_major'
          description: string
          evidence_notes?: string | null
          site?: string | null
          process?: string | null
          interviewee?: string | null
          severity_score?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          audit_id?: string
          checklist_item_id?: string | null
          type?: 'conformity' | 'observation' | 'improvement' | 'nc_minor' | 'nc_major'
          description?: string
          evidence_notes?: string | null
          site?: string | null
          process?: string | null
          interviewee?: string | null
          severity_score?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      vch_non_conformities: {
        Row: {
          id: string
          audit_id: string
          finding_id: string | null
          client_id: string
          reference_number: string
          status: 'open' | 'root_cause_analysis' | 'action_plan' | 'implementation' | 'verification' | 'closed'
          severity: 'minor' | 'major' | 'critical'
          description: string
          requirement: string | null
          root_cause: string | null
          root_cause_method: string | null
          responsible_person: string | null
          due_date: string | null
          closed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          finding_id?: string | null
          client_id: string
          reference_number: string
          status: 'open' | 'root_cause_analysis' | 'action_plan' | 'implementation' | 'verification' | 'closed'
          severity: 'minor' | 'major' | 'critical'
          description: string
          requirement?: string | null
          root_cause?: string | null
          root_cause_method?: string | null
          responsible_person?: string | null
          due_date?: string | null
          closed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          finding_id?: string | null
          client_id?: string
          reference_number?: string
          status?: 'open' | 'root_cause_analysis' | 'action_plan' | 'implementation' | 'verification' | 'closed'
          severity?: 'minor' | 'major' | 'critical'
          description?: string
          requirement?: string | null
          root_cause?: string | null
          root_cause_method?: string | null
          responsible_person?: string | null
          due_date?: string | null
          closed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vch_capa: {
        Row: {
          id: string
          nc_id: string
          type: 'correction' | 'corrective' | 'preventive'
          description: string
          assigned_to: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'verified' | 'effective' | 'ineffective'
          planned_date: string | null
          completion_date: string | null
          verification_date: string | null
          effectiveness_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nc_id: string
          type: 'correction' | 'corrective' | 'preventive'
          description: string
          assigned_to?: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'verified' | 'effective' | 'ineffective'
          planned_date?: string | null
          completion_date?: string | null
          verification_date?: string | null
          effectiveness_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nc_id?: string
          type?: 'correction' | 'corrective' | 'preventive'
          description?: string
          assigned_to?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'verified' | 'effective' | 'ineffective'
          planned_date?: string | null
          completion_date?: string | null
          verification_date?: string | null
          effectiveness_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
