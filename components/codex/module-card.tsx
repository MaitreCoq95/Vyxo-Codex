import { KnowledgeModule } from "@/types/codex";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  module: KnowledgeModule;
}

const getCategoryColor = (category: KnowledgeModule['category']) => {
  switch (category) {
    case 'ISO':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Pharma':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'Transport':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'ExOp':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'ITSec':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getLevelColor = (level: KnowledgeModule['level']) => {
  switch (level) {
    case 'basic':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case 'intermediate':
      return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-800 dark:text-cyan-300';
    case 'advanced':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300';
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
  return (
    <Link href={`/codex/modules/${module.id}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:border-vyxo-gold/50 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-500" />
              {module.code && (
                <Badge variant="outline" className="font-mono text-xs">
                  {module.code}
                </Badge>
              )}
            </div>
            <Badge className={getLevelColor(module.level)}>
              {getLevelLabel(module.level)}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-vyxo-gold transition-colors">
            {module.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {module.shortDescription}
          </CardDescription>

          <div className="space-y-2">
            <Badge className={getCategoryColor(module.category)}>
              {module.category}
            </Badge>

            <div className="flex flex-wrap gap-1">
              {module.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-slate-50 dark:bg-slate-900"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {module.sectors && module.sectors.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-muted-foreground mb-1">Secteurs :</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {module.sectors.join(' • ')}
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center text-sm text-cyan-600 dark:text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
            Accéder au module
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
