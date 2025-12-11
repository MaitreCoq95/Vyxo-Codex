"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- IDEA ACTIONS ---

export async function createIdea(data: {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  created_by: string;
  time_horizon?: string;
  strategic_fit?: number;
  business_potential?: number;
  complexity?: number;
  risk_level?: number;
}) {
  const { error } = await supabase.from("vch_idea_bucket").insert({
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory,
    created_by: data.created_by,
    status: "idea",
    time_horizon: data.time_horizon,
    strategic_fit: data.strategic_fit || 3,
    business_potential: data.business_potential || 3,
    complexity: data.complexity || 3,
    risk_level: data.risk_level || 3,
  });

  if (error) {
    console.error("Error creating idea:", error);
    throw new Error("Failed to create idea");
  }

  revalidatePath("/vyxo-bucket");
}

export async function voteOnIdea(ideaId: string, memberId: string, vote: "yes" | "no" | "abstain", comment?: string) {
  // 1. Insert or Update Vote
  const { error } = await supabase.from("vch_idea_votes").upsert({
    idea_id: ideaId,
    member_id: memberId,
    vote,
    comment
  }, { onConflict: 'idea_id, member_id' });

  if (error) {
    console.error("Error voting:", error);
    throw new Error("Failed to vote");
  }

  // 2. Check for Approval Logic
  // We need to count votes to see if we should auto-approve
  await checkAndApproveIdea(ideaId);

  revalidatePath("/vyxo-bucket");
}

async function checkAndApproveIdea(ideaId: string) {
  const { data: votes, error } = await supabase
    .from("vch_idea_votes")
    .select("vote")
    .eq("idea_id", ideaId);

  if (error || !votes) return;

  const yesVotes = votes.filter(v => v.vote === "yes").length;
  const noVotes = votes.filter(v => v.vote === "no").length;
  const totalVotes = votes.length; // Including abstain for participation count, or just yes/no? User said "majorité simple des yes sur yes+no".
  
  // User Rule: "Si yes > no et qu’au moins 2 personnes ont voté → statut = approved"
  // Assuming 2 persons voted means yes+no >= 2 (abstain usually doesn't count for majority calculation but counts for quorum). 
  // Let's stick to strict interpretation: at least 2 votes cast (of any kind? or yes/no?).
  // Let's assume at least 2 "decisive" votes (Yes/No) OR just 2 votes total participation.
  // "Au moins 2 personnes ont voté" -> 2 rows in votes table.
  
  if (votes.length >= 2 && yesVotes > noVotes) {
    // Check current status first to avoid overwriting "converted_to_project" or "rejected" manually set?
    // User said "Passage auto d’une idée en approved".
    
    await supabase.from("vch_idea_bucket")
      .update({ status: "approved" })
      .eq("id", ideaId)
      .eq("status", "idea"); // Only update if currently 'idea' (or under_review). Don't revert 'converted' or 'rejected' automatically if someone changes vote late.
      // Actually, we might want to support under_review too.
  }
}

export async function convertIdeaToProject(ideaId: string, projectData: any) {
    // 1. Create Project
    const { data: project, error: projError } = await supabase.from("vch_projects").insert({
        ...projectData,
        origin_idea_id: ideaId,
        status: 'draft'
    }).select('id').single();

    if (projError) throw new Error("Failed to create project");

    // 2. Update Idea Status
    await supabase.from("vch_idea_bucket").update({
        status: 'converted_to_project',
        converted_project_id: project.id
    }).eq('id', ideaId);


    revalidatePath("/vyxo-bucket");
    revalidatePath("/vyxo-projets");
}

export async function updateIdeaScores(ideaId: string, scores: {
    strategic_fit: number;
    business_potential: number;
    complexity: number;
    risk_level: number;
}) {
    const { error } = await supabase.from("vch_idea_bucket").update({
        strategic_fit: scores.strategic_fit,
        business_potential: scores.business_potential,
        complexity: scores.complexity,
        risk_level: scores.risk_level,
    }).eq("id", ideaId);

    if (error) {
        console.error("Error updating scores:", error);
        throw new Error("Failed to update scores");
    }

    revalidatePath("/vyxo-bucket");
}
