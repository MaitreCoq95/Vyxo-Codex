# 🚀 Plan de Déploiement Vyxo Codex 2.0

> **Date :** 2025-12-12
> **Objectif :** Déploiement production de toutes les fonctionnalités existantes
> **Statut RBAC/Auth :** Reporté (à traiter ultérieurement)

---

## ✅ Phase 1 : Merge des Corrections Critiques (EN COURS)

### 1.1 Créer la Pull Request
- [ ] Aller sur GitHub : `MaitreCoq95/Vyxo-Codex`
- [ ] Créer PR : `claude/check-vyxo-codex-repo-01FRWSuwyuu5CEZop3FJSpYX` → `main`
- [ ] Titre : `fix: Corrections critiques Vyxo Codex 2.0 - Build & Sécurité`
- [ ] Copier la description fournie ci-dessus

### 1.2 Review & Merge
- [ ] Vérifier les 5 commits
- [ ] Valider les changements
- [ ] Merger vers `main`

---

## 🗄️ Phase 2 : Migrations Base de Données Supabase

### 2.1 Appliquer les migrations SQL

**Méthode A : Via Supabase Dashboard (Recommandé)**
1. Aller sur Supabase Dashboard → SQL Editor
2. Exécuter dans l'ordre :

```sql
-- Migration 1 : Badge Streak-100
-- Contenu : supabase/migrations/20251213_update_user_streak_function.sql
```

```sql
-- Migration 2 : RLS Policies
-- Contenu : supabase/migrations/20251213_add_missing_rls_policies.sql
```

**Méthode B : Via Supabase CLI**
```bash
supabase db push
```

### 2.2 Vérifier les policies RLS
```sql
-- Vérifier que les policies sont actives
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('teams', 'incidents', 'duels');
```

### 2.3 Créer les Storage Buckets
```sql
-- Bucket pour les certificats
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false);

-- Bucket pour les validations pratiques
INSERT INTO storage.buckets (id, name, public)
VALUES ('practical-validations', 'practical-validations', false);
```

### 2.4 Configurer les RLS pour Storage
```sql
-- Policy : Les utilisateurs voient seulement leurs certificats
CREATE POLICY "Users view own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy : Les utilisateurs uploadent leurs certificats
CREATE POLICY "Users upload own certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Même logique pour practical-validations
CREATE POLICY "Users view own validations"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'practical-validations'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users upload own validations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'practical-validations'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## ⚡ Phase 3 : Déploiement Edge Functions

### 3.1 Déployer les Edge Functions

**Edge Function 1 : generate-daily-flashes**
```bash
supabase functions deploy generate-daily-flashes
```

**Edge Function 2 : schedule-daily-challenges**
```bash
supabase functions deploy schedule-daily-challenges
```

### 3.2 Configurer les secrets
```bash
# Secret Anthropic API Key
supabase secrets set ANTHROPIC_API_KEY=<votre_clé_anthropic>

# Vérifier les secrets
supabase secrets list
```

### 3.3 Configurer les CRON schedules

**Via Supabase Dashboard → Database → Extensions → pg_cron**

```sql
-- CRON 1 : Vyxo Flash quotidien (6h00 UTC)
SELECT cron.schedule(
  'generate-daily-flashes',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url:='https://<your-project-ref>.supabase.co/functions/v1/generate-daily-flashes',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer <anon-key>"}'::jsonb
  ) AS request_id;
  $$
);

-- CRON 2 : Défis quotidiens (8h00 UTC)
SELECT cron.schedule(
  'schedule-daily-challenges',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://<your-project-ref>.supabase.co/functions/v1/schedule-daily-challenges',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer <anon-key>"}'::jsonb
  ) AS request_id;
  $$
);
```

### 3.4 Tester les Edge Functions manuellement
```bash
# Test generate-daily-flashes
curl -X POST \
  'https://<your-project-ref>.supabase.co/functions/v1/generate-daily-flashes' \
  -H 'Authorization: Bearer <anon-key>' \
  -H 'Content-Type: application/json'

# Test schedule-daily-challenges
curl -X POST \
  'https://<your-project-ref>.supabase.co/functions/v1/schedule-daily-challenges' \
  -H 'Authorization: Bearer <anon-key>' \
  -H 'Content-Type: application/json'
```

---

## 🌐 Phase 4 : Déploiement Vercel

### 4.1 Configurer les variables d'environnement Vercel

**Via Vercel Dashboard → Settings → Environment Variables**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Anthropic Claude
ANTHROPIC_API_KEY=<your-anthropic-key>

# OpenAI (si utilisé)
OPENAI_API_KEY=<your-openai-key>

# Google AI (si utilisé)
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-key>

# Resend (pour les emails)
RESEND_API_KEY=<your-resend-key>
```

### 4.2 Déclencher le déploiement
- [ ] Merger la PR vers `main`
- [ ] Vercel détecte automatiquement le merge
- [ ] Build démarre automatiquement
- [ ] Attendre ~3-5 minutes

### 4.3 Vérifier le build Vercel
- [ ] Aller sur Vercel Dashboard
- [ ] Vérifier que le build est vert ✅
- [ ] Vérifier qu'il n'y a pas d'erreurs TypeScript
- [ ] Noter l'URL de production

---

## ✅ Phase 5 : Tests Post-Déploiement

### 5.1 Tests fonctionnels par rôle

**Operator Role :**
- [ ] Créer un compte opérateur
- [ ] Accéder au dashboard Operator
- [ ] Compléter un défi quotidien
- [ ] Vérifier la mise à jour du streak
- [ ] Tester le quiz Codex
- [ ] Vérifier l'attribution de badges
- [ ] Tester l'export PDF

**Manager Role :**
- [ ] Créer un compte manager
- [ ] Accéder au dashboard Manager
- [ ] Voir le Vyxo Flash du jour (après 6h00 UTC)
- [ ] Créer un incident pratique
- [ ] Assigner un exercice pratique à l'équipe
- [ ] Valider une soumission
- [ ] Voir les stats d'équipe

**Director Role :**
- [ ] Créer un compte director
- [ ] Accéder au dashboard Director
- [ ] Vérifier le calcul IMO
- [ ] Voir les analytics globales
- [ ] Télécharger les rapports
- [ ] Voir la matrice de compétences

### 5.2 Tests des Edge Functions
```bash
# Vérifier les logs Supabase
supabase functions logs generate-daily-flashes --tail
supabase functions logs schedule-daily-challenges --tail
```

### 5.3 Tests de sécurité RLS
```bash
# Se connecter avec différents utilisateurs
# Vérifier qu'ils ne voient QUE leurs données
# Tester les tentatives d'accès cross-team
```

### 5.4 Tests de performance
- [ ] Temps de chargement page d'accueil < 2s
- [ ] Dashboard opérateur < 3s
- [ ] Requêtes Supabase < 500ms
- [ ] Edge Functions répondent en < 30s

---

## 📊 Phase 6 : Monitoring & Observability

### 6.1 Activer Vercel Analytics
- [ ] Aller sur Vercel Dashboard → Analytics
- [ ] Activer Web Analytics
- [ ] Activer Speed Insights

### 6.2 Configurer Supabase Monitoring
- [ ] Activer Database Insights
- [ ] Configurer les alertes :
  - CPU > 80%
  - Connections > 50
  - Storage > 80%

### 6.3 Configurer les alertes email
```sql
-- Alerte si échec Edge Function
CREATE OR REPLACE FUNCTION notify_edge_function_failure()
RETURNS trigger AS $$
BEGIN
  -- Envoyer email via Resend
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := '{"Authorization": "Bearer <resend-key>"}'::jsonb,
    body := jsonb_build_object(
      'from', 'alerts@vyxo.app',
      'to', 'admin@vyxo.app',
      'subject', 'Edge Function Failed',
      'html', NEW.error_message
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 🎯 Checklist Finale de Déploiement

### Pre-Flight
- [x] Build TypeScript local réussi
- [x] Corrections critiques committées
- [ ] PR créée et mergée
- [ ] Variables d'environnement Vercel configurées

### Database
- [ ] Migrations SQL appliquées
- [ ] RLS policies activées et testées
- [ ] Storage buckets créés
- [ ] CRON jobs configurés

### Backend
- [ ] Edge Functions déployées
- [ ] Secrets Anthropic configurés
- [ ] Tests manuels Edge Functions OK

### Frontend
- [ ] Build Vercel réussi ✅
- [ ] URL de production active
- [ ] Toutes les pages accessibles
- [ ] Thèmes fonctionnent correctement

### Tests
- [ ] Test Operator role complet
- [ ] Test Manager role complet
- [ ] Test Director role complet
- [ ] RLS vérifié (isolation des données)
- [ ] Performance acceptable

### Monitoring
- [ ] Vercel Analytics activé
- [ ] Supabase Monitoring activé
- [ ] Alertes configurées

---

## 🔧 Rollback Plan (en cas de problème)

### Rollback Vercel
```bash
# Via Vercel Dashboard
# Aller sur Deployments → Sélectionner déploiement précédent → Promote to Production
```

### Rollback Database
```sql
-- Désactiver les policies RLS si problème
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE duels DISABLE ROW LEVEL SECURITY;
```

### Rollback Edge Functions
```bash
# Supprimer les CRON jobs
SELECT cron.unschedule('generate-daily-flashes');
SELECT cron.unschedule('schedule-daily-challenges');
```

---

## 📞 Support & Contacts

**En cas de problème :**
- Vercel Support : support@vercel.com
- Supabase Support : https://supabase.com/dashboard/support
- Documentation Vyxo Codex : `/docs`

**Équipe technique :**
- Développement : [Votre équipe]
- DevOps : [Responsable infra]
- Product : [Product Manager]

---

## 📝 Notes & Observations

### Fonctionnalités déployées (actuellement)
✅ Système d'authentification Supabase
✅ 3 dashboards (Operator, Manager, Director)
✅ Système de gamification (streaks, badges, XP)
✅ Vyxo Codex (modules de connaissance + quiz)
✅ Défis quotidiens personnalisés
✅ Vyxo Flash managérial quotidien
✅ Incidents pratiques & validation
✅ Système de duels 1v1
✅ Calcul IMO (Indice Maturité Opérationnelle)
✅ Export PDF des rapports
✅ 5 thèmes adaptatifs
✅ Spaced Repetition (SM-2)

### Fonctionnalités reportées (RBAC/Auth)
⏸️ Gestion fine des permissions
⏸️ Système de compétences avancé
⏸️ Workflows de validation multi-niveaux
⏸️ Audit trail complet
⏸️ Versioning des documents
⏸️ Vues maturity avancées

---

**🚀 Prêt pour le déploiement ! Suivre les phases dans l'ordre.**
