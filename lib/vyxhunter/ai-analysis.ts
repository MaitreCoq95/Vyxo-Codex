import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { VyxHunterCompany, VyxHunterAnalysis } from '@/lib/vyxhunter/types'
import { VYX_SKILLS } from '@/lib/constants/skills'

/**
 * Analyze a company using OpenAI GPT-4o
 * Returns business insights, pain points, opportunities, and relevance score
 */
export async function analyzeCompany(
  company: VyxHunterCompany,
  qualityManagerDetected: boolean = false,
  websiteContent: string = ''
): Promise<Omit<VyxHunterAnalysis, 'id' | 'created_at' | 'company_id' | 'organization_id'>> {
  
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const skillsContext = JSON.stringify(VYX_SKILLS, null, 2)

  const prompt = `
Tu es un expert en stratégie commerciale B2B pour Vyxo Consulting.
Ton but est d'analyser un prospect et de trouver l'angle d'attaque parfait en utilisant les compétences RÉELLES de Vivien Closse (Vyxo).

COMPÉTENCES ET EXPERTISES VYXO (Vivien Closse) :
${skillsContext}

ENTREPRISE À ANALYSER :
- Nom : ${company.name}
- Secteur : ${company.sector || 'Non spécifié'}
- Taille : ${company.size_range || 'Non spécifié'} employés
- Localisation : ${company.location || 'Non spécifié'}
- Site web : ${company.website || 'Non disponible'}
- Description : ${company.description || 'Non disponible'}
- Transition de maturité : ${company.maturity_transition || 'Non spécifié'}
- RESPONSABLE QUALITÉ DÉTECTÉ : ${qualityManagerDetected ? 'OUI ✅' : 'NON ❌'}
- DÉTAILS SUPPLÉMENTAIRES (Technologies, News, Funding, etc.) :
${JSON.stringify(company.metadata || {}, null, 2)}

CONTENU DU SITE WEB (Extrait) :
"${websiteContent || 'Non disponible'}"


MISSION :
Analyse cette entreprise pour déterminer si elle est un bon prospect et comment l'aborder.

INSTRUCTION SPÉCIALE "RESPONSABLE QUALITÉ" :
- Si OUI : Ton angle doit être d'apporter de l'aide, de l'expertise pointue ou des outils à cette personne (Support, Audit, Digitalisation).
- Si NON : Ton angle doit être de proposer de structurer la démarche qualité ou d'externaliser la fonction (Responsable Qualité à temps partagé).

ANALYSE REQUISE :

1. **business_summary** (3 lignes max) :
   - Résumé de l'activité et du contexte
   - Niveau de maturité opérationnelle estimé

2. **pains** (array de 3-5 points de douleur probables) :
   - Points de friction opérationnels typiques
   - Problèmes de conformité potentiels

3. **opportunities** (array de 3-4 opportunités) :
   - Axes d'amélioration concrets pour Vyxo

4. **recommended_hat** (String - "Casquette" à porter) :
   - Quelle expertise spécifique Vivien doit-il mettre en avant ?
   - Exemples : "Expert GAMP5", "Auditeur ISO 9001", "Spécialiste Lean", "Consultant Supply Chain", "Expert QHSE"
   - Choisis la PLUS pertinente pour ce prospect.

5. **skill_match_reasoning** (1-2 phrases) :
   - Pourquoi cette casquette ? Quel est le lien précis entre le besoin du prospect et la compétence Vyxo ?

6. **entry_angle** (1-2 lignes) :
   - L'accroche commerciale basée sur cette casquette et la présence/absence de Responsable Qualité.

7. **quick_wins** (array de 3 gains rapides) :
   - Résultats concrets en 1-3 mois.

8. **relevance_score** (0-100) :
   - CALCULE ce score dynamiquement. NE METS PAS 85 PAR DÉFAUT.
   - 90-100 : Match parfait (Secteur cible + Besoin critique + Compétence Vyxo exacte)
   - 70-89 : Bon match (Secteur connexe + Besoin probable)
   - 50-69 : Match moyen (Besoin flou ou secteur éloigné)
   - < 50 : Hors cible

9. **confidence_level** ('high' | 'medium' | 'low')

RETURNE UNIQUEMENT UN JSON VALIDE :
{
  "business_summary": "...",
  "pains": ["..."],
  "opportunities": ["..."],
  "recommended_hat": "...",
  "skill_match_reasoning": "...",
  "entry_angle": "...",
  "quick_wins": ["..."],
  "relevance_score": 0,
  "confidence_level": "high"
}
`.trim()

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt,
    })

    // Parse JSON response
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const analysis = JSON.parse(cleanText)

    // Validate required fields
    if (!analysis.business_summary || !analysis.pains || !analysis.opportunities || 
        !analysis.entry_angle || !analysis.quick_wins || 
        typeof analysis.relevance_score !== 'number' || !analysis.confidence_level) {
      throw new Error('Invalid analysis response: missing required fields')
    }

    return {
      business_summary: analysis.business_summary,
      pains: analysis.pains,
      opportunities: analysis.opportunities,
      entry_angle: analysis.entry_angle,
      quick_wins: analysis.quick_wins,
      relevance_score: analysis.relevance_score,
      confidence_level: analysis.confidence_level,
      recommended_hat: analysis.recommended_hat,
      skill_match_reasoning: analysis.skill_match_reasoning,
      model_used: 'gpt-4o',
      prompt_version: 'v3-quality-detection',
      tokens_used: undefined
    }
  } catch (error: any) {
    console.error('❌ AI Analysis error:', error)
    throw new Error(`Failed to analyze company: ${error.message}`)
  }
}
