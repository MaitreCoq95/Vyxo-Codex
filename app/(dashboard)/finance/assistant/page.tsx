/**
 * Vyxo Finance Hub - AI Assistant Page
 * Page de l'assistant IA Finance
 */

import { AIAssistant } from '@/components/finance/ai-assistant'

export const metadata = {
  title: 'Assistant IA - Vyxo Finance Hub',
  description: 'Assistant IA pour vos questions financières',
}

export default function AIAssistantPage() {
  // TODO: Récupérer depuis l'auth/session
  const companyId = 'default-company-id'

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Assistant IA Finance</h1>
        <p className="text-muted-foreground">
          Posez vos questions sur vos données financières
        </p>
      </div>

      <AIAssistant companyId={companyId} />
    </div>
  )
}
