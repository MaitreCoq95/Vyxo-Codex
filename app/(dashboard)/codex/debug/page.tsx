
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function CodexDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const supabase = createClientComponentClient();

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const runDiagnostics = async () => {
    setLogs([]);
    setStatus("loading");
    addLog("Démarrage du diagnostic...");

    try {
      // 1. Check Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(`Auth Error: ${authError.message}`);
      if (!user) throw new Error("Aucun utilisateur connecté.");
      addLog(`✅ Utilisateur identifié: ${user.email} (${user.id})`);

      // 2. Test Insert into codex_quiz_results
      addLog("Tentative d'insertion dans codex_quiz_results...");
      const testResult = {
        user_id: user.id,
        module_id: 'debug-module',
        question_id: 'debug-question',
        is_correct: true,
        time_spent: 10
      };

      const { data: insertData, error: insertError } = await supabase
        .from('codex_quiz_results')
        .insert(testResult)
        .select()
        .single();

      if (insertError) {
        addLog(`❌ Erreur Insert: ${insertError.message} (Code: ${insertError.code})`);
        addLog(`💡 Indice: Si le code est 42501, c'est un problème de permissions RLS.`);
        throw insertError;
      }
      addLog(`✅ Insertion réussie! ID: ${insertData.id}`);

      // 3. Test Read from codex_user_module_scores
      addLog("Tentative de lecture de la vue codex_user_module_scores...");
      const { data: viewData, error: viewError } = await supabase
        .from('codex_user_module_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', 'debug-module');

      if (viewError) {
        addLog(`❌ Erreur Lecture Vue: ${viewError.message}`);
      } else {
        addLog(`✅ Lecture Vue réussie. Lignes trouvées: ${viewData?.length}`);
      }

      // Cleanup (Delete test data)
      addLog("Nettoyage des données de test...");
      await supabase.from('codex_quiz_results').delete().eq('id', insertData.id);
      addLog("✅ Nettoyage terminé.");

      setStatus("success");

    } catch (e: any) {
      addLog(`⛔ DIAGNOSTIC ÉCHOUÉ: ${e.message}`);
      setStatus("error");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛠️ Codex Database Debugger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cet outil va tester la connexion à la base de données Codex et vérifier si les permissions (RLS) sont correctes.
          </p>
          
          <Button onClick={runDiagnostics} disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Test en cours..." : "Lancer le Diagnostic"}
          </Button>

          <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-xs h-64 overflow-y-auto">
            {logs.length === 0 ? <span className="text-slate-500">En attente...</span> : logs.map((log, i) => (
              <div key={i} className="mb-1 border-b border-slate-800 pb-1">{log}</div>
            ))}
          </div>

          {status === "error" && (
            <div className="p-4 bg-red-100 text-red-800 rounded flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Il y a un problème de configuration BDD.</span>
            </div>
          )}
          
          {status === "success" && (
            <div className="p-4 bg-green-100 text-green-800 rounded flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Tout fonctionne correctement ! La BDD est accessible.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
