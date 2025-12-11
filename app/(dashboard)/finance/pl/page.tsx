/**
 * Vyxo Finance Hub - P&L Page
 * Page détaillée du compte de résultat
 */

import { PLTable } from '@/components/finance/pl-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata = {
  title: 'P&L - Vyxo Finance Hub',
  description: 'Compte de résultat détaillé',
}

export default function PLPage() {
  // TODO: Récupérer depuis l'auth/session
  const companyId = 'default-company-id'
  const periodId = 'default-period-id'

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compte de Résultat (P&L)</h1>
        <p className="text-muted-foreground">
          Analyse détaillée de la performance financière
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>P&L - Réel vs Budget</CardTitle>
          <CardDescription>
            Comparaison des résultats réels avec le budget prévisionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PLTable companyId={companyId} periodId={periodId} />
        </CardContent>
      </Card>
    </div>
  )
}
