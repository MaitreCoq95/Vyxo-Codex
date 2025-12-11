import { KnowledgeItem } from "@/types/codex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      return <Lightbulb className="h-4 w-4" />;
    case 'requirement':
      return <FileText className="h-4 w-4" />;
    case 'checklist':
      return <CheckSquare className="h-4 w-4" />;
    case 'tool':
      return <Wrench className="h-4 w-4" />;
    case 'risk':
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getTypeColor = (type: KnowledgeItem['type']) => {
  switch (type) {
    case 'concept':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'requirement':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'checklist':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'tool':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
    case 'risk':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
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
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold flex-1">
            {item.topic}
          </CardTitle>
          <Badge className={`${getTypeColor(item.type)} flex items-center gap-1`}>
            {getTypeIcon(item.type)}
            <span className="text-xs">{getTypeLabel(item.type)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {item.body}
        </p>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-slate-50 dark:bg-slate-900"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
