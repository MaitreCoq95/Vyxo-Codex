"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addCompetency(memberId: string, data: {
  category: string;
  label: string;
  description?: string;
  level: string;
}) {
  const { error } = await supabase.from("vch_codir_competencies").insert({
    member_id: memberId,
    category: data.category,
    label: data.label,
    description: data.description || "",
    level: data.level
  });

  if (error) {
    console.error("Error adding competency:", error);
    throw new Error("Failed to add competency");
  }

  revalidatePath("/vyxo-codir");
}

export async function deleteCompetency(competencyId: string) {
  const { error } = await supabase.from("vch_codir_competencies").delete().eq("id", competencyId);

  if (error) {
    console.error("Error deleting competency:", error);
    throw new Error("Failed to delete competency");
  }

  revalidatePath("/vyxo-codir");
}

export async function updateCompetency(competencyId: string, data: {
  category?: string;
  label?: string;
  description?: string;
  level?: string;
}) {
  const { error } = await supabase.from("vch_codir_competencies").update(data).eq("id", competencyId);

  if (error) {
     console.error("Error updating competency:", error);
     throw new Error("Failed to update competency");
  }
  
  revalidatePath("/vyxo-codir");
}
