"use client"

import { useState } from "react"
import { Database } from "@/types/supabase-audit"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  XCircle,
  Mic,
  Image as ImageIcon,
  Paperclip
} from "lucide-react"
import { cn } from "@/lib/utils"

type FindingType = 'conformity' | 'observation' | 'improvement' | 'nc_minor' | 'nc_major'

interface FindingEditorProps {
  itemId: string | null
  initialData?: any
  onSave: (data: any) => void
}

export function FindingEditor({ itemId, initialData, onSave }: FindingEditorProps) {
  const [type, setType] = useState<FindingType>('conformity')
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState("")

  // Reset or load data when item changes
  useState(() => {
    if (initialData) {
      setType(initialData.type)
      setDescription(initialData.description)
    } else {
      setType('conformity')
      setDescription("")
    }
  })

  // React to prop changes (when switching items)
  const [prevItemId, setPrevItemId] = useState(itemId)
  if (itemId !== prevItemId) {
    setPrevItemId(itemId)
    if (initialData) {
      setType(initialData.type)
      setDescription(initialData.description)
    } else {
      setType('conformity')
      setDescription("")
    }
  }

  if (!itemId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
        <div>
          <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Sélectionnez un point de contrôle à gauche pour commencer l'évaluation.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold mb-2">Évaluation du point</h2>
        <p className="text-muted-foreground text-sm">
          Qualifiez le constat et apportez les preuves nécessaires.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Classification Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setType('conformity')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
              type === 'conformity' 
                ? "border-green-500 bg-green-50 text-green-700" 
                : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-600"
            )}
          >
            <CheckCircle className="h-6 w-6" />
            <span className="text-xs font-medium">Conforme</span>
          </button>

          <button
            onClick={() => setType('observation')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
              type === 'observation' 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-600"
            )}
          >
            <Info className="h-6 w-6" />
            <span className="text-xs font-medium">Observation</span>
          </button>

          <button
            onClick={() => setType('improvement')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
              type === 'improvement' 
                ? "border-purple-500 bg-purple-50 text-purple-700" 
                : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-600"
            )}
          >
            <Lightbulb className="h-6 w-6" />
            <span className="text-xs font-medium">Piste Progrès</span>
          </button>

          <button
            onClick={() => setType('nc_minor')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
              type === 'nc_minor' 
                ? "border-orange-500 bg-orange-50 text-orange-700" 
                : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-600"
            )}
          >
            <AlertTriangle className="h-6 w-6" />
            <span className="text-xs font-medium">NC Mineure</span>
          </button>

          <button
            onClick={() => setType('nc_major')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
              type === 'nc_major' 
                ? "border-red-500 bg-red-50 text-red-700" 
                : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-600"
            )}
          >
            <XCircle className="h-6 w-6" />
            <span className="text-xs font-medium">NC Majeure</span>
          </button>
        </div>

        {/* Description Editor */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Constat détaillé</Label>
            <Button variant="ghost" size="sm" className="text-vyxo-gold">
              <Mic className="h-4 w-4 mr-2" />
              Dictée vocale
            </Button>
          </div>
          <Textarea 
            placeholder="Décrivez vos observations factuelles..." 
            className="min-h-[200px] text-base p-4 resize-none focus-visible:ring-vyxo-gold"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 h-12">
            <ImageIcon className="h-4 w-4 mr-2" />
            Ajouter Photo
          </Button>
          <Button variant="outline" className="flex-1 h-12">
            <Paperclip className="h-4 w-4 mr-2" />
            Joindre Document
          </Button>
        </div>
      </div>

      <div className="p-6 border-t bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-4">
        <Button variant="ghost">Ignorer</Button>
        <Button 
          className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 min-w-[150px]"
          onClick={() => onSave({ type, description })}
        >
          Valider le constat
        </Button>
      </div>
    </div>
  )
}
