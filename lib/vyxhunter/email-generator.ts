import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@supabase/supabase-js'
import type { VyxHunterCompany, VyxHunterAnalysis } from '@/lib/vyxhunter/types'

/**
 * Get sectoral email template from database
 */
async function getSectoralTemplate(sectorId: string | null, painPoint?: string) {
  if (!sectorId) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Try to find template matching pain point
  let query = supabase
    .from('vch_email_templates')
    .select('*')
    .eq('sector_id', sectorId)
    .eq('active', true)

  if (painPoint) {
    query = query.eq('pain_point_focus', painPoint)
  }

  const { data: templates } = await query.limit(1)

  if (templates && templates.length > 0) {
    return templates[0]
  }

  // Fallback: get any template for this sector
  const { data: fallbackTemplates } = await supabase
    .from('vch_email_templates')
    .select('*')
    .eq('sector_id', sectorId)
    .eq('active', true)
    .limit(1)

  return fallbackTemplates?.[0] || null
}

/**
 * Replace template variables with actual values
 */
function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g')
    result = result.replace(regex, value)
  })

  return result
}

/**
 * Generate personalized email for VyxHunter prospect
 * Now uses sectoral templates from database when available
 */
export async function generateVyxHunterEmail(
  company: VyxHunterCompany,
  analysis: VyxHunterAnalysis,
  gammaUrl?: string,
  emailType: 'initial' | 'follow_up_1' | 'follow_up_2' | 'follow_up_3' = 'initial',
  contactName?: string,
  emailStyle: 'short' | 'structured' = 'structured'
): Promise<{ subject: string; bodyHtml: string; bodyText: string }> {
  
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  // Try to get sectoral template if company has ICP sector
  let sectoralTemplate = null
  if (company.icp_sector_id) {
    const mainPainPoint = company.detected_pain_points?.[0]
    sectoralTemplate = await getSectoralTemplate(company.icp_sector_id, mainPainPoint)
  }

  // If we have a sectoral template, use it with personalization
  if (sectoralTemplate && emailType === 'initial') {
    const variables = {
      'PRÉNOM': contactName || 'Monsieur/Madame',
      'ENTREPRISE': company.name,
      'CLIENT_EXIGEANT': analysis.key_clients?.[0] || '[CLIENT]',
      'SECTEUR': company.sector || 'votre secteur',
      'DOULEUR_PRINCIPALE': company.detected_pain_points?.[0] || 'vos enjeux qualité'
    }

    const subject = replaceTemplateVariables(sectoralTemplate.subject_template, variables)
    const bodyText = replaceTemplateVariables(sectoralTemplate.body_template, variables)
    
    // Convert to HTML
    const bodyHtml = bodyText
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('\n')

    return { subject, bodyText, bodyHtml }
  }

  // Fallback to AI generation if no template or follow-up email
  const emailContext = getEmailContext(emailType)
  const ctaText = getCtaText(emailType)

  const prompt = buildEmailPrompt(
    company,
    analysis,
    emailType,
    emailStyle,
    emailContext,
    ctaText,
    contactName,
    gammaUrl,
    sectoralTemplate
  )

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt,
    })

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const emailData = JSON.parse(cleanText)

    if (!emailData.subject || !emailData.bodyText || !emailData.bodyHtml) {
      throw new Error('Invalid email response: missing required fields')
    }

    return {
      subject: emailData.subject,
      bodyText: emailData.bodyText,
      bodyHtml: emailData.bodyHtml
    }
  } catch (error: any) {
    console.error('❌ Email generation error:', error)
    throw new Error(`Failed to generate email: ${error.message}`)
  }
}

function getEmailContext(emailType: string): string {
  switch (emailType) {
    case 'initial':
      return 'Premier contact avec ce prospect. Email de découverte.'
    case 'follow_up_1':
      return 'Première relance (3 jours après). Rappel léger avec valeur ajoutée.'
    case 'follow_up_2':
      return 'Deuxième relance (7 jours après). Angle différent ou exemple concret.'
    case 'follow_up_3':
      return 'Dernière relance (14 jours après). Simple et direct, dernière tentative.'
    default:
      return ''
  }
}

function getCtaText(emailType: string): string {
  switch (emailType) {
    case 'initial':
      return 'Audit Express 2 minutes'
    case 'follow_up_1':
      return 'Échange rapide de 10 minutes'
    case 'follow_up_2':
      return 'Cas client similaire à partager'
    case 'follow_up_3':
      return 'Dernière opportunité d\'échange'
    default:
      return 'Échange rapide'
  }
}

function buildEmailPrompt(
  company: VyxHunterCompany,
  analysis: VyxHunterAnalysis,
  emailType: string,
  emailStyle: string,
  emailContext: string,
  ctaText: string,
  contactName?: string,
  gammaUrl?: string,
  sectoralTemplate?: any
): string {
  const sectorContext = sectoralTemplate 
    ? `\nTEMPLATE SECTORIEL DISPONIBLE (à adapter, pas copier) :
Secteur: ${sectoralTemplate.sector_name}
Ton: ${sectoralTemplate.tone}
Focus douleur: ${sectoralTemplate.pain_point_focus}
Exemple de structure: ${sectoralTemplate.body_template.substring(0, 200)}...`
    : ''

  return `
Tu es VyxHunter, l'agent de prospection IA de Vyxo Consulting.

COMPÉTENCES VYXO (Vivien Closse) :
- Qualité: ISO 9001, AS9120B, EFQM, ISO 13485, ISO 22716, PPAP, AMDEC, 8D
- Pharma: GDP, BPF, BPD, GAMP5, 21 CFR Part 11, chaîne du froid, validation
- IT/Cybersécurité: ISO 27001, RGPD, SMSI, audit trail, dev sécurisé
- Lean Six Sigma: DMAIC, Kaizen, 5S, SMED, Kanban, Jidoka
- Logistique: GDP, traçabilité, chaîne du froid
- Sûreté aérienne: DGAC, CE 300/2008, AS9120B
- HSE: ISO 45001, ISO 14001, REACH
- Transformation digitale: Power BI, Supabase, QMS digitaux

STYLE VYXO :
- Direct, clair, humain
- Confiance tranquille, pas d'arrogance
- Phrases courtes, pas de jargon
- INTERDIT: "Je me permets", "N'hésitez pas", "Cordialement"
- OBLIGATOIRE: Gains concrets, audit express 2 min, CTA simple

CONTEXTE EMAIL :
Type: ${emailType}
Style: ${emailStyle === 'short' ? 'COURT (max 6 lignes)' : 'STRUCTURÉ (max 10 lignes)'}
${emailContext}
${sectorContext}

PROSPECT :
- Entreprise: ${company.name}
- Contact: ${contactName || 'Non spécifié'}
- Secteur ICP: ${company.icp_sector_id ? 'Détecté' : 'Non détecté'}
- Pain points détectés: ${company.detected_pain_points?.join(', ') || 'Non détectés'}
- Maturité: ${company.maturity_level || 'Inconnue'}
- Réglementations: ${company.applicable_regulations?.join(', ') || 'Non détectées'}

ANALYSE IA :
- Résumé: ${analysis.business_summary}
- Points de douleur: ${analysis.pains?.join(', ')}
- Angle d'entrée: ${analysis.entry_angle}
- Gains rapides: ${analysis.quick_wins?.join(', ')}

${gammaUrl ? `GAMMA SLIDE: ${gammaUrl}` : ''}

STRUCTURE EMAIL :
1. Salutation personnalisée
2. Montrer que tu connais l'entreprise (1 phrase)
3. Citer 1-2 pain points détectés
4. Valeur Vyxo adaptée au secteur
${gammaUrl ? '5. Lien Gamma' : ''}
${emailType === 'initial' ? '6. Lien audit express: https://www.vyxoconsult.com/' : ''}
7. CTA: ${ctaText}

FORMAT JSON :
{
  "subject": "...",
  "bodyText": "...",
  "bodyHtml": "..."
}

Pour bodyHtml: <p> pour paragraphes, <a> pour liens. Style simple et pro.
`.trim()
}

/**
 * Generate email subject line only (for quick preview)
 */
export async function generateEmailSubject(
  companyName: string,
  sector: string,
  entryAngle: string
): Promise<string> {
  const prompt = `
Génère un objet d'email de prospection B2B pour ${companyName} (${sector}).
Angle: ${entryAngle}

Style: Direct, intrigant, personnalisé. Max 50 caractères.
Exemples: "Question rapide ${companyName}", "${sector}: gain de temps?", "Optimisation process chez vous?"

Retourne UNIQUEMENT l'objet, sans guillemets ni formatage.
`.trim()

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
    })

    return text.trim().replace(/^["']|["']$/g, '')
  } catch (error: any) {
    console.error('❌ Subject generation error:', error)
    return `Optimisation opérationnelle ${companyName}`
  }
}
