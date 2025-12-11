'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Loader2 } from 'lucide-react'

interface GammaCustomizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  companyName: string
  onGenerate: (options: GammaGenerationOptions) => Promise<void>
}

export interface GammaGenerationOptions {
  tone: string
  audience: string
  imageStyle: string
  imageInstructions: string
  numSlides: number
}

export function GammaCustomizationDialog({
  open,
  onOpenChange,
  companyId,
  companyName,
  onGenerate
}: GammaCustomizationDialogProps) {
  const [generating, setGenerating] = useState(false)
  const [tone, setTone] = useState('professional, inspiring')
  const [audience, setAudience] = useState('C-level executives, decision makers')
  const [imageStyle, setImageStyle] = useState('photorealistic')
  const [imageInstructions, setImageInstructions] = useState('')
  const [numSlides, setNumSlides] = useState(5)

  async function handleGenerate() {
    setGenerating(true)
    try {
      await onGenerate({
        tone,
        audience,
        imageStyle,
        imageInstructions,
        numSlides
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Personnaliser la présentation Gamma
          </DialogTitle>
          <DialogDescription>
            Configurez la présentation pour {companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tone Selection */}
          <div className="space-y-2">
            <Label htmlFor="tone">Ton de la présentation</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional, inspiring">Professionnel et inspirant</SelectItem>
                <SelectItem value="professional, technical">Professionnel et technique</SelectItem>
                <SelectItem value="casual, friendly">Décontracté et amical</SelectItem>
                <SelectItem value="formal, corporate">Formel et corporate</SelectItem>
                <SelectItem value="enthusiastic, energetic">Enthousiaste et énergique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audience Selection */}
          <div className="space-y-2">
            <Label htmlFor="audience">Audience cible</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger id="audience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C-level executives, decision makers">C-Level / Décideurs</SelectItem>
                <SelectItem value="managers, team leads">Managers / Chefs d&apos;équipe</SelectItem>
                <SelectItem value="technical team, engineers">Équipe technique / Ingénieurs</SelectItem>
                <SelectItem value="sales team, business developers">Équipe commerciale</SelectItem>
                <SelectItem value="general audience, all stakeholders">Audience générale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Slides */}
          <div className="space-y-2">
            <Label htmlFor="numSlides">Nombre de slides</Label>
            <Select value={numSlides.toString()} onValueChange={(v) => setNumSlides(parseInt(v))}>
              <SelectTrigger id="numSlides">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 slide (Concis)</SelectItem>
                <SelectItem value="3">3 slides (Équilibré)</SelectItem>
                <SelectItem value="5">5 slides (Détaillé - Recommandé)</SelectItem>
                <SelectItem value="7">7 slides (Complet)</SelectItem>
                <SelectItem value="10">10 slides (Très détaillé)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Style */}
          <div className="space-y-2">
            <Label htmlFor="imageStyle">Style des images</Label>
            <Select value={imageStyle} onValueChange={setImageStyle}>
              <SelectTrigger id="imageStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic (IA)</SelectItem>
                <SelectItem value="illustration">Illustration moderne (IA)</SelectItem>
                <SelectItem value="none">Sans images</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Image Instructions */}
          <div className="space-y-2">
            <Label htmlFor="imageInstructions">Instructions personnalisées pour les images</Label>
            <Textarea
              id="imageInstructions"
              placeholder="Ex: Utiliser des images de bureaux modernes, éviter les personnes, privilégier les graphiques abstraits..."
              value={imageInstructions}
              onChange={(e) => setImageInstructions(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Décrivez le type d&apos;images que vous souhaitez. L&apos;IA Gamma générera des images correspondant à vos instructions.
            </p>
          </div>

          {/* Preview Info */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h4 className="text-sm font-medium">Aperçu de la configuration</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Ton : {tone}</p>
              <p>• Audience : {audience}</p>
              <p>• Slides : {numSlides}</p>
              <p>• Images : {imageStyle === 'none' ? 'Aucune' : `IA ${imageStyle}`}</p>
              {imageInstructions && <p>• Instructions images : Personnalisées</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={generating}>
            Annuler
          </Button>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer la présentation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
