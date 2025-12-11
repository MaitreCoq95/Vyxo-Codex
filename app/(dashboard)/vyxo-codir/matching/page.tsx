import { getCodirMembers } from "@/lib/codir-data";
import ProspectingEngine from "@/components/codir/ProspectingEngine";
import { Building2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MatchingPage() {
  // Pre-fetch not strictly needed for the engine as it searches on demand, 
  // but good to verify DB access.
  await getCodirMembers(); 

  return (
    <div className="container py-8 space-y-8">
       <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center gap-3 text-[hsl(var(--vyxo-navy))] dark:text-[hsl(var(--vyxo-gold))]">
           <Building2 className="nav-icon" />
           <h1 className="text-3xl font-bold tracking-tight">Vyxo Matching & Prospection</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          Identifiez instantanément les meilleures ressources du Codir pour vos opportunités.
        </p>
      </div>
      
      <ProspectingEngine />
    </div>
  );
}
