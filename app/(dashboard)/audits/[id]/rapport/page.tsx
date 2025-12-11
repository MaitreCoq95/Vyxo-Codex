"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, FileText, Sparkles } from "lucide-react"
import { ISOReportTemplate } from "@/components/audit/reports/iso-report-template"
import { VyxoReportTemplate } from "@/components/audit/reports/vyxo-report-template"

export default function ReportGenerationPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("vyxo")

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">Rapport d'Audit</h1>
          <p className="text-muted-foreground mt-1">Générez et exportez le rapport final.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div className="no-print">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="vyxo">
              <Sparkles className="h-4 w-4 mr-2 text-vyxo-gold" />
              Vyxo Simplifié
            </TabsTrigger>
            <TabsTrigger value="iso">
              <FileText className="h-4 w-4 mr-2" />
              ISO Complet
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6 border rounded-lg bg-white shadow-sm min-h-[1123px] w-full max-w-[794px] mx-auto p-[40px] print:border-none print:shadow-none print:p-0 print:w-full print:max-w-none">
        {activeTab === "vyxo" ? (
          <VyxoReportTemplate auditId={params.id} />
        ) : (
          <ISOReportTemplate auditId={params.id} />
        )}
      </div>
    </div>
  )
}
