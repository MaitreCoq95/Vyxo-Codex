/**
 * Vyxo Finance Hub - Scenario Simulator Component
 * Simulateur de scénarios financiers
 */

'use client'

import { useState } from 'react'
import { Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { FinanceScenario, ScenarioType } from '@/types/finance'

interface ScenarioSimulatorProps {
  companyId: string
}

export function ScenarioSimulator({ companyId }: ScenarioSimulatorProps) {
  const [scenarioType, setScenarioType] = useState<ScenarioType>('realistic')
  const [scenarioName, setScenarioName] = useState('')
  const [revenueGrowth, setRevenueGrowth] = useState('0')
  const [costVariation, setCostVariation] = useState('0')
  const [opexVariation, setOpexVariation] = useState('0')
  const [dsoDays, setDsoDays] = useState('')
  const [dpoDays, setDpoDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FinanceScenario | null>(null)

  async function handleSimulate() {
    if (!scenarioName.trim()) {
      alert('Veuillez donner un nom au scénario')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/finance/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          name: scenarioName,
          scenario_type: scenarioType,
          parameters: {
            revenue_growth: parseFloat(revenueGrowth) / 100,
            cost_variation: parseFloat(costVariation) / 100,
            opex_variation: parseFloat(opexVariation) / 100,
            dso_days: dsoDays ? parseInt(dsoDays) : undefined,
            dpo_days: dpoDays ? parseInt(dpoDays) : undefined,
          },
        }),
      })

      const apiResult = await response.json()

      if (apiResult.success) {
        setResult(apiResult.data)
      } else {
        alert('Erreur lors de la simulation')
      }
    } catch (error) {
      console.error('Error simulating scenario:', error)
      alert('Erreur lors de la simulation')
    } finally {
      setLoading(false)
    }
  }

  function loadPreset(type: ScenarioType) {
    setScenarioType(type)
    switch (type) {
      case 'pessimistic':
        setScenarioName('Scénario Pessimiste')
        setRevenueGrowth('-10')
        setCostVariation('15')
        setOpexVariation('10')
        setDsoDays('60')
        setDpoDays('30')
        break
      case 'realistic':
        setScenarioName('Scénario Réaliste')
        setRevenueGrowth('10')
        setCostVariation('5')
        setOpexVariation('5')
        setDsoDays('45')
        setDpoDays('45')
        break
      case 'optimistic':
        setScenarioName('Scénario Optimiste')
        setRevenueGrowth('25')
        setCostVariation('-5')
        setOpexVariation('0')
        setDsoDays('30')
        setDpoDays('60')
        break
      default:
        setScenarioName('')
        setRevenueGrowth('0')
        setCostVariation('0')
        setOpexVariation('0')
        setDsoDays('')
        setDpoDays('')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Paramètres */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du scénario</CardTitle>
          <CardDescription>
            Ajustez les variables pour simuler différents scénarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type de scénario */}
          <div className="space-y-2">
            <Label>Type de scénario</Label>
            <Select
              value={scenarioType}
              onValueChange={(value) => loadPreset(value as ScenarioType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessimistic">Pessimiste</SelectItem>
                <SelectItem value="realistic">Réaliste</SelectItem>
                <SelectItem value="optimistic">Optimiste</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <Label>Nom du scénario</Label>
            <Input
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Ex: Q1 2025 Projection"
            />
          </div>

          {/* Croissance CA */}
          <div className="space-y-2">
            <Label>Croissance CA (%)</Label>
            <Input
              type="number"
              value={revenueGrowth}
              onChange={(e) => setRevenueGrowth(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Variation coûts */}
          <div className="space-y-2">
            <Label>Variation coûts (%)</Label>
            <Input
              type="number"
              value={costVariation}
              onChange={(e) => setCostVariation(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Variation OPEX */}
          <div className="space-y-2">
            <Label>Variation OPEX (%)</Label>
            <Input
              type="number"
              value={opexVariation}
              onChange={(e) => setOpexVariation(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* DSO */}
          <div className="space-y-2">
            <Label>DSO (jours)</Label>
            <Input
              type="number"
              value={dsoDays}
              onChange={(e) => setDsoDays(e.target.value)}
              placeholder="45"
            />
          </div>

          {/* DPO */}
          <div className="space-y-2">
            <Label>DPO (jours)</Label>
            <Input
              type="number"
              value={dpoDays}
              onChange={(e) => setDpoDays(e.target.value)}
              placeholder="45"
            />
          </div>

          <Button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              'Simulation en cours...'
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Simuler
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats de simulation</CardTitle>
          <CardDescription>
            Projection des KPIs selon vos paramètres
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  CA projeté
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(result.results?.projected_revenue || 0)}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Marge brute projetée
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(result.results?.projected_gross_margin || 0)}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Résultat net projeté
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(result.results?.projected_net_income || 0)}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Trésorerie projetée
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(result.results?.projected_cash || 0)}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  BFR projeté (jours)
                </p>
                <p className="text-2xl font-bold">
                  {result.results?.projected_wc_days || 0} jours
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Configurez et lancez une simulation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
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
