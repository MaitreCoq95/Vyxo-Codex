# 📚 Module Vyxo Codex - Documentation

## Vue d'ensemble

Le module **Vyxo Codex** est un système de gestion de connaissances et d'entraînement quotidien intégré à Vyxo Central Hub. Il permet de :

- 📖 Stocker et organiser des connaissances structurées (ISO, GDP, GMP, CEIV, Lean, etc.)
- 🔍 Rechercher dans la base de connaissances
- 🎯 Lancer des quiz aléatoires ou ciblés par module
- 📊 Suivre sa progression (à venir)
- 🤖 Intégration future avec ChatGPT pour générer automatiquement du contenu

---

## 🏗️ Architecture

### Fichiers créés

#### Types TypeScript
```
types/codex.ts
```
Contient tous les types pour le module :
- `KnowledgeModule` : Structure d'un module de connaissance
- `KnowledgeItem` : Item de connaissance (concept, exigence, checklist, etc.)
- `QuizQuestion` : Question de quiz
- `QuizResult`, `QuizSession`, `UserStats` : Types pour les quiz

#### Données
```
lib/codex/
├── modules.ts          # Liste des modules avec helpers
├── items.ts            # Items de connaissance avec helpers
├── questions.ts        # Questions de quiz avec helpers
├── ai-assistant.ts     # Placeholder pour l'intégration ChatGPT
└── index.ts            # Export centralisé
```

#### Composants
```
components/codex/
├── module-card.tsx           # Carte d'affichage d'un module
├── knowledge-item-card.tsx   # Carte d'affichage d'un item
└── quiz-runner.tsx           # Composant de quiz interactif
```

#### Pages
```
app/(dashboard)/codex/
├── page.tsx                  # Dashboard principal
├── modules/[id]/page.tsx     # Page détail d'un module
└── quiz/page.tsx            # Page de quiz
```

#### Navigation
- `components/layout/sidebar.tsx` : Ajout de l'entrée "Vyxo Codex"
- `lib/i18n/translations.ts` : Traductions EN/FR

---

## 🎨 Fonctionnalités

### 1. Dashboard Codex (`/codex`)

**Caractéristiques :**
- Affichage en grille de tous les modules
- Barre de recherche globale (titre, description, tags, code)
- Filtre par catégorie (ISO, Pharma, Transport, ExOp, ITSec)
- Statistiques (nombre de modules, catégories)
- Bouton "Quiz Aléatoire" pour lancer un quiz global

**Données affichées :**
- Titre et code du module (ex: ISO 9001)
- Description courte
- Niveau (Débutant, Intermédiaire, Avancé)
- Catégorie
- Tags
- Secteurs d'application

### 2. Page Module (`/codex/modules/[id]`)

**Onglet "Connaissances" :**
- Recherche dans les items du module
- Items groupés par type :
  - 💡 Concepts
  - 📄 Exigences
  - ✅ Checklists
  - 🔧 Outils
  - ⚠️ Risques

**Onglet "Quiz" :**
- Lancer un quiz spécifique au module
- Affiche le nombre de questions disponibles

**Statistiques :**
- Nombre d'items de connaissance
- Nombre de questions de quiz
- Placeholder pour l'assistant IA

### 3. Quiz (`/codex/quiz`)

**Fonctionnalités :**
- Mode global (toutes questions) ou module spécifique
- Configuration du nombre de questions (5, 10, 15, 20, 30)
- Questions aléatoires
- Affichage progressif avec validation
- Explication immédiate après réponse
- Score final avec statistiques
- Possibilité de recommencer

**Interface :**
- Barre de progression
- Badges de difficulté (Facile, Moyen, Difficile)
- Réponses colorées (vert = correct, rouge = incorrect)
- Écran de résultats avec score en %

---

## ➕ Comment ajouter du contenu

### Ajouter un nouveau module

**Fichier :** `lib/codex/modules.ts`

```typescript
export const knowledgeModules: KnowledgeModule[] = [
  // ... modules existants
  {
    id: "mon-nouveau-module",           // ID unique
    code: "XYZ 123",                     // Code optionnel
    title: "Mon Nouveau Module",
    category: "ISO",                     // ISO | Pharma | Transport | ExOp | ITSec
    shortDescription: "Description courte du module",
    sectors: ["Industrie", "Services"],  // Optionnel
    level: "intermediate",               // basic | intermediate | advanced
    tags: ["tag1", "tag2", "tag3"]
  }
];
```

### Ajouter des items de connaissance

**Fichier :** `lib/codex/items.ts`

```typescript
export const knowledgeItems: KnowledgeItem[] = [
  // ... items existants
  {
    id: "mon-item-unique",
    moduleId: "mon-nouveau-module",      // Doit correspondre à l'ID du module
    type: "concept",                     // concept | requirement | checklist | tool | risk
    topic: "Titre de la connaissance",
    body: "Contenu détaillé de la connaissance...",
    tags: ["tag1", "tag2"]
  }
];
```

**Types d'items :**
- `concept` : Notion théorique ou définition
- `requirement` : Exigence d'une norme
- `checklist` : Liste de vérification
- `tool` : Outil ou méthode
- `risk` : Risque identifié

### Ajouter des questions de quiz

**Fichier :** `lib/codex/questions.ts`

```typescript
export const quizQuestions: QuizQuestion[] = [
  // ... questions existantes
  {
    id: "q-unique-id",
    moduleId: "mon-nouveau-module",
    difficulty: "medium",                // easy | medium | hard
    question: "Quelle est la question ?",
    choices: [
      "Réponse A",
      "Réponse B",
      "Réponse C (correcte)",
      "Réponse D"
    ],
    correctIndex: 2,                     // Index de la bonne réponse (0-based)
    explanation: "Explication de la réponse correcte...",
    tags: ["tag1", "tag2"]
  }
];
```

---

## 🤖 Intégration ChatGPT (À venir)

### Configuration

**Fichier de configuration :** `lib/codex/ai-assistant.ts`

**Variable d'environnement à ajouter dans `.env.local` :**
```bash
OPENAI_API_KEY=votre_clé_api_openai
```

### Fonctions disponibles (placeholder)

```typescript
// Poser une question à l'assistant
await askCodexAssistant({
  prompt: "Explique-moi le contexte de l'organisme dans ISO 9001",
  moduleId: "iso-9001",
  type: "general-query"
});

// Générer des questions de quiz
await generateQuizQuestions("iso-9001", 10, "medium");

// Enrichir les connaissances
await enrichKnowledge("iso-9001", "Leadership et engagement");
```

### Implémentation à faire

Le fichier `lib/codex/ai-assistant.ts` contient des commentaires détaillés expliquant comment implémenter l'intégration avec l'API OpenAI. Le SDK OpenAI est déjà installé.

**Étapes :**
1. Ajouter `OPENAI_API_KEY` dans `.env.local`
2. Décommenter et adapter le code dans `askCodexAssistant()`
3. Créer une API route (`/api/codex/ai`) pour la sécurité
4. Utiliser dans l'UI (zone de chat sur les pages modules)

---

## 🎯 Roadmap / Améliorations futures

### Court terme
- ✅ Structure de base complète
- ✅ Quiz fonctionnels
- ⏳ Enrichissement du contenu (plus de modules, items, questions)

### Moyen terme
- 🔲 Intégration ChatGPT pour génération automatique
- 🔲 Sauvegarde des résultats de quiz (Supabase)
- 🔲 Statistiques utilisateur détaillées
- 🔲 Historique de progression
- 🔲 Badges et achievements

### Long terme
- 🔲 Mode révision espacée (spaced repetition)
- 🔲 Export PDF des connaissances
- 🔲 Partage de modules personnalisés
- 🔲 Mode collaboratif (équipes)
- 🔲 Gamification avancée

---

## 🐛 Résolution de problèmes

### Le module n'apparaît pas dans la sidebar
- Vérifier que `components/layout/sidebar.tsx` contient l'entrée Codex
- Vérifier les traductions dans `lib/i18n/translations.ts`

### Erreur "Module not found"
- Vérifier que tous les fichiers sont bien dans les bons dossiers
- Relancer `npm install`

### Les questions ne s'affichent pas
- Vérifier que `moduleId` dans les questions correspond bien à l'ID du module
- Vérifier que le tableau `quizQuestions` n'est pas vide

### Build error
- Vérifier les imports TypeScript
- S'assurer que tous les composants UI sont bien importés de `@/components/ui`

---

## 📝 Notes de développement

### Conventions de code
- Tous les composants Codex sont préfixés par leur type (ModuleCard, KnowledgeItemCard, etc.)
- Les helpers sont regroupés dans les fichiers de données (modules.ts, items.ts, questions.ts)
- Les couleurs suivent la charte Vyxo (vyxo-navy, vyxo-gold, cyan pour Codex)

### Performance
- Les données sont chargées en mémoire (pas de DB pour l'instant)
- Utilisation de `useMemo` pour optimiser les filtres
- Les quiz sont stockés en state local (pas de persistence pour l'instant)

### Sécurité
- Aucune donnée sensible n'est stockée
- L'API ChatGPT sera appelée côté serveur (API routes)
- Les résultats de quiz seront liés au user Supabase

---

## 🙏 Contribution

Pour enrichir le Codex :

1. **Ajouter du contenu :**
   - Modules dans `lib/codex/modules.ts`
   - Items dans `lib/codex/items.ts`
   - Questions dans `lib/codex/questions.ts`

2. **Vérifier la cohérence :**
   - Les `moduleId` correspondent bien
   - Les tags sont pertinents
   - Les questions ont des explications claires

3. **Tester :**
   - Naviguer vers `/codex`
   - Ouvrir un module
   - Lancer un quiz
   - Vérifier que tout fonctionne

---

## 📞 Support

Pour toute question ou suggestion d'amélioration, contactez l'équipe Vyxo.

**Version :** 1.0.0
**Dernière mise à jour :** Décembre 2024
