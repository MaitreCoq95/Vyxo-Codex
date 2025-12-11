# 🗄️ Configuration Supabase pour Vyxo Codex

## Problème identifié

Sur Vercel, le système de fichiers est **en lecture seule**. On ne peut pas écrire directement dans `lib/codex/questions.ts`.

**Solution :** Utiliser Supabase (déjà configuré dans votre projet) pour stocker les questions générées dynamiquement.

---

## ✅ Solution : Système Hybride

### Questions hardcodées (dans le code)
- Fichier : `lib/codex/questions.ts`
- 14 questions de base
- Versionnées avec Git
- Toujours disponibles

### Questions générées (dans Supabase)
- Table : `codex_quiz_questions`
- Questions créées via l'IA
- Sauvegardées en base de données
- Chargées dynamiquement

### Combinaison automatique
- Le système charge automatiquement les deux sources
- L'utilisateur ne voit aucune différence
- Les quiz utilisent TOUTES les questions disponibles

---

## 🚀 Configuration (5 minutes)

### Étape 1 : Créer la table Supabase

1. **Allez sur** https://supabase.com/dashboard
2. **Sélectionnez** votre projet Vyxo
3. **Ouvrez** le SQL Editor (barre latérale)
4. **Copiez-collez** le contenu du fichier `supabase-codex-schema.sql`
5. **Cliquez** sur "Run" (ou F5)

✅ La table `codex_quiz_questions` est créée !

### Étape 2 : Mettre à jour l'interface Admin

Le fichier `app/(dashboard)/codex/admin/page.tsx` doit utiliser la fonction `saveToDatabase()` au lieu de `saveToFile()`.

**Changement à faire :**

```typescript
// Remplacer dans app/(dashboard)/codex/admin/page.tsx (ligne ~326)

onClick={saveToDatabase}  // ← Au lieu de saveToFile
```

### Étape 3 : Utiliser les questions combinées

Dans vos composants quiz, utilisez les nouvelles fonctions :

**Avant :**
```typescript
import { getQuestionsByModule, getRandomQuestions } from '@/lib/codex/questions';
```

**Après :**
```typescript
import { getAllQuestionsByModule, getAllRandomQuestions } from '@/lib/codex/all-questions';

// Utilisation (asynchrone maintenant)
const questions = await getAllQuestionsByModule('iso-9001');
const randomQuestions = await getAllRandomQuestions(10, 'iso-9001');
```

---

## 📝 Fichiers créés

### 1. `supabase-codex-schema.sql`
Script SQL pour créer la table dans Supabase.

**Contenu de la table :**
- `id` : ID unique de la question
- `module_id` : Référence au module
- `difficulty` : easy | medium | hard
- `question` : Texte de la question
- `choices` : Array JSON des 4 choix
- `correct_index` : Index de la bonne réponse (0-3)
- `explanation` : Explication détaillée
- `tags` : Array JSON des tags
- `created_at` : Date de création

**Sécurité (RLS activé) :**
- Lecture publique autorisée
- Insertion pour les utilisateurs authentifiés

### 2. `lib/codex/supabase-questions.ts`
Fonctions pour interagir avec Supabase :
- `saveQuestionsToSupabase()` : Sauvegarder des questions
- `loadQuestionsFromSupabase()` : Charger toutes les questions
- `loadQuestionsByModule()` : Charger pour un module spécifique
- `deleteAllGeneratedQuestions()` : Reset (si besoin)

### 3. `lib/codex/all-questions.ts`
Système de combinaison automatique :
- `getAllQuestions()` : Hardcodées + Supabase
- `getAllQuestionsByModule()` : Par module
- `getAllRandomQuestions()` : Questions aléatoires
- Cache de 5 minutes pour les performances

---

## 🎯 Workflow après configuration

### Pour l'administrateur :

1. **Allez sur** `/codex/admin`
2. **Configurez** et générez les questions via l'IA
3. **Cliquez** sur le bouton vert "💾 Sauvegarder"
4. **Les questions sont sauvegardées** dans Supabase
5. **Immédiatement disponibles** dans les quiz (aucun redéploiement nécessaire)

### Pour les utilisateurs :

1. **Allez sur** `/codex`
2. **Choisissez** un module
3. **Lancez un quiz**
4. **Les questions** incluent automatiquement :
   - Les 14 questions de base (hardcodées)
   - TOUTES les questions générées via l'IA (Supabase)

---

## 📊 Avantages de cette approche

✅ **Fonctionne en production** (Vercel, Netlify, etc.)
✅ **Pas de rebuild nécessaire** pour ajouter des questions
✅ **Questions persistées** en base de données
✅ **Performance** avec cache de 5 minutes
✅ **Flexibilité** : questions hardcodées + dynamiques
✅ **Évolutif** : peut gérer des milliers de questions
✅ **Versioning** : questions de base dans Git, générées dans DB

---

## 🔧 Commandes utiles

### Voir les stats des questions
```typescript
import { getQuestionsStats } from '@/lib/codex/all-questions';

const stats = await getQuestionsStats();
console.log(stats);
// {
//   total: 314,
//   hardcoded: 14,
//   generated: 300,
//   byModule: { 'iso-9001': 34, 'gdp': 45, ... }
// }
```

### Invalider le cache
```typescript
import { invalidateQuestionsCache } from '@/lib/codex/all-questions';
invalidateQuestionsCache();
```

### Supprimer toutes les questions générées (reset)
```typescript
import { deleteAllGeneratedQuestions } from '@/lib/codex/supabase-questions';
await deleteAllGeneratedQuestions();
```

---

## 🐛 Dépannage

### Erreur "Table does not exist"
➡️ Exécutez le script SQL `supabase-codex-schema.sql` dans Supabase

### Erreur "Permission denied"
➡️ Vérifiez que les politiques RLS sont bien configurées dans Supabase

### Les questions n'apparaissent pas
➡️ Vérifiez que vous utilisez bien `getAllQuestions()` et non `quizQuestions` directement
➡️ Invalidez le cache avec `invalidateQuestionsCache()`

### Performance lente
➡️ Le cache de 5 minutes devrait résoudre ce problème
➡️ Vérifiez les index dans Supabase (créés automatiquement par le script)

---

## 📚 Prochaines étapes

1. ✅ Exécuter le script SQL dans Supabase
2. ✅ Mettre à jour `app/(dashboard)/codex/admin/page.tsx`
3. ✅ Tester la génération et sauvegarde de questions
4. ✅ Vérifier que les questions apparaissent dans les quiz

---

**Questions ?** Consultez la documentation Supabase : https://supabase.com/docs
