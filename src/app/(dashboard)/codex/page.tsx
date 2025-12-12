"use client"

import { useState, useMemo } from "react";
import { knowledgeModules, searchModules } from "../../../domain/codex/modules";
import { ModuleCard } from "../../../components/codex/module-card";
import { AIAssistant } from "../../../components/codex/ai-assistant";
import { XPBar } from "../../../components/codex/xp-bar";
import { ScoreDashboard } from "../../../components/codex/score-dashboard";
import { EnhancedBentoCard } from "@/components/ui/enhanced-bento-card";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Sparkles, GraduationCap, ClipboardCheck, Dices } from "lucide-react";
import Link from "next/link";
import { MagicBento } from "../../../components/bento/MagicBento";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function CodexDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filtrage des modules
  const filteredModules = useMemo(() => {
    let modules = knowledgeModules;

    // Filtre par recherche
    if (searchTerm.trim()) {
      modules = searchModules(searchTerm);
    }

    // Filtre par catégorie
    if (categoryFilter !== "all") {
      modules = modules.filter(m => m.category === categoryFilter);
    }

    return modules;
  }, [searchTerm, categoryFilter]);

  // Statistiques
  const stats = {
    totalModules: knowledgeModules.length,
    categories: Array.from(new Set(knowledgeModules.map(m => m.category))).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Vyxo Codex
                </h1>
              </div>
              <p className="text-muted-foreground mt-1">
                Votre base de connaissances pour maîtriser les normes ISO, GDP, GMP, CEIV et l&apos;excellence opérationnelle.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ThemeSwitcher />
              <Link href="/codex/learning">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-card-hover transition-colors flex items-center gap-2 bg-card text-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Parcours
                </button>
              </Link>
              <Link href="/codex/audit-sim">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-card-hover transition-colors flex items-center gap-2 bg-card text-foreground">
                  <ClipboardCheck className="h-4 w-4" />
                  Audit
                </button>
              </Link>
              <Link href="/codex/admin">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-card-hover transition-colors flex items-center gap-2 bg-card text-foreground">
                  <Sparkles className="h-4 w-4" />
                  Admin IA
                </button>
              </Link>
              <Link href="/codex/quiz">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium">
                  <Dices className="h-4 w-4" />
                  Quiz
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* XP Bar */}
        <XPBar />

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Modules Actifs"
            value={stats.totalModules.toString()}
            icon={BookOpen}
            color="primary"
          />
          <StatsCard
            title="Catégories"
            value={stats.categories.toString()}
            icon={Sparkles}
            color="secondary"
          />
          <StatsCard
            title="Parcours"
            value="12"
            icon={GraduationCap}
            color="primary"
          />
          <StatsCard
            title="Complétion"
            value="85%"
            icon={ClipboardCheck}
            color="success"
          />
        </div>

        {/* AI Assistant & Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIAssistant />
          </div>
          <div>
            <ScoreDashboard />
          </div>
        </div>

        {/* Search and Filter */}
        <EnhancedBentoCard
          title="Rechercher un module"
          description="Filtrez par mot-clé ou catégorie"
          icon={Search}
          iconColor="primary"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un module, tag ou mot-clé..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="ISO">ISO</SelectItem>
                <SelectItem value="Pharma">Pharma</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="ExOp">Excellence Opérationnelle</SelectItem>
                <SelectItem value="ITSec">IT & Sécurité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </EnhancedBentoCard>

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <EnhancedBentoCard
            title="Aucun module trouvé"
            description="Essayez d'ajuster vos critères de recherche"
            icon={BookOpen}
            iconColor="primary"
          >
            <div className="py-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">
                Aucun module trouvé. Essayez d&apos;ajuster vos critères de recherche.
              </p>
            </div>
          </EnhancedBentoCard>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredModules.length} module{filteredModules.length > 1 ? 's' : ''} trouvé{filteredModules.length > 1 ? 's' : ''}
              </p>
            </div>

            <MagicBento className="lg:grid-cols-3">
              {filteredModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </MagicBento>
          </>
        )}
      </div>
    </div>
  );
}
