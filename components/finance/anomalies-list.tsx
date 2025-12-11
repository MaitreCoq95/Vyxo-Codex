/**
 * Vyxo Finance Hub - Anomalies List Component
 * Liste des anomalies financières détectées
 */

'use client'

import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { FinanceAnomaly } from '@/types/finance'

interface AnomaliesListProps {
  anomalies: FinanceAnomaly[]
}

export function AnomaliesList({ anomalies }: AnomaliesListProps) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="h-12 w-12 text-green-600 mx-auto mb-2" />
        <p className="text-muted-foreground">
          Aucune anomalie détectée. Tout va bien !
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly) => (
        <div
          key={anomaly.id}
          className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="mt-0.5">
            {getSeverityIcon(anomaly.severity)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{anomaly.title}</h4>
              <Badge variant={getSeverityVariant(anomaly.severity)}>
                {getSeverityLabel(anomaly.severity)}
              </Badge>
              <Badge variant="outline">
                {getTypeLabel(anomaly.anomaly_type)}
              </Badge>
            </div>
            {anomaly.description && (
              <p className="text-sm text-muted-foreground">
                {anomaly.description}
              </p>
            )}
            {anomaly.context && (
              <div className="text-xs text-muted-foreground mt-2">
                {renderContext(anomaly.context)}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(anomaly.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      ))}
    </div>
  )
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical':
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-red-600" />
    case 'medium':
      return <AlertCircle className="h-5 w-5 text-orange-600" />
    case 'low':
    default:
      return <Info className="h-5 w-5 text-blue-600" />
  }
}

function getSeverityVariant(
  severity: string
): 'default' | 'destructive' | 'outline' | 'secondary' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
    default:
      return 'secondary'
  }
}

function getSeverityLabel(severity: string): string {
  const labels: Record<string, string> = {
    critical: 'Critique',
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible',
  }
  return labels[severity] || severity
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    trend_break: 'Rupture tendance',
    margin_variation: 'Variation marge',
    missing_data: 'Données manquantes',
    inconsistent_data: 'Données incohérentes',
    outlier: 'Valeur aberrante',
  }
  return labels[type] || type
}

function renderContext(context: any): string {
  if (!context) return ''

  const parts: string[] = []
  if (context.metric) parts.push(`Métrique: ${context.metric}`)
  if (context.expected !== undefined)
    parts.push(`Attendu: ${context.expected.toLocaleString()}`)
  if (context.actual !== undefined)
    parts.push(`Réel: ${context.actual.toLocaleString()}`)
  if (context.deviation !== undefined)
    parts.push(`Écart: ${context.deviation}%`)

  return parts.join(' | ')
}
