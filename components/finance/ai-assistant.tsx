/**
 * Vyxo Finance Hub - AI Assistant Component
 * Assistant IA pour questions financières
 */

'use client'

import { useState } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AIFinanceResponse } from '@/types/finance'

interface AIAssistantProps {
  companyId: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  suggestions?: string[]
}

export function AIAssistant({ companyId }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Bonjour ! Je suis votre assistant IA Finance. Posez-moi des questions sur votre trésorerie, vos marges, vos KPIs ou vos anomalies.',
      suggestions: [
        'Quelle est ma situation de trésorerie ?',
        'Comment évoluent mes marges ?',
        'Y a-t-il des anomalies à surveiller ?',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(question?: string) {
    const questionToAsk = question || input
    if (!questionToAsk.trim() || loading) return

    setInput('')
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: questionToAsk },
    ])

    setLoading(true)

    try {
      const response = await fetch('/api/finance/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionToAsk,
          company_id: companyId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const aiResponse: AIFinanceResponse = result.data
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: aiResponse.answer,
            suggestions: aiResponse.suggestions,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "Désolé, je n'ai pas pu traiter votre demande.",
          },
        ])
      }
    } catch (error) {
      console.error('Error with AI assistant:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Une erreur est survenue.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Assistant IA Finance
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>

              {/* Suggestions */}
              {message.role === 'assistant' && message.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleSubmit(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Je réfléchis...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Posez votre question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
