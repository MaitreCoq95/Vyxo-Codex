/**
 * API Route: Vyxo Finance Hub - AI Assistant
 * POST /api/finance/ai-assistant - Poser une question à l'IA Finance
 */

import { NextRequest, NextResponse } from 'next/server'
import { createFinanceClient } from '@/lib/finance/supabase-client'
import type { AIFinanceQuery, AIFinanceResponse, ApiResponse } from '@/types/finance'

export async function POST(request: NextRequest) {
  try {
    const body: AIFinanceQuery = await request.json()
    const { question, company_id, context } = body

    if (!question || !company_id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'question and company_id are required' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    // Récupérer le contexte financier
    const financialContext = await getFinancialContext(company_id, context?.period_id)

    // TODO: Intégrer avec un modèle d'IA (OpenAI, Claude, etc.)
    // Pour l'instant, réponse placeholder
    const answer = await generateAIResponse(question, financialContext)

    // Sauvegarder la conversation
    const { data: conversation, error } = await supabase
      .from('finance_ai_conversations')
      .insert({
        company_id,
        user_id: 'placeholder-user-id', // TODO: récupérer de l'auth
        question,
        answer: answer.answer,
        context_data: financialContext,
      })
      .select()
      .single()

    if (error) {
      console.warn('Failed to save conversation:', error)
    }

    return NextResponse.json<ApiResponse<AIFinanceResponse>>({
      success: true,
      data: answer,
    })
  } catch (error) {
    console.error('Error with AI assistant:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

/**
 * Récupérer le contexte financier pour l'IA
 */
async function getFinancialContext(companyId: string, periodId?: string) {
  const supabase = createFinanceClient()

  // Récupérer les dernières KPI
  const { data: kpi } = await supabase
    .from('finance_kpi_snapshots')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Récupérer les anomalies ouvertes
  const { data: anomalies } = await supabase
    .from('finance_anomalies')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'open')
    .limit(5)

  return {
    kpi,
    anomalies: anomalies || [],
    period_id: periodId,
  }
}

/**
 * Générer une réponse IA
 * TODO: Remplacer par un vrai appel à OpenAI/Claude/autre
 */
async function generateAIResponse(
  question: string,
  context: any
): Promise<AIFinanceResponse> {
  // Placeholder - à remplacer par un vrai modèle d'IA
  const lowerQuestion = question.toLowerCase()

  let answer = ''
  const suggestions: string[] = []

  if (lowerQuestion.includes('trésorerie') || lowerQuestion.includes('cash')) {
    answer = `D'après les dernières données, votre trésorerie est de ${context.kpi?.cash_balance?.toLocaleString() || 'N/A'} €. `
    answer += `Le forecast à 30 jours est de ${context.kpi?.cash_forecast_30d?.toLocaleString() || 'N/A'} €.`
    suggestions.push('Analyser les flux de trésorerie détaillés')
    suggestions.push('Voir les prévisions à 60 et 90 jours')
  } else if (lowerQuestion.includes('marge') || lowerQuestion.includes('margin')) {
    answer = `Votre marge brute est de ${context.kpi?.gross_margin?.toLocaleString() || 'N/A'} €. `
    answer += `Votre marge opérationnelle est de ${context.kpi?.operating_margin?.toLocaleString() || 'N/A'} €.`
    suggestions.push('Analyser l\'évolution des marges sur 12 mois')
    suggestions.push('Comparer avec le budget')
  } else if (lowerQuestion.includes('anomalie') || lowerQuestion.includes('problème')) {
    const anomalyCount = context.anomalies?.length || 0
    answer = `Il y a actuellement ${anomalyCount} anomalie(s) ouverte(s). `
    if (anomalyCount > 0) {
      answer += `Les plus critiques concernent : ${context.anomalies[0]?.title || 'N/A'}.`
    }
    suggestions.push('Voir toutes les anomalies')
    suggestions.push('Lancer une analyse de data quality')
  } else {
    answer = `Je suis l'assistant IA Finance de Vyxo. Pour vous aider au mieux, pouvez-vous préciser votre question sur : la trésorerie, les marges, le P&L, les anomalies, ou les KPIs ?`
    suggestions.push('Quelle est ma situation de trésorerie ?')
    suggestions.push('Comment évoluent mes marges ?')
    suggestions.push('Y a-t-il des anomalies à surveiller ?')
  }

  return {
    answer,
    data_summary: context.kpi,
    suggestions,
    confidence_score: 0.75,
  }
}
