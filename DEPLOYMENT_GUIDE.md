# 🚀 Guide de Déploiement - Système de Prospection Intelligence

## ⚡ Déploiement Rapide (5 minutes)

### Étape 1: Appliquer les migrations Supabase

**Option A: Via Supabase Dashboard (Recommandé)**

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner ton projet
3. Aller dans **SQL Editor**
4. Créer une nouvelle query
5. Copier-coller le contenu de `supabase/migrations/20250124_add_prospecting_intelligence.sql`
6. Cliquer sur **Run**
7. Répéter avec `supabase/migrations/20250124_seed_prospecting_data.sql`

**Option B: Via CLI Supabase**

```bash
cd supabase
supabase db push
```

### Étape 2: Vérifier les tables créées

Dans Supabase Dashboard → **Table Editor**, tu devrais voir:

- ✅ `vch_icp_sectors` (9 lignes)
- ✅ `vch_pain_points`
- ✅ `vch_solutions_mapping`
- ✅ `vch_scoring_rules` (17 lignes)
- ✅ `vch_company_scores`
- ✅ `vch_email_templates` (10 lignes)
- ✅ `vch_gamma_templates`

### Étape 3: Commit et push

```bash
git add .
git commit -m "feat: Complete prospecting intelligence system"
git push
```

---

## 🧪 Tests

### Test 1: Enrichissement d'une company

**Via API (Postman/Thunder Client)**

```http
POST http://localhost:3000/api/vyxhunter/enrich
Content-Type: application/json

{
  "companyId": "COMPANY_UUID_HERE"
}
```

**Résultat attendu:**

```json
{
  "success": true,
  "enrichment": {
    "sector": "Pharma / Santé",
    "sectorConfidence": 0.9,
    "painPoints": ["Inspections ANSM", "Traçabilité"],
    "maturityLevel": "low",
    "regulations": ["GDP", "BPF"],
    "recommendedSolutions": ["Audit GDP/BPF"],
    "talkingPoints": ["Préparer inspection"]
  },
  "score": {
    "total": 85,
    "classification": "hot"
  }
}
```

### Test 2: Scoring d'une company

```http
POST http://localhost:3000/api/vyxhunter/scoring
Content-Type: application/json

{
  "companyId": "COMPANY_UUID_HERE"
}
```

**Résultat attendu:**

```json
{
  "success": true,
  "score": {
    "total": 85,
    "classification": "hot",
    "breakdown": {
      "sector": 20,
      "painPoints": 25,
      "maturity": 12,
      "regulations": 15
    }
  }
}
```

### Test 3: Génération d'email avec template sectoriel

1. Enrichir une company (test 1)
2. Analyser la company (route existante)
3. Générer un email (route existante)
4. Vérifier que le template sectoriel est utilisé

---

## 📊 Vérification du système

### Checklist de vérification

- [ ] Les 9 ICPs sectoriels sont dans la DB
- [ ] Les 10 templates d'emails sont dans la DB
- [ ] Les règles de scoring sont dans la DB
- [ ] L'enrichissement détecte correctement le secteur
- [ ] Le scoring calcule un score 0-100
- [ ] La classification (hot/warm/cold) fonctionne
- [ ] Les emails utilisent les templates sectoriels
- [ ] Les variables sont remplacées correctement

### Commandes de vérification SQL

```sql
-- Vérifier les ICPs
SELECT name, slug, priority_level FROM vch_icp_sectors ORDER BY priority_level DESC;

-- Vérifier les templates
SELECT sector_id, template_name, pain_point_focus FROM vch_email_templates;

-- Vérifier les règles de scoring
SELECT rule_name, rule_type, points FROM vch_scoring_rules ORDER BY points DESC;

-- Vérifier les companies enrichies
SELECT name, icp_sector_id, detected_pain_points, maturity_level
FROM vch_vyxhunter_companies
WHERE icp_sector_id IS NOT NULL;

-- Vérifier les scores
SELECT c.name, cs.total_score, cs.classification
FROM vch_company_scores cs
JOIN vch_vyxhunter_companies c ON c.id = cs.company_id
ORDER BY cs.total_score DESC;
```

---

## 🔧 Troubleshooting

### Problème: Migrations échouent

**Solution:**

- Vérifier que les tables n'existent pas déjà
- Supprimer les tables existantes si besoin
- Réappliquer les migrations

### Problème: Enrichissement ne détecte pas le secteur

**Solution:**

- Vérifier que `OPENAI_API_KEY` est configurée
- Vérifier que la company a une description
- Vérifier les logs de l'API

### Problème: Templates d'emails non utilisés

**Solution:**

- Vérifier que la company a un `icp_sector_id`
- Vérifier que les templates sont actifs (`active = true`)
- Vérifier les logs de l'email generator

### Problème: Score toujours à 0

**Solution:**

- Vérifier que la company est enrichie (secteur, pain points)
- Vérifier que les règles de scoring sont dans la DB
- Appeler manuellement la fonction SQL `calculate_company_score(uuid)`

---

## 🎯 Prochaines étapes (Optionnel)

### 1. Intégration automatique

Modifier `app/api/vyxhunter/companies/[id]/analyze/route.ts`:

```typescript
// Après l'analyse AI
const analysisResponse = await analyzeCompany(company);

// Enrichir automatiquement
const enrichResponse = await fetch(
  `${process.env.NEXT_PUBLIC_APP_URL}/api/vyxhunter/enrich`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId: id }),
  }
);
```

### 2. UI Updates

Ajouter dans `app/(dashboard)/vyxhunter/companies/[id]/page.tsx`:

```tsx
// Afficher le secteur ICP
{
  company.icp_sector_id && <Badge variant="secondary">{sectorName}</Badge>;
}

// Afficher le score
{
  score && (
    <div className={`score-badge ${score.classification}`}>
      {score.total}/100 - {score.classification.toUpperCase()}
    </div>
  );
}

// Afficher les pain points
{
  company.detected_pain_points?.map((pain) => <li key={pain}>{pain}</li>);
}
```

### 3. Workflows d'automatisation

- Auto-enrichissement lors de la création
- Notification Slack pour leads hot
- Séquences de relance automatiques

---

## ✅ Validation finale

Une fois tout déployé et testé:

1. ✅ Créer une company de test
2. ✅ L'enrichir via API
3. ✅ Vérifier le secteur détecté
4. ✅ Vérifier le score calculé
5. ✅ Générer un email
6. ✅ Vérifier que le template sectoriel est utilisé

**Si tous les tests passent → Système opérationnel ! 🎉**

---

## 📞 Support

En cas de problème:

1. Vérifier les logs de l'application
2. Vérifier les logs Supabase
3. Vérifier que toutes les variables d'environnement sont configurées
4. Consulter le walkthrough.md pour plus de détails
