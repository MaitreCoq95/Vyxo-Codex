
import { createClient } from "@supabase/supabase-js";
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { title, description, category, subcategory } = await req.json();

    // 1. Fetch CODIR Members & Skills
    const { data: members, error } = await supabase
      .from("vch_codir_members")
      .select(`
        id, 
        name, 
        role, 
        vch_codir_competencies ( category, label, level )
      `);

    if (error) throw new Error("Failed to fetch Codir members");

    // Format context for AI
    const teamContext = members.map(m => `
      - ${m.name} (${m.role}): 
        Skills: ${m.vch_codir_competencies.map((c: any) => `${c.label} (${c.level})`).join(', ')}
    `).join('\n');

    // 2. Generate Score with AI
    const prompt = `
      You are an expert strategic consultant for "Vyxo".
      Analyze this new business idea against the current Executive Team's capabilities (CODIR).

      IDEA:
      Title: ${title}
      Category: ${category} (${subcategory})
      Description: ${description}

      CURRENT TEAM (CODIR):
      ${teamContext}

      TASK:
      Score this idea on 4 criteria (1-5 scale) and provide a short rationale.
      
      CRITERIA:
      1. Strategic Fit (1-5): How well does it align with Vyxo's consulting/tech DNA?
      2. Business Potential (1-5): Revenue/Growth potential.
      3. Complexity (1-5): 1=Simple, 5=Extremely Hard. (Does the team HAVE the skills to do it easily? If yes, complexity is lower).
      4. Risk Level (1-5): 1=Safe, 5=Risky. (Does the team have experience in this domain? If yes, risk is lower).

      Output JSON only.
    `;

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        strategic_fit: z.number().min(1).max(5),
        business_potential: z.number().min(1).max(5),
        complexity: z.number().min(1).max(5),
        risk_level: z.number().min(1).max(5),
        rationale: z.string().describe("Short explanation (max 2 sentences) of why this score was given, highlighting team skills match or gap.")
      }),
      prompt,
    });

    return Response.json(result.object);

  } catch (err) {
    console.error('AI Score Error:', err);
    return Response.json({ error: 'Failed to generate score' }, { status: 500 });
  }
}
