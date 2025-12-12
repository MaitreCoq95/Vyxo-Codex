import { KnowledgeItem } from "@/domain/types/codex";
import { Badge } from "@/components/ui/badge";
import { MagicBentoCard } from "@/components/bento/MagicBentoCard";
import {
  FileText,
  CheckSquare,
  Lightbulb,
  Wrench,
  AlertTriangle
} from "lucide-react";

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
}

const getTypeIcon = (type: KnowledgeItem['type']) => {
  switch (type) {
    case 'concept':
      return <Lightbulb className="h-6 w-6" />; // Increased size for Bento
    case 'requirement':
      return <FileText className="h-6 w-6" />;
    case 'checklist':
      return <CheckSquare className="h-6 w-6" />;
    case 'tool':
      return <Wrench className="h-6 w-6" />;
    case 'risk':
      return <AlertTriangle className="h-6 w-6" />;
  }
};

const getTypeColor = (type: KnowledgeItem['type']) => {
  switch (type) {
    case 'concept':
      return '#3b82f6'; // blue-500
    case 'requirement':
      return '#a855f7'; // purple-500
    case 'checklist':
      return '#22c55e'; // green-500
    case 'tool':
      return '#f59e0b'; // amber-500
    case 'risk':
      return '#ef4444'; // red-500
    default:
      return '#94a3b8'; // slate-400
  }
};

const getTypeLabel = (type: KnowledgeItem['type']) => {
  switch (type) {
    case 'concept':
      return 'Concept';
    case 'requirement':
      return 'Exigence';
    case 'checklist':
      return 'Checklist';
    case 'tool':
      return 'Outil';
    case 'risk':
      return 'Risque';
  }
};

export function KnowledgeItemCard({ item }: KnowledgeItemCardProps) {
  const color = getTypeColor(item.type);
  const icon = getTypeIcon(item.type);
  const label = getTypeLabel(item.type);

  return (
    <div className="h-full">
      <MagicBentoCard
        title={item.topic}
        label={label}
        icon={icon}
        color={color}
        enableTilt={true}
      >
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {item.body}
          </p>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
              {item.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] bg-white/5 border-white/10 text-slate-400"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </MagicBentoCard>
    </div>
  );
}
