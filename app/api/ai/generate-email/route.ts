import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    const { prospectName, companyName, industry, triggerEvent, painPoint, valueProp, cta } = await req.json()

    // Settings par défaut (style Vivien/Vyxo)
    const settings = {
      formality: 'professional-casual',
      length: 'concise',
      personality: 'Direct, humain, pro, jamais mielleux',
      avoidPhrases: [
        'Je me permets',
        "N'hésitez pas",
        'Cordialement',
        'Je vous remercie par avance',
        'Dans le cadre de',
        'Suite à',
        'Faire un point'
      ],
      preferredPhrases: [
        'Si ça vous parle',
        'On peut en discuter',
        'Parlons-en',
        'Photo claire',
        'Vrai gain',
        'Niveau supérieur'
      ],
      signature: 'Bien à vous,\nVivien\nVyxo Consulting'
    }

    const prompt = `
Tu es un expert en prospection B2B pour Vyxo Consulting et tu écris EXACTEMENT comme Vivien parle : direct, humain, pro, jamais mielleux.

STYLE & TON :
- Cash mais respectueux
- Pas de phrases longues, pas de jargon vide
- Confiance tranquille, pas de survente
- Fluide, simple, orienté résultats

PARAMÈTRES :
- Formalité : ${settings.formality}
- Longueur : ${settings.length}
- Personnalité : ${settings.personality}

RÈGLES :
- INTERDIT : ${settings.avoidPhrases.join(', ')}
- À UTILISER : ${settings.preferredPhrases.join(', ')}
- Signature : ${settings.signature}
- Zéro "je me permets", zéro "n'hésitez pas", zéro corpo
- Valeur directe dès la première ligne

MISSION :
Adapter chaque message selon le secteur en sélectionnant les compétences pertinentes :
(Transport/Logistique, Agro, Pharma, Industrie, Startups, Boîtes désorganisées, Digitalisation…)

Toujours mettre l'accent sur :
- Excellence opérationnelle  
- Gain de temps  
- Réduction des erreurs  
- Mise en ordre rapide  
- Clarté dans les process  
- Passage au niveau supérieur  

AUDIT EXPRESS :
Toujours diriger vers l'audit express (2 minutes) qui renvoie vers le site Vyxo :
Formulation possible :
"Si vous voulez une photo claire de votre niveau actuel (2 min), j'ai mis un audit express ici 👉 [lien audit Vyxo]"

CTA FINAL (obligatoire) :
- Appel simple, naturel, léger :
"Si ça vous parle, on peut en discuter 10 minutes pour voir si je peux vous apporter un vrai gain."
- Jamais agressif, jamais lourd.

INSTRUCTIONS FINALES :
- Message court, précis, structuré
- Un problème du client → une solution Vyxo → audit express → CTA court

INPUT VARIABLES :
- Prospect : ${prospectName}
- Entreprise : ${companyName}
- Secteur : ${industry || 'Non spécifié'}
- Événement déclencheur : ${triggerEvent || 'Aucun'}
- Point de douleur : ${painPoint || 'Amélioration de l\'efficacité générale'}
- Proposition de valeur : ${valueProp || 'Excellence opérationnelle et optimisation des process'}
- CTA souhaité : ${cta || 'Échange de 10 minutes'}

GÉNÈRE 3 VARIATIONS + SÉQUENCE DE RELANCE :

Variation types:
- Direct : Ultra court (3-4 lignes max), droit au but
- Valeur : Focus ROI et bénéfices concrets
- Relationnel : Ton humain, connexion personnelle

Séquence de relance (3 emails) :
- Relance 1 (3 jours) : Rappel léger avec valeur ajoutée
- Relance 2 (7 jours) : Angle différent ou exemple concret
- Relance 3 (14 jours) : Dernière tentative, simple et direct

RETOURNE JSON EXACTEMENT DANS CE FORMAT :
{
  "analysis": "Analyse brève du prospect et approche recommandée",
  "variations": [
    { "type": "Direct", "subject": "...", "body": "..." },
    { "type": "Valeur", "subject": "...", "body": "..." },
    { "type": "Relationnel", "subject": "...", "body": "..." }
  ],
  "sequence": [
    { "step": "Relance 1 (Jour 3)", "subject": "...", "body": "..." },
    { "step": "Relance 2 (Jour 7)", "subject": "...", "body": "..." },
    { "step": "Relance 3 (Jour 14)", "subject": "...", "body": "..." }
  ]
}
`

    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY is missing')
      return Response.json({ error: 'Server configuration error: API Key missing' }, { status: 500 })
    }

    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt,
    })

    // Parse the JSON response
    let jsonResponse
    try {
      // Clean up potential markdown code blocks if the AI adds them
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
      jsonResponse = JSON.parse(cleanText)
    } catch (e) {
      console.error('Failed to parse AI JSON response:', text)
      return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
    }

    return Response.json(jsonResponse)
  } catch (error: any) {
    console.error('💥 AI Generation Error:', error)
    // Return the actual error message for debugging
    return Response.json({ 
      error: error.message || 'Failed to generate email',
      details: error.toString()
    }, { status: 500 })
  }
}
