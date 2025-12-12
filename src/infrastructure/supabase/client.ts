import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Also export a default instance for compatibility
export default createClient();

// ═══════════════════════════════════════════════════════════════════════
// DATABASE TYPES - Vyxo Codex 2.0
// ═══════════════════════════════════════════════════════════════════════

export type Profile = {
  id: string
  company_id: string
  full_name: string
  role: 'operator' | 'manager' | 'director'
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  mentor_level: boolean
  team_id: string | null
  created_at: string
  updated_at: string
}

export type Team = {
  id: string
  company_id: string
  name: string
  manager_id: string | null
  created_at: string
  updated_at: string
}

export type Badge = {
  id: string
  title: string
  description: string
  category: 'skill' | 'milestone' | 'achievement'
  icon: string
  linkedin_shareable: boolean
  pdf_certificate: boolean
  criteria: Record<string, any>
  created_at: string
}

export type BadgeAward = {
  id: string
  user_id: string
  badge_id: string
  awarded_at: string
  certificate_url: string | null
}

export type VyxoFlash = {
  id: string
  team_id: string
  date: string
  titre: string
  hook: string
  contexte: string
  exercice_pratique: Record<string, any>
  message_cle: string
  action_immediate: string
  critical_gap: Record<string, any> | null
  affected_users: string[]
  completed: boolean
  completed_by: string | null
  completed_at: string | null
  created_at: string
}

export type DailyChallenge = {
  id: string
  user_id: string
  skill_id: string
  type: 'photo_interactive' | 'quiz_visual' | 'scenario'
  content: Record<string, any>
  completed: boolean
  score: number | null
  time_spent_seconds: number | null
  created_at: string
  completed_at: string | null
  scheduled_for: string
}

export type RiskAlert = {
  id: string
  team_id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'skill_gap' | 'incident_pattern' | 'compliance_risk' | 'turnover'
  title: string
  description: string
  affected_users: string[]
  recommendations: Record<string, any> | null
  potential_impact: Record<string, any> | null
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved'
  acknowledged_by: string | null
  acknowledged_at: string | null
  created_at: string
  resolved_at: string | null
}

export type Incident = {
  id: string
  team_id: string
  user_id: string | null
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  cost: number | null
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  root_cause: string | null
  corrective_actions: Record<string, any> | null
  related_modules: string[]
  created_at: string
  resolved_at: string | null
}

export type PracticalValidation = {
  id: string
  user_id: string
  module_id: string
  challenge_id: string | null
  type: 'photo' | 'video' | 'document' | 'checklist'
  file_url: string | null
  metadata: Record<string, any> | null
  validation_status: 'pending' | 'approved' | 'rejected' | 'needs_revision'
  validator_id: string | null
  validator_notes: string | null
  created_at: string
  validated_at: string | null
}

export type UserProgress = {
  id: string
  user_id: string
  module_id: string
  score: number
  status: 'in_progress' | 'completed'
  mastery_level: number
  next_review_date: string | null
  review_count: number
  last_review_date: string | null
  created_at: string
  updated_at: string
}
