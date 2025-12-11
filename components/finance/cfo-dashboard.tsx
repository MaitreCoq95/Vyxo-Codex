/**
 * Vyxo Finance Hub - CFO Dashboard Component
 * Dashboard principal du CFO avec KPIs et graphiques
 */

'use client'

import { useState, useEffect } from 'react'
import { KPICard } from './kpi-card'
import { PLChart } from './pl-chart'
import { CashFlowChart } from './cashflow-chart'
import { TopProductsTable } from './top-products-table'
import { AnomaliesList } from './anomalies-list'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CFODashboard } from '@/types/finance'

interface CFODashboardProps {
  companyId: string
  periodId?: string
}

export function CFODashboard({ companyId, periodId }: CFODashboardProps) {
  const [dashboard, setDashboard] = useState<CFODashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboard()
  }, [companyId, periodId])

  async function fetchDashboard() {
    try {
      setLoading(true)
      const params = new URLSearchParams({ company_id: companyId })
      if (periodId) params.append('period_id', periodId)

      const response = await fetch(`/api/finance/dashboard?${params}`)
      const result = await response.json()

      if (result.success) {
        setDashboard(result.data)
      } else {
        setError(result.error || 'Failed to load dashboard')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erreur</p>
          <p className="text-muted-foreground">{error || 'Données non disponibles'}</p>
        </div>
      </div>
    )
  }

  const { kpis, trends, top_products, recent_anomalies, current_period } = dashboard

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vyxo Finance Hub</h1>
          <p className="text-muted-foreground">
            Période : {current_period.period_label}
          </p>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Chiffre d'affaires"
          value={kpis.revenue}
          format="currency"
          period="Ce mois"
        />
        <KPICard
          title="CA YTD"
          value={kpis.revenue_ytd}
          format="currency"
          trend={kpis.revenue_growth}
          period="Année en cours"
        />
        <KPICard
          title="Marge brute"
          value={kpis.gross_margin_pct}
          format="percent"
          decimals={1}
          period={`${(kpis.gross_margin / 1000).toFixed(0)}K €`}
        />
        <KPICard
          title="Résultat net"
          value={kpis.net_income_pct}
          format="percent"
          decimals={1}
          period={`${(kpis.net_income / 1000).toFixed(0)}K €`}
        />
      </div>

      {/* KPIs Cash & BFR */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Trésorerie"
          value={kpis.cash_balance}
          format="currency"
          period="Disponible"
        />
        <KPICard
          title="Forecast 30j"
          value={kpis.cash_forecast_30d}
          format="currency"
          period="Projection"
        />
        <KPICard
          title="BFR (jours)"
          value={kpis.wc_days}
          format="days"
          period={`DSO: ${kpis.dso}j | DPO: ${kpis.dpo}j`}
        />
        <KPICard
          title="Ratio de liquidité"
          value={kpis.current_ratio}
          format="number"
          decimals={2}
          period="Current ratio"
        />
      </div>

      {/* Graphiques & Tables */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="products">Top Produits</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution P&L</CardTitle>
                <CardDescription>12 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <PLChart data={trends} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution Trésorerie</CardTitle>
                <CardDescription>12 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <CashFlowChart data={trends} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Produits</CardTitle>
              <CardDescription>Par rentabilité</CardDescription>
            </CardHeader>
            <CardContent>
              <TopProductsTable products={top_products} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Anomalies détectées</CardTitle>
              <CardDescription>Alertes et points d'attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AnomaliesList anomalies={recent_anomalies} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
