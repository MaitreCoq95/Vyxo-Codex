"use client";

import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getEtatLabel, getEtatColor, getPrioriteLabel, getPrioriteColor, getImpactLabel, getImpactColor, getThemeColor } from "@/lib/codir-module/utils";
import type { CodirImpact, CodirTheme } from "@/types/codir-module";

interface StatusBadgeProps {
  type: 'decision' | 'action' | 'projet' | 'reunion' | 'priorite' | 'impact' | 'theme';
  value: string | number;
  className?: string;
}

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  let label: string;
  let colorClass: string;

  switch (type) {
    case 'priorite':
      label = getPrioriteLabel(value as number);
      colorClass = getPrioriteColor(value as number);
      break;
    case 'impact':
      label = getImpactLabel(value as CodirImpact);
      colorClass = getImpactColor(value as CodirImpact);
      break;
    case 'theme':
      label = value as string;
      colorClass = getThemeColor(value as CodirTheme);
      break;
    default:
      label = getEtatLabel(value as string, type);
      colorClass = getEtatColor(value as string, type);
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
