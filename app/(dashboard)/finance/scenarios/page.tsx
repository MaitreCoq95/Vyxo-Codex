/**
 * Vyxo Finance Hub - Scenarios Page
 * Page de simulation de scénarios financiers
 */

import { ScenarioSimulator } from '@/components/finance/scenario-simulator'

export const metadata = {
  title: 'Scénarios - Vyxo Finance Hub',
  description: 'Simulation et analyse de scénarios financiers',
}

export default function ScenariosPage() {
  // TODO: Récupérer depuis l'auth/session
  const companyId = 'default-company-id'

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Simulateur de Scénarios</h1>
        <p className="text-muted-foreground">
          Projetez vos KPIs financiers selon différents scénarios
        </p>
      </div>

      <ScenarioSimulator companyId={companyId} />
    </div>
  )
}
