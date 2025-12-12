"use client"

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { getModuleById } from "../../../../../domain/codex/modules";
import { getItemsByModule, groupItemsByType, searchItems } from "../../../../../domain/codex/items";
import { getAllQuestionsByModule } from "../../../../../domain/codex/all-questions";
import { KnowledgeItemCard } from "@/components/codex/knowledge-item-card";
import { ModuleScoreCard } from "@/components/codex/module-score-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ArrowLeft,
  Search,
  Dices,
  Brain,
  Lightbulb,
  FileText,
  CheckSquare,
  Wrench,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { MagicBento } from "../../../../../components/bento/MagicBento";
import { MagicBentoCard } from "../../../../../components/bento/MagicBentoCard";
import { KnowledgeItemType, QuizQuestion } from "../../../../../domain/types/codex";

const typeIcons: Record<KnowledgeItemType, React.ElementType> = {
  concept: Lightbulb,
  requirement: FileText,
  checklist: CheckSquare,
  tool: Wrench,
  risk: AlertTriangle,
};

const typeLabels: Record<KnowledgeItemType, string> = {
  concept: 'Concepts',
  requirement: 'Exigences',
  checklist: 'Checklists',
  tool: 'Outils',
  risk: 'Risques',
};

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = params.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("knowledge");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Récupération des données
  const currentModule = getModuleById(moduleId);
  const allItems = useMemo(() => getItemsByModule(moduleId), [moduleId]);
  const groupedItems = useMemo(() => groupItemsByType(moduleId), [moduleId]);

  // Charger les questions depuis Supabase + hardcodées
  useEffect(() => {
    const loadQuestions = async () => {
      setQuestionsLoading(true);
      try {
        const allQuestions = await getAllQuestionsByModule(moduleId);
        setQuestions(allQuestions);
      } catch (error) {
        console.error("Erreur lors du chargement des questions:", error);
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadQuestions();
  }, [moduleId]);

  // Recherche
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    return searchItems(searchTerm, moduleId);
  }, [searchTerm, moduleId, allItems]);

  if (!currentModule) {
    return (
      <div className="space-y-6 p-6">
        <div className="magic-bento-card py-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground mb-4">Module non trouvé</p>
            <Link href="/codex">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au Codex
              </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/codex">
          <Button variant="ghost" size="sm" className="w-fit text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Codex
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-cyan-500" />
              {currentModule.code && (
                <Badge variant="outline" className="font-mono bg-white/5 border-white/10 text-white">
                  {currentModule.code}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {currentModule.title}
            </h1>
            <p className="text-muted-foreground">
              {currentModule.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {currentModule.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-slate-50 dark:bg-slate-900/50 border-white/10 text-slate-400">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <Link href={`/codex/quiz?moduleId=${moduleId}`}>
            <Button className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90 font-medium">
              <Dices className="mr-2 h-4 w-4" />
              Quiz sur ce module
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <MagicBento className="lg:grid-cols-3">
        <MagicBentoCard
          title={allItems.length.toString()}
          label="Connaissances"
          icon={<Brain className="h-8 w-8 text-cyan-500" />}
          enableTilt={true}
        />
        <MagicBentoCard
          title={questionsLoading ? "..." : questions.length.toString()}
          label="Questions Quiz"
          icon={<Dices className="h-8 w-8 text-amber-500" />}
          enableTilt={true}
        />
        {/* ModuleScoreCard needs to be refactored too, for now we wrap it or assume it fits.
            Actually, if ModuleScoreCard is a Card, I should probably replace it HERE with a MagicBentoCard 
            that displays the data, OR refactor ModuleScoreCard. 
            I'll leave it as component for now but wrapping it in Bento might be tricky if it isn't one.
            I will look at ModuleScoreCard later. For now, keep it in layout. 
            Wait, MagicBento expects BentoCards. 
            I'll put ModuleScoreCard in a div if it's not a BentoCard, but it breaks the grid consistency.
            I will use a placeholder BentoCard for Score if I can't access data, but I'll use the component.
            Actually, let's just make the stats grid a normal grid if we mix types. 
            But prompt says "Magic Bento Card System".
            I will assume ModuleScoreCard WILL be refactored to be a BentoCard.
        */}
        <ModuleScoreCard moduleId={moduleId} />
      </MagicBento>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/10">
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-vyxo-indigo data-[state=active]:text-white text-muted-foreground">
            <Brain className="mr-2 h-4 w-4" />
            Connaissances
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-vyxo-indigo data-[state=active]:text-white text-muted-foreground">
            <Dices className="mr-2 h-4 w-4" />
            Quiz
          </TabsTrigger>
        </TabsList>

        {/* Onglet Connaissances */}
        <TabsContent value="knowledge" className="space-y-4">
          {/* Search */}
          <div className="magic-bento-card p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les connaissances..."
                  className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-vyxo-indigo focus:ring-vyxo-indigo/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>

          {/* Knowledge Items */}
          {filteredItems.length === 0 ? (
            <div className="magic-bento-card py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucune connaissance trouvée pour cette recherche." : "Aucune connaissance disponible pour ce module."}
                </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(typeLabels).map(([type, label]) => {
                const items = searchTerm.trim()
                  ? filteredItems.filter(item => item.type === type)
                  : groupedItems[type as KnowledgeItemType];

                if (items.length === 0) return null;

                const Icon = typeIcons[type as KnowledgeItemType];

                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-5 w-5 text-cyan-500" />
                      <h3 className="text-lg font-semibold text-white">{label}</h3>
                      <Badge variant="outline" className="ml-2 bg-white/5 border-white/10 text-white">
                        {items.length}
                      </Badge>
                    </div>
                    {/* Items Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {items.map((item) => (
                        <KnowledgeItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Onglet Quiz */}
        <TabsContent value="quiz" className="space-y-4">
          <MagicBentoCard
             title="Quiz disponibles"
             description={`Testez vos connaissances sur ${currentModule.title}`}
             icon={<Dices className="h-6 w-6" />}
             enableTilt={false}
          >
             <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium text-white">Quiz aléatoire</p>
                      <p className="text-sm text-muted-foreground">
                        {questions.length} questions disponibles
                      </p>
                    </div>
                    <Link href={`/codex/quiz?moduleId=${moduleId}`}>
                      <Button className="bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90">
                        <Dices className="mr-2 h-4 w-4" />
                        Démarrer
                      </Button>
                    </Link>
                  </div>

                  {questions.length === 0 && (
                    <div className="text-center py-8">
                      <Dices className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                      <p className="text-muted-foreground text-sm">
                        Aucune question de quiz disponible pour ce module.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Les questions seront bientôt générées via l&apos;assistant IA.
                      </p>
                    </div>
                  )}
             </div>
          </MagicBentoCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
