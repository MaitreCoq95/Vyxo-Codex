"use client"

import { useState } from "react";
import { getAuditQuestions, generateAuditReport } from "@/lib/codex/auditSim";
import { AuditType, AuditSimQuestion, AuditResponse, AuditResult } from "@/types/codex";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ClipboardCheck,
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  RotateCcw
} from "lucide-react";
import Link from "next/link";

export default function AuditSimulatorPage() {
  const [selectedAuditType, setSelectedAuditType] = useState<AuditType | null>(null);
  const [auditStarted, setAuditStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AuditResponse[]>([]);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const auditTypes = [
    {
      id: "iso-9001" as AuditType,
      title: "ISO 9001:2015",
      description: "Système de Management de la Qualité",
      icon: "📋",
      color: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
    },
    {
      id: "iso-14001" as AuditType,
      title: "ISO 14001:2015",
      description: "Système de Management Environnemental",
      icon: "🌱",
      color: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
    },
    {
      id: "iso-45001" as AuditType,
      title: "ISO 45001:2018",
      description: "Système de Management Santé-Sécurité",
      icon: "🛡️",
      color: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700"
    },
    {
      id: "gdp-transport" as AuditType,
      title: "GDP Transport",
      description: "Bonnes Pratiques de Distribution Pharmaceutique",
      icon: "🚚",
      color: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
    },
    {
      id: "gmp-pharma" as AuditType,
      title: "GMP Pharma",
      description: "Bonnes Pratiques de Fabrication Pharmaceutique",
      icon: "💊",
      color: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700"
    }
  ];

  const currentAudit = auditTypes.find(a => a.id === selectedAuditType);
  const questions = selectedAuditType ? getAuditQuestions(selectedAuditType) : [];
  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);

  const handleStartAudit = () => {
    if (!selectedAuditType) return;
    setAuditStarted(true);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setAuditCompleted(false);
    setAuditResult(null);
  };

  const handleResponseChange = (
    status: "conforme" | "non-conforme" | "non-applicable",
    comment?: string,
    evidence?: string
  ) => {
    const newResponse: AuditResponse = {
      questionId: currentQuestion.id,
      status,
      comment,
      evidence
    };

    setResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== currentQuestion.id);
      return [...filtered, newResponse];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Audit terminé
      completeAudit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeAudit = () => {
    const result = generateAuditReport(selectedAuditType!, questions, responses);
    setAuditResult(result);
    setAuditCompleted(true);
  };

  const handleReset = () => {
    setSelectedAuditType(null);
    setAuditStarted(false);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setAuditCompleted(false);
    setAuditResult(null);
  };

  const progressPercent = questions.length > 0 ? Math.round((responses.length / questions.length) * 100) : 0;

  // ═══════════════════════════════════════════════════════════════════
  // ÉCRAN DE SÉLECTION DU TYPE D'AUDIT
  // ═══════════════════════════════════════════════════════════════════
  if (!auditStarted) {
    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/codex">
            <Button variant="ghost" size="sm" className="w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Codex
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardCheck className="h-8 w-8 text-green-500" />
              <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">
                Simulateur d'Audit
              </h1>
            </div>
            <p className="text-muted-foreground">
              Simulez un audit complet ISO, GDP ou GMP. Obtenez un rapport détaillé avec NC, CAPA et recommandations.
            </p>
          </div>
        </div>

        {/* Sélection du type d'audit */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Choisissez le type d'audit</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auditTypes.map((audit) => (
              <Card
                key={audit.id}
                className={`cursor-pointer border-2 transition-all hover:shadow-lg ${
                  selectedAuditType === audit.id
                    ? audit.color
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
                onClick={() => setSelectedAuditType(audit.id)}
              >
                <CardHeader>
                  <div className="text-center">
                    <div className="text-5xl mb-3">{audit.icon}</div>
                    <CardTitle className="text-lg">{audit.title}</CardTitle>
                    <CardDescription className="mt-2">{audit.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-muted-foreground">
                    {getAuditQuestions(audit.id).length} questions
                  </div>
                  {selectedAuditType === audit.id && (
                    <div className="mt-3">
                      <Badge className="w-full justify-center bg-green-600 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Sélectionné
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bouton démarrer */}
        {selectedAuditType && (
          <Card className={`border-2 ${currentAudit?.color}`}>
            <CardContent className="py-6 text-center">
              <h3 className="text-xl font-semibold mb-2">
                Prêt à démarrer l'audit {currentAudit?.title} ?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                L'audit comprend {questions.length} questions. Comptez environ {Math.ceil(questions.length * 2)} minutes.
              </p>
              <Button
                size="lg"
                onClick={handleStartAudit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Lancer l'Audit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // ÉCRAN DE RÉSULTAT D'AUDIT
  // ═══════════════════════════════════════════════════════════════════
  if (auditCompleted && auditResult) {
    const scoreColor =
      auditResult.totalScore >= 90
        ? "text-green-600 dark:text-green-400"
        : auditResult.totalScore >= 75
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" className="w-fit" onClick={handleReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-green-500" />
                <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">
                  Rapport d'Audit
                </h1>
              </div>
              <p className="text-muted-foreground">
                {currentAudit?.title} - {new Date(auditResult.completedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </div>

        {/* Score Card */}
        <Card className="border-2 border-green-300 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-center">Score de Conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-6xl font-bold ${scoreColor} mb-4`}>
                {auditResult.totalScore}%
              </div>
              <Progress value={auditResult.totalScore} className="h-4 mb-4" />

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{auditResult.conformeCount}</p>
                  <p className="text-sm text-muted-foreground">Conforme</p>
                </div>
                <div className="text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{auditResult.nonConformeCount}</p>
                  <p className="text-sm text-muted-foreground">Non-conforme</p>
                </div>
                <div className="text-center">
                  <MinusCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{auditResult.naCount}</p>
                  <p className="text-sm text-muted-foreground">N/A</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé Exécutif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {auditResult.summary}
            </div>
          </CardContent>
        </Card>

        {/* Non-Conformités */}
        {auditResult.ncList.length > 0 && (
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Non-Conformités Détaillées ({auditResult.ncList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditResult.ncList.map((nc, index) => {
                const severityColors = {
                  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-500",
                  major: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-500",
                  minor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-500",
                };

                return (
                  <div key={index} className={`p-4 border-2 rounded-lg ${severityColors[nc.severity]}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">
                            {nc.severity === "critical" && "🚨 Critique"}
                            {nc.severity === "major" && "⚠️ Majeure"}
                            {nc.severity === "minor" && "ℹ️ Mineure"}
                          </Badge>
                          {nc.clause && (
                            <Badge variant="outline" className="font-mono text-xs">
                              Clause {nc.clause}
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{nc.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm whitespace-pre-wrap">
                      <strong>Recommandation CAPA :</strong>
                      <div className="mt-1">{nc.recommendation}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Recommandations CAPA */}
        <Card className="border-2 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle>Plan d'Actions Recommandé (CAPA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auditResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="h-6 w-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            Nouvel Audit
          </Button>
          <Link href="/codex">
            <Button variant="outline" size="lg">
              Retour au Codex
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // ÉCRAN DE QUESTIONNAIRE D'AUDIT
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" onClick={handleReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Annuler l'audit
        </Button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">{currentAudit?.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-vyxo-navy dark:text-white">
                {currentAudit?.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progression</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="border-2 border-cyan-300 dark:border-cyan-700">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{currentQuestion.text}</CardTitle>
              <div className="flex gap-2">
                {currentQuestion.clause && (
                  <Badge variant="outline" className="text-xs font-mono">
                    Clause {currentQuestion.clause}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={
                    currentQuestion.severity === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : currentQuestion.severity === "major"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  }
                >
                  {currentQuestion.severity === "critical" && "🚨 Critique"}
                  {currentQuestion.severity === "major" && "⚠️ Majeur"}
                  {currentQuestion.severity === "minor" && "ℹ️ Mineur"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Preuves attendues */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm font-semibold mb-2">📋 Preuves attendues :</p>
            <ul className="text-sm space-y-1">
              {currentQuestion.expectedEvidence.map((evidence, index) => (
                <li key={index} className="text-muted-foreground">
                  • {evidence}
                </li>
              ))}
            </ul>
          </div>

          {/* Réponse */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Statut de conformité</Label>
            <RadioGroup
              value={currentResponse?.status || ""}
              onValueChange={(value) =>
                handleResponseChange(
                  value as "conforme" | "non-conforme" | "non-applicable",
                  currentResponse?.comment,
                  currentResponse?.evidence
                )
              }
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
                <RadioGroupItem value="conforme" id="conforme" />
                <Label htmlFor="conforme" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Conforme</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    Les preuves sont présentes et satisfaisantes
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
                <RadioGroupItem value="non-conforme" id="non-conforme" />
                <Label htmlFor="non-conforme" className="flex items-center gap-2 cursor-pointer flex-1">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Non-conforme</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    Les preuves sont absentes ou insuffisantes
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
                <RadioGroupItem value="non-applicable" id="non-applicable" />
                <Label htmlFor="non-applicable" className="flex items-center gap-2 cursor-pointer flex-1">
                  <MinusCircle className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">Non applicable</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    Cette exigence ne s'applique pas
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Commentaire */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
              Commentaire (optionnel)
            </Label>
            <Textarea
              id="comment"
              placeholder="Ajoutez des observations, précisions ou explications..."
              value={currentResponse?.comment || ""}
              onChange={(e) =>
                handleResponseChange(
                  currentResponse?.status || "conforme",
                  e.target.value,
                  currentResponse?.evidence
                )
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        <span className="text-sm text-muted-foreground">
          {responses.length} / {questions.length} réponses
        </span>

        <Button
          onClick={handleNext}
          disabled={!currentResponse?.status}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              Terminer l'audit
              <FileText className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
