"use client"

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllRandomQuestions, getAllQuestionsByModule } from "@/lib/codex/all-questions";
import { getModuleById } from "@/lib/codex/modules";
import { QuizRunner } from "@/components/codex/quiz-runner";
import { saveQuizResults } from "@/lib/codex/scoring-system";
import { recordQuizCompleted } from "@/lib/codex/xp-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuizQuestion, QuizResult } from "@/types/codex";
import { ArrowLeft, Dices, Settings, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

function QuizPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moduleIdParam = searchParams.get('moduleId');

  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionCount, setQuestionCount] = useState("10");
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>(moduleIdParam || undefined);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const module = selectedModuleId ? getModuleById(selectedModuleId) : undefined;

  useEffect(() => {
    if (moduleIdParam) {
      setSelectedModuleId(moduleIdParam);
    }
  }, [moduleIdParam]);

  // Charger le nombre de questions disponibles
  useEffect(() => {
    const loadAvailableCount = async () => {
      const questions = await getAllRandomQuestions(1000, selectedModuleId);
      setAvailableCount(questions.length);
    };
    loadAvailableCount();
  }, [selectedModuleId]);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const count = parseInt(questionCount) || 10;
      const quizQuestions = await getAllRandomQuestions(count, selectedModuleId);

      if (quizQuestions.length === 0) {
        alert("Aucune question disponible pour ce quiz.");
        return;
      }

      setQuestions(quizQuestions);
      setQuizStarted(true);
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
      alert("Erreur lors du chargement des questions. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (results: QuizResult[], score: number) => {
    console.log('Quiz completed:', { results, score });

    // Sauvegarder les résultats dans Supabase pour le scoring
    const quizSubmissions = questions.map((question, index) => {
      const result = results.find(r => r.questionId === question.id);
      return {
        moduleId: question.moduleId,
        questionId: question.id,
        isCorrect: result?.isCorrect || false,
      };
    });

    await saveQuizResults(quizSubmissions);

    // Enregistrer l'XP pour le quiz
    const quizId = `quiz-${Date.now()}`;
    await recordQuizCompleted(quizId, score);
  };

  const handleQuizExit = () => {
    setQuizStarted(false);
    setQuestions([]);
    if (selectedModuleId) {
      router.push(`/codex/modules/${selectedModuleId}`);
    } else {
      router.push('/codex');
    }
  };

  if (quizStarted && questions.length > 0) {
    return (
      <div className="space-y-6 p-6">
        <QuizRunner
          questions={questions}
          onComplete={handleQuizComplete}
          onExit={handleQuizExit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href={selectedModuleId ? `/codex/modules/${selectedModuleId}` : '/codex'}>
          <Button variant="ghost" size="sm" className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour {selectedModuleId ? 'au module' : 'au Codex'}
          </Button>
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Dices className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">
              Quiz
            </h1>
          </div>
          {module ? (
            <p className="text-muted-foreground">
              Testez vos connaissances sur <span className="font-medium">{module.title}</span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Testez vos connaissances tous modules confondus
            </p>
          )}
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-500" />
            <CardTitle>Configuration du Quiz</CardTitle>
          </div>
          <CardDescription>
            Choisissez le nombre de questions pour votre session d'entraînement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Module Info (si spécifique) */}
          {module && (
            <div className="p-4 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 rounded-lg">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div>
                  <p className="font-medium text-cyan-900 dark:text-cyan-100">
                    {module.title}
                  </p>
                  <p className="text-sm text-cyan-700 dark:text-cyan-300 mt-1">
                    {module.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nombre de questions */}
          <div className="space-y-2">
            <Label htmlFor="questionCount">Nombre de questions</Label>
            <Select value={questionCount} onValueChange={setQuestionCount}>
              <SelectTrigger id="questionCount">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 questions</SelectItem>
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="15">15 questions</SelectItem>
                <SelectItem value="20">20 questions</SelectItem>
                <SelectItem value="30">30 questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Mode :</strong>{' '}
              {selectedModuleId
                ? `Quiz spécifique à un module (${availableCount} questions disponibles)`
                : `Quiz global (${availableCount} questions disponibles)`}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Les questions sont sélectionnées aléatoirement. Vous verrez votre score à la fin.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              ✨ Inclut les questions générées par l'IA et les questions de base
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartQuiz}
            disabled={isLoading || availableCount === 0}
            className="w-full bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Dices className="mr-2 h-5 w-5" />
                Démarrer le Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Dices className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4 animate-pulse" />
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}
