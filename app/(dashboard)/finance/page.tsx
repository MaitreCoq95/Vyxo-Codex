/**
 * Vyxo Finance Hub - Main Page
 * Page principale du module Finance
 */

import { CFODashboard } from '@/components/finance/cfo-dashboard'

export const metadata = {
  title: 'Vyxo Finance Hub | Vyxo Central Hub',
  description: 'Pilotage financier et cockpit CFO',
}

export default function FinanceHubPage() {
  // TODO: Récupérer le company_id depuis l'auth/session
  const companyId = 'default-company-id'

  return (
    <div className="container mx-auto py-6">
      <CFODashboard companyId={companyId} />
    </div>
  )
}
