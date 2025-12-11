// =====================================================
// VyxHunter TypeScript Types
// =====================================================

export interface VyxHunterCompany {
  id: string
  created_at: string
  updated_at: string
  name: string
  website?: string
  sector?: string
  size_range?: string
  location?: string
  employee_count?: number
  revenue_estimate?: number
  linkedin_url?: string
  description?: string
  maturity_transition?: string
  relevance_score?: number
  status: 'identified' | 'analyzed' | 'contacted' | 'responded' | 'qualified' | 'lost'
  assigned_to?: string
  source?: string
  external_id?: string
  metadata?: Record<string, any>
  organization_id: string
  // Prospecting Intelligence fields
  icp_sector_id?: string | null
  detected_pain_points?: string[]
  maturity_level?: 'none' | 'low' | 'medium' | 'high'
  applicable_regulations?: string[]
}

export interface VyxHunterAnalysis {
  id: string
  created_at: string
  company_id: string
  business_summary?: string
  pains?: string[]
  opportunities?: string[]
  entry_angle?: string
  quick_wins?: string[]
  relevance_score?: number
  confidence_level?: 'high' | 'medium' | 'low'
  model_used?: string
  prompt_version?: string
  tokens_used?: number
  organization_id: string
  // Prospecting Intelligence fields
  detected_sector?: string
  applicable_regulations?: string[]
  sector_specific_insights?: Record<string, any>
  recommended_solutions?: string[]
  talking_points?: string[]
  key_clients?: string[]
  recommended_hat?: string
  skill_match_reasoning?: string
  quality_manager_detected?: boolean
}

export interface VyxHunterGammaSlide {
  id: string
  created_at: string
  company_id: string
  analysis_id?: string
  gamma_slide_id?: string
  gamma_url?: string
  gamma_prompt?: string
  status: 'pending' | 'generating' | 'ready' | 'failed'
  error_message?: string
  views_count: number
  last_viewed_at?: string
  organization_id: string
}

export interface VyxHunterEmail {
  id: string
  created_at: string
  sent_at?: string
  company_id: string
  gamma_slide_id?: string
  recipient_email: string
  recipient_name?: string
  subject: string
  body_html: string
  body_text?: string
  email_type: 'initial' | 'follow_up_1' | 'follow_up_2' | 'follow_up_3'
  parent_email_id?: string
  resend_email_id?: string
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed'
  opened_at?: string
  open_count: number
  clicked_gamma_at?: string
  clicked_audit_at?: string
  click_count: number
  replied_at?: string
  metadata?: Record<string, any>
  organization_id: string
}

export interface VyxHunterInteraction {
  id: string
  created_at: string
  company_id: string
  email_id?: string
  type: InteractionType
  details?: Record<string, any>
  user_id?: string
  notes?: string
  organization_id: string
}

export type InteractionType =
  | 'company_added'
  | 'analysis_generated'
  | 'gamma_generated'
  | 'email_drafted'
  | 'email_sent'
  | 'email_opened'
  | 'link_clicked'
  | 'replied'
  | 'call_scheduled'
  | 'call_completed'
  | 'status_changed'
  | 'note_added'

// =====================================================
// API Request/Response Types
// =====================================================

export interface AnalyzeCompanyRequest {
  companyId: string
}

export interface AnalyzeCompanyResponse {
  analysis: VyxHunterAnalysis
  success: boolean
  error?: string
}

export interface GenerateGammaRequest {
  companyId: string
  analysisId: string
}

export interface GenerateGammaResponse {
  gammaSlide: VyxHunterGammaSlide
  success: boolean
  error?: string
}

export interface GenerateEmailRequest {
  companyId: string
  analysisId: string
  gammaSlideId?: string
  emailType?: 'initial' | 'follow_up_1' | 'follow_up_2'
}

export interface GenerateEmailResponse {
  email: {
    subject: string
    bodyHtml: string
    bodyText: string
  }
  success: boolean
  error?: string
}

export interface SendEmailRequest {
  emailId: string
}

export interface SendEmailResponse {
  resendId: string
  status: string
  success: boolean
  error?: string
}

// =====================================================
// Search & Targeting Types
// =====================================================

export interface CompanySearchFilters {
  sector?: string
  sizeRange?: string[]
  location?: string
  maturityTransition?: string
  revenueMin?: number
  revenueMax?: number
}

export interface CompanySearchResult {
  name: string
  website?: string
  sector?: string
  size?: string
  location?: string
  description?: string
  linkedinUrl?: string
  employeeCount?: number
  externalId?: string
  source: string
}

// =====================================================
// Dashboard Stats Types
// =====================================================

export interface VyxHunterStats {
  newProspects: number
  analyzed: number
  emailsSent: number
  responses: number
  responseRate: number
  hotLeads: number
}

export interface EmailMetrics {
  date: string
  sent: number
  opened: number
  clicked: number
}
