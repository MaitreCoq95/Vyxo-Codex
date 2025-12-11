"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BarChart3,
  ChevronRight
} from "lucide-react";
import {
  getGlobalScore,
  getTopModules,
  getWeakModules,
  getScoreColor,
  getScoreLabel,
  getScoreIcon,
  GlobalScore,
  ModuleScore,
} from "@/lib/codex/scoring-system";
import { getModuleById } from "@/lib/codex/modules";
import Link from "next/link";

export function ScoreDashboard() {
  const [globalScore, setGlobalScore] = useState<GlobalScore | null>(null);
  const [topModules, setTopModules] = useState<ModuleScore[]>([]);
  const [weakModules, setWeakModules] = useState<ModuleScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    setLoading(true);
    const [global, top, weak] = await Promise.all([
      getGlobalScore(),
      getTopModules(3),
      getWeakModules(3),
    ]);

    setGlobalScore(global);
    setTopModules(top);
    setWeakModules(weak);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Vos Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!globalScore) {
    return (
      <Card className="border-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            Vos Scores
          </CardTitle>
          <CardDescription>
            Commencez à répondre aux quiz pour voir vos statistiques !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm text-muted-foreground">
              Vos performances apparaîtront ici après votre premier quiz
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColors = getScoreColor(globalScore.scorePercentage);
  const scoreLabel = getScoreLabel(globalScore.scorePercentage);
  const scoreIcon = getScoreIcon(globalScore.scorePercentage);

  return (
    <div className="space-y-4">
      {/* Score Global */}
      <Card className={`border-2 ${scoreColors.border}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Score Global
          </CardTitle>
          <CardDescription>
            Performance tous modules confondus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`h-16 w-16 rounded-full ${scoreColors.bg} flex items-center justify-center`}>
                <span className="text-3xl">{scoreIcon}</span>
              </div>
              <div>
                <p className={`text-3xl font-bold ${scoreColors.text}`}>
                  {globalScore.scorePercentage}%
                </p>
                <p className="text-sm text-muted-foreground">{scoreLabel}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                {globalScore.correctAnswers}/{globalScore.totalQuestionsAnswered}
              </p>
              <p className="text-xs text-muted-foreground">réponses correctes</p>
            </div>
          </div>

          <Progress value={globalScore.scorePercentage} className="h-3 mb-3" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Modules testés</p>
              <p className="font-semibold">{globalScore.modulesAttempted}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Questions répondues</p>
              <p className="font-semibold">{globalScore.totalQuestionsAnswered}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Modules */}
      {topModules.length > 0 && (
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Vos Points Forts
            </CardTitle>
            <CardDescription>
              Modules où vous excellez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topModules.map((moduleScore, index) => {
              const module = getModuleById(moduleScore.moduleId);
              if (!module) return null;

              const colors = getScoreColor(moduleScore.scorePercentage);

              return (
                <Link key={moduleScore.moduleId} href={`/codex/modules/${moduleScore.moduleId}`}>
                  <div className={`p-3 rounded-lg border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-shadow cursor-pointer`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold ${colors.text}`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm line-clamp-1">{module.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {moduleScore.totalQuestionsAnswered} question{moduleScore.totalQuestionsAnswered > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={colors.bg}>
                          {moduleScore.scorePercentage}%
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Progress value={moduleScore.scorePercentage} className="h-2" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Modules à Améliorer */}
      {weakModules.length > 0 && (
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-amber-500" />
              À Améliorer
            </CardTitle>
            <CardDescription>
              Modules nécessitant plus de pratique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakModules.map((moduleScore) => {
              const module = getModuleById(moduleScore.moduleId);
              if (!module) return null;

              const colors = getScoreColor(moduleScore.scorePercentage);

              return (
                <Link key={moduleScore.moduleId} href={`/codex/modules/${moduleScore.moduleId}`}>
                  <div className={`p-3 rounded-lg border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-shadow cursor-pointer`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-1">{module.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {moduleScore.totalQuestionsAnswered} question{moduleScore.totalQuestionsAnswered > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={colors.bg}>
                          {moduleScore.scorePercentage}%
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Progress value={moduleScore.scorePercentage} className="h-2" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
