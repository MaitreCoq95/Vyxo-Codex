'use client';

import { useTheme } from '@/hooks/use-theme';
import { themes } from '@/lib/themes/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Thème d&apos;affichage</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(themes).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as any)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">{config.name}</div>
                {config.description && (
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                )}
              </div>
              {theme === key && <Check className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
