/**
 * Vyxo Finance Hub - KPI Card Component
 * Carte affichant un KPI avec variation et tendance
 */

'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: number
  format?: 'currency' | 'percent' | 'number' | 'days'
  currency?: string
  trend?: number // Variation en %
  period?: string
  className?: string
  decimals?: number
}

export function KPICard({
  title,
  value,
  format = 'currency',
  currency = 'EUR',
  trend,
  period,
  className,
  decimals = 0,
}: KPICardProps) {
  const formattedValue = formatValue(value, format, currency, decimals)
  const trendIcon = getTrendIcon(trend)
  const trendColor = getTrendColor(trend)

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1', trendColor)}>
            {trendIcon}
            <span className="text-xs font-medium">
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {period && (
          <p className="text-xs text-muted-foreground mt-1">{period}</p>
        )}
      </CardContent>
    </Card>
  )
}

function formatValue(
  value: number,
  format: 'currency' | 'percent' | 'number' | 'days',
  currency: string,
  decimals: number
): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)

    case 'percent':
      return `${value.toFixed(decimals)}%`

    case 'days':
      return `${Math.round(value)} j`

    case 'number':
    default:
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
  }
}

function getTrendIcon(trend?: number) {
  if (trend === undefined) return null
  if (trend > 0) return <TrendingUp className="h-4 w-4" />
  if (trend < 0) return <TrendingDown className="h-4 w-4" />
  return <Minus className="h-4 w-4" />
}

function getTrendColor(trend?: number): string {
  if (trend === undefined) return ''
  if (trend > 0) return 'text-green-600'
  if (trend < 0) return 'text-red-600'
  return 'text-gray-500'
}
