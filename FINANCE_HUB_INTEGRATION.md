# 📊 Vyxo Finance Hub - Guide d'Intégration

## Vue d'ensemble

**Vyxo Finance Hub** est un module complet de pilotage financier pour Vyxo Central Hub. Il offre un cockpit CFO avec analyse financière, reporting automatisé, prévisions, détection d'anomalies et assistant IA.

---

## 🎯 Fonctionnalités

### 1. Dashboard CFO
- KPIs financiers clés (CA, marges, résultat net, EBITDA)
- KPIs de trésorerie (cash disponible, forecast 30/60/90j)
- KPIs BFR (DSO, DPO, DIO, WC days)
- Ratios financiers (current ratio, quick ratio, debt-to-equity)
- Graphiques de tendances sur 12 mois
- Top 5 produits par rentabilité

### 2. P&L (Compte de Résultat)
- Tableau détaillé Réel vs Budget vs Forecast
- Calcul automatique des écarts et variations
- Identification des surperformances / sous-performances
- Drill-down par catégorie et sous-catégorie

### 3. Cash Flow & Trésorerie
- Flux opérationnels, d'investissement et de financement
- Prévisions de trésorerie 30/60/90 jours
- Graphique d'évolution du cash

### 4. Bilan Simplifié
- Actifs courants / non courants
- Passifs court / long terme
- Capitaux propres
- Calcul automatique des ratios

### 5. BFR & Indicateurs de Rotation
- DSO, DPO, DIO
- BFR global en jours
- Alertes selon seuils

### 6. Unit Economics
- Rentabilité par produit / service
- Marges de contribution et marges nettes
- Points morts / seuils de rentabilité
- Ranking par profitabilité

### 7. Analyse des Écarts
- Comparaison Réel / Budget / Forecast
- Identification des plus gros écarts
- Tags visuels de performance

### 8. Scénarios & Analyse de Sensibilité
- Création de scénarios (pessimiste / réaliste / optimiste)
- Simulation de variations (CA, coûts, BFR)
- Projection automatique des KPIs

### 9. Assistant IA Finance
- Questions en langage naturel
- Réponses contextualisées
- Suggestions d'analyses
- Historique des conversations

### 10. Détection d'Anomalies
- Ruptures de tendance
- Variations anormales de marge
- Données manquantes ou incohérentes
- Classification par sévérité
- Suivi et résolution

---

## 📁 Structure du Module

```
vyxo-central-hub/
├── app/
│   ├── api/finance/
│   │   ├── dashboard/route.ts        # API Dashboard CFO
│   │   ├── pl/route.ts                # API P&L
│   │   ├── cashflow/route.ts          # API Cash Flow
│   │   ├── scenarios/route.ts         # API Scénarios
│   │   ├── anomalies/route.ts         # API Anomalies
│   │   └── ai-assistant/route.ts      # API Assistant IA
│   └── (dashboard)/finance/
│       ├── layout.tsx                 # Layout avec navigation
│       ├── page.tsx                   # Dashboard principal
│       ├── pl/page.tsx                # Page P&L
│       ├── scenarios/page.tsx         # Page Scénarios
│       └── assistant/page.tsx         # Page Assistant IA
│
├── components/finance/
│   ├── kpi-card.tsx                   # Carte KPI
│   ├── cfo-dashboard.tsx              # Dashboard CFO
│   ├── pl-chart.tsx                   # Graphique P&L
│   ├── cashflow-chart.tsx             # Graphique Cash Flow
│   ├── top-products-table.tsx         # Table top produits
│   ├── anomalies-list.tsx             # Liste anomalies
│   ├── pl-table.tsx                   # Table P&L détaillée
│   ├── ai-assistant.tsx               # Assistant IA
│   └── scenario-simulator.tsx         # Simulateur scénarios
│
├── lib/finance/
│   ├── supabase-client.ts             # Client Supabase
│   ├── seed-data.sql                  # Seeds SQL
│   └── mock-data.ts                   # Données mockées
│
├── types/finance.ts                   # Types TypeScript
│
└── supabase-finance-schema.sql        # Schéma BDD complet
```

---

## 🗄️ Installation de la Base de Données

### 1. Exécuter le Schéma SQL

Connectez-vous à votre instance Supabase et exécutez le fichier :

```bash
supabase-finance-schema.sql
```

Ou via le Dashboard Supabase :
1. Allez dans **SQL Editor**
2. Collez le contenu du fichier `supabase-finance-schema.sql`
3. Exécutez le script

### 2. Insérer les Données de Test (optionnel)

Exécutez le fichier de seeds :

```bash
lib/finance/seed-data.sql
```

**Important** : Remplacez `'your-user-id-here'` par un UUID utilisateur valide avant l'exécution.

### 3. Vérifier les Tables

Vérifiez que les tables suivantes ont été créées :

- `finance_companies`
- `finance_periods`
- `finance_pl_entries`
- `finance_cashflow_entries`
- `finance_balance_entries`
- `finance_unit_economics`
- `finance_kpi_snapshots`
- `finance_scenarios`
- `finance_anomalies`
- `finance_ai_conversations`

---

## 🔧 Configuration de l'Application

### 1. Variables d'Environnement

Assurez-vous que les variables Supabase sont configurées dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Ajouter Finance Hub à la Navigation

Modifiez votre fichier de navigation principal (ex: `components/layout/sidebar.tsx`) pour ajouter Vyxo Finance Hub :

```tsx
import { TrendingUp } from 'lucide-react'

const navigation = [
  // ... autres modules
  {
    name: 'Finance Hub',
    href: '/finance',
    icon: TrendingUp,
  },
]
```

### 3. Adapter les Company IDs

Dans les fichiers suivants, remplacez `'default-company-id'` par la logique de récupération du company_id depuis votre système d'auth :

- `app/(dashboard)/finance/page.tsx`
- `app/(dashboard)/finance/pl/page.tsx`
- `app/(dashboard)/finance/scenarios/page.tsx`
- `app/(dashboard)/finance/assistant/page.tsx`

Exemple :

```tsx
// Récupérer depuis la session utilisateur
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
const { data: { user } } = await supabase.auth.getUser()
const companyId = user?.user_metadata?.company_id || 'default'
```

---

## 🚀 Utilisation

### Accès au Module

Une fois intégré, accédez au Finance Hub via :

```
http://localhost:3000/finance
```

### Navigation

Le module Finance Hub propose une navigation dédiée :

- **Dashboard** : Vue d'ensemble CFO
- **P&L** : Compte de résultat détaillé
- **Cash Flow** : Flux de trésorerie
- **Scénarios** : Simulateur de projections
- **Anomalies** : Alertes et détections
- **Assistant IA** : Questions / réponses

### Workflow Typique

1. **Consulter le Dashboard** pour avoir une vue d'ensemble
2. **Analyser le P&L** pour comprendre la performance
3. **Vérifier les Anomalies** pour identifier les points d'attention
4. **Simuler des Scénarios** pour planifier l'avenir
5. **Interroger l'Assistant IA** pour des insights rapides

---

## 🔌 Intégration de l'IA

### Configuration OpenAI / Claude

Pour activer l'assistant IA avec un vrai modèle :

1. Installez le SDK :

```bash
npm install openai
# ou
npm install @anthropic-ai/sdk
```

2. Modifiez `app/api/finance/ai-assistant/route.ts` :

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateAIResponse(question: string, context: any) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Tu es un assistant CFO expert en analyse financière.',
      },
      {
        role: 'user',
        content: `Contexte: ${JSON.stringify(context)}\n\nQuestion: ${question}`,
      },
    ],
  })

  return {
    answer: completion.choices[0].message.content || '',
    suggestions: [], // Extraire des suggestions depuis la réponse
    confidence_score: 0.9,
  }
}
```

3. Ajoutez la variable d'environnement :

```env
OPENAI_API_KEY=sk-...
```

---

## 📊 Calcul des KPIs

### Calcul Automatique

La fonction SQL `calculate_kpi_snapshot` peut être appelée pour générer automatiquement un snapshot :

```sql
SELECT calculate_kpi_snapshot('company-id', 'period-id');
```

### Calcul Programmé (Cron)

Pour automatiser le calcul des KPIs, créez un job Supabase Edge Function :

```typescript
// supabase/functions/calculate-kpis/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Récupérer toutes les périodes non fermées
  const { data: periods } = await supabase
    .from('finance_periods')
    .select('*, company:finance_companies(*)')
    .eq('is_closed', false)

  for (const period of periods || []) {
    await supabase.rpc('calculate_kpi_snapshot', {
      p_company_id: period.company_id,
      p_period_id: period.id,
    })
  }

  return new Response('KPIs calculated', { status: 200 })
})
```

Planifiez via Supabase Cron :

```sql
SELECT cron.schedule(
  'calculate-kpis',
  '0 0 * * *', -- Tous les jours à minuit
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/calculate-kpis',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

---

## 🎨 Personnalisation

### Thème & Couleurs

Les composants utilisent les variables CSS Tailwind. Pour personnaliser :

```css
/* globals.css */
:root {
  --chart-1: 220 70% 50%;  /* Bleu pour CA */
  --chart-2: 160 60% 45%;  /* Vert pour Marges */
  --chart-3: 30 80% 55%;   /* Orange pour Résultat */
}
```

### Ajout de Nouveaux KPIs

1. Ajoutez les colonnes dans `finance_kpi_snapshots` :

```sql
ALTER TABLE finance_kpi_snapshots
ADD COLUMN your_new_kpi DECIMAL(15,2);
```

2. Mettez à jour le type TypeScript dans `types/finance.ts` :

```typescript
export interface KPISnapshot {
  // ... existing fields
  your_new_kpi?: number
}
```

3. Ajoutez le calcul dans la fonction `calculate_kpi_snapshot`

4. Affichez-le dans `CFODashboard` avec une `KPICard`

---

## 🧪 Tests

### Tests avec Données Mockées

Pour tester sans BDD, utilisez les données mockées :

```typescript
import { getMockDashboard } from '@/lib/finance/mock-data'

// Dans votre composant
const dashboard = getMockDashboard()
```

### Tests d'Intégration

```bash
# Installer les dépendances de test
npm install -D @testing-library/react @testing-library/jest-dom jest

# Créer un test
# __tests__/finance/dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { CFODashboard } from '@/components/finance/cfo-dashboard'

test('renders CFO dashboard', () => {
  render(<CFODashboard companyId="test-id" />)
  expect(screen.getByText('Vyxo Finance Hub')).toBeInTheDocument()
})
```

---

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables Finance ont RLS activé. Les utilisateurs ne peuvent voir que :

- Les données de leur entreprise (via `created_by`)
- Leurs propres conversations avec l'IA

### Validation des Inputs

Les API routes valident les inputs :

```typescript
if (!company_id || !period_id) {
  return NextResponse.json(
    { success: false, error: 'Missing parameters' },
    { status: 400 }
  )
}
```

### Rate Limiting

Ajoutez un rate limiting pour l'assistant IA :

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})
```

---

## 📈 Performance

### Optimisation des Requêtes

Les index sont créés automatiquement par le schéma :

```sql
CREATE INDEX idx_finance_periods_company ON finance_periods(company_id);
CREATE INDEX idx_pl_company_period ON finance_pl_entries(company_id, period_id);
```

### Cache

Utilisez React Query ou SWR pour cacher les données :

```bash
npm install @tanstack/react-query
```

```typescript
import { useQuery } from '@tanstack/react-query'

function useDashboard(companyId: string) {
  return useQuery({
    queryKey: ['dashboard', companyId],
    queryFn: () => fetchDashboard(companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

---

## 🐛 Troubleshooting

### Erreur : Tables non trouvées

➡️ Vérifiez que le schéma SQL a été exécuté correctement

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'finance_%';
```

### Erreur : RLS bloque les requêtes

➡️ Vérifiez que l'utilisateur est bien authentifié et que `created_by` correspond

```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User ID:', user?.id)
```

### Dashboard vide

➡️ Vérifiez qu'il y a des données dans `finance_kpi_snapshots`

```sql
SELECT * FROM finance_kpi_snapshots LIMIT 5;
```

### Graphiques ne s'affichent pas

➡️ Vérifiez que `recharts` est bien installé

```bash
npm list recharts
```

---

## 🚀 Prochaines Étapes

1. **Connecter à vos données réelles** : Remplacez les données mockées par vos vrais chiffres
2. **Automatiser les calculs** : Mettez en place les cron jobs pour les KPIs
3. **Intégrer l'IA** : Connectez OpenAI ou Claude pour l'assistant
4. **Personnaliser** : Adaptez les KPIs à vos besoins métier
5. **Déployer** : Testez en production

---

## 📞 Support

Pour toute question sur l'intégration du Finance Hub :

- Consultez les commentaires dans le code
- Vérifiez les types TypeScript pour l'autocomplétion
- Référez-vous aux données mockées pour des exemples

---

**Vyxo Finance Hub** - Votre cockpit CFO complet 🚀
