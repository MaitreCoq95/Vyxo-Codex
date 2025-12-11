"use client";

import { useState, useTransition } from "react";
import { CodirMember } from "@/types/codir";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCompetency, deleteCompetency } from "@/app/(dashboard)/vyxo-codir/actions";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface CompetencyEditorProps {
  member: CodirMember;
}

const CATEGORIES = [
  { value: "finance", label: "Finance & Pilotage" },
  { value: "operations", label: "Opérations & Logistique" },
  { value: "quality", label: "Qualité & QSE" },
  { value: "tech", label: "Tech, IA & Systèmes" },
  { value: "norms", label: "Normes & Référentiels" },
  { value: "dataIa", label: "Data, IA & BI" },
  { value: "commercial", label: "Commerce & Croissance" },
  { value: "methods", label: "Méthodologies & Approches" },
  { value: "softSkills", label: "Leadership & Soft Skills" }
];

export function CompetencyEditor({ member }: CompetencyEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [newSkill, setNewSkill] = useState({
    category: "",
    label: "",
    level: "Expert"
  });

  const handleAdd = () => {
    if (!newSkill.category || !newSkill.label) {
      toast({ title: "Erreur", description: "Veuillez remplir la catégorie et le nom de la compétence.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        await addCompetency(member.id, {
          category: newSkill.category,
          label: newSkill.label,
          level: newSkill.level
        });
        setNewSkill({ ...newSkill, label: "" }); // Reset label only
        toast({ title: "Succès", description: "Compétence ajoutée." });
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible d'ajouter la compétence.", variant: "destructive" });
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteCompetency(id);
        toast({ title: "Succès", description: "Compétence supprimée." });
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer la compétence.", variant: "destructive" });
      }
    });
  };

  const richCompetencies = member.competenciesRich || [];

  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-secondary/20 p-4 rounded-lg border border-border">
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select 
            value={newSkill.category} 
            onValueChange={(val) => setNewSkill({ ...newSkill, category: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Compétence</Label>
          <Input 
            placeholder="Ex: Audit ISO 9001" 
            value={newSkill.label}
            onChange={(e) => setNewSkill({ ...newSkill, label: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>

        <Button onClick={handleAdd} disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Compétences actuelles</h4>
        {richCompetencies.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Aucune compétence enregistrée.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {richCompetencies.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-2 rounded border bg-card hover:bg-accent/50 transition-colors group">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{skill.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {CATEGORIES.find(c => c.value === skill.category)?.label || skill.category}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(skill.id)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
