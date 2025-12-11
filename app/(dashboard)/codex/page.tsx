"use client"

import { useState, useMemo } from "react";
import { knowledgeModules, searchModules } from "@/lib/codex/modules";
import { ModuleCard } from "@/components/codex/module-card";
import { AIAssistant } from "@/components/codex/ai-assistant";
import { XPBar } from "@/components/codex/xp-bar";
import { ScoreDashboard } from "@/components/codex/score-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Dices, BookOpen, Sparkles, GraduationCap, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnowledgeCategory } from "@/types/codex";

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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">
              Vyxo Codex
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Votre base de connaissances pour maîtriser les normes ISO, GDP, GMP, CEIV et l'excellence opérationnelle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/codex/learning">
            <Button variant="outline" className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950">
              <GraduationCap className="mr-2 h-4 w-4" />
              Parcours
            </Button>
          </Link>
          <Link href="/codex/audit-sim">
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Audit
            </Button>
          </Link>
          <Link href="/codex/admin">
            <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
              <Sparkles className="mr-2 h-4 w-4" />
              Admin IA
            </Button>
          </Link>
          <Link href="/codex/quiz">
            <Button className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 font-medium">
              <Dices className="mr-2 h-4 w-4" />
              Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {stats.totalModules}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-cyan-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Catégories</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {stats.categories}
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
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
      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">
              Aucun module trouvé. Essayez d'ajuster vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredModules.length} module{filteredModules.length > 1 ? 's' : ''} trouvé{filteredModules.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
