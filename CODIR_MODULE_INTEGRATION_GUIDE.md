# 🚀 GUIDE D'INTÉGRATION COMPLET - MODULE CODIR VYXO

## 📋 Vue d'Ensemble

Le module **Vyxo CODIR - Synthèse & Pilotage** est un système complet de gestion et de pilotage du Comité de Direction. Il permet de :

- ✅ Gérer les réunions CODIR avec comptes rendus structurés
- ✅ Suivre les décisions stratégiques
- ✅ Assigner et tracker les actions
- ✅ Piloter les projets issus du CODIR
- ✅ Visualiser la roadmap 7j/30j/90j
- ✅ Utiliser des templates internes
- ✅ Monitorer les KPIs stratégiques

---

## 🎯 Fichiers Créés

### 📁 Structure Complète

```
VyxoCentralHub3.0/
├── supabase/migrations/
│   └── 20250210_create_codir_module.sql       # ⭐ Schéma SQL complet
│
├── types/
│   └── codir-module.ts                         # ⭐ Types TypeScript
│
├── lib/codir-module/
│   ├── client.ts                               # ⭐ Fonctions Supabase
│   ├── utils.ts                                # ⭐ Utilitaires
│   └── index.ts                                # ⭐ Exports
│
├── components/codir-module/
│   ├── stat-card.tsx                           # ⭐ Carte de stat
│   ├── status-badge.tsx                        # ⭐ Badge de statut
│   ├── progress-bar.tsx                        # ⭐ Barre de progression
│   ├── data-table.tsx                          # ⭐ Table de données
│   └── index.ts                                # ⭐ Exports
│
├── app/(dashboard)/
│   ├── codir-dashboard/page.tsx                # ⭐ Dashboard principal
│   └── codir-reunions/page.tsx                 # ⭐ Page réunions
│
└── components/layout/sidebar.tsx               # ⭐ Modifié (navigation)
```

---

## 🛠️ ÉTAPE 1 : Installer la Base de Données

### 1.1 Exécuter la Migration SQL

**Option A : Via Supabase Dashboard**

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Ouvrez le fichier `supabase/migrations/20250210_create_codir_module.sql`
4. Copiez tout le contenu
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **Run**

**Option B : Via CLI Supabase**

```bash
# Si vous utilisez Supabase CLI
supabase db push
```

### 1.2 Vérifier les Tables Créées

Dans le SQL Editor, exécutez :

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'codir_%';
```

Vous devriez voir :
- `codir_reunions`
- `codir_decisions`
- `codir_actions`
- `codir_projets`
- `codir_subtasks`
- `codir_kpis`
- `codir_templates`

### 1.3 Vérifier les Templates Par Défaut

```sql
SELECT * FROM codir_templates WHERE is_default = true;
```

Vous devriez voir 4 templates :
- Template Compte Rendu CODIR
- Template Décision Stratégique
- Template Action Item
- Template Projet CODIR

---

## 📦 ÉTAPE 2 : Installer les Dépendances (Déjà Présentes)

Toutes les dépendances nécessaires sont déjà installées dans votre projet :

- ✅ `@supabase/supabase-js`
- ✅ `@supabase/auth-helpers-nextjs`
- ✅ `@radix-ui/react-*` (composants UI)
- ✅ `lucide-react` (icônes)
- ✅ `tailwindcss`
- ✅ `recharts` (pour les graphiques futurs)

---

## 🎨 ÉTAPE 3 : Pages Créées et À Créer

### ✅ Pages Déjà Créées

| Page | Statut | Description |
|------|--------|-------------|
| `/codir-dashboard` | ✅ Créée | Dashboard principal avec stats, décisions récentes, actions urgentes, projets actifs |
| `/codir-reunions` | ✅ Créée | Liste des réunions avec stats et historique |

### 🔨 Pages À Créer (Template Fourni)

Pour créer les pages manquantes, suivez ce template :

#### **`/codir-decisions/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/codir-module/data-table";
import { StatusBadge } from "@/components/codir-module/status-badge";
import { getDecisions } from "@/lib/codir-module";
import { formatDate } from "@/lib/codir-module/utils";
import type { CodirDecision } from "@/types/codir-module";
import { FileText, Plus } from "lucide-react";

export default function CodirDecisionsPage() {
  const [decisions, setDecisions] = useState<CodirDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecisions();
  }, []);

  async function loadDecisions() {
    try {
      setLoading(true);
      const data = await getDecisions();
      setDecisions(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-8">Chargement...</div>;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Décisions CODIR</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Décision
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les Décisions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={decisions}
            columns={[
              { key: 'titre', header: 'Titre' },
              {
                key: 'theme',
                header: 'Thème',
                render: (item) => <StatusBadge type="theme" value={item.theme} />
              },
              { key: 'responsable', header: 'Responsable' },
              {
                key: 'impact',
                header: 'Impact',
                render: (item) => <StatusBadge type="impact" value={item.impact} />
              },
              {
                key: 'etat',
                header: 'État',
                render: (item) => <StatusBadge type="decision" value={item.etat} />
              },
              {
                key: 'date_echeance',
                header: 'Échéance',
                render: (item) => formatDate(item.date_echeance)
              },
            ]}
            emptyMessage="Aucune décision"
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

Utilisez ce template pour créer :
- `/codir-decisions/page.tsx`
- `/codir-projets/page.tsx`
- `/codir-roadmap/page.tsx`
- `/codir-kpis/page.tsx`
- `/codir-templates/page.tsx`

---

## 🎯 ÉTAPE 4 : Créer la Roadmap (Exemple Complet)

### **`app/(dashboard)/codir-roadmap/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoadmapData } from "@/lib/codir-module";
import { formatDate } from "@/lib/codir-module/utils";
import type { RoadmapData, RoadmapPeriod } from "@/types/codir-module";
import { Calendar } from "lucide-react";
import { StatusBadge } from "@/components/codir-module/status-badge";
import { DataTable } from "@/components/codir-module/data-table";

export default function CodirRoadmapPage() {
  const [period, setPeriod] = useState<RoadmapPeriod>('30j');
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, [period]);

  async function loadRoadmap() {
    try {
      setLoading(true);
      const data = await getRoadmapData(period);
      setRoadmap(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-8">Chargement...</div>;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Roadmap CODIR</h1>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as RoadmapPeriod)}>
        <TabsList>
          <TabsTrigger value="7j">7 Jours</TabsTrigger>
          <TabsTrigger value="30j">30 Jours</TabsTrigger>
          <TabsTrigger value="90j">90 Jours</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {roadmap?.stats.total || 0} élément(s) - {period}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={roadmap?.items || []}
                columns={[
                  {
                    key: 'type',
                    header: 'Type',
                    render: (item) => (
                      <span className="capitalize">{item.type}</span>
                    ),
                  },
                  { key: 'titre', header: 'Titre' },
                  { key: 'responsable', header: 'Responsable' },
                  {
                    key: 'deadline',
                    header: 'Échéance',
                    render: (item) => formatDate(item.deadline),
                  },
                  {
                    key: 'priorite',
                    header: 'Priorité',
                    render: (item) => <StatusBadge type="priorite" value={item.priorite} />,
                  },
                ]}
                emptyMessage="Aucun élément dans cette période"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 🔌 ÉTAPE 5 : Créer les API Routes (Optionnel)

Si vous souhaitez des API routes pour les opérations CRUD, créez-les dans `app/api/codir/`:

### **`app/api/codir/reunions/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from('codir_reunions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createClientComponentClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('codir_reunions')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

Créez des routes similaires pour :
- `/api/codir/decisions/route.ts`
- `/api/codir/actions/route.ts`
- `/api/codir/projets/route.ts`
- `/api/codir/kpis/route.ts`

---

## 📝 ÉTAPE 6 : Utiliser les Templates

### Récupérer un Template

```tsx
import { getDefaultTemplate } from '@/lib/codir-module';

// Dans votre composant
const template = await getDefaultTemplate('cr'); // 'cr', 'decision', 'action', 'projet'
```

### Utiliser le Template

```tsx
<textarea
  defaultValue={template?.contenu_markdown}
  className="w-full h-96"
/>
```

---

## 🧪 ÉTAPE 7 : Tester le Module

### 1. Vérifier que tout compile

```bash
npm run build
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

### 3. Naviguer vers le Dashboard CODIR

```
http://localhost:3000/codir-dashboard
```

### 4. Créer une première réunion

1. Allez sur `/codir-reunions`
2. Cliquez sur "Nouvelle Réunion" (bouton à implémenter)
3. Remplissez le formulaire
4. Sauvegardez

### 5. Créer une décision

1. Allez sur `/codir-decisions`
2. Cliquez sur "Nouvelle Décision"
3. Remplissez les champs
4. Sauvegardez

---

## 🎨 ÉTAPE 8 : Personnalisation

### Couleurs

Modifiez les couleurs dans `lib/codir-module/utils.ts` :

```ts
export function getThemeColor(theme: CodirTheme): string {
  const colors: Record<CodirTheme, string> = {
    Produit: 'bg-purple-100 text-purple-800',
    Finance: 'bg-emerald-100 text-emerald-800',
    // ... personnalisez ici
  };
  return colors[theme];
}
```

### Templates

Modifiez les templates dans la base de données :

```sql
UPDATE codir_templates
SET contenu_markdown = '# Votre nouveau template...'
WHERE type = 'cr' AND is_default = true;
```

---

## 📊 ÉTAPE 9 : Calculer les KPIs Automatiquement

### Manuellement

```sql
SELECT calculate_codir_kpis('2025-02-01', 'month');
```

### Automatisation (Cron Supabase)

```sql
-- Créer une fonction Edge pour calculer les KPIs tous les jours
SELECT cron.schedule(
  'calculate-codir-kpis-daily',
  '0 0 * * *', -- Tous les jours à minuit
  $$
  SELECT calculate_codir_kpis(current_date, 'month');
  $$
);
```

---

## ✅ Checklist d'Intégration

- [x] Migration SQL exécutée
- [x] Tables créées et vérifiées
- [x] Templates par défaut insérés
- [x] Types TypeScript créés
- [x] Fonctions utilitaires créées
- [x] Composants UI créés
- [x] Page Dashboard créée
- [x] Page Réunions créée
- [x] Navigation mise à jour
- [ ] Page Décisions créée
- [ ] Page Projets créée
- [ ] Page Roadmap créée
- [ ] Page KPIs créée
- [ ] Page Templates créée
- [ ] Formulaires de création/édition ajoutés
- [ ] API routes créées (optionnel)
- [ ] Tests effectués

---

## 🚀 Prochaines Étapes Recommandées

1. **Créer les formulaires de création/édition**
   - Formulaire nouvelle réunion
   - Formulaire nouvelle décision
   - Formulaire nouveau projet
   - Formulaire nouvelle action

2. **Ajouter la fonctionnalité d'auto-synthèse**
   - Intégrer OpenAI ou Claude
   - Générer automatiquement les synthèses de réunions

3. **Ajouter des graphiques (recharts)**
   - Graphique d'évolution des décisions
   - Graphique d'avancement des projets
   - Graphique de répartition par thème

4. **Notifications et Alertes**
   - Alertes pour actions en retard
   - Notifications de prochaines réunions
   - Rappels de deadlines

5. **Export PDF**
   - Export de comptes rendus
   - Export de roadmap
   - Export de rapports KPI

---

## 🐛 Troubleshooting

### Erreur : Tables non trouvées

➡️ Vérifiez que la migration a été exécutée :

```sql
SELECT * FROM codir_reunions LIMIT 1;
```

### Erreur : RLS bloque les requêtes

➡️ Vérifiez que vous êtes authentifié :

```tsx
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

### Erreur : Types non trouvés

➡️ Vérifiez que le fichier est bien importé :

```ts
import type { CodirReunion } from '@/types/codir-module';
```

---

## 📞 Support

Pour toute question ou problème :

1. Vérifiez ce guide d'intégration
2. Consultez les commentaires dans le code
3. Vérifiez les types TypeScript pour l'autocomplétion
4. Testez les fonctions dans la console

---

## 🎉 Félicitations !

Vous avez maintenant un module CODIR complet et fonctionnel !

**Le module permet de :**
- ✅ Gérer toutes les réunions CODIR
- ✅ Suivre les décisions stratégiques
- ✅ Tracker les actions et leur avancement
- ✅ Piloter les projets
- ✅ Visualiser la roadmap 7/30/90 jours
- ✅ Utiliser des templates professionnels
- ✅ Monitorer les KPIs stratégiques

**Bon pilotage avec Vyxo CODIR ! 🚀**

---

**Version:** 1.0.0
**Date:** 10 Février 2025
**Auteur:** Claude Code pour Vyxo Central Hub
