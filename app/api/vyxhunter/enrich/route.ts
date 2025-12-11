import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai'

export const dynamic = 'force-dynamic'

/**
 * POST /api/vyxhunter/enrich
 * Enrich company with sector detection, pain points, and recommendations
 */
export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  try {
    const { companyId } = await request.json()

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Enriching company:', companyId)

    // Fetch company data
    const { data: company, error: companyError } = await supabase
      .from('vch_vyxhunter_companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (companyError) throw companyError
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Fetch all ICP sectors for context
    const { data: sectors, error: sectorsError } = await supabase
      .from('vch_icp_sectors')
      .select('id, name, slug, description, typical_pain_points, typical_regulations')

    if (sectorsError) throw sectorsError

    // Build AI prompt for enrichment
    const enrichmentPrompt = `Tu es un expert en prospection B2B pour Vyxo Consulting, spécialisé en Qualité, QHSE, IT et Excellence Opérationnelle.

ENTREPRISE À ANALYSER:
- Nom: ${company.name}
- Description: ${company.description || 'Non disponible'}
- Site web: ${company.website || 'Non disponible'}
- Secteur d'activité: ${company.industry || 'Non disponible'}
- Taille: ${company.size || 'Non disponible'} employés

SECTEURS ICP DISPONIBLES:
${sectors?.map(s => `- ${s.name} (${s.slug}): ${s.description}
  Douleurs typiques: ${s.typical_pain_points?.join(', ')}
  Réglementations: ${s.typical_regulations?.join(', ')}`).join('\n\n')}

TÂCHE:
1. Détermine le secteur ICP le plus pertinent parmi la liste ci-dessus
2. Identifie 3-5 pain points probables pour cette entreprise (basés sur son secteur et sa description)
3. Détermine le niveau de maturité probable (none/low/medium/high)
4. Liste les réglementations applicables
5. Propose 3 solutions Vyxo adaptées
6. Génère 3 talking points pour l'approche commerciale

RÉPONSE ATTENDUE (JSON):
{
  "sector_slug": "slug du secteur ICP",
  "sector_confidence": 0.0-1.0,
  "pain_points": ["douleur 1", "douleur 2", "douleur 3"],
  "maturity_level": "none|low|medium|high",
  "applicable_regulations": ["ISO 9001", "GDP", etc.],
  "recommended_solutions": ["Solution 1", "Solution 2", "Solution 3"],
  "talking_points": ["Point 1", "Point 2", "Point 3"],
  "reasoning": "Explication courte de ton analyse"
}`

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en prospection B2B spécialisé en Qualité, QHSE et Excellence Opérationnelle. Tu réponds UNIQUEMENT en JSON valide.'
        },
        {
          role: 'user',
          content: enrichmentPrompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const enrichmentData = JSON.parse(completion.choices[0].message.content || '{}')

    console.log('🤖 AI Enrichment:', enrichmentData)

    // Find sector ID
    const detectedSector = sectors?.find(s => s.slug === enrichmentData.sector_slug)

    // Update company with enrichment data
    const { error: updateError } = await supabase
      .from('vch_vyxhunter_companies')
      .update({
        icp_sector_id: detectedSector?.id || null,
        detected_pain_points: enrichmentData.pain_points || [],
        maturity_level: enrichmentData.maturity_level || 'low',
        applicable_regulations: enrichmentData.applicable_regulations || []
      })
      .eq('id', companyId)

    if (updateError) throw updateError

    // Calculate score automatically
    const scoreResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vyxhunter/scoring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId })
    })

    const scoreData = await scoreResponse.json()

    console.log('✅ Company enriched successfully')

    return NextResponse.json({
      success: true,
      enrichment: {
        sector: detectedSector?.name || enrichmentData.sector_slug,
        sectorConfidence: enrichmentData.sector_confidence,
        painPoints: enrichmentData.pain_points,
        maturityLevel: enrichmentData.maturity_level,
        regulations: enrichmentData.applicable_regulations,
        recommendedSolutions: enrichmentData.recommended_solutions,
        talkingPoints: enrichmentData.talking_points,
        reasoning: enrichmentData.reasoning
      },
      score: scoreData.score
    })

  } catch (error: any) {
    console.error('💥 Error enriching company:', error)
    return NextResponse.json(
      { error: 'Failed to enrich company', details: error.message },
      { status: 500 }
    )
  }
}
