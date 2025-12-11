import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    const { subject, body, action } = await req.json()

    // Settings Vivien/Vyxo
    const settings = {
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
      ]
    }

    let prompt = ''

    switch (action) {
      case 'direct':
        prompt = `
Réécris cet email en mode ULTRA-DIRECT :
- Supprime toute politesse inutile
- Va droit au but dès la première ligne
- Phrases courtes (max 10 mots par phrase)
- Ton cash mais respectueux
- Garde l'essentiel uniquement

Sujet actuel : ${subject}
Corps actuel : ${body}

Retourne JSON : { "subject": "...", "body": "..." }
`
        break

      case 'pro':
        prompt = `
Réécris cet email en mode PROFESSIONNEL :
- Vouvoiement
- Ton formel mais pas guindé
- Crédibilité et expertise
- Structure claire
- Garde le fond, améliore la forme

Sujet actuel : ${subject}
Corps actuel : ${body}

Retourne JSON : { "subject": "...", "body": "..." }
`
        break

      case 'relationnel':
        prompt = `
Réécris cet email en mode RELATIONNEL :
- Ton chaleureux et humain
- Connexion personnelle
- Storytelling léger si pertinent
- Approche consultative
- Garde l'authenticité

Sujet actuel : ${subject}
Corps actuel : ${body}

Retourne JSON : { "subject": "...", "body": "..." }
`
        break

      case 'shorten':
        prompt = `
RACCOURCIS cet email au MAXIMUM :
- Garde uniquement l'essentiel
- Max 3-4 lignes au total
- Ultra concis
- Chaque mot compte
- Garde le CTA

Sujet actuel : ${subject}
Corps actuel : ${body}

Retourne JSON : { "subject": "...", "body": "..." }
`
        break

      case 'lengthen':
        prompt = `
ALLONGE cet email avec des DÉTAILS :
- Ajoute des exemples concrets
- Bénéfices chiffrés si possible
- Cas d'usage
- Valeur ajoutée claire
- Garde la structure

Sujet actuel : ${subject}
Corps actuel : ${body}

Retourne JSON : { "subject": "...", "body": "..." }
`
        break

      case 'vivien':
        prompt = `
Réécris cet email dans le STYLE VIVIEN/VYXO :

RÈGLES STRICTES :
- INTERDIT : ${settings.avoidPhrases.join(', ')}
- UTILISE : ${settings.preferredPhrases.join(', ')}
- Zéro jargon IA, zéro corpo
- Direct, humain, pro, jamais mielleux
- Excellence opérationnelle
- Ton cash mais respectueux
- Pas de phrases longues

Sujet actuel : ${subject}
Corps actuel : ${body}

Retourne JSON : { "subject": "...", "body": "..." }
`
        break

      case 'cta':
        prompt = `
Génère un CTA FINAL PERCUTANT pour cet email :
- Naturel et léger
- Pas agressif, pas lourd
- Irrésistible
- Style Vivien (simple, direct)
- Exemple : "Si ça vous parle, on peut en discuter 10 min"

Email actuel :
Sujet : ${subject}
Corps : ${body}

Retourne JSON avec le corps modifié pour avoir un CTA final parfait :
{ "subject": "${subject}", "body": "..." }
`
        break

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
    })

    // Parse JSON response
    let result
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
      result = JSON.parse(cleanText)
    } catch (_e) {
      console.error('Failed to parse AI response:', text)
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    return Response.json(result)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('💥 AI Improvement Error:', error)
    return Response.json({ 
      error: errorMessage || 'Failed to improve email',
      details: String(error)
    }, { status: 500 })
  }
}
