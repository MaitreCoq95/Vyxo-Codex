'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IMOScore {
  globalScore: number;
  level: string;
  trend?: number;
  components: {
    competences: number;
    regularite: number;
    pratique: number;
    incidents: number;
  };
  prediction?: {
    score: number;
    confidence: number;
  };
  calculatedAt: Date;
}

export function IMOGauge({ imo }: { imo: IMOScore }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Animation du score
    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev < imo.globalScore) {
          return Math.min(prev + 1, imo.globalScore);
        }
        clearInterval(timer);
        return prev;
      });
    }, 20);
    
    return () => clearInterval(timer);
  }, [imo.globalScore]);
  
  const getLevelColor = () => {
    if (imo.level === 'Excellence') return 'from-green-500 to-emerald-600';
    if (imo.level === 'Opérationnel') return 'from-blue-500 to-cyan-600';
    if (imo.level === 'Fragile') return 'from-orange-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };
  
  const getLevelIcon = () => {
    if (imo.level === 'Excellence') return '🏆';
    if (imo.level === 'Opérationnel') return '✅';
    if (imo.level === 'Fragile') return '⚠️';
    return '🚨';
  };
  
  return (
    <div className="space-y-6">
      <Card className="magic-bento-card">
        <CardHeader>
          <CardTitle className="text-white">
            INDICE MATURITÉ OPÉRATIONNELLE
          </CardTitle>
          <CardDescription>Vue Direction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score principal circulaire */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-white/10"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(animatedScore / 100) * 553} 553`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`stop-color-${getLevelColor().split('-')[1]}-500`} />
                    <stop offset="100%" className={`stop-color-${getLevelColor().split('-')[3]}-600`} />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{animatedScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
          
          {/* Niveau */}
          <div className="flex justify-center">
            <Badge className={`text-lg px-6 py-2 bg-gradient-to-r ${getLevelColor()}`}>
              {getLevelIcon()} {imo.level}
            </Badge>
          </div>
          
          {/* Tendance */}
          {imo.trend !== undefined && imo.trend !== 0 && (
            <div className="flex items-center justify-center gap-2 text-sm">
              {imo.trend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{imo.trend} pts vs période précédente</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">{imo.trend} pts vs période précédente</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Composantes détaillées */}
      <Card className="magic-bento-card">
        <CardHeader>
          <CardTitle className="text-white">Détail par composante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ComponentBar label="Compétences" value={imo.components.competences} weight={40} color="blue" />
          <ComponentBar label="Régularité" value={imo.components.regularite} weight={20} color="green" />
          <ComponentBar label="Pratique" value={imo.components.pratique} weight={25} color="purple" />
          <ComponentBar label="Incidents" value={imo.components.incidents} weight={15} color="orange" />
          
          {/* Prédiction */}
          {imo.prediction && (
            <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    📈 Projection 90 jours
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {imo.prediction.score}/100
                    <span className="text-sm text-muted-foreground ml-2">
                      ({imo.prediction.score > imo.globalScore ? '+' : ''}
                      {imo.prediction.score - imo.globalScore} pts)
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Confiance : {imo.prediction.confidence}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ComponentBar({ 
  label, 
  value, 
  weight, 
  color 
}: { 
  label: string; 
  value: number; 
  weight: number; 
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white">{label}</span>
        <span className="text-muted-foreground">
          {value.toFixed(1)}/100
          <span className="text-xs ml-1">({weight}%)</span>
        </span>
      </div>
      <Progress value={value} className={`h-2 ${colorMap[color]}`} />
    </div>
  );
}
