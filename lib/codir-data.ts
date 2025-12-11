import { supabase } from "@/lib/supabase";
import { CodirMember, CodirMemberDB, CodirCompetencyDB, CodirImpactDB } from "@/types/codir";

/**
 * Fetches all Codir members and their related data from Supabase.
 * Returns the data shaped for the frontend components.
 */
export async function getCodirMembers(): Promise<CodirMember[]> {
  // Fetch everything in parallel
  const [membersResult, competenciesResult, impactsResult] = await Promise.all([
    supabase.from("vch_codir_members").select("*").order("name"),
    supabase.from("vch_codir_competencies").select("*"),
    supabase.from("vch_codir_impacts").select("*")
  ]);

  if (membersResult.error) throw membersResult.error;
  if (competenciesResult.error) throw competenciesResult.error;
  if (impactsResult.error) throw impactsResult.error;

  const members = membersResult.data as CodirMemberDB[];
  const competencies = competenciesResult.data as CodirCompetencyDB[];
  const impacts = impactsResult.data as CodirImpactDB[];

  // Transformation
  return members.map((m) => {
    // 1. Competencies
    const memberCompetencies = competencies.filter((c) => c.member_id === m.id);
    
    // Group by category for the display view
    const competenciesMap: { [category: string]: string[] } = {};
    memberCompetencies.forEach((c) => {
      if (!competenciesMap[c.category]) {
        competenciesMap[c.category] = [];
      }
      // Use label or label + description? Old UI used just strings.
      // Let's use label for now to match the "list of strings" look.
      competenciesMap[c.category].push(c.label);
    });

    // 2. Impacts
    const memberImpacts = impacts.filter((i) => i.member_id === m.id);
    
    const strengths = memberImpacts
      .filter((i) => i.type === 'strength')
      .map((i) => i.content);
      
    const impactZones = memberImpacts
      .filter((i) => i.type === 'impact_zone')
      .map((i) => i.content);
      
    const results = memberImpacts
      .filter((i) => i.type === 'result')
      .map((i) => i.content);

    return {
      id: m.id,
      name: m.name,
      role: m.role,
      mission: m.mission || "",
      portfolioUrl: m.portfolio_url || undefined,
      longBio: m.long_bio || "",
      quote: m.quote || "",
      competencies: competenciesMap,
      competenciesRich: memberCompetencies.map(c => ({
        id: c.id,
        category: c.category,
        label: c.label,
        description: c.description || "",
        level: c.level
      })),
      strengths,
      impactZones,
      results
    };
  });
}

// Fallback for initial render or error states if needed, 
// allows preserving the shape while DB is empty during migration if skipped.
export const emptyCodirMember: CodirMember = {
  id: "",
  name: "",
  role: "",
  mission: "",
  longBio: "",
  quote: "",
  competencies: {},
  strengths: [],
  impactZones: [],
  results: []
};
