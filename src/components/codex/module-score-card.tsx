"use client"

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MagicBentoCard } from "../bento/MagicBentoCard";
import {
  getModuleScore,
  getScoreLabel,
  getScoreIcon,
  ModuleScore,
} from "@/domain/codex/scoring-system";

type ModuleScoreCardProps = {
  moduleId: string;
};

export function ModuleScoreCard({ moduleId }: ModuleScoreCardProps) {
  const [moduleScore, setModuleScore] = useState<ModuleScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScore = async () => {
      setLoading(true);
      const score = await getModuleScore(moduleId);
      setModuleScore(score);
      setLoading(false);
    };
    loadScore();
  }, [moduleId]);

  if (loading) {
    return (
      <MagicBentoCard
        title="..."
        label="Score"
        icon={<Target className="h-6 w-6" />}
        enableTilt={true}
      />
    );
  }

  if (!moduleScore) {
    return (
      <MagicBentoCard
        title="N/A"
        label="Score du module"
        description="Pas encore de quiz réalisé"
        icon={<Target className="h-6 w-6" />}
        enableTilt={true}
        color="#94a3b8"
      >
        <div className="mt-4">
             <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-400">
               <Minus className="h-3 w-3 mr-1" />
               N/A
             </Badge>
        </div>
      </MagicBentoCard>
    );
  }

  const scoreLabel = getScoreLabel(moduleScore.scorePercentage);
  const scoreIcon = getScoreIcon(moduleScore.scorePercentage);

  // Déterminer la tendance
  const isGood = moduleScore.scorePercentage >= 75;
  const TrendIcon = isGood ? TrendingUp : TrendingDown;
  const trendColor = isGood ? "text-green-500" : "text-amber-500";
  
  // Custom color for Bento
  const customColor = moduleScore.scorePercentage >= 85 ? '#22c55e' : (moduleScore.scorePercentage >= 50 ? '#f59e0b' : '#ef4444');

  return (
      <MagicBentoCard
        title={`${moduleScore.scorePercentage}%`}
        label="Votre Score"
        icon={<div className="text-xl">{scoreIcon}</div>}
        enableTilt={true}
        color={customColor}
      >
        <div className="mt-4 space-y-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
             <Badge className="bg-white/10 border-none text-white">
               {scoreLabel}
             </Badge>
             <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
               <TrendIcon className={`h-3 w-3 ${trendColor}`} />
               {moduleScore.correctAnswers}/{moduleScore.totalQuestionsAnswered}
             </p>
          </div>

          <Progress value={moduleScore.scorePercentage} className="h-2" />

          <div className="flex items-center justify-between text-xs text-slate-400">
             <span>{moduleScore.totalQuestionsAnswered} questions</span>
             <span>
               {new Date(moduleScore.lastAttempt).toLocaleDateString('fr-FR')}
             </span>
          </div>
        </div>
      </MagicBentoCard>
  );
}
