import { KnowledgeModule } from "@/domain/types/codex";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { MagicBentoCard } from "../bento/MagicBentoCard";

interface ModuleCardProps {
  module: KnowledgeModule;
}

const getLevelColor = (level: KnowledgeModule['level']) => {
  switch (level) {
    case 'basic':
      return 'bg-slate-100/10 text-slate-300';
    case 'intermediate':
      return 'bg-cyan-500/20 text-cyan-300';
    case 'advanced':
      return 'bg-indigo-500/20 text-indigo-300';
  }
};

const getLevelLabel = (level: KnowledgeModule['level']) => {
  switch (level) {
    case 'basic':
      return 'Débutant';
    case 'intermediate':
      return 'Intermédiaire';
    case 'advanced':
      return 'Avancé';
  }
};

export function ModuleCard({ module }: ModuleCardProps) {
  // Use Level for Color and Label to match Learning Paths
  const levelColorMap: Record<string, string> = {
    'basic': '#22c55e',       // Green
    'intermediate': '#3b82f6', // Blue
    'advanced': '#a855f7',    // Purple
  };
  const color = levelColorMap[module.level] || '#94a3b8';

  return (
    <div className="h-full">
      <MagicBentoCard
        title={module.title}
        description={module.shortDescription}
        href={`/codex/modules/${module.id}`}
        label={getLevelLabel(module.level).toUpperCase()}
        color={color}
        icon={<BookOpen className="h-8 w-8" />}
        enableTilt={true}
      >
        {/* Top Content: Category / Code similar to 'Status' badges */}
        <div className="flex gap-2 mb-4">
           <Badge variant="outline" className="bg-white/5 border-white/10 text-xs text-white/90">
              {module.code || module.category}
           </Badge>
        </div>

        {/* Bottom Content: Tags */}
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
          {module.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {module.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-[10px] bg-white/5 border-white/10 text-slate-400">
                  #{tag}
                </Badge>
              ))}
              {module.tags.length > 3 && (
                <span className="text-[10px] text-slate-500 flex items-center">+{module.tags.length - 3}</span>
              )}
            </div>
          )}
          
          {module.sectors && (
             <p className="text-[10px] text-slate-500 line-clamp-1">
               {module.sectors.join(', ')}
             </p>
          )}
        </div>
      </MagicBentoCard>
    </div>
  );
}
