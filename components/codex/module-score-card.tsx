"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  getModuleScore,
  getScoreColor,
  getScoreLabel,
  getScoreIcon,
  ModuleScore,
} from "@/lib/codex/scoring-system";

type ModuleScoreCardProps = {
  moduleId: string;
};

export function ModuleScoreCard({ moduleId }: ModuleScoreCardProps) {
  const [moduleScore, setModuleScore] = useState<ModuleScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScore();
  }, [moduleId]);

  const loadScore = async () => {
    setLoading(true);
    const score = await getModuleScore(moduleId);
    setModuleScore(score);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!moduleScore) {
    return (
      <Card className="border-2 border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Target className="h-6 w-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Score du module</p>
              <p className="text-xs text-muted-foreground">
                Pas encore de quiz réalisé
              </p>
            </div>
            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900">
              <Minus className="h-3 w-3 mr-1" />
              N/A
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColors = getScoreColor(moduleScore.scorePercentage);
  const scoreLabel = getScoreLabel(moduleScore.scorePercentage);
  const scoreIcon = getScoreIcon(moduleScore.scorePercentage);

  // Déterminer la tendance (simple : si > 75% = bien, sinon = à améliorer)
  const isGood = moduleScore.scorePercentage >= 75;
  const TrendIcon = isGood ? TrendingUp : TrendingDown;
  const trendColor = isGood ? "text-green-500" : "text-amber-500";

  return (
    <Card className={`border-2 ${scoreColors.border}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full ${scoreColors.bg} flex items-center justify-center`}>
              <span className="text-2xl">{scoreIcon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Votre score
              </p>
              <p className={`text-2xl font-bold ${scoreColors.text}`}>
                {moduleScore.scorePercentage}%
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge className={`${scoreColors.bg} ${scoreColors.text} mb-2`}>
              {scoreLabel}
            </Badge>
            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
              <TrendIcon className={`h-3 w-3 ${trendColor}`} />
              {moduleScore.correctAnswers}/{moduleScore.totalQuestionsAnswered}
            </p>
          </div>
        </div>

        <Progress value={moduleScore.scorePercentage} className="h-2 mb-3" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{moduleScore.totalQuestionsAnswered} question{moduleScore.totalQuestionsAnswered > 1 ? 's' : ''}</span>
          <span>
            Dernière tentative : {new Date(moduleScore.lastAttempt).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
