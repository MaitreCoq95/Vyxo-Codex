"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  Search,
  BookOpen,
  Lightbulb,
  FileText,
  CheckSquare,
  Wrench,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { AISearchResult, KnowledgeItemType } from "@/types/codex";
import Link from "next/link";

const typeIcons: Record<KnowledgeItemType, any> = {
  concept: Lightbulb,
  requirement: FileText,
  checklist: CheckSquare,
  tool: Wrench,
  risk: AlertTriangle,
};

const typeColors: Record<KnowledgeItemType, string> = {
  concept: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  requirement: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  checklist: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  tool: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  risk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function AIAssistant() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      setError("Veuillez entrer au moins 3 caractères");
      return;
    }

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/codex/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data: AISearchResult = await response.json();
      setResult(data);
      setIsExpanded(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <CardTitle className="text-xl">Assistant IA Codex</CardTitle>
              <CardDescription>
                Posez vos questions sur les normes ISO, GDP, GMP, Lean, etc.
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder='Ex: "Explique-moi la clause 8.5 ISO 9001" ou "Quels sont les risques GDP route ?"'
                className="pl-10 bg-white dark:bg-slate-900"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || query.trim().length < 3}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4 pt-4 border-t">
              {/* Answer Summary */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                  <div className="whitespace-pre-wrap">{result.answerSummary}</div>
                </div>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-500" />
                    Sources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white dark:bg-slate-900">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Items */}
              {result.relatedItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Connaissances pertinentes ({result.relatedItems.length})
                  </h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {result.relatedItems.map((item) => {
                      const Icon = typeIcons[item.type];
                      return (
                        <Link
                          key={item.id}
                          href={`/codex/modules/${item.moduleId}#${item.id}`}
                          className="block"
                        >
                          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded ${typeColors[item.type]} shrink-0`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{item.topic}</p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {item.body}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggested Quiz */}
              {result.suggestedQuiz.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Questions de quiz suggérées ({result.suggestedQuiz.length})
                  </h4>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm mb-3">
                      Testez vos connaissances avec {result.suggestedQuiz.length} question{result.suggestedQuiz.length > 1 ? 's' : ''} sur ce sujet.
                    </p>
                    <Link href="/codex/quiz">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Démarrer le quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Related Modules */}
              {result.relatedModules.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-500" />
                    Modules connexes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.relatedModules.map((module) => (
                      <Link key={module.id} href={`/codex/modules/${module.id}`}>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            {module.code && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {module.code}
                              </Badge>
                            )}
                            <p className="font-medium text-sm line-clamp-1">{module.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {module.shortDescription}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Examples */}
          {!result && !isSearching && (
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">💡 Exemples de questions :</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Explique-moi la clause 8.5 ISO 9001",
                  "Quels sont les risques GDP route ?",
                  "Liste-moi les exigences Lean sur le 5S",
                  "Qu'est-ce qu'un Point Critique de Contrôle en HACCP ?"
                ].map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setQuery(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
