"use client"

import { useState, useEffect, useMemo } from "react";
import { getAllLearningPaths, getLearningPathsByDifficulty, calculatePathProgress } from "../../../../domain/codex/learningPaths";
import { getAllUserProgress } from "../../../../domain/codex/xp-system";
import { LearningPath, UserLearningProgress } from "../../../../domain/types/codex";
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
} from "lucide-react";
import Link from "next/link";
import { MagicBento } from "../../../../components/bento/MagicBento";
import { MagicBentoCard } from "../../../../components/bento/MagicBentoCard";

export default function LearningPathsPage() {
  const [allPaths] = useState<LearningPath[]>(getAllLearningPaths());
  const [userProgress, setUserProgress] = useState<UserLearningProgress[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadUserProgress = async () => {
    // setLoading(true); Optimized
    const progress = await getAllUserProgress();
    setUserProgress(progress);
    setLoading(false);
  };

  useEffect(() => {
    loadUserProgress();
  }, []);

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/codex">
          <Button variant="ghost" size="sm" className="w-fit text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Codex
          </Button>
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Parcours d&apos;Apprentissage
            </h1>
          </div>
          <p className="text-muted-foreground">
            Suivez des parcours structurés pour maîtriser les normes et gagner de l&apos;XP et des badges.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <MagicBento className="lg:grid-cols-3">
        <MagicBentoCard
          title={allPaths.length.toString()}
          label="Parcours disponibles"
          icon={<GraduationCap className="h-8 w-8 text-cyan-500" />}
          enableTilt={true}
        />
        <MagicBentoCard
          title={userProgress.filter((p) => !p.completedAt).length.toString()}
          label="En cours"
          icon={<PlayCircle className="h-8 w-8 text-amber-500" />}
          enableTilt={true}
        />
        <MagicBentoCard
          title={userProgress.filter((p) => p.completedAt).length.toString()}
          label="Terminés"
          icon={<Trophy className="h-8 w-8 text-green-500" />}
          enableTilt={true}
        />
      </MagicBento>

      {/* Filter */}
      <div className="magic-bento-card p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1 text-white">Filtrer par niveau</p>
              <p className="text-xs text-muted-foreground">
                Choisissez un niveau de difficulté
              </p>
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-black/20 border-white/10 text-white focus:ring-vyxo-indigo/20">
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent className="bg-vyxo-navy border-white/10 text-white">
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="beginner">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>

      {/* Learning Paths Grid */}
      {loading ? (
        <MagicBento className="lg:grid-cols-2">
           {/* Loading skeletons or similar */}
           <div className="magic-bento-card h-40 animate-pulse bg-white/5" />
           <div className="magic-bento-card h-40 animate-pulse bg-white/5" />
        </MagicBento>
      ) : filteredPaths.length === 0 ? (
        <div className="magic-bento-card py-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">
              Aucun parcours trouvé pour ce niveau de difficulté.
            </p>
        </div>
      ) : (
        <MagicBento className="lg:grid-cols-2">
          {filteredPaths.map((path) => {
            const progress = getProgressForPath(path.id);
            const isStarted = !!progress;
            const isCompleted = progress?.completedAt !== undefined;
            const progressPercent = progress
              ? calculatePathProgress(progress.completedSteps, path)
              : 0;

            const color = path.difficulty === 'expert' ? '#a855f7' : path.difficulty === 'intermediate' ? '#3b82f6' : '#22c55e';

            return (
              <MagicBentoCard
                key={path.id}
                title={path.title}
                description={path.description}
                href={`/codex/learning/${path.id}`}
                label={path.difficulty === "beginner" ? "Débutant" : path.difficulty === "intermediate" ? "Intermédiaire" : "Expert"}
                color={color}
                icon={<div className="text-2xl">{path.rewardBadge.icon}</div>}
                enableTilt={true}
              >
                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 border-none dark:text-green-300">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Terminé
                          </Badge>
                        )}
                        {isStarted && !isCompleted && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 border-none dark:text-amber-300">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            En cours
                          </Badge>
                        )}
                  </div>

                  <div className="space-y-4 mt-2 pt-4 border-t border-white/10">
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

                    {isStarted && !isCompleted && (
                        <div>
                        <div className="flex items-center justify-between mb-2 text-sm text-white">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        </div>
                    )}

                    <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-white">
                            Récompense : {path.rewardBadge.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                            {path.rewardBadge.description}
                            </p>
                        </div>
                        </div>
                    </div>
                  </div>
              </MagicBentoCard>
            );
          })}
        </MagicBento>
      )}
    </div>
  );
}
