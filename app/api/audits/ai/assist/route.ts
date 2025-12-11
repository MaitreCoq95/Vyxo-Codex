import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt, context } = await req.json()

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: `You are Vyxo Audit Assist, an expert AI auditor specializing in ISO 19011 and operational excellence.
        Your goal is to assist consultants in drafting high-quality audit findings and reports.
        
        Style guidelines:
        - Professional, objective, and factual.
        - Concise and direct (Vyxo style).
        - Focus on value-added recommendations.
        - Use "Nous" or passive voice for observations.
        
        Context provided: ${JSON.stringify(context)}`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
  })

  return result.toTextStreamResponse()
}
