'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Calendar, XCircle } from 'lucide-react';

interface RiskAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'skill_gap' | 'incident_pattern' | 'compliance_risk' | 'turnover';
  title: string;
  description: string;
  affectedUsers: string[];
  recommendations: string[];
  potentialImpact: {
    financial?: number;
    operational?: string;
    compliance?: string;
  };
  createdAt: Date;
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved';
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
    badge: 'bg-red-600 text-white',
    label: 'CRITIQUE'
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900',
    badge: 'bg-orange-600 text-white',
    label: 'ÉLEVÉ'
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900',
    badge: 'bg-amber-600 text-white',
    label: 'MOYEN'
  },
  low: {
    icon: AlertTriangle,
    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
    badge: 'bg-yellow-600 text-white',
    label: 'BAS'
  }
};

export function RiskAlertsPanel({ alerts }: { alerts: RiskAlert[] }) {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  
  const toggleExpand = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };
  
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  if (alerts.length === 0) {
    return (
      <Card className="magic-bento-card">
        <CardHeader>
          <CardTitle className="text-white">Alertes Risques</CardTitle>
          <CardDescription>Aucune alerte active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-white font-medium">Tout va bien !</p>
            <p className="text-sm text-muted-foreground mt-1">
              Aucun risque détecté pour le moment
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="magic-bento-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Alertes Risques</CardTitle>
            <CardDescription>
              {alerts.length} alerte{alerts.length > 1 ? 's' : ''} active{alerts.length > 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400">
            {alerts.filter(a => a.severity === 'critical').length} critique{alerts.filter(a => a.severity === 'critical').length > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAlerts.map(alert => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          const isExpanded = expandedAlerts.has(alert.id);
          
          return (
            <div
              key={alert.id}
              className={`border rounded-lg overflow-hidden transition-all ${config.color}`}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => toggleExpand(alert.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={config.badge} variant="default">
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {alert.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-current/10">
                  {/* Description */}
                  <div className="pt-4">
                    <p className="text-sm">{alert.description}</p>
                  </div>
                  
                  {/* Affected Users */}
                  {alert.affectedUsers.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2">
                        👥 {alert.affectedUsers.length} personne{alert.affectedUsers.length > 1 ? 's' : ''} concernée{alert.affectedUsers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* Impact Potentiel */}
                  <div className="p-3 bg-black/10 dark:bg-white/5 rounded-lg">
                    <p className="text-xs font-medium mb-2">💥 Impact potentiel</p>
                    <div className="space-y-1 text-xs">
                      {alert.potentialImpact.financial && (
                        <p>💰 Financier : {alert.potentialImpact.financial.toLocaleString('fr-FR')}€</p>
                      )}
                      {alert.potentialImpact.operational && (
                        <p>⚙️ Opérationnel : {alert.potentialImpact.operational}</p>
                      )}
                      {alert.potentialImpact.compliance && (
                        <p>📋 Conformité : {alert.potentialImpact.compliance}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Recommandations */}
                  <div>
                    <p className="text-xs font-medium mb-2">✅ Actions recommandées</p>
                    <ul className="space-y-1">
                      {alert.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <span className="text-current mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Traiter
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Planifier
                    </Button>
                    <Button size="sm" variant="ghost">
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
