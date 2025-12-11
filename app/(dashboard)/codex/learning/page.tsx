"use client"

import { useState, useEffect, useMemo } from "react";
import { getAllLearningPaths, getLearningPathsByDifficulty, calculatePathProgress } from "@/lib/codex/learningPaths";
import { getAllUserProgress } from "@/lib/codex/xp-system";
import { LearningPath, UserLearningProgress } from "@/types/codex";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  ArrowLeft,
  Trophy,
  Clock,
  Star,
  CheckCircle2,
  PlayCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function LearningPathsPage() {
  const [allPaths] = useState<LearningPath[]>(getAllLearningPaths());
  const [userProgress, setUserProgress] = useState<UserLearningProgress[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    setLoading(true);
    const progress = await getAllUserProgress();
    setUserProgress(progress);
    setLoading(false);
  };

  // Filtrer les parcours
  const filteredPaths = useMemo(() => {
    if (difficultyFilter === "all") {
      return allPaths;
    }
    return getLearningPathsByDifficulty(
      difficultyFilter as "beginner" | "intermediate" | "expert"
    );
  }, [allPaths, difficultyFilter]);

  // Obtenir la progression pour un parcours
  const getProgressForPath = (pathId: string): UserLearningProgress | undefined => {
    return userProgress.find((p) => p.pathId === pathId);
  };

  const difficultyColors = {
    beginner: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-700",
    },
    intermediate: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-300 dark:border-blue-700",
    },
    expert: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-300 dark:border-purple-700",
    },
  };

  const rarityColors = {
    common: "text-slate-600 dark:text-slate-400",
    rare: "text-blue-600 dark:text-blue-400",
    epic: "text-purple-600 dark:text-purple-400",
    legendary: "text-amber-600 dark:text-amber-400",
  };

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
            <GraduationCap className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">
              Parcours d'Apprentissage
            </h1>
          </div>
          <p className="text-muted-foreground">
            Suivez des parcours structurés pour maîtriser les normes et gagner de l'XP et des badges.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Parcours disponibles</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {allPaths.length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-cyan-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {userProgress.filter((p) => !p.completedAt).length}
                </p>
              </div>
              <PlayCircle className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminés</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {userProgress.filter((p) => p.completedAt).length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Filtrer par niveau</p>
              <p className="text-xs text-muted-foreground">
                Choisissez un niveau de difficulté
              </p>
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="beginner">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPaths.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">
              Aucun parcours trouvé pour ce niveau de difficulté.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPaths.map((path) => {
            const progress = getProgressForPath(path.id);
            const isStarted = !!progress;
            const isCompleted = progress?.completedAt !== undefined;
            const progressPercent = progress
              ? calculatePathProgress(progress.completedSteps, path)
              : 0;

            const colors = difficultyColors[path.difficulty];

            return (
              <Card
                key={path.id}
                className={`border-2 ${
                  isCompleted ? "border-green-500 dark:border-green-700" : ""
                } hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${colors.bg} ${colors.text} capitalize`}>
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
                        {isStarted && !isCompleted && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            En cours
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {path.description}
                      </CardDescription>
                    </div>

                    {/* Badge Reward */}
                    <div className="text-center shrink-0">
                      <div className="text-3xl mb-1">{path.rewardBadge.icon}</div>
                      <p
                        className={`text-xs font-semibold ${
                          rarityColors[path.rewardBadge.rarity]
                        }`}
                      >
                        {path.rewardBadge.rarity === "legendary" && "Légendaire"}
                        {path.rewardBadge.rarity === "epic" && "Épique"}
                        {path.rewardBadge.rarity === "rare" && "Rare"}
                        {path.rewardBadge.rarity === "common" && "Commun"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{path.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>{path.totalXp} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>{path.steps.length} étapes</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {isStarted && !isCompleted && (
                    <div>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {progress.completedSteps.length} / {path.steps.length} étapes terminées
                      </p>
                    </div>
                  )}

                  {/* Badge Info */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          Récompense : {path.rewardBadge.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {path.rewardBadge.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/codex/learning/${path.id}`}>
                    <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Revoir le parcours
                        </>
                      ) : isStarted ? (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continuer
                        </>
                      ) : (
                        <>
                          <Star className="mr-2 h-4 w-4" />
                          Commencer
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
