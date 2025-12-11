"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Idea } from "@/types/bucket-project";
import { Lightbulb, ThumbsUp, Activity, CheckCircle2 } from "lucide-react";

interface IdeaCardProps {
  idea: Idea;
  voteCount?: { yes: number; no: number; total: number };
  onClick: () => void;
}

export default function IdeaCard({ idea, voteCount, onClick }: IdeaCardProps) {
  // Calculate Score
  // IdeaScore = (strategic_fit + business_potential + (6 - complexity) + (6 - risk_level))
  const score = (idea.strategic_fit || 0) + (idea.business_potential || 0) + (6 - (idea.complexity || 3)) + (6 - (idea.risk_level || 3));
  
  let scoreColor = "text-muted-foreground";
  if (score > 15) scoreColor = "text-green-600 font-bold";
  else if (score < 10) scoreColor = "text-red-500";
  else scoreColor = "text-[hsl(var(--vyxo-gold))]";

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-[hsl(var(--vyxo-gold))]" onClick={onClick}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
           <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider">{idea.category}</Badge>
           {idea.status === 'approved' && <Badge className="bg-green-600">Approved</Badge>}
        </div>
        <CardTitle className="text-base leading-tight line-clamp-2">{idea.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1 pb-2">
        <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{idea.description}</p>
        
        <div className="flex items-center justify-between text-xs">
           <div className="flex items-center gap-1" title="Vyxo Score">
              <Activity className="w-3 h-3" />
              <span className={scoreColor}>{score}/20</span>
           </div>
           {voteCount && (
             <div className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp className="w-3 h-3" />
                <span>{voteCount.yes} / {voteCount.total}</span>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
