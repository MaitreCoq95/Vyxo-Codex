// =====================================================
// Gamma API Client
// Integration with Gamma.app for presentation generation
// =====================================================

interface GammaSlideConfig {
  title: string
  subtitle?: string
  sections: GammaSection[]
  theme?: 'minimal' | 'modern' | 'professional'
  colors?: {
    primary: string
    secondary: string
  }
}

interface GammaSection {
  heading: string
  content: string[]
  type?: 'text' | 'bullets' | 'cta'
}

interface GammaGenerateResponse {
  slideId: string
  url: string
  status: 'ready' | 'generating' | 'failed'
  error?: string
}

/**
 * Generate a Gamma presentation slide
 * 
 * Uses Gamma API v1.0 (https://gamma.app/docs/api)
 * Requires GAMMA_API_KEY in environment (format: sk-gamma-xxxxxxxx)
 */
export async function generateGammaSlide(
  prompt: string,
  config?: Partial<GammaSlideConfig> & {
    tone?: string
    audience?: string
    imageStyle?: string
    imageInstructions?: string
    numSlides?: number
    ctaText?: string
    ctaUrl?: string
  }
): Promise<GammaGenerateResponse> {
  const apiKey = process.env.GAMMA_API_KEY
  const logoUrl = process.env.VYXO_LOGO_URL || 'https://vyxoconsulting.com/logo.png'

  if (!apiKey) {
    console.warn('⚠️ GAMMA_API_KEY not configured - using mock response')
    
    // Mock response for development
    return {
      slideId: `mock-${Date.now()}`,
      url: `https://gamma.app/docs/mock-presentation-${Date.now()}`,
      status: 'ready'
    }
  }

  try {
    console.log('📊 Generating Gamma presentation via API...')
    
    // Build request body with advanced options
    const requestBody: any = {
      inputText: prompt,
      textMode: 'generate',
      format: 'presentation'
    }

    // Add text options
    requestBody.textOptions = {
      tone: config?.tone || 'professional, inspiring',
      audience: config?.audience || 'C-level executives, decision makers',
      amount: 'detailed',
      language: 'fr'
    }

    // Add image options
    if (config?.imageStyle && config.imageStyle !== 'none') {
      requestBody.imageOptions = {
        source: 'aiGenerated',
        model: 'imagen-4-pro',
        style: config.imageStyle === 'photorealistic' 
          ? 'professional, modern, photorealistic' 
          : 'professional, modern, illustration'
      }
    } else if (config?.imageStyle === 'none') {
      requestBody.imageOptions = {
        source: 'noImages'
      }
    }

    // Add custom image instructions if provided
    if (config?.imageInstructions) {
      if (!requestBody.additionalInstructions) {
        requestBody.additionalInstructions = ''
      }
      requestBody.additionalInstructions += `\n\nImage instructions: ${config.imageInstructions}`
    }

    // Add card options (simplified - no header/footer as it causes API errors)
    requestBody.cardOptions = {
      dimensions: 'fluid'
    }

    // Add number of slides if specified
    if (config?.numSlides && config.numSlides > 1) {
      requestBody.numCards = config.numSlides
      requestBody.cardSplit = 'auto'
    }

    // Add additional instructions for branding (including logo)
    const brandInstructions = `Use Vyxo Consulting brand colors: Navy blue (#1e3a8a) as primary, Gold (#d4af37) for accents and CTAs. Maintain a premium, minimalist aesthetic. Include Vyxo Consulting logo if possible.`
    requestBody.additionalInstructions = (requestBody.additionalInstructions || '') + '\n\n' + brandInstructions

    // Add custom theme ID if configured (Gamma Pro feature)
    const themeId = process.env.GAMMA_THEME_ID
    if (themeId) {
      requestBody.themeId = themeId
      console.log('🎨 Using custom Gamma theme:', themeId)
    }


    // Gamma API v1.0 endpoint
    const response = await fetch('https://public-api.gamma.app/v1.0/generations', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Gamma API error:', response.status, errorText)
      throw new Error(`Gamma API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    console.log('✅ Gamma presentation generated:', JSON.stringify(data, null, 2))
    
    // Handle async generation response
    // Gamma API v1.0 usually returns { id: "generation_id" } for async requests
    // We check for various ID fields to be robust
    const generationId = data.id || data.generationId || data.jobId
    const documentId = data.documentId || (data.result && data.result.id)
    const webUrl = data.url || data.webUrl

    // Case 1: Sync response with document details
    if (documentId || webUrl) {
      return {
        slideId: documentId || generationId,
        url: webUrl || `https://gamma.app/docs/${documentId}`,
        status: 'ready'
      }
    }

    // Case 2: Async response (Generation ID only)
    if (generationId) {
      return {
        slideId: generationId,
        url: '', // No URL yet
        status: 'generating'
      }
    }

    // Case 3: Unknown structure
    console.warn('⚠️ Unexpected Gamma response structure:', data)
    return {
      slideId: `unknown-${Date.now()}`,
      url: '',
      status: 'failed',
      error: 'Unexpected response structure from Gamma API'
    }

  } catch (error: any) {
    console.error('❌ Gamma API error:', error)
    
    // Fallback to mock if API fails
    return {
      slideId: `error-fallback-${Date.now()}`,
      url: '',
      status: 'failed',
      error: error.message
    }
  }
}

/**
 * Get Gamma slide details
 * Fetches the current status and metadata of a Gamma presentation
 */
export async function getGammaSlide(slideId: string): Promise<{
  url: string
  status: string
  viewsCount?: number
}> {
  const apiKey = process.env.GAMMA_API_KEY

  if (!apiKey) {
    return {
      url: `https://gamma.app/docs/${slideId}`,
      status: 'ready'
    }
  }

  try {
    // Gamma API v1.0 - Get document details
    // First try to fetch as a document
    let response = await fetch(`https://public-api.gamma.app/v1.0/documents/${slideId}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey
      }
    })

    // If 404, it might be a generation ID, try fetching generation status
    if (response.status === 404) {
       response = await fetch(`https://public-api.gamma.app/v1.0/generations/${slideId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey
        }
      })
    }

    if (!response.ok) {
      console.warn('⚠️ Could not fetch Gamma slide/generation details, using fallback')
      return {
        url: `https://gamma.app/docs/${slideId}`,
        status: 'ready' // Fallback, assuming it might be ready or we can't check
      }
    }

    const data = await response.json()
    
    console.log('🔍 Gamma API response for slideId', slideId, ':', JSON.stringify(data, null, 2))
    
    // Check if it's a generation response or document response
    const status = data.status || 'ready'
    const url = data.gammaUrl || data.url || data.webUrl || (data.result && data.result.url)
    
    console.log('📊 Parsed status:', status, 'url:', url)
    
    // If generation is done, we might get the document ID/URL
    // Gamma API returns 'completed' when generation is done
    if (status === 'completed' || status === 'SUCCESS' || status === 'ready') {
       return {
        url: url || `https://gamma.app/docs/${data.id || slideId}`,
        status: 'ready',
        viewsCount: data.analytics?.views || 0
      }
    }

    return {
      url: '',
      status: 'generating',
      viewsCount: 0
    }
  } catch (error: any) {
    console.error('❌ Error fetching Gamma slide:', error)
    
    // Fallback to basic URL
    return {
      url: `https://gamma.app/docs/${slideId}`,
      status: 'ready'
    }
  }
}

/**
 * Track Gamma slide view
 * Called when we detect a view via webhook or tracking pixel
 */
export async function trackGammaView(slideId: string): Promise<void> {
  // This would typically be handled by Gamma's analytics
  // We just need to update our local database
  console.log(`👁️ Gamma slide viewed: ${slideId}`)
}

/**
 * Export Gamma slide as PDF or PPTX
 * Uses Gamma API to generate downloadable file
 */
export async function exportGammaSlide(
  slideId: string,
  format: 'pdf' | 'pptx',
  prompt: string
): Promise<{ url: string; blob?: Blob }> {
  const apiKey = process.env.GAMMA_API_KEY

  if (!apiKey) {
    throw new Error('GAMMA_API_KEY not configured')
  }

  try {
    console.log(`📥 Exporting Gamma slide ${slideId} as ${format.toUpperCase()}...`)

    // Use Gamma's export endpoint for existing documents
    // Format: /v1.0/documents/{documentId}/export
    const exportEndpoint = `https://public-api.gamma.app/v1.0/documents/${slideId}/export`
    
    const response = await fetch(exportEndpoint, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        format: format.toUpperCase() // PDF or PPTX
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Gamma export failed:', error)
      throw new Error(`Gamma export failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Gamma export response:', data)

    // The API returns a download URL for the exported file
    const downloadUrl = data.downloadUrl || data.url || data.exportUrl || data.fileUrl

    if (!downloadUrl) {
      throw new Error('No download URL in Gamma export response')
    }

    return {
      url: downloadUrl
    }
  } catch (error: any) {
    console.error('❌ Error exporting Gamma slide:', error)
    throw error
  }
}

export function buildGammaPrompt(
  companyName: string,
  sector: string,
  analysis: {
    mainPain: string
    solution: string
    quickWins: string[]
    pains?: string[]
    opportunities?: string[]
    relevance_score?: number
    business_summary?: string
  }
): string {
  const pains = analysis.pains || [analysis.mainPain]
  const opportunities = analysis.opportunities || []
  const score = analysis.relevance_score || 85
  
  return `
Create a professional, high-impact presentation for ${companyName} in the ${sector} sector.

PRESENTATION STRUCTURE:

=== SLIDE 1: TITLE & HOOK ===
Title: "${companyName} × Vyxo Consulting"
Subtitle: "Clarté. Rapidité. Excellence opérationnelle."

Opening hook: "${companyName} fait face à des défis opérationnels qui freinent sa croissance. Nous avons la solution."

=== SLIDE 2: VOTRE SITUATION ACTUELLE ===
Heading: "Les défis de ${companyName}"

Context: "${analysis.business_summary || `${companyName} est une entreprise ${sector} qui cherche à optimiser ses processus.`}"

Pain Points (avec impact quantifié):
${pains.map((pain, i) => `${i + 1}. ${pain}
   Impact: Perte de temps, inefficacité, coûts cachés`).join('\n')}

Stat visuelle: "Score de pertinence Vyxo: ${score}/100"

=== SLIDE 3: NOTRE SOLUTION VYXO ===
Heading: "Une approche éprouvée en 3 étapes"

Méthodologie:
1. **Audit Express** (2 minutes)
   - Diagnostic rapide et précis
   - Identification des quick wins
   
2. **Plan d'action personnalisé**
   - Roadmap claire et priorisée
   - Timeline réaliste
   
3. **Accompagnement opérationnel**
   - Mise en œuvre concrète
   - Formation des équipes

Notre proposition: ${analysis.solution}

=== SLIDE 4: RÉSULTATS ATTENDUS ===
Heading: "Ce que ${companyName} va gagner"

Quick Wins (résultats immédiats):
${analysis.quickWins.map((win, i) => `✓ ${win}`).join('\n')}

${opportunities.length > 0 ? `
Opportunités de croissance:
${opportunities.slice(0, 3).map(opp => `→ ${opp}`).join('\n')}
` : ''}

ROI estimé: "Gains mesurables dès les 3 premiers mois"

=== SLIDE 5: PROCHAINES ÉTAPES ===
Heading: "Démarrons ensemble"

Call-to-Action principal:
"🚀 Audit Express Gratuit - 2 minutes"
→ https://www.vyxoconsult.com/

Proposition de valeur:
- Sans engagement
- Résultats immédiats
- Plan d'action personnalisé offert

Contact: contact@vyxoconsult.com

VISUAL & STYLE GUIDELINES:
- Design: Minimaliste, premium, moderne
- Couleurs: Bleu marine (#1e3a8a) comme couleur principale, Or (#d4af37) pour les accents et CTA
- Typographie: Inter ou équivalent professionnel, hiérarchie claire
- Layout: Aéré, beaucoup d'espace blanc, focus sur la lisibilité
- Images: Professionnelles, modernes, éviter le stock photo générique
- Data viz: Utiliser des graphiques simples pour les stats (score, ROI)
- Icônes: Minimalistes, cohérentes avec la charte
- Logo: Vyxo Consulting en haut à droite sur chaque slide

TONE & MESSAGING:
- Professionnel mais accessible
- Orienté résultats et action
- Empathique (comprendre les défis)
- Confiant (expertise prouvée)
- Concret (éviter le jargon, privilégier les exemples)
`.trim()
}
