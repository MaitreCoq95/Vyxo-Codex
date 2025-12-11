import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react"

export function VyxoReportTemplate({ auditId }: { auditId: string }) {
  return (
    <div className="space-y-8 font-sans text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-vyxo-gold pb-6">
        <div>
          <h1 className="text-4xl font-bold text-vyxo-navy">Rapport d'Audit</h1>
          <p className="text-xl text-slate-500 mt-2">Synthèse Exécutive</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-vyxo-gold">VYXO</div>
          <div className="text-sm text-slate-400">Excellence Opérationnelle</div>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-700">Vyxo Excellence Index</h3>
          <p className="text-sm text-slate-500">Score global de maturité</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-vyxo-navy">82<span className="text-2xl text-slate-400">/100</span></div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-sm">Excellent</Badge>
        </div>
      </div>

      {/* 3 Key Areas */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Points Forts</h4>
          </div>
          <ul className="text-sm text-green-800 space-y-2 list-disc list-inside">
            <li>Engagement direction fort</li>
            <li>Processus RH maîtrisés</li>
            <li>Documentation à jour</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">Points Sensibles</h4>
          </div>
          <ul className="text-sm text-orange-800 space-y-2 list-disc list-inside">
            <li>Suivi fournisseurs</li>
            <li>Indicateurs performance</li>
            <li>Revue de direction</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Opportunités</h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Digitalisation audits</li>
            <li>Formation auditeurs</li>
            <li>Simplification doc</li>
          </ul>
        </div>
      </div>

      {/* Action Plan */}
      <div>
        <h3 className="text-xl font-bold text-vyxo-navy mb-4 border-l-4 border-vyxo-gold pl-3">Plan d'Action Prioritaire</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-white border rounded-lg shadow-sm">
            <div className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold uppercase mt-1">Immédiat</div>
            <div>
              <h4 className="font-semibold text-slate-900">Mettre à jour la liste des fournisseurs critiques</h4>
              <p className="text-sm text-slate-600 mt-1">Risque de rupture d'approvisionnement identifié sur 2 composants clés.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-white border rounded-lg shadow-sm">
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs font-bold uppercase mt-1">30 Jours</div>
            <div>
              <h4 className="font-semibold text-slate-900">Former l'équipe maintenance aux nouveaux formulaires</h4>
              <p className="text-sm text-slate-600 mt-1">Assurer la traçabilité des interventions préventives.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-white border rounded-lg shadow-sm">
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-bold uppercase mt-1">90 Jours</div>
            <div>
              <h4 className="font-semibold text-slate-900">Revoir les indicateurs du processus Achat</h4>
              <p className="text-sm text-slate-600 mt-1">Aligner les KPIs avec la nouvelle stratégie groupe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-center text-sm text-slate-400">
        <p>Généré automatiquement par Vyxo Central Hub • {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}
