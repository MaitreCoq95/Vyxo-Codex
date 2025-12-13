# Order 66 - Migration Vyxo Codex 2.0

> *"Good soldiers follow orders."* 🎖️

## 🎯 Objectif

Cette migration consolide et nettoie toute la base de données Vyxo Codex 2.0. Elle:
- ✅ Supprime les doublons (clients vs profiles, codex_quiz_questions vs quiz_questions)
- ✅ Unifie le schéma en une structure cohérente
- ✅ Crée toutes les tables manquantes
- ✅ Ajoute tous les index de performance
- ✅ Configure les RLS policies
- ✅ Installe les fonctions et triggers
- ✅ Initialise les données (badges, storage)

## 📋 Ordre d'Exécution

**IMPORTANT:** Exécutez les scripts **DANS CET ORDRE EXACT**:

### Partie 1: Tables
```bash
psql $DATABASE_URL -f ORDER_66_PART_1_TABLES.sql
```
Crée toutes les tables dans l'ordre de dépendance.

### Partie 2: Index & RLS
```bash
psql $DATABASE_URL -f ORDER_66_PART_2_INDEXES.sql
```
Crée les index de performance et active Row Level Security.

### Partie 3: Fonctions & Data
```bash
psql $DATABASE_URL -f ORDER_66_PART_3_FUNCTIONS.sql
```
Installe les fonctions, triggers, badges initiaux et storage.

## 🔍 Via Supabase Dashboard

Si vous préférez utiliser l'interface:

1. **Supabase Dashboard** → SQL Editor → New Query
2. Copiez le contenu de `ORDER_66_PART_1_TABLES.sql`
3. Exécutez (Run)
4. Répétez pour PART_2 et PART_3

## ✅ Vérification

Après exécution, vérifiez:

```sql
-- Compter les tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Devrait retourner ~30 tables

-- Vérifier les badges
SELECT COUNT(*) FROM badges;
-- Devrait retourner 8

-- Vérifier les storage buckets
SELECT * FROM storage.buckets;
-- Devrait montrer: certificates, practical-validations, avatars

-- Vérifier les fonctions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

## 📦 Tables Créées

### Core (5)
- companies
- profiles (unifié avec clients)
- teams
- team_members

### Learning (6)
- modules
- quiz_questions (unifié)
- user_modules
- codex_user_xp
- codex_learning_progress
- codex_xp_history

### Gamification (6)
- challenges
- user_challenges
- badges
- user_badges
- streaks
- duels
- daily_challenges

### Communications (2)
- notifications
- vyxo_flashes

### Analytics (4)
- incidents
- risk_alerts
- company_kpis
- practical_validations

### CRM (5)
- clients (CRM, différent de profiles)
- engagements
- audits
- invoices
- activities

## 🔧 Fonctions Disponibles

```sql
-- Mettre à jour le streak d'un utilisateur
SELECT update_user_streak('user-uuid');

-- Calculer l'IMO d'une entreprise
SELECT calculate_imo('company-uuid');

-- Analyser les gaps d'une équipe
SELECT analyze_team_gaps('team-uuid', '24 hours');

-- Obtenir XP total
SELECT get_user_total_xp('user-uuid');

-- Mettre à jour stats question
SELECT update_question_stats('question-id', true, 45);
```

## 🎭 Vues Créées

```sql
-- Leaderboard global
SELECT * FROM leaderboard_global LIMIT 10;

-- Stats équipes
SELECT * FROM team_stats;
```

## 🛡️ Sécurité (RLS)

Toutes les tables ont Row Level Security activé avec policies appropriées:
- Users voient leurs propres données
- Managers voient les données de leur équipe
- Directors voient les données de leur entreprise

## 🐛 Troubleshooting

### Erreur: "relation already exists"
Normal si vous ré-exécutez. Les scripts utilisent `IF NOT EXISTS`.

### Erreur: "duplicate key value"
Pour les badges - normal si déjà créés. Script utilise `ON CONFLICT DO NOTHING`.

### Erreur: "permission denied"
Assurez-vous d'utiliser le `SERVICE_ROLE_KEY` ou un user avec privilèges suffisants.

## 📊 Résultat Attendu

Après exécution complète:
- ✅ ~30 tables créées
- ✅ ~80+ index créés
- ✅ 6 fonctions SQL
- ✅ 6 triggers
- ✅ 8 badges initiaux
- ✅ 3 storage buckets
- ✅ RLS activé partout
- ✅ 2 vues utiles

## 🎖️ Message Final

Si vous voyez ce message en fin d'exécution:

```
═══════════════════════════════════════════════════════════════
ORDER 66 COMPLETED SUCCESSFULLY
═══════════════════════════════════════════════════════════════
Tables créées: 30
Index créés: 80+
Fonctions créées: 6
Triggers créés: 6
Badges initiaux: 8
Storage buckets: 3

"Good soldiers follow orders." ✅
═══════════════════════════════════════════════════════════════
```

**Félicitations ! Votre base de données est prête pour la production.** 🚀

---

*"The mission... the nightmares... they're finally... over."*
