"use client"

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Trophy, Zap, TrendingUp } from "lucide-react";
import { getUserXP, calculateLevelProgress, xpNeededForNextLevel } from "@/lib/codex/xp-system";
import { UserXP } from "@/types/codex";
import { badges } from "@/lib/codex/learningPaths";

export function XPBar() {
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadUserXP();
  }, []);

  const loadUserXP = async () => {
    setLoading(true);
    const xp = await getUserXP();
    setUserXP(xp);

    if (xp) {
      setProgress(calculateLevelProgress(xp.totalXp));
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-vyxo-gold/20 to-amber-100 dark:from-vyxo-gold/10 dark:to-amber-900/20 border-vyxo-gold/30">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  if (!userXP) {
    return null;
  }

  const nextLevelXP = xpNeededForNextLevel(userXP.level);

  return (
    <Card className="p-4 bg-gradient-to-r from-vyxo-gold/20 to-amber-100 dark:from-vyxo-gold/10 dark:to-amber-900/20 border-vyxo-gold/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Level Badge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-vyxo-gold to-amber-600 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <Star className="h-5 w-5 text-white mx-auto mb-0.5" />
                    <p className="text-white font-bold text-sm">{userXP.level}</p>
                  </div>
                </div>
                {userXP.level >= 5 && (
                  <div className="absolute -top-1 -right-1">
                    <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Niveau {userXP.level}</p>
              <p className="text-xs text-muted-foreground">
                {userXP.totalXp} XP total
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Progress Info */}
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-vyxo-navy dark:text-white">
                Niveau {userXP.level}
              </p>
              <p className="text-xs text-muted-foreground">
                {userXP.totalXp} / {nextLevelXP} XP
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <TrendingUp className="h-3 w-3" />
              {progress}%
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-3 bg-amber-200 dark:bg-amber-900/30">
            <div
              className="h-full bg-gradient-to-r from-vyxo-gold to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </Progress>

          <p className="text-xs text-muted-foreground mt-1">
            {nextLevelXP - userXP.totalXp} XP jusqu'au niveau {userXP.level + 1}
          </p>
        </div>

        {/* Badges */}
        {userXP.badgesEarned.length > 0 && (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {userXP.badgesEarned.slice(0, 3).map((badgeId) => {
                const badge = badges[badgeId];
                if (!badge) return null;

                const rarityColors = {
                  common: "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600",
                  rare: "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600",
                  epic: "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-600",
                  legendary: "bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-600",
                };

                return (
                  <Tooltip key={badgeId}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${rarityColors[badge.rarity]} cursor-pointer hover:scale-110 transition-transform`}
                      >
                        <span className="text-lg">{badge.icon}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs mt-1 capitalize"
                      >
                        {badge.rarity}
                      </Badge>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>

            {userXP.badgesEarned.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 cursor-pointer">
                      <Trophy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      +{userXP.badgesEarned.length - 3} autre(s) badge(s)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
