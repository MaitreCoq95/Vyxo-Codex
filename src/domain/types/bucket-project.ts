export type IdeaStatus = 'idea' | 'under_review' | 'approved' | 'rejected' | 'converted_to_project';
export type VoteType = 'yes' | 'no' | 'abstain';
export type ProjectStatus = 'draft' | 'discovery' | 'design' | 'build' | 'launch' | 'live' | 'parked' | 'archived';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: IdeaStatus;
  
  strategic_fit: number; // 1-5
  business_potential: number; // 1-5
  complexity: number; // 1-5
  risk_level: number; // 1-5
  time_horizon?: string;
  notes_internal?: string;

  created_by?: string; // uuid
  created_at: string;
  updated_at: string;
  
  converted_project_id?: string;
}

export interface IdeaVote {
  id: string;
  idea_id: string;
  member_id: string;
  vote: VoteType;
  comment?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: ProjectStatus;

  origin_idea_id?: string;
  owner_id?: string;
  codir_sponsor_ids?: string[];

  expected_revenue?: number;
  expected_profit?: number;
  effort_estimation?: 'low' | 'medium' | 'high';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  time_horizon?: string;

  kpi_main?: string;
  kpi_target?: string;
  kpi_current?: string;

  created_at: string;
  updated_at: string;
}

// Helper Interfaces for Frontend (Joins)
export interface IdeaWithVotes extends Idea {
  votes?: IdeaVote[];
  creatorName?: string; // Joined if needed
}

export interface ProjectWithDetails extends Project {
  ownerName?: string;
  sponsorsNames?: string[];
}
