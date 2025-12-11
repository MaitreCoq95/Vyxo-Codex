"use client";

import { CodirMember } from "@/types/codir";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface CodirCardProps {
  member: CodirMember;
  onSelect: (member: CodirMember) => void;
}

export function CodirCard({ member, onSelect }: CodirCardProps) {
  // Initials for avatar fallback
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-[hsl(var(--vyxo-gold))] cursor-pointer overflow-hidden relative bg-card/50 hover:bg-card/80 dark:bg-slate-900/50 dark:hover:bg-slate-900/80 backdrop-blur-sm"
      onClick={() => onSelect(member)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-6 h-6 text-[hsl(var(--vyxo-gold))]" />
      </div>
      
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-[hsl(var(--vyxo-navy))] dark:border-[hsl(var(--vyxo-gold))]">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} alt={member.name} />
          <AvatarFallback className="bg-[hsl(var(--vyxo-navy))] text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold text-[hsl(var(--vyxo-navy))] dark:text-white group-hover:text-[hsl(var(--vyxo-gold))] transition-colors">
            {member.name}
          </CardTitle>
          <CardDescription className="text-sm font-medium line-clamp-2">
            {member.role}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 italic">
            &quot;{member.quote}&quot;
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {member.strengths.slice(0, 2).map((strength, index) => (
              <span 
                key={index} 
                className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--vyxo-navy))/10] text-[hsl(var(--vyxo-navy))] dark:bg-[hsl(var(--vyxo-gold))/20] dark:text-[hsl(var(--vyxo-gold))]"
              >
                {strength.length > 30 ? strength.substring(0, 30) + "..." : strength}
              </span>
            ))}
            {member.strengths.length > 2 && (
               <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium text-muted-foreground">
                 +{member.strengths.length - 2}
               </span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-2 group-hover:bg-[hsl(var(--vyxo-navy))] group-hover:text-white dark:group-hover:bg-[hsl(var(--vyxo-gold))] dark:group-hover:text-black transition-colors"
          >
            Découvrir le profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
