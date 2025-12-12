'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Target, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

interface CertificationSimulatorProps {
  imoScore: number;
  companyId: string;
}

const CERTIFICATIONS = {
  gdp: {
    name: 'GDP Transport Pharma',
    minScore: 85,
    criticalSkills: ['temperature', 'documentation', 'incidents'],
    description: 'Good Distribution Practice pour transport pharmaceutique'
  },
  iso9001: {
    name: 'ISO 9001',
    minScore: 80,
    criticalSkills: ['processes', 'documentation', 'audit'],
    description: 'Système de management de la qualité'
  },
  iso14001: {
    name: 'ISO 14001',
    minScore: 75,
    criticalSkills: ['environment', 'risks', 'compliance'],
    description: 'Management environnemental'
  },
  iso45001: {
    name: 'ISO 45001',
    minScore: 80,
    criticalSkills: ['safety', 'risks', 'incidents'],
    description: 'Santé et sécurité au travail'
  }
};

export function CertificationSimulator({ imoScore, companyId }: CertificationSimulatorProps) {
  const [selectedCert, setSelectedCert] = useState<keyof typeof CERTIFICATIONS>('gdp');
  
  const cert = CERTIFICATIONS[selectedCert];
  const gap = cert.minScore - imoScore;
  const isReady = gap <= 0;
  const daysNeeded = Math.max(gap * 3, 0); // Estimation : 3 jours par point
  
  return (
    <Card className="magic-bento-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-cyan-500" />
          <CardTitle className="text-white">Simulateur Certification</CardTitle>
        </div>
        <CardDescription>
          Estimation temps et actions pour certification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélection certification */}
        <div>
          <label className="text-sm font-medium text-white mb-2 block">
            Certification cible
          </label>
          <Select value={selectedCert} onValueChange={(value: any) => setSelectedCert(value)}>
            <SelectTrigger className="bg-black/20 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-vyxo-navy border-white/10 text-white">
              {Object.entries(CERTIFICATIONS).map(([key, c]) => (
                <SelectItem key={key} value={key}>
                  {c.name} - Score min: {c.minScore}/100
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{cert.description}</p>
        </div>
        
        {/* Résultat simulation */}
        <div className={`p-6 rounded-lg border ${
          isReady 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-orange-500/10 border-orange-500/20'
        }`}>
          <div className="flex items-start gap-3">
            {isReady ? (
              <div className="text-4xl">✅</div>
            ) : (
              <AlertTriangle className="h-8 w-8 text-orange-500 shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">
                {isReady ? 'Prêt pour audit !' : `⏱️ ${daysNeeded} jours estimés`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isReady 
                  ? `Votre score IMO (${imoScore}/100) dépasse le minimum requis (${cert.minScore}/100). Vous pouvez planifier l'audit de certification.`
                  : `Gap actuel : ${gap} points. Actions correctives nécessaires avant audit.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Compétences critiques */}
        {!isReady && (
          <div>
            <h4 className="text-sm font-medium text-white mb-3">
              🎯 Compétences critiques à renforcer
            </h4>
            <div className="space-y-2">
              {cert.criticalSkills.map((skill, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-white capitalize">{skill}</span>
                  </div>
                  <Badge variant="outline" className="bg-orange-500/10 border-orange-500/20 text-orange-400">
                    Prioritaire
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Roadmap */}
        <div className="p-4 bg-black/20 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-500" />
            Roadmap recommandée
          </h4>
          <div className="space-y-2 text-sm">
            {isReady ? (
              <>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">Score IMO conforme</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-500">→</span>
                  <span className="text-white">Planifier audit blanc interne</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-500">→</span>
                  <span className="text-white">Préparer documentation audit</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-500">→</span>
                  <span className="text-white">Contacter organisme certificateur</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">1.</span>
                  <span className="text-white">Formation intensive compétences critiques ({Math.ceil(daysNeeded / 2)} jours)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">2.</span>
                  <span className="text-white">Audit blanc + actions correctives ({Math.floor(daysNeeded / 3)} jours)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">3.</span>
                  <span className="text-white">Vérification conformité ({Math.ceil(daysNeeded / 6)} jours)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-500">→</span>
                  <span className="text-white">Audit de certification</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500">
            <FileText className="mr-2 h-4 w-4" />
            Générer plan d'action détaillé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
