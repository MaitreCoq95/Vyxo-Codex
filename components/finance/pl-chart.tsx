/**
 * Vyxo Finance Hub - P&L Chart Component
 * Graphique d'évolution du P&L
 */

'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PLChartProps {
  data: {
    period_label: string
    revenue: number
    gross_margin: number
    net_income: number
  }[]
}

export function PLChart({ data }: PLChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Aucune donnée disponible
      </div>
    )
  }

  // Formater les données pour Recharts
  const chartData = data.map((item) => ({
    period: item.period_label,
    'CA': item.revenue / 1000, // En K€
    'Marge brute': item.gross_margin / 1000,
    'Résultat net': item.net_income / 1000,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="period"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          label={{ value: 'K€', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`${value.toFixed(0)} K€`, '']}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="CA"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="Marge brute"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="Résultat net"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
