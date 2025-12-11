"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const QUESTIONS = [
  {
    id: "q1",
    question: "Vos processus clés sont-ils formellement documentés ?",
    options: [
      { value: "0", label: "Non, tout est oral" },
      { value: "5", label: "Partiellement" },
      { value: "10", label: "Oui, procédures à jour" }
    ]
  },
  {
    id: "q2",
    question: "Suivez-vous des indicateurs de performance (KPI) mensuels ?",
    options: [
      { value: "0", label: "Aucun indicateur" },
      { value: "5", label: "Quelques uns, irrégulier" },
      { value: "10", label: "Oui, tableau de bord piloté" }
    ]
  },
  {
    id: "q3",
    question: "Gérez-vous les non-conformités et réclamations clients ?",
    options: [
      { value: "0", label: "Au cas par cas, sans trace" },
      { value: "5", label: "Suivi Excel simple" },
      { value: "10", label: "Processus structuré avec CAPA" }
    ]
  },
  {
    id: "q4",
    question: "Vos équipes sont-elles formées régulièrement ?",
    options: [
      { value: "0", label: "Formation sur le tas uniquement" },
      { value: "5", label: "Formations ponctuelles" },
      { value: "10", label: "Plan de formation suivi" }
    ]
  },
  {
    id: "q5",
    question: "Réalisez-vous des audits internes ?",
    options: [
      { value: "0", label: "Jamais" },
      { value: "5", label: "Rarement / Informel" },
      { value: "10", label: "Oui, programme annuel" }
    ]
  }
]

export default function AuditExpressPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const { toast } = useToast()

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: value })
  }

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setStep(step + 1) // Move to contact form
    }
  }

  const calculateScore = () => {
    let total = 0
    Object.values(answers).forEach(val => total += parseInt(val))
    return (total / (QUESTIONS.length * 10)) * 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const finalScore = calculateScore()
      setScore(finalScore)
      setLoading(false)
      toast({
        title: "Audit terminé !",
        description: "Votre rapport express a été généré.",
      })
    }, 1500)
  }

  if (score !== null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-vyxo-gold/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-vyxo-gold" />
            </div>
            <CardTitle className="text-2xl">Résultat de votre Audit Express</CardTitle>
            <CardDescription>Voici votre score de maturité opérationnelle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-vyxo-navy">{score}%</div>
            <Progress value={score} className="h-3" />
            
            <div className="bg-slate-100 p-4 rounded-lg text-left text-sm space-y-2">
              <p className="font-semibold">Notre analyse :</p>
              {score < 50 ? (
                <p>Votre structure manque de formalisme. Les risques opérationnels sont élevés. Il est urgent de structurer vos bases documentaires et de pilotage.</p>
              ) : score < 80 ? (
                <p>Bonnes bases, mais des fragilités persistent. Vous devez systématiser vos pratiques pour garantir une qualité constante et pérenne.</p>
              ) : (
                <p>Excellent niveau de maturité ! Vous êtes prêts pour l'excellence opérationnelle et l'amélioration continue avancée.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 h-12 text-lg">
              Réserver un appel diagnostic (15 min)
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => window.location.reload()}>
              Recommencer
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-vyxo-gold tracking-widest uppercase">Audit Express</span>
            <span className="text-xs text-muted-foreground">{step + 1} / {QUESTIONS.length + 1}</span>
          </div>
          <Progress value={((step) / (QUESTIONS.length + 1)) * 100} className="h-1 mb-4" />
          
          {step < QUESTIONS.length ? (
            <CardTitle className="text-xl leading-tight">
              {QUESTIONS[step].question}
            </CardTitle>
          ) : (
            <CardTitle className="text-xl">Dernière étape</CardTitle>
          )}
        </CardHeader>

        <CardContent>
          {step < QUESTIONS.length ? (
            <RadioGroup onValueChange={handleAnswer} value={answers[QUESTIONS[step].id]} className="space-y-3">
              {QUESTIONS[step].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors [&:has(:checked)]:border-vyxo-gold [&:has(:checked)]:bg-vyxo-gold/5">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Nom de l'entreprise</Label>
                <Input 
                  id="company" 
                  placeholder="Votre société" 
                  required 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="vous@entreprise.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                En soumettant ce formulaire, vous acceptez de recevoir votre rapport par email et d'être contacté par l'équipe Vyxo.
              </p>
            </form>
          )}
        </CardContent>

        <CardFooter>
          {step < QUESTIONS.length ? (
            <Button 
              className="w-full bg-vyxo-navy text-white hover:bg-vyxo-navy/90" 
              onClick={handleNext}
              disabled={!answers[QUESTIONS[step].id]}
            >
              Suivant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              className="w-full bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90" 
              type="submit"
              form="contact-form"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                "Obtenir mon score"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
