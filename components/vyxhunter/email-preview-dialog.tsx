"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ExternalLink, Send, Eye } from "lucide-react"

interface EmailPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: {
    id: string
    subject: string
    body: string
    gammaUrl?: string
  } | null
  onSend: (id: string, subject: string, body: string) => Promise<void>
}

export function EmailPreviewDialog({ open, onOpenChange, email, onSend }: EmailPreviewDialogProps) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (email) {
      setSubject(email.subject)
      setBody(email.body)
    }
  }, [email])

  const handleSend = async () => {
    if (!email) return
    
    try {
      setLoading(true)
      await onSend(email.id, subject, body)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to send email:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!email) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Aperçu et Édition de l'Email</DialogTitle>
          <DialogDescription>
            Vérifiez et modifiez l'email avant de l'envoyer au prospect.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {email.gammaUrl && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-300">Présentation Gamma incluse :</span>
              <a 
                href={email.gammaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Voir la présentation <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="subject">Objet</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet de l'email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="body">Corps du message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Bonjour..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleSend}
            disabled={loading}
            className="bg-vyxo-navy hover:bg-vyxo-navy/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer l'email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
