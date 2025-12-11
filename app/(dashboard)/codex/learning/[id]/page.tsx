"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLearningPathById, getNextStep, calculatePathProgress } from "@/lib/codex/learningPaths";
import { getPathProgress, startLearningPath, completeStep, completeLearningPath } from "@/lib/codex/xp-system";
import { getItemsByModule } from "@/lib/codex/items";
import { LearningPath, UserLearningProgress, LearningStep } from "@/types/codex";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  ArrowLeft,
  Trophy,
  Star,
  CheckCircle2,
  Circle,
  PlayCircle,
  Sparkles,
  BookOpen,
  Dices,
  Loader2,
  ChevronRight,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function LearningPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.id as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<UserLearningProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    loadPathData();
  }, [pathId]);

  const loadPathData = async () => {
    setLoading(true);
    const pathData = getLearningPathById(pathId);
    setPath(pathData || null);

    if (pathData) {
      const progressData = await getPathProgress(pathId);
      setProgress(progressData);
    }

    setLoading(false);
  };

  const handleStartPath = async () => {
    if (!path) return;

    setStarting(true);
    const success = await startLearningPath(path.id);

    if (success) {
      await loadPathData();
    } else {
      alert("Erreur lors du démarrage du parcours.");
    }

    setStarting(false);
  };

  const handleCompleteStep = async (step: LearningStep) => {
    if (!path || !progress) return;

    setCompleting(step.id);
    const success = await completeStep(path.id, step.id, step.xpReward);

    if (success) {
      await loadPathData();

      // Vérifier si c'est la dernière étape
      const newProgress = await getPathProgress(path.id);
      if (newProgress && newProgress.completedSteps.length === path.steps.length) {
        // Parcours terminé !
        await completeLearningPath(path.id, path.rewardBadge.id);
        await loadPathData();
      }
    } else {
      alert("Erreur lors de la complétion de l'étape.");
    }

    setCompleting(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground">Chargement du parcours...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground mb-4">Parcours non trouvé</p>
            <Link href="/codex/learning">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux parcours
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isStarted = !!progress;
  const isCompleted = progress?.completedAt !== undefined;
  const progressPercent = progress ? calculatePathProgress(progress.completedSteps, path) : 0;
  const nextStep = progress ? getNextStep(path, progress.completedSteps) : path.steps[0];

  const difficultyColors = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    expert: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/codex/learning">
          <Button variant="ghost" size="sm" className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux parcours
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Path Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${difficultyColors[path.difficulty]} capitalize`}>
                {path.difficulty === "beginner" && "Débutant"}
                {path.difficulty === "intermediate" && "Intermédiaire"}
                {path.difficulty === "expert" && "Expert"}
              </Badge>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Terminé
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white mb-2">
              {path.title}
            </h1>
            <p className="text-muted-foreground">{path.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                <span>{path.steps.length} étapes</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span>{path.totalXp} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>{path.estimatedDuration}</span>
              </div>
            </div>
          </div>

          {/* Badge Reward Card */}
          <Card className="lg:w-72 border-2 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-center text-lg">Récompense</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl mb-3">{path.rewardBadge.icon}</div>
              <p className="font-semibold text-lg mb-1">{path.rewardBadge.name}</p>
              <p className="text-xs text-muted-foreground mb-2">
                {path.rewardBadge.description}
              </p>
              <Badge variant="outline" className="capitalize">
                {path.rewardBadge.rarity === "legendary" && "Légendaire"}
                {path.rewardBadge.rarity === "epic" && "Épique"}
                {path.rewardBadge.rarity === "rare" && "Rare"}
                {path.rewardBadge.rarity === "common" && "Commun"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Card */}
      {isStarted && !isCompleted && (
        <Card className="border-2 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Votre Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progression globale</span>
                <span className="font-semibold text-lg">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {progress?.completedSteps.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Terminées</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {progress?.xpEarned || 0}
                </p>
                <p className="text-xs text-muted-foreground">XP gagnés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {path.steps.length - (progress?.completedSteps.length || 0)}
                </p>
                <p className="text-xs text-muted-foreground">Restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Alert */}
      {isCompleted && (
        <Alert className="border-2 border-green-500 bg-green-50 dark:bg-green-950/30">
          <Trophy className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-900 dark:text-green-100">
            🎉 <strong>Félicitations !</strong> Vous avez terminé ce parcours et débloqué le badge "{path.rewardBadge.name}" !
          </AlertDescription>
        </Alert>
      )}

      {/* Start Button */}
      {!isStarted && (
        <Card>
          <CardContent className="py-8 text-center">
            <PlayCircle className="mx-auto h-16 w-16 text-cyan-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Prêt à commencer ?</h3>
            <p className="text-muted-foreground mb-6">
              Lancez-vous dans ce parcours et gagnez {path.totalXp} XP !
            </p>
            <Button
              size="lg"
              onClick={handleStartPath}
              disabled={starting}
              className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90"
            >
              {starting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Démarrage...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-5 w-5" />
                  Commencer le parcours
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Étapes du parcours ({path.steps.length})
        </h2>

        <div className="space-y-4">
          {path.steps.map((step, index) => {
            const isCompleted = progress?.completedSteps.includes(step.id) || false;
            const isNext = nextStep?.id === step.id;
            const isLocked = !isStarted || (!isCompleted && !isNext);

            return (
              <Card
                key={step.id}
                className={`border-2 ${
                  isCompleted
                    ? "border-green-500 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20"
                    : isNext
                    ? "border-cyan-500 dark:border-cyan-700"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Step Number/Status */}
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isNext
                            ? "bg-cyan-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isNext ? (
                          <PlayCircle className="h-5 w-5" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          {isCompleted && (
                            <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Terminé
                            </Badge>
                          )}
                          {isNext && !isCompleted && (
                            <Badge variant="outline" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                              <PlayCircle className="h-3 w-3 mr-1" />
                              En cours
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{step.description}</CardDescription>

                        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{step.itemIds.length} connaissances</span>
                          </div>
                          {step.quizIds && step.quizIds.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Dices className="h-4 w-4" />
                              <span>{step.quizIds.length} quiz</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>{step.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Terminé
                        </Button>
                      ) : isNext ? (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteStep(step)}
                          disabled={completing === step.id}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          {completing === step.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Validation...
                            </>
                          ) : (
                            <>
                              Terminer l'étape
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Lock className="mr-2 h-4 w-4" />
                          Verrouillé
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Step Content */}
                {!isLocked && (
                  <CardContent className="pt-0">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3">
                      {/* Knowledge Items */}
                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-cyan-500" />
                          Connaissances à étudier
                        </p>
                        <div className="space-y-1">
                          {step.itemIds.map((itemId) => {
                            const item = getItemsByModule(step.moduleId).find((i) => i.id === itemId);
                            return item ? (
                              <Link
                                key={itemId}
                                href={`/codex/modules/${step.moduleId}#${itemId}`}
                                className="block"
                              >
                                <div className="text-sm text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                  • {item.topic}
                                </div>
                              </Link>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Quiz */}
                      {step.quizIds && step.quizIds.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Dices className="h-4 w-4 text-amber-500" />
                            Quiz à réaliser
                          </p>
                          <Link href={`/codex/quiz?moduleId=${step.moduleId}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              <Dices className="mr-2 h-4 w-4" />
                              Lancer le quiz du module
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
