export function ISOReportTemplate({ auditId }: { auditId: string }) {
  return (
    <div className="space-y-8 font-serif text-slate-900">
      {/* ISO Header */}
      <div className="text-center border-b-2 border-slate-900 pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Rapport d'Audit Interne</h1>
        <p className="text-lg mt-2 italic">Conforme ISO 19011:2018</p>
        <p className="text-sm mt-4 text-slate-500">Réf: AUD-2024-0042</p>
      </div>

      {/* 1. General Info */}
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 pb-2 mb-4">1. Informations Générales</h2>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div className="grid grid-cols-3">
            <span className="font-bold text-slate-600">Client :</span>
            <span className="col-span-2">Demo Client SAS</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-slate-600">Date :</span>
            <span className="col-span-2">23 Nov 2024</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-slate-600">Auditeur :</span>
            <span className="col-span-2">Vivien V.</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-slate-600">Lieu :</span>
            <span className="col-span-2">Siège Social - Paris</span>
          </div>
        </div>
      </section>

      {/* 2. Scope & Objectives */}
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 pb-2 mb-4">2. Périmètre et Objectifs</h2>
        <div className="space-y-4 text-sm text-justify">
          <div>
            <h3 className="font-bold text-slate-700 mb-1">Périmètre (Scope)</h3>
            <p>L'audit couvre l'ensemble des processus de réalisation, incluant la conception, les achats, la production et la livraison. Les fonctions support RH et Maintenance sont également incluses.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-1">Objectifs</h3>
            <p>Vérifier la conformité du système de management de la qualité par rapport aux exigences de la norme ISO 9001:2015 et aux exigences internes de l'organisme.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-1">Critères</h3>
            <p>ISO 9001:2015, Manuel Qualité v3.2, Procédures internes.</p>
          </div>
        </div>
      </section>

      {/* 3. Findings Summary */}
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 pb-2 mb-4">3. Synthèse des Constats</h2>
        <table className="w-full text-sm border-collapse border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 p-2 text-left">Type</th>
              <th className="border border-slate-300 p-2 text-center">Quantité</th>
              <th className="border border-slate-300 p-2 text-left">Description Sommaire</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 font-bold text-green-700">Points Forts</td>
              <td className="border border-slate-300 p-2 text-center">3</td>
              <td className="border border-slate-300 p-2">Maturité processus RH, Engagement direction</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-bold text-red-700">NC Majeures</td>
              <td className="border border-slate-300 p-2 text-center">0</td>
              <td className="border border-slate-300 p-2">-</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-bold text-orange-600">NC Mineures</td>
              <td className="border border-slate-300 p-2 text-center">2</td>
              <td className="border border-slate-300 p-2">Revue de contrat incomplète, Étalonnage balance</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-bold text-blue-600">Pistes de Progrès</td>
              <td className="border border-slate-300 p-2 text-center">4</td>
              <td className="border border-slate-300 p-2">Digitalisation supports, Communication interne</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 4. Detailed Findings */}
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 pb-2 mb-4">4. Détail des Constats</h2>
        <div className="space-y-6">
          <div className="border border-slate-200 p-4 bg-slate-50">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-orange-600">NC-2024-01 (Mineure)</span>
              <span className="text-slate-500 text-xs">Ref: 8.2.3</span>
            </div>
            <p className="text-sm italic mb-2">"L'organisme doit mener une revue avant de s'engager..."</p>
            <p className="text-sm">Lors de l'audit du dossier client X42, aucune preuve de revue de faisabilité technique n'a pu être présentée avant l'acceptation de la commande.</p>
          </div>
          
          <div className="border border-slate-200 p-4 bg-slate-50">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-orange-600">NC-2024-02 (Mineure)</span>
              <span className="text-slate-500 text-xs">Ref: 7.1.5</span>
            </div>
            <p className="text-sm italic mb-2">"L'organisme doit conserver des informations documentées appropriées..."</p>
            <p className="text-sm">La balance de précision du laboratoire (Inv. 452) a une étiquette de validité expirée depuis le 15/10/2024.</p>
          </div>
        </div>
      </section>

      {/* 5. Conclusion */}
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 pb-2 mb-4">5. Conclusion d'Audit</h2>
        <p className="text-sm text-justify">
          Le système de management de la qualité est globalement conforme et efficace. Les non-conformités relevées sont mineures et ne remettent pas en cause la capacité de l'organisme à satisfaire ses clients. Un plan d'actions correctives devra être transmis sous 30 jours pour les écarts constatés.
        </p>
      </section>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12 pt-12">
        <div className="border-t border-slate-400 pt-2">
          <p className="font-bold text-sm">L'Auditeur</p>
          <p className="text-xs text-slate-500">Vivien V.</p>
        </div>
        <div className="border-t border-slate-400 pt-2">
          <p className="font-bold text-sm">Le Représentant de la Direction</p>
          <p className="text-xs text-slate-500">Jean Dupont</p>
        </div>
      </div>
    </div>
  )
}
