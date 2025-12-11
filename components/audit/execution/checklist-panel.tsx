"use client"

import { useState } from "react"
import { Database } from "@/types/supabase-audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type ChecklistItem = Database['public']['Tables']['vch_audit_checklist_items']['Row']
type Checklist = Database['public']['Tables']['vch_audit_checklists']['Row'] & {
  items: ChecklistItem[]
}

interface ChecklistPanelProps {
  checklists: Checklist[]
  selectedItemId: string | null
  onSelectItem: (itemId: string) => void
}

export function ChecklistPanel({ checklists, selectedItemId, onSelectItem }: ChecklistPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 border-r">
      <div className="p-4 border-b bg-slate-50 dark:bg-slate-900/50">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-vyxo-gold" />
          Checklist
        </h2>
        <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            12 Complétés
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            45 Total
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {checklists.map((checklist) => (
            <div key={checklist.id} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider px-2">
                {checklist.title}
              </h3>
              <div className="space-y-1">
                {checklist.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg text-sm transition-colors flex items-start gap-3 group",
                      selectedItemId === item.id
                        ? "bg-vyxo-gold/10 text-vyxo-navy dark:text-white font-medium border border-vyxo-gold/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <div className="mt-0.5">
                      {selectedItemId === item.id ? (
                        <div className="h-4 w-4 rounded-full border-2 border-vyxo-gold bg-vyxo-gold" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="block">{item.requirement}</span>
                      {item.reference && (
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Ref: {item.reference}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
