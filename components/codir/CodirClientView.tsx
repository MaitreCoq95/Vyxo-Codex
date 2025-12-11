"use client";

import { useState } from "react";
import { CodirMember } from "@/types/codir";
import { CodirCard } from "@/components/codir/CodirCard";
import { CodirMemberDetail } from "@/components/codir/CodirMemberDetail";
import { Building2 } from "lucide-react";

interface CodirClientViewProps {
  members: CodirMember[];
}

export default function CodirClientView({ members }: CodirClientViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Derive selected member from props to ensure updates from server actions are reflected
  const selectedMember = selectedMemberId ? members.find(m => m.id === selectedMemberId) || null : null;

  const handleSelectMember = (member: CodirMember) => {
    setSelectedMemberId(member.id);
    setDetailOpen(true);
  };

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center gap-3 text-[hsl(var(--vyxo-navy))] dark:text-[hsl(var(--vyxo-gold))]">
           <Building2 className="nav-icon" />
           <h1 className="text-3xl font-bold tracking-tight">Vyxo ComEx</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          Le Comité de Direction Vyxo réunit des experts de haut vol pour piloter la vision, 
          l&apos;excellence opérationnelle et l&apos;innovation. Une équipe pluridisciplinaire 
          dédiée à la performance de nos clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <CodirCard 
            key={member.id} 
            member={member} 
            onSelect={handleSelectMember} 
          />
        ))}
      </div>

      <CodirMemberDetail 
        member={selectedMember} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </div>
  );
}
