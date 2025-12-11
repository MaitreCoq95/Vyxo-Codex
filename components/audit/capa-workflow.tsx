"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, ArrowRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CAPAWorkflowProps {
  status: string
  onStatusChange: (status: string) => void
}

const STEPS = [
  { id: 'open', label: 'Ouverture', description: 'NC identifiée' },
  { id: 'root_cause_analysis', label: 'Analyse Cause', description: '5 Pourquoi / Ishikawa' },
  { id: 'action_plan', label: 'Plan d\'Action', description: 'Définition des actions' },
  { id: 'implementation', label: 'Mise en œuvre', description: 'Réalisation des actions' },
  { id: 'verification', label: 'Vérification', description: 'Contrôle efficacité' },
  { id: 'closed', label: 'Clôture', description: 'Dossier archivé' },
]

export function CAPAWorkflow({ status, onStatusChange }: CAPAWorkflowProps) {
  const currentStepIndex = STEPS.findIndex(s => s.id === status)

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-10" />
        
        {/* Progress Bar Active */}
        <div 
          className="absolute top-4 left-0 h-1 bg-vyxo-gold transition-all duration-500 -z-10" 
          style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all bg-white dark:bg-slate-950",
                  isCompleted 
                    ? "border-vyxo-gold text-vyxo-gold" 
                    : "border-slate-200 text-slate-300",
                  isCurrent && "ring-4 ring-vyxo-gold/20"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-xs font-semibold",
                  isCompleted ? "text-vyxo-navy dark:text-white" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
