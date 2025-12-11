"use client";

import { CodirMember } from "@/types/codir";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompetencyEditor } from "./CompetencyEditor";
import { ExternalLink, Target, Trophy, Lightbulb, Users, Briefcase, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodirMemberDetailProps {
  member: CodirMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CodirMemberDetail({ member, open, onOpenChange }: CodirMemberDetailProps) {
  if (!member) return null;

  // Translation mapping for competency categories
  const competencyLabels: Record<string, string> = {
    finance: "Finance & Pilotage",
    operations: "Opérations & Logistique",
    quality: "Qualité & QSE",
    tech: "Tech, IA & Systèmes",
    norms: "Normes & Référentiels",
    dataIa: "Data, IA & BI",
    commercial: "Commerce & Croissance",
    methods: "Méthodologies & Approches",
    softSkills: "Leadership & Soft Skills",
  };

  const hasCompetencies = Object.keys(member.competencies).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl border-none shadow-2xl">
        
        {/* Header Section with Gradient */}
        <div className="relative bg-gradient-to-r from-[hsl(var(--vyxo-navy))] to-[#1e293b] p-6 text-white shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-32 h-32" />
          </div>
          
          <DialogHeader className="relative z-10 flex flex-col gap-2">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-[hsl(var(--vyxo-gold))] shadow-xl shrink-0 hidden sm:block">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} alt={member.name} />
                <AvatarFallback className="text-xl font-bold bg-[hsl(var(--vyxo-navy))] text-white">
                  {member.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-3xl font-bold tracking-tight text-white mb-1">
                      {member.name}
                    </DialogTitle>
                    <DialogDescription className="text-[hsl(var(--vyxo-gold))] text-base font-semibold opacity-100">
                      {member.role}
                    </DialogDescription>
                  </div>
                  {member.portfolioUrl && (
                    <Button 
                      asChild 
                      variant="outline" 
                      className="bg-transparent border-[hsl(var(--vyxo-gold))] text-[hsl(var(--vyxo-gold))] hover:bg-[hsl(var(--vyxo-gold))] hover:text-[hsl(var(--vyxo-navy))] shrink-0 ml-4"
                    >
                      <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        Voir le portfolio <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex gap-3">
                    <Quote className="w-6 h-6 text-[hsl(var(--vyxo-gold))] shrink-0" />
                    <p className="italic text-lg text-white/90 leading-relaxed font-light">
                      {member.quote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <Tabs defaultValue="profile" className="w-full h-full">
            <div className="px-6 pt-4 border-b bg-background sticky top-0 z-20">
               <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
                 <TabsTrigger 
                   value="profile" 
                   className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--vyxo-gold))] rounded-none pb-2 text-muted-foreground data-[state=active]:text-foreground"
                 >
                   Profil & Parcours
                 </TabsTrigger>
                 <TabsTrigger 
                   value="competencies" 
                   className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--vyxo-gold))] rounded-none pb-2 text-muted-foreground data-[state=active]:text-foreground"
                 >
                   Gestion Compétences
                 </TabsTrigger>
               </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="profile" className="mt-0 space-y-8 pb-8 focus-visible:outline-none">
                
                {/* Mission & Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-[hsl(var(--vyxo-navy))] dark:text-white">
                      <Target className="w-5 h-5 text-[hsl(var(--vyxo-gold))]" />
                      Mission
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.mission}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-[hsl(var(--vyxo-navy))] dark:text-white">
                      <Briefcase className="w-5 h-5 text-[hsl(var(--vyxo-gold))]" />
                      Parcours & Bio
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {member.longBio}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Strengths & Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Forces (Strengths) */}
                  <div className="space-y-3">
                     <h3 className="flex items-center gap-2 text-lg font-semibold">
                       ⚡ Force de frappe
                     </h3>
                     <ul className="space-y-2">
                       {member.strengths.map((str, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                           <ChevronRight className="w-4 h-4 text-[hsl(var(--vyxo-gold))] shrink-0 mt-0.5" />
                           {str}
                         </li>
                       ))}
                     </ul>
                  </div>

                  {/* Zones d'impact */}
                  <div className="space-y-3">
                     <h3 className="flex items-center gap-2 text-lg font-semibold">
                       🎯 Zones d&apos;impact
                     </h3>
                     <div className="flex flex-wrap gap-2">
                       {member.impactZones.map((zone, i) => (
                         <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-normal">
                           {zone}
                         </Badge>
                       ))}
                     </div>
                  </div>
                </div>

                {member.results.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-xl font-semibold text-[hsl(var(--vyxo-navy))] dark:text-white">
                        <Trophy className="w-5 h-5 text-[hsl(var(--vyxo-gold))]" />
                        Résultats & Track Record
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {member.results.map((result, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary">
                             <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--vyxo-gold))] mt-2 shrink-0" />
                             <span className="text-sm font-medium">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {hasCompetencies && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                       <h3 className="flex items-center gap-2 text-xl font-semibold text-[hsl(var(--vyxo-navy))] dark:text-white">
                        <Lightbulb className="w-5 h-5 text-[hsl(var(--vyxo-gold))]" />
                        Compétences & Expertises
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {Object.entries(member.competencies).map(([key, items]) => {
                          if (!items || items.length === 0) return null;
                          return (
                            <div key={key} className="break-inside-avoid">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                 <div className="h-px w-4 bg-[hsl(var(--vyxo-gold))]" />
                                 {competencyLabels[key] || key}
                              </h4>
                              <ul className="space-y-1.5">
                                {items.map((item, idx) => (
                                  <li key={idx} className="text-sm pl-6 relative">
                                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-primary/20 rounded-full" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="competencies" className="mt-0 focus-visible:outline-none min-h-[500px]">
                <CompetencyEditor member={member} />
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
        
        {/* Footer actions if needed suited for mobile */}
        <div className="md:hidden border-t p-4 flex justify-end">
           <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
