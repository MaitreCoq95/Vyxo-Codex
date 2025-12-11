import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const { moduleId, moduleName, count = 5, difficulty = 'medium' } = await req.json();

    // Vérifier la clé API
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY is missing');
      return Response.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    const prompt = `
Tu es un expert certifié en systèmes de management, normes ISO, GDP, GMP, CEIV, et excellence opérationnelle.
Tu as une connaissance approfondie du contenu exact des normes et référentiels.

MODULE : ${moduleName} (ID: ${moduleId})
NOMBRE DE QUESTIONS : ${count}
DIFFICULTÉ : ${difficulty}

MISSION :
Génère ${count} questions de quiz basées EXCLUSIVEMENT sur le contenu réel et les exigences officielles du référentiel ${moduleName}.

SOURCES À UTILISER (selon le module) :
- ISO 9001:2015 : Clauses 4-10, exigences documentées, approche processus, contexte, risques
- ISO 14001:2015 : Aspects/impacts environnementaux, conformité réglementaire, ACV
- ISO 45001:2018 : Dangers, évaluation des risques SST, DUERP, participation des travailleurs
- ISO 27001:2022 : Annexe A (93 mesures), SMSI, analyse de risques, gestion des incidents
- GDP (EU 2013/C 343/01) : Chaîne du froid, qualification véhicules, traçabilité, excursions
- GMP (EU GMP Part I & II) : Batch records, validation, personnel qualifié, contrôles qualité
- CEIV Pharma (IATA) : 3 piliers (Formation, Processus, Infrastructure), TCR, handling pharma
- GAMP 5 : Catégories de systèmes, validation basée sur les risques, 4Q (IQ/OQ/PQ)
- Lean Six Sigma : 5S, DMAIC, VSM, Kaizen, réduction variabilité, Muda/Mura/Muri
- Cold Chain : Emballages passifs/actifs, PCM, qualification, études de stabilité

RÈGLES STRICTES :
1. Base-toi UNIQUEMENT sur le contenu réel des normes/référentiels
2. Cite les clauses, articles ou sections précis quand pertinent
3. Utilise la terminologie exacte du référentiel
4. Questions sur des exigences concrètes, pas de généralités
5. Explications avec références (ex: "Selon la clause 8.5.1 d'ISO 9001...")

DIFFICULTÉ :
- EASY : Définitions, acronymes, structure de la norme, concepts de base
- MEDIUM : Exigences spécifiques, application pratique, interprétation
- HARD : Cas complexes, arbitrage entre exigences, audit avancé, exceptions

TYPES DE QUESTIONS À VARIER :
- Définitions et concepts clés
- Clauses et exigences spécifiques
- Applications terrain / cas pratiques
- Différences entre versions ou normes
- Pièges d'interprétation courants
- Méthodologies et outils

EXEMPLES DE BONNES QUESTIONS :

ISO 9001 (MEDIUM):
"Quelle clause de l'ISO 9001:2015 exige l'identification des enjeux internes et externes ?"
Choix: [Clause 3, Clause 4, Clause 5, Clause 6]
Correcte: Clause 4
Explication: "La clause 4.1 de l'ISO 9001:2015 exige que l'organisme détermine les enjeux externes et internes pertinents pour sa finalité et son orientation stratégique..."

GDP (HARD):
"Selon les GDP EU 2013/C 343/01, quelle est la température maximale de stockage pour les médicaments thermosensibles 2-8°C lors d'une excursion temporaire ?"
Choix: [Aucune excursion autorisée, Dépend de l'étude de stabilité du produit, 15°C maximum, 25°C maximum 24h]
Correcte: Dépend de l'étude de stabilité du produit
Explication: "Les GDP ne fixent pas de limite universelle. Chaque excursion doit être évaluée selon les données de stabilité du fabricant (Chapitre 9.3)..."

RETOURNE UN JSON EXACTEMENT DANS CE FORMAT :
{
  "questions": [
    {
      "question": "Question basée sur le contenu réel de la norme ?",
      "difficulty": "${difficulty}",
      "choices": ["Choix A plausible", "Choix B plausible", "Bonne réponse C", "Choix D plausible"],
      "correctIndex": 2,
      "explanation": "Explication avec référence à la clause/section + contexte pédagogique détaillé (min 100 caractères)...",
      "tags": ["tag-pertinent-1", "tag-pertinent-2", "clause-ou-concept"]
    }
  ]
}

IMPORTANT : Les questions doivent refléter le contenu RÉEL des normes, pas des généralités.
`;

    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt,
    });

    // Parse la réponse JSON
    let jsonResponse;
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResponse = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse AI JSON response:', text);
      return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 });
    }

    // Ajouter moduleId à chaque question
    if (jsonResponse.questions && Array.isArray(jsonResponse.questions)) {
      jsonResponse.questions = jsonResponse.questions.map((q: any, index: number) => ({
        id: `ai-${moduleId}-${Date.now()}-${index}`,
        moduleId: moduleId,
        ...q
      }));
    }

    return Response.json(jsonResponse);
  } catch (error: any) {
    console.error('💥 AI Quiz Generation Error:', error);
    return Response.json({
      error: error.message || 'Failed to generate quiz questions',
      details: error.toString()
    }, { status: 500 });
  }
}
