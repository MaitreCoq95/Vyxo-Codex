"use client"

import { useState, useEffect } from "react";
import { QuizQuestion, QuizResult } from "@/types/codex";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onComplete?: (results: QuizResult[], score: number) => void;
  onExit?: () => void;
}

export function QuizRunner({ questions, onComplete, onExit }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (!showExplanation) {
      setSelectedAnswer(index);
    }
  };

  const handleValidate = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const newResult: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect,
    };

    setResults([...results, newResult]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz terminé
      const finalScore = Math.round(
        ((results.filter(r => r.isCorrect).length + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0)) /
          questions.length) *
          100
      );
      setIsComplete(true);
      if (onComplete) {
        onComplete([...results], finalScore);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setResults([]);
    setIsComplete(false);
  };

  // Calcul du score final
  const finalScore = isComplete
    ? Math.round((results.filter(r => r.isCorrect).length / questions.length) * 100)
    : 0;

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Target className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <p className="text-muted-foreground">Aucune question disponible pour ce quiz.</p>
          {onExit && (
            <Button onClick={onExit} variant="outline" className="mt-4">
              Retour
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Écran de résultats
  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-vyxo-gold to-amber-400 rounded-full">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Quiz terminé !</CardTitle>
          <CardDescription className="text-lg mt-2">
            Voici vos résultats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <div className="text-6xl font-bold text-vyxo-navy dark:text-white mb-2">
              {finalScore}%
            </div>
            <p className="text-muted-foreground">
              {results.filter(r => r.isCorrect).length} / {questions.length} réponses correctes
            </p>
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">
                ✓ Correctes: {results.filter(r => r.isCorrect).length}
              </span>
              <span className="text-red-600 dark:text-red-400 font-medium">
                ✗ Incorrectes: {results.filter(r => !r.isCorrect).length}
              </span>
            </div>
            <Progress value={finalScore} className="h-3" />
          </div>

          {/* Message d'encouragement */}
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="font-medium">
              {finalScore >= 80
                ? "🎉 Excellent ! Vous maîtrisez très bien ce sujet."
                : finalScore >= 60
                ? "👍 Bien joué ! Continuez vos efforts."
                : "💪 Continuez à apprendre, vous progresserez !"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleRestart} className="flex-1" variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Recommencer
            </Button>
            {onExit && (
              <Button onClick={onExit} className="flex-1 bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90">
                Terminer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Interface de quiz
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Question {currentIndex + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="font-mono">
              Question {currentIndex + 1}
            </Badge>
            <Badge
              className={
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }
            >
              {currentQuestion.difficulty === 'easy'
                ? 'Facile'
                : currentQuestion.difficulty === 'medium'
                ? 'Moyen'
                : 'Difficile'}
            </Badge>
          </div>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Choices */}
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all",
                    "hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950",
                    isSelected && !showResult && "border-cyan-500 bg-cyan-50 dark:bg-cyan-950",
                    showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                    !isSelected && !showResult && "border-slate-200 dark:border-slate-800"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex-1">{choice}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={cn(
              "p-4 rounded-lg border-l-4",
              selectedAnswer === currentQuestion.correctIndex
                ? "bg-green-50 border-green-500 dark:bg-green-950"
                : "bg-amber-50 border-amber-500 dark:bg-amber-950"
            )}>
              <p className="font-medium mb-2">
                {selectedAnswer === currentQuestion.correctIndex
                  ? "✓ Bonne réponse !"
                  : "Explication :"}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>

            {!showExplanation ? (
              <Button
                onClick={handleValidate}
                disabled={selectedAnswer === null}
                className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90"
              >
                Valider
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Voir les résultats"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
