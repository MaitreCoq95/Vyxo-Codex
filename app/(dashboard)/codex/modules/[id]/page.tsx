"use client"

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getModuleById } from "@/lib/codex/modules";
import { getItemsByModule, groupItemsByType, searchItems } from "@/lib/codex/items";
import { getAllQuestionsByModule } from "@/lib/codex/all-questions";
import { KnowledgeItemCard } from "@/components/codex/knowledge-item-card";
import { ModuleScoreCard } from "@/components/codex/module-score-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertTriangle,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { KnowledgeItemType, QuizQuestion } from "@/types/codex";

const typeIcons: Record<KnowledgeItemType, any> = {
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
  const router = useRouter();
  const moduleId = params.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("knowledge");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Récupération des données
  const module = getModuleById(moduleId);
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

  if (!module) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground mb-4">Module non trouvé</p>
            <Link href="/codex">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au Codex
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/codex">
          <Button variant="ghost" size="sm" className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Codex
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-cyan-500" />
              {module.code && (
                <Badge variant="outline" className="font-mono">
                  {module.code}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white mb-2">
              {module.title}
            </h1>
            <p className="text-muted-foreground">
              {module.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {module.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-slate-50 dark:bg-slate-900">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connaissances</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {allItems.length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-cyan-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Questions Quiz</p>
                <p className="text-2xl font-bold text-vyxo-navy dark:text-white">
                  {questionsLoading ? "..." : questions.length}
                </p>
              </div>
              <Dices className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Score du module */}
        <ModuleScoreCard moduleId={moduleId} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">
            <Brain className="mr-2 h-4 w-4" />
            Connaissances
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Dices className="mr-2 h-4 w-4" />
            Quiz
          </TabsTrigger>
        </TabsList>

        {/* Onglet Connaissances */}
        <TabsContent value="knowledge" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les connaissances..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Items */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucune connaissance trouvée pour cette recherche." : "Aucune connaissance disponible pour ce module."}
                </p>
              </CardContent>
            </Card>
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
                      <h3 className="text-lg font-semibold">{label}</h3>
                      <Badge variant="outline" className="ml-2">
                        {items.length}
                      </Badge>
                    </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Quiz disponibles</CardTitle>
              <CardDescription>
                Testez vos connaissances sur {module.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Quiz aléatoire</p>
                  <p className="text-sm text-muted-foreground">
                    {questions.length} questions disponibles
                  </p>
                </div>
                <Link href={`/codex/quiz?moduleId=${moduleId}`}>
                  <Button>
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
                    Les questions seront bientôt générées via l'assistant IA.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
