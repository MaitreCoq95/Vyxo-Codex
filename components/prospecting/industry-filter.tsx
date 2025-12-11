"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import { INDUSTRY_SECTORS } from "@/lib/constants/industries"

interface IndustryFilterProps {
  selectedIndustries: string[]
  onChange: (industries: string[]) => void
  maxHeight?: string
}

export function IndustryFilter({ selectedIndustries, onChange, maxHeight = "200px" }: IndustryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIndustries = INDUSTRY_SECTORS.filter(industry => 
    industry.value !== "" && 
    industry.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleIndustry = (value: string) => {
    if (selectedIndustries.includes(value)) {
      onChange(selectedIndustries.filter(i => i !== value))
    } else {
      onChange([...selectedIndustries, value])
    }
  }

  const removeIndustry = (value: string) => {
    onChange(selectedIndustries.filter(i => i !== value))
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">🏭 Secteur d'activité</label>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="Rechercher un secteur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-9 px-3 py-1 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {/* Checkboxes list */}
      <div className="border rounded-md p-2 bg-background">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-1">
            {filteredIndustries.map((industry) => (
              <label 
                key={industry.value} 
                className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-1.5 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedIndustries.includes(industry.value)}
                  onChange={() => toggleIndustry(industry.value)}
                  className="rounded border-gray-300 text-vyxo-navy focus:ring-vyxo-gold"
                />
                <span className="text-sm flex-1">{industry.label}</span>
                {selectedIndustries.includes(industry.value) && (
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                )}
              </label>
            ))}
            {filteredIndustries.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun secteur trouvé
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Selected industries badges */}
      {selectedIndustries.length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {selectedIndustries.length} secteur(s) sélectionné(s)
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700 hover:underline"
            >
              Tout effacer
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedIndustries.map(value => {
              const industry = INDUSTRY_SECTORS.find(s => s.value === value)
              return (
                <Badge 
                  key={value} 
                  variant="secondary" 
                  className="text-xs pr-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => removeIndustry(value)}
                >
                  {industry?.label}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
