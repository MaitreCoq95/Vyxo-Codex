import { EmailGenerator } from "@/components/prospecting/email-generator"

export default function EmailGeneratorPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">Générateur d'Emails IA</h2>
          <p className="text-muted-foreground">Créez des campagnes d'emails personnalisées avec l'IA.</p>
        </div>
      </div>

      <EmailGenerator />
    </div>
  )
}
