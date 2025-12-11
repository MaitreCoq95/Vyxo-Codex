/**
 * Vyxo Finance Hub - P&L Table Component
 * Tableau détaillé du compte de résultat
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { PLComparison } from '@/types/finance'

interface PLTableProps {
  companyId: string
  periodId: string
}

export function PLTable({ companyId, periodId }: PLTableProps) {
  const [comparison, setComparison] = useState<PLComparison[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPL()
  }, [companyId, periodId])

  async function fetchPL() {
    try {
      setLoading(true)
      const params = new URLSearchParams({ company_id: companyId, period_id: periodId })
      const response = await fetch(`/api/finance/pl?${params}`)
      const result = await response.json()

      if (result.success) {
        setComparison(result.data.comparison)
      }
    } catch (error) {
      console.error('Error fetching P&L:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (comparison.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée P&L disponible
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Poste</TableHead>
          <TableHead className="text-right">Réel</TableHead>
          <TableHead className="text-right">Budget</TableHead>
          <TableHead className="text-right">Écart</TableHead>
          <TableHead className="text-right">Écart %</TableHead>
          <TableHead className="text-right">Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comparison.map((line) => (
          <TableRow key={line.line_type}>
            <TableCell className="font-medium">{line.label}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(line.actual)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(line.budget)}
            </TableCell>
            <TableCell
              className={`text-right ${getVarianceColor(line.variance_actual_budget)}`}
            >
              {formatCurrency(line.variance_actual_budget)}
            </TableCell>
            <TableCell
              className={`text-right ${getVarianceColor(line.variance_actual_budget_pct)}`}
            >
              {line.variance_actual_budget_pct.toFixed(1)}%
            </TableCell>
            <TableCell className="text-right">
              {getStatusBadge(line.variance_actual_budget_pct, line.line_type)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getVarianceColor(variance: number): string {
  if (variance > 0) return 'text-green-600'
  if (variance < 0) return 'text-red-600'
  return 'text-muted-foreground'
}

function getStatusBadge(variancePct: number, lineType: string) {
  // Pour les revenus et marges, positif = bon
  const isRevenueLine = ['revenue', 'gross_margin', 'ebitda', 'net_income'].includes(lineType)

  const threshold = 5 // 5% de tolérance

  if (Math.abs(variancePct) <= threshold) {
    return <Badge variant="outline">On Track</Badge>
  }

  if (isRevenueLine) {
    return variancePct > 0 ? (
      <Badge className="bg-green-600">Surperforme</Badge>
    ) : (
      <Badge variant="destructive">Sous-performe</Badge>
    )
  } else {
    // Pour les coûts, négatif = bon (moins de dépenses)
    return variancePct < 0 ? (
      <Badge className="bg-green-600">Surperforme</Badge>
    ) : (
      <Badge variant="destructive">Sous-performe</Badge>
    )
  }
}
