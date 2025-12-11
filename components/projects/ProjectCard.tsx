"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectWithDetails } from "@/types/bucket-project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, TrendingUp, AlertTriangle } from "lucide-react";

interface ProjectCardProps {
  project: ProjectWithDetails;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    // Priority Colors
    const priorityColor = 
      project.priority === 'critical' ? 'bg-red-600 border-red-600' :
      project.priority === 'high' ? 'bg-orange-500 border-orange-500' :
      'bg-blue-500 border-blue-500';

    return (
        <Card className="cursor-pointer hover:shadow-lg transition-all group border-l-4 border-l-transparent hover:border-l-[hsl(var(--vyxo-gold))]" onClick={onClick}>
            <CardHeader className="p-4 pb-2">
                 <div className="flex justify-between items-start mb-2">
                     <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{project.category}</Badge>
                     {project.priority && (
                         <div className={`w-2 h-2 rounded-full ${priorityColor.split(' ')[0]}`} title={`Priority: ${project.priority}`} />
                     )}
                 </div>
                 <CardTitle className="text-base font-bold leading-tight group-hover:text-[hsl(var(--vyxo-gold))] transition-colors">
                     {project.title}
                 </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                         {project.ownerName && (
                            <Avatar className="h-6 w-6 border">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner_id}`} />
                                <AvatarFallback>{project.ownerName[0]}</AvatarFallback>
                            </Avatar>
                         )}
                         <span className="truncate max-w-[80px]">{project.ownerName?.split(' ')[0]}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {project.time_horizon && (
                             <div className="flex items-center gap-1" title="Horizon">
                                 <Clock className="w-3 h-3" />
                                 {project.time_horizon.includes('mois') ? project.time_horizon.split(' ')[0] + 'm' : 'Lt'}
                             </div>
                         )}
                         {(project.expected_revenue || 0) > 0 && (
                             <div className="flex items-center gap-1 text-green-600 font-medium" title="Revenue Potentiel">
                                 <TrendingUp className="w-3 h-3" />
                                 {(project.expected_revenue! / 1000).toFixed(0)}k
                             </div>
                         )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
