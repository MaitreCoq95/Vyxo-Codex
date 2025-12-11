import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Client = {
  id: string
  organization_id: string
  name: string
  siren?: string
  sector?: string
  status: 'lead' | 'active' | 'inactive' | 'archived'
  logo_url?: string
  city?: string
  country?: string
  contact_email?: string
  contact_phone?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Engagement = {
  id: string
  organization_id: string
  client_id: string
  name: string
  type: 'audit' | 'consulting' | 'training' | 'support'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  start_date?: string
  end_date?: string
  budget_amount?: number
  currency?: string
  description?: string
  created_at: string
  updated_at: string
}

export type Audit = {
  id: string
  organization_id: string
  engagement_id: string
  template_name?: string
  template_data?: any
  score?: number
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'approved'
  auditor_id?: string
  audit_date?: string
  findings?: string
  recommendations?: string
  created_at: string
  updated_at: string
}

export type Invoice = {
  id: string
  organization_id: string
  engagement_id?: string
  client_id: string
  invoice_number: string
  amount: number
  currency?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  paid_date?: string
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  organization_id: string
  user_id?: string
  entity_type?: string
  entity_id?: string
  action: string
  description?: string
  metadata?: any
  created_at: string
}
