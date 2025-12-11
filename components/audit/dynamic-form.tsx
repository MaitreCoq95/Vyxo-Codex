"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Types for our JSON Form Schema
export type FormField = {
  id: string
  type: "text" | "textarea" | "select" | "radio" | "rating"
  label: string
  description?: string
  options?: { label: string; value: string }[]
  required?: boolean
}

export type FormSection = {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

export type FormSchema = {
  title: string
  sections: FormSection[]
}

interface DynamicFormProps {
  schema: FormSchema
  onSubmit: (data: Record<string, any>) => void
}

export function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const progress = ((currentSection + 1) / schema.sections.length) * 100

  const isLastSection = currentSection === schema.sections.length - 1

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSection((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onSubmit(formData)
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
    }
  }

  const section = schema.sections[currentSection]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>Section {currentSection + 1} of {schema.sections.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <motion.div
        key={section.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-t-4 border-t-vyxo-navy shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-vyxo-navy dark:text-white">{section.title}</CardTitle>
            {section.description && <CardDescription>{section.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {section.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-base font-medium flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground mb-2">{field.description}</p>}

                {field.type === "text" && (
                  <Input
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900"
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 min-h-[100px]"
                  />
                )}

                {field.type === "select" && (
                  <Select onValueChange={(value) => handleInputChange(field.id, value)} value={formData[field.id]}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "radio" && (
                  <RadioGroup onValueChange={(value) => handleInputChange(field.id, value)} value={formData[field.id]}>
                    {field.options?.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${field.id}-${opt.value}`} />
                        <Label htmlFor={`${field.id}-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {field.type === "rating" && (
                    <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleInputChange(field.id, rating)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                    formData[field.id] === rating 
                                    ? "bg-vyxo-navy text-white border-vyxo-navy scale-110" 
                                    : "bg-white dark:bg-slate-900 border-slate-200 hover:border-vyxo-gold"
                                }`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack} disabled={currentSection === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-vyxo-gold hover:bg-vyxo-gold/90 text-vyxo-navy font-bold px-8">
          {isLastSection ? "Submit Audit" : "Next Section"}
        </Button>
      </div>
    </div>
  )
}
