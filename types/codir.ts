// Database Types
export interface CodirMemberDB {
  id: string;
  name: string;
  role: string;
  mission: string;
  long_bio: string;
  portfolio_url: string | null;
  quote: string;
  created_at: string;
  updated_at: string;
}

export interface CodirCompetencyDB {
  id: string;
  member_id: string;
  category: string;
  label: string;
  description: string | null;
  level: string;
  created_at: string;
}

export interface CodirImpactDB {
  id: string;
  member_id: string;
  type: string; // 'strength' | 'impact_zone' | 'result'
  content: string;
  created_at: string;
}

// Frontend Type (Enhanced with Arrays for easier UI rendering)
export interface CodirMember {
  id: string;
  name: string;
  role: string;
  mission: string;
  portfolioUrl?: string;
  longBio: string;
  competencies: {
    [category: string]: string[]; // Simple string list for display or complex objects?
    // We previously used string[]. Let's upgrade to objects if needed, but for display string[] is easier in the UI unless we want description.
    // The previous UI expects { category: string[] }.
    // BUT the new editor needs IDs. So we should probably change the UI type to be richer.
  };
  competenciesRich?: { // New rich format for editing
    id: string;
    category: string;
    label: string;
    description: string;
    level: string;
  }[];
  strengths: string[];
  impactZones: string[];
  results: string[];
  quote: string;
}
