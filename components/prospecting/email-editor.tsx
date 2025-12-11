"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Save, X, Sparkles, RotateCcw, Copy } from "lucide-react"

interface EmailEditorProps {
  initialSubject: string
  initialBody: string
  onSave: (subject: string, body: string) => void
  type: string
}

export function EmailEditor({ initialSubject, initialBody, onSave, type }: EmailEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [showAIMenu, setShowAIMenu] = useState(false)
  const [isImproving, setIsImproving] = useState(false)

  const handleSave = () => {
    onSave(subject, body)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setSubject(initialSubject)
    setBody(initialBody)
    setIsEditing(false)
  }

  const handleReset = () => {
    setSubject(initialSubject)
    setBody(initialBody)
  }

  const handleAIImprove = async (action: string) => {
    setIsImproving(true)
    try {
      const response = await fetch('/api/ai/improve-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          action
        })
      })

      if (!response.ok) throw new Error('AI improvement failed')

      const data = await response.json()
      setSubject(data.subject)
      setBody(data.body)
      setShowAIMenu(false)
    } catch (error) {
      console.error('AI improvement error:', error)
    } finally {
      setIsImproving(false)
    }
  }

  if (!isEditing) {
    return (
      <Card className="relative group">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-vyxo-gold uppercase tracking-wider mb-2">
                  {type}
                </div>
                <h4 className="font-semibold text-base mb-2">{subject}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-2" />
                Éditer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAIMenu(!showAIMenu)}
                className="flex-1 border-vyxo-gold text-vyxo-gold hover:bg-vyxo-gold/10"
              >
                <Sparkles className="h-3 w-3 mr-2" />
                IA Améliore
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
                }}
                className="px-3"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            {showAIMenu && (
              <Card className="mt-2 border-vyxo-gold">
                <CardContent className="p-3">
                  <div className="text-xs font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-vyxo-gold" />
                    Améliorations IA
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('direct')}
                      disabled={isImproving}
                      className="justify-start text-xs"
                    >
                      ⚡ Plus direct
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('pro')}
                      disabled={isImproving}
                      className="justify-start text-xs"
                    >
                      💼 Plus pro
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('relationnel')}
                      disabled={isImproving}
                      className="justify-start text-xs"
                    >
                      🤝 Plus relationnel
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('shorten')}
                      disabled={isImproving}
                      className="justify-start text-xs"
                    >
                      ✂️ Raccourcir
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('lengthen')}
                      disabled={isImproving}
                      className="justify-start text-xs"
                    >
                      📝 Allonger
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('vivien')}
                      disabled={isImproving}
                      className="justify-start text-xs"
                    >
                      🎯 Style Vivien
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAIImprove('cta')}
                      disabled={isImproving}
                      className="justify-start text-xs col-span-2"
                    >
                      🔥 Punch line CTA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-vyxo-gold">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-xs font-medium text-vyxo-gold uppercase tracking-wider">
            {type} - Mode Édition
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sujet</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet de l'email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Corps</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Corps de l'email"
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="flex-1 bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90"
            >
              <Save className="h-3 w-3 mr-2" />
              Sauvegarder
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="h-3 w-3 mr-2" />
              Annuler
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="border"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
