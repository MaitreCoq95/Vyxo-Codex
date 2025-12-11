"use client"

import { useState } from "react";
import { knowledgeModules } from "@/lib/codex/modules";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QuizQuestion } from "@/types/codex";

export default function CodexAdminPage() {
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState("10");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);
  const [currentModule, setCurrentModule] = useState("");
  const [logs, setLogs] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);

  const addLog = (type: 'success' | 'error' | 'info', message: string) => {
    setLogs(prev => [...prev, { type, message }]);
  };

  const generateForModule = async (moduleId: string, moduleName: string, count: number, diff: string) => {
    try {
      setCurrentModule(moduleName);

      const response = await fetch('/api/codex/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          moduleName,
          count,
          difficulty: diff === 'mixed' ? 'medium' : diff,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur génération');
      }

      const data = await response.json();
      return data.questions || [];
    } catch (error: any) {
      addLog('error', `❌ ${moduleName}: ${error.message}`);
      return [];
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedQuestions([]);
    setLogs([]);

    const count = parseInt(questionCount) || 10;
    const modules = selectedModule === "all"
      ? knowledgeModules
      : knowledgeModules.filter(m => m.id === selectedModule);

    let allQuestions: QuizQuestion[] = [];
    const totalModules = modules.length;

    addLog('info', `🚀 Génération de ${count} questions pour ${totalModules} module(s)...`);

    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];

      addLog('info', `📚 ${module.title}...`);

      // Si mode mixte, générer des questions de différentes difficultés
      if (difficulty === 'mixed') {
        const easyCount = Math.floor(count * 0.3);
        const mediumCount = Math.floor(count * 0.5);
        const hardCount = count - easyCount - mediumCount;

        const [easy, medium, hard] = await Promise.all([
          easyCount > 0 ? generateForModule(module.id, module.title, easyCount, 'easy') : [],
          mediumCount > 0 ? generateForModule(module.id, module.title, mediumCount, 'medium') : [],
          hardCount > 0 ? generateForModule(module.id, module.title, hardCount, 'hard') : [],
        ]);

        const moduleQuestions = [...easy, ...medium, ...hard];
        allQuestions = [...allQuestions, ...moduleQuestions];

        if (moduleQuestions.length > 0) {
          addLog('success', `✅ ${module.title}: ${moduleQuestions.length} questions générées`);
        }
      } else {
        const moduleQuestions = await generateForModule(module.id, module.title, count, difficulty);
        allQuestions = [...allQuestions, ...moduleQuestions];

        if (moduleQuestions.length > 0) {
          addLog('success', `✅ ${module.title}: ${moduleQuestions.length} questions générées`);
        }
      }

      setProgress(((i + 1) / totalModules) * 100);

      // Pause pour éviter de surcharger l'API
      if (i < modules.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setGeneratedQuestions(allQuestions);
    setIsGenerating(false);
    setCurrentModule("");

    addLog('success', `🎉 Terminé ! ${allQuestions.length} questions générées au total.`);
  };

  const downloadQuestions = () => {
    const dataStr = JSON.stringify(generatedQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codex-questions-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const tsCode = `// Questions générées automatiquement le ${new Date().toLocaleDateString()}
// À ajouter dans lib/codex/questions.ts

export const quizQuestions: QuizQuestion[] = [
  // ... questions existantes

${generatedQuestions.map(q => `  ${JSON.stringify(q, null, 2)},`).join('\n')}
];`;

    navigator.clipboard.writeText(tsCode);
    addLog('success', '📋 Code TypeScript copié dans le presse-papiers !');
  };

  const [isSaving, setIsSaving] = useState(false);

  const saveToDatabase = async () => {
    setIsSaving(true);
    addLog('info', '💾 Sauvegarde dans Supabase...');

    try {
      const { saveQuestionsToSupabase } = await import('@/lib/codex/supabase-questions');
      const result = await saveQuestionsToSupabase(generatedQuestions);

      if (!result.success) {
        throw new Error(result.error || 'Erreur de sauvegarde');
      }

      addLog('success', `✅ ${result.count} questions sauvegardées avec succès dans la base de données !`);
      addLog('info', '✨ Les questions sont maintenant disponibles instantanément dans tous les quiz.');
      addLog('info', '🔄 Astuce : Rechargez la page /codex pour voir les stats mises à jour.');
    } catch (error: any) {
      addLog('error', `❌ Erreur: ${error.message}`);
      addLog('info', '💡 Vérifiez que la table Supabase est bien créée (voir CODEX_SUPABASE_SETUP.md)');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/codex">
          <Button variant="ghost" size="sm" className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Codex
          </Button>
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">
              Générateur IA - Quiz Codex
            </h1>
          </div>
          <p className="text-muted-foreground">
            Générez automatiquement des questions de quiz basées sur les normes ISO, GDP, GMP, CEIV, etc.
          </p>
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            L'IA va générer des questions basées sur le contenu réel des normes et référentiels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Module */}
          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger id="module">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🌐 Tous les modules ({knowledgeModules.length})</SelectItem>
                {knowledgeModules.map(module => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.code ? `${module.code} - ` : ''}{module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre de questions */}
          <div className="space-y-2">
            <Label htmlFor="count">Nombre de questions par module</Label>
            <Select value={questionCount} onValueChange={setQuestionCount}>
              <SelectTrigger id="count">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 questions</SelectItem>
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="15">15 questions</SelectItem>
                <SelectItem value="20">20 questions</SelectItem>
                <SelectItem value="30">30 questions</SelectItem>
                <SelectItem value="50">50 questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulté */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulté</Label>
            <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">🎨 Mixte (30% facile, 50% moyen, 20% difficile)</SelectItem>
                <SelectItem value="easy">😊 Facile</SelectItem>
                <SelectItem value="medium">🤔 Moyen</SelectItem>
                <SelectItem value="hard">🔥 Difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimation */}
          <Alert>
            <AlertDescription>
              <strong>Estimation :</strong>{' '}
              {selectedModule === 'all'
                ? `${knowledgeModules.length * parseInt(questionCount || '10')} questions au total`
                : `${questionCount} questions`}
              {' '}• Durée estimée : {Math.ceil((selectedModule === 'all' ? knowledgeModules.length : 1) * 0.5)} min
            </AlertDescription>
          </Alert>

          {/* Bouton Generate */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Générer les questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Progress */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
            <CardDescription>{currentModule || 'Initialisation...'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complété
            </p>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, i) => (
                <div key={i} className={
                  log.type === 'success' ? 'text-green-600' :
                  log.type === 'error' ? 'text-red-600' :
                  'text-slate-600'
                }>
                  {log.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Questions générées ({generatedQuestions.length})
            </CardTitle>
            <CardDescription>
              Exportez ou copiez ces questions dans votre code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Bouton principal */}
              <Button
                onClick={saveToDatabase}
                disabled={isSaving}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sauvegarde en cours...
                  </>
                ) : (
                  <>
                    💾 Sauvegarder dans la base de données
                  </>
                )}
              </Button>

              {/* Boutons secondaires */}
              <div className="flex gap-3">
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  📋 Copier le code
                </Button>
                <Button onClick={downloadQuestions} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger JSON
                </Button>
              </div>
            </div>

            {/* Aperçu */}
            <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 max-h-96 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-3">Aperçu des questions :</p>
              {generatedQuestions.slice(0, 3).map((q, i) => (
                <div key={i} className="mb-4 pb-4 border-b last:border-0">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {q.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-mono">
                      {q.moduleId}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm mb-2">{q.question}</p>
                  <div className="space-y-1">
                    {q.choices.map((choice, j) => (
                      <div key={j} className={`text-xs pl-3 ${j === q.correctIndex ? 'text-green-600 font-medium' : 'text-slate-600'}`}>
                        {j === q.correctIndex ? '✓' : '○'} {choice}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {generatedQuestions.length > 3 && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  ... et {generatedQuestions.length - 3} autres questions
                </p>
              )}
            </div>

            {/* Instructions */}
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <AlertDescription>
                <strong>✨ Sauvegarde automatique (recommandée) :</strong><br />
                1. Cliquez sur le bouton vert <strong>"💾 Sauvegarder dans la base de données"</strong><br />
                2. Les questions sont sauvegardées dans Supabase<br />
                3. <strong>Instantanément disponibles</strong> dans tous les quiz (aucun redéploiement nécessaire) !<br />
                <br />
                <span className="text-xs text-muted-foreground">
                  Alternative : Utilisez "📋 Copier le code" ou "Télécharger JSON" si Supabase n'est pas configuré
                </span>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
