"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- PROJECT ACTIONS ---

export async function createProject(data: {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  owner_id: string;
  effort_estimation?: string;
  priority?: string;
  time_horizon?: string;
  expected_revenue?: number;
  expected_profit?: number;
}) {
  const { error } = await supabase.from("vch_projects").insert({
    title: data.title,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory,
    owner_id: data.owner_id,
    status: 'draft', // Default
    effort_estimation: data.effort_estimation,
    priority: data.priority,
    time_horizon: data.time_horizon,
    expected_revenue: data.expected_revenue,
    expected_profit: data.expected_profit
  });

  if (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }

  revalidatePath("/vyxo-projets");
}

export async function updateProjectStatus(projectId: string, newStatus: string) {
  const { error } = await supabase
    .from("vch_projects")
    .update({ status: newStatus })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating project status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/vyxo-projets");
}

export async function updateProjectDetails(projectId: string, data: any) {
  const { error } = await supabase
    .from("vch_projects")
    .update(data)
    .eq("id", projectId);

  if (error) {
    console.error("Error updating project details:", error);
    throw new Error("Failed to update details");
  }

  revalidatePath("/vyxo-projets");
}
