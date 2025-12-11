# 🎯 Guide d'Enrichissement du Quiz Vyxo Codex

## Vue d'ensemble

Ce guide vous montre comment enrichir facilement le module Vyxo Codex avec de nouvelles questions de quiz, soit **manuellement** soit via l'**IA ChatGPT** (déjà configurée sur Vercel).

---

## 🤖 Méthode 1 : Génération automatique via IA (RECOMMANDÉ)

### Configuration

✅ **Aucune configuration nécessaire !**
La clé API OpenAI est déjà configurée sur Vercel (même que pour les emails, audits, VyxHunter, etc.)

### API Routes créées

Deux routes sont disponibles pour l'IA :

#### 1. `/api/codex/generate-questions` - Générer des questions
```typescript
POST /api/codex/generate-questions
{
  "moduleId": "iso-9001",
  "moduleName": "ISO 9001 – Système de management de la qualité",
  "count": 10,
  "difficulty": "medium"
}
```

**Réponse :**
```json
{
  "questions": [
    {
      "id": "ai-iso-9001-1234567890-0",
      "moduleId": "iso-9001",
      "question": "Que signifie l'acronyme SMQ dans ISO 9001 ?",
      "difficulty": "easy",
      "choices": [
        "Système Mondial de Qualité",
        "Système de Management de la Qualité",
        "Standard de Mesure de Qualité",
        "Structure de Management Qualifié"
      ],
      "correctIndex": 1,
      "explanation": "SMQ signifie Système de Management de la Qualité. C'est le cadre organisationnel qui permet de démontrer qu'une organisation peut fournir des produits/services conformes...",
      "tags": ["smq", "définition", "base"]
    }
  ]
}
```

#### 2. `/api/codex/ask-assistant` - Poser des questions (streaming)
```typescript
POST /api/codex/ask-assistant
{
  "question": "Explique-moi la clause 4 de l'ISO 9001",
  "moduleId": "iso-9001",
  "moduleName": "ISO 9001"
}
```

---

## 💻 Utilisation de l'IA dans le code

### Fonction 1 : `generateQuizQuestions()`

**Fichier :** `lib/codex/ai-assistant.ts`

**Exemple d'utilisation :**

```typescript
import { generateQuizQuestions } from '@/lib/codex/ai-assistant';

// Générer 10 questions de niveau intermédiaire pour ISO 9001
const questions = await generateQuizQuestions(
  'iso-9001',
  'ISO 9001 – Système de management de la qualité',
  10,
  'medium'
);

console.log(questions); // Tableau de QuizQuestion[]
```

### Fonction 2 : `askAssistant()` (streaming)

```typescript
import { askAssistant, streamToText } from '@/lib/codex/ai-assistant';

// Poser une question à l'assistant
const stream = await askAssistant(
  "Explique-moi les non-conformités dans ISO 9001",
  "iso-9001",
  "ISO 9001"
);

// Convertir le stream en texte
const response = await streamToText(stream);
console.log(response);
```

---

## 📝 Exemples d'enrichissement par module

### Exemple 1 : Enrichir ISO 9001 avec 20 questions

**Script Node.js :**

```javascript
// scripts/enrich-iso9001.js
import { generateQuizQuestions } from '../lib/codex/ai-assistant.js';
import fs from 'fs';

async function enrichISO9001() {
  console.log('🚀 Génération de 20 questions pour ISO 9001...');

  // Générer 10 questions faciles
  const easyQuestions = await generateQuizQuestions(
    'iso-9001',
    'ISO 9001 – Système de management de la qualité',
    10,
    'easy'
  );

  // Générer 5 questions moyennes
  const mediumQuestions = await generateQuizQuestions(
    'iso-9001',
    'ISO 9001 – Système de management de la qualité',
    5,
    'medium'
  );

  // Générer 5 questions difficiles
  const hardQuestions = await generateQuizQuestions(
    'iso-9001',
    'ISO 9001 – Système de management de la qualité',
    5,
    'hard'
  );

  const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

  // Sauvegarder dans un fichier JSON
  fs.writeFileSync(
    'data/iso9001-questions.json',
    JSON.stringify(allQuestions, null, 2)
  );

  console.log('✅ 20 questions générées et sauvegardées !');
}

enrichISO9001();
```

**Ensuite, copiez-collez dans `lib/codex/questions.ts` :**

```typescript
// Ouvrez lib/codex/questions.ts et ajoutez les questions au tableau existant
export const quizQuestions: QuizQuestion[] = [
  // ... questions existantes

  // Questions générées par IA pour ISO 9001
  {
    id: "ai-iso-9001-...",
    moduleId: "iso-9001",
    question: "...",
    // etc.
  },
  // ... suite
];
```

---

## ✍️ Méthode 2 : Ajout manuel de questions

Si vous préférez créer des questions manuellement (recommandé pour des questions très spécifiques) :

### Template de question

**Fichier :** `lib/codex/questions.ts`

```typescript
{
  id: "q-unique-id-123",              // ID unique (format: q-module-topic-number)
  moduleId: "iso-9001",               // Doit correspondre à un module existant
  difficulty: "medium",               // easy | medium | hard
  question: "Quelle est la question ?",
  choices: [
    "Mauvaise réponse A",
    "Mauvaise réponse B",
    "Bonne réponse C",               // ← La bonne réponse
    "Mauvaise réponse D"
  ],
  correctIndex: 2,                   // Index de la bonne réponse (0-based, donc 2 = 3ème choix)
  explanation: "Explication détaillée de pourquoi la réponse C est correcte. Ajoutez du contexte, des références à la norme, et des conseils pratiques.",
  tags: ["smq", "clause-10", "amelioration"]
}
```

### Exemples concrets par domaine

#### ISO 9001 - Clause 10 (Amélioration)

```typescript
{
  id: "q-iso9001-amelioration-1",
  moduleId: "iso-9001",
  difficulty: "medium",
  question: "Quelle est la différence entre une action corrective et une action préventive dans ISO 9001:2015 ?",
  choices: [
    "Il n'y a aucune différence, ce sont des synonymes",
    "L'action préventive n'existe plus dans ISO 9001:2015",
    "L'action corrective concerne le passé, l'action préventive concerne le futur",
    "L'action préventive est obligatoire, l'action corrective est optionnelle"
  ],
  correctIndex: 1,
  explanation: "Dans ISO 9001:2015, le concept d'action préventive a été retiré. La prévention est maintenant intégrée dans l'approche par les risques (clause 6.1) et dans l'amélioration continue. Seules les actions correctives subsistent pour traiter les non-conformités.",
  tags: ["amelioration", "action-corrective", "risques", "clause-10"]
}
```

#### GDP - Cold Chain

```typescript
{
  id: "q-gdp-cold-chain-1",
  moduleId: "gdp",
  difficulty: "hard",
  question: "Dans le cadre GDP, quelle est la durée maximale acceptable pour une excursion de température à +28°C pour un produit dont la plage de stockage est +2/+8°C ?",
  choices: [
    "Aucune excursion n'est acceptable",
    "Cela dépend de l'étude de stabilité du produit",
    "Maximum 2 heures",
    "Maximum 24 heures"
  ],
  correctIndex: 1,
  explanation: "Il n'existe pas de durée maximale universelle. Chaque excursion doit être évaluée au cas par cas en fonction de l'étude de stabilité du produit, de la température atteinte, et de la durée. Le fabricant doit fournir les données de stabilité permettant d'évaluer l'impact. C'est pourquoi une procédure d'investigation d'excursion est essentielle.",
  tags: ["excursion", "temperature", "stabilite", "investigation"]
}
```

#### CEIV Pharma

```typescript
{
  id: "q-ceiv-pharma-1",
  moduleId: "ceiv-pharma",
  difficulty: "medium",
  question: "Quels sont les trois piliers de la certification CEIV Pharma ?",
  choices: [
    "Formation, Infrastructure, Documentation",
    "Température, Traçabilité, Qualité",
    "Formation, Processus, Infrastructure",
    "ISO 9001, GDP, IATA"
  ],
  correctIndex: 2,
  explanation: "Les trois piliers de CEIV Pharma sont : 1) Formation (personnel formé aux exigences pharma), 2) Processus (procédures et instructions alignées IATA TCR et GDP), 3) Infrastructure (équipements qualifiés, zones de stockage conformes). Ces trois piliers sont audités lors de la certification.",
  tags: ["ceiv", "certification", "piliers", "iata"]
}
```

#### Lean Six Sigma

```typescript
{
  id: "q-lean-dmaic-1",
  moduleId: "lean-six-sigma",
  difficulty: "medium",
  question: "Dans la phase 'Analyze' du DMAIC, quel outil permet d'identifier les causes racines d'un problème ?",
  choices: [
    "Diagramme de Gantt",
    "5S",
    "Diagramme d'Ishikawa (arête de poisson)",
    "Kaizen"
  ],
  correctIndex: 2,
  explanation: "Le diagramme d'Ishikawa (aussi appelé diagramme en arête de poisson ou diagramme de causes-effets) est l'outil clé de la phase Analyze. Il permet de cartographier systématiquement toutes les causes potentielles d'un problème en les regroupant par familles (5M : Main d'œuvre, Matière, Matériel, Méthode, Milieu).",
  tags: ["dmaic", "analyze", "ishikawa", "causes-racines"]
}
```

---

## 🎯 Bonnes pratiques pour créer des questions

### ✅ DO (À faire)

1. **Questions claires et sans ambiguïté**
   - ✅ "Quelle clause de l'ISO 9001 traite du contexte de l'organisme ?"
   - ❌ "Dans quelle partie on parle du contexte ?"

2. **Réponses plausibles**
   - Toutes les options doivent sembler crédibles
   - Évitez les réponses évidentes comme "Aucune de ces réponses"

3. **Explications riches**
   - Ajoutez du contexte
   - Référencez la clause/article/section
   - Donnez des exemples concrets
   - Ajoutez des conseils d'audit si pertinent

4. **Tags pertinents**
   - Utilisez des tags cohérents avec les autres questions
   - 2-4 tags par question
   - Facilitent la recherche et le filtrage

5. **Difficulté appropriée**
   - **Easy** : Définitions, base, reconnaissance
   - **Medium** : Application, compréhension, analyse
   - **Hard** : Cas complexes, décisions, interprétation avancée

### ❌ DON'T (À éviter)

1. ❌ Questions trop vagues
2. ❌ Réponses avec des blagues ou du sarcasme
3. ❌ Explications trop courtes (< 50 caractères)
4. ❌ Questions pièges ou ambiguës
5. ❌ Réponses évidentes parmi les choix
6. ❌ Erreurs factuelles dans les explications

---

## 📊 Plan d'enrichissement suggéré

### Phase 1 : Modules prioritaires (100 questions)
- ISO 9001 : 20 questions (5 easy, 10 medium, 5 hard)
- GDP : 20 questions
- CEIV Pharma : 15 questions
- ISO 14001 : 15 questions
- ISO 45001 : 15 questions
- Lean/Six Sigma : 15 questions

### Phase 2 : Modules avancés (80 questions)
- GMP : 15 questions
- GAMP 5 : 15 questions
- ISO 27001 : 15 questions
- Excellence Opérationnelle : 15 questions
- Cold Chain Packaging : 10 questions
- Audit Méthodologies : 10 questions

### Phase 3 : Diversification (100+ questions)
- Quiz inter-modules (transversaux)
- Cas pratiques complexes
- Questions basées sur des audits réels (anonymisés)

**Objectif final :** 300+ questions pour un entraînement complet

---

## 🔧 Workflow recommandé

### Workflow 1 : Enrichissement par batch avec IA

```bash
1. Décider d'un module (ex: ISO 9001)
2. Appeler l'API generate-questions 3 fois :
   - 10 questions easy
   - 10 questions medium
   - 10 questions hard
3. Réviser les questions générées (vérifier la qualité)
4. Ajuster/corriger si nécessaire
5. Ajouter au fichier lib/codex/questions.ts
6. Commit et push
```

### Workflow 2 : Enrichissement manuel ciblé

```bash
1. Identifier un sujet/clause spécifique à couvrir
2. Rédiger 2-3 questions manuellement
3. Utiliser l'IA pour générer des variantes ou compléments
4. Réviser et ajuster
5. Ajouter au fichier lib/codex/questions.ts
6. Commit et push
```

---

## 🧪 Tester vos questions

Avant d'ajouter des questions en masse :

1. **Ajoutez 1-2 questions test**
2. **Lancez un quiz** sur le module concerné
3. **Vérifiez :**
   - L'affichage de la question
   - Les choix sont bien visibles
   - La validation fonctionne
   - L'explication est claire
   - Les tags sont corrects

---

## 📱 Exemple de script complet

Créez un fichier `scripts/generate-quiz.js` :

```javascript
import { generateQuizQuestions } from '../lib/codex/ai-assistant.js';
import { knowledgeModules } from '../lib/codex/modules.js';
import fs from 'fs';

async function generateForAllModules() {
  console.log('🚀 Génération de questions pour tous les modules...\n');

  let allGeneratedQuestions = [];

  for (const module of knowledgeModules) {
    console.log(`📚 Traitement de ${module.title}...`);

    try {
      // 5 questions par module (ajustez selon vos besoins)
      const questions = await generateQuizQuestions(
        module.id,
        module.title,
        5,
        'medium'
      );

      allGeneratedQuestions = [...allGeneratedQuestions, ...questions];
      console.log(`  ✅ ${questions.length} questions générées\n`);

      // Pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`  ❌ Erreur : ${error.message}\n`);
    }
  }

  // Sauvegarder toutes les questions
  const outputPath = 'data/generated-questions.json';
  fs.writeFileSync(outputPath, JSON.stringify(allGeneratedQuestions, null, 2));

  console.log(`\n✨ Terminé ! ${allGeneratedQuestions.length} questions générées`);
  console.log(`📄 Fichier : ${outputPath}`);
  console.log('\n💡 Prochaine étape : Copiez ces questions dans lib/codex/questions.ts');
}

generateForAllModules();
```

**Lancer le script :**
```bash
node scripts/generate-quiz.js
```

---

## 🎓 Ressources supplémentaires

### Sources de contenu

Pour créer des questions de qualité, inspirez-vous de :
- Les normes ISO officielles
- Les guides GDP/GMP (EMA, FDA)
- Les standards IATA (TCR)
- Les référentiels Lean/Six Sigma
- Vos expériences d'audit terrain

### Révision de qualité

Avant d'ajouter des questions :
- Relire pour les fautes
- Vérifier l'exactitude technique
- Tester les réponses sur des collègues
- S'assurer de la valeur pédagogique

---

## ✅ Checklist avant commit

- [ ] Les IDs sont uniques
- [ ] Les moduleId correspondent aux modules existants
- [ ] Les correctIndex sont corrects (0-based)
- [ ] Les explications sont détaillées (> 50 caractères)
- [ ] Les tags sont pertinents
- [ ] Les difficultés sont appropriées
- [ ] Pas de fautes d'orthographe
- [ ] Testé dans l'UI (au moins 1-2 questions)

---

**Besoin d'aide ?** Consultez le `CODEX_README.md` ou contactez l'équipe Vyxo ! 🚀
