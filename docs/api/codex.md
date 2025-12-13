# Codex API

Endpoints for managing learning modules, content, and AI-generated quiz questions.

## List Modules

Get a list of all available learning modules.

**Endpoint:** `GET /api/codex/modules`

**Authentication:** Required

**Rate Limit:** 30 requests per minute

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| difficulty | string | Filter by difficulty: `easy`, `medium`, `hard` |
| tag | string | Filter by tag |
| completed | boolean | Filter by completion status |
| limit | number | Max results (default: 50, max: 100) |
| offset | number | Pagination offset |

### Response (200 OK)

```json
{
  "modules": [
    {
      "id": "module-uuid",
      "title": "Introduction to Safety",
      "description": "Learn basic safety protocols",
      "difficulty": "easy",
      "estimated_duration": 30,
      "xp_reward": 50,
      "tags": ["safety", "basics"],
      "completed": false,
      "progress": 0
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

### Example

```typescript
const response = await fetch('/api/codex/modules?difficulty=easy&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { modules, total } = await response.json();
```

---

## Get Module

Get detailed information about a specific module.

**Endpoint:** `GET /api/codex/modules/:id`

**Authentication:** Required

### Response (200 OK)

```json
{
  "id": "module-uuid",
  "title": "Introduction to Safety",
  "description": "Learn basic safety protocols and procedures",
  "difficulty": "easy",
  "estimated_duration": 30,
  "xp_reward": 50,
  "content": {
    "sections": [
      {
        "title": "Section 1",
        "type": "text",
        "content": "Safety is paramount..."
      },
      {
        "title": "Quiz",
        "type": "quiz",
        "questions": [...]
      }
    ]
  },
  "tags": ["safety", "basics"],
  "prerequisites": [],
  "next_modules": ["module-2"],
  "user_progress": {
    "started_at": "2024-12-01T10:00:00Z",
    "completed_at": null,
    "progress_percentage": 45,
    "time_spent_minutes": 15
  }
}
```

### Errors

- `404` - Module not found

---

## Complete Module

Mark a module as completed and award XP.

**Endpoint:** `POST /api/codex/modules/:id/complete`

**Authentication:** Required

### Request Body

```json
{
  "time_spent_minutes": 35,
  "quiz_score": 0.85
}
```

### Response (200 OK)

```json
{
  "message": "Module completed successfully",
  "xp_earned": 50,
  "achievements_unlocked": [
    {
      "id": "first-module",
      "title": "First Steps",
      "description": "Complete your first module"
    }
  ],
  "next_modules": ["module-2", "module-3"]
}
```

---

## Generate Questions

Generate quiz questions using AI for a specific module.

**Endpoint:** `POST /api/codex/generate-questions`

**Authentication:** Required (Director only)

**Rate Limit:** 5 requests per minute (AI preset)

### Request Body

```json
{
  "module_id": "module-uuid",
  "topic": "Safety protocols for manufacturing",
  "difficulty": "medium",
  "count": 10,
  "language": "fr"
}
```

### Response (200 OK)

```json
{
  "questions": [
    {
      "question": "Quel est le premier geste en cas d'incendie?",
      "difficulty": "medium",
      "choices": [
        "Appeler les pompiers",
        "Utiliser un extincteur",
        "Évacuer immédiatement",
        "Fermer les portes"
      ],
      "correct_index": 2,
      "explanation": "L'évacuation immédiate est la priorité absolue...",
      "tags": ["safety", "fire", "emergency"]
    }
  ],
  "generated_count": 10,
  "module_id": "module-uuid"
}
```

### Errors

- `403` - Insufficient permissions (director only)
- `429` - Rate limit exceeded
- `502` - AI service error

### Example

```typescript
const response = await fetch('/api/codex/generate-questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    module_id: 'module-123',
    topic: 'Workplace safety',
    difficulty: 'medium',
    count: 5,
  }),
});

const { questions } = await response.json();
```

---

## Save Questions

Save quiz questions to the database.

**Endpoint:** `POST /api/codex/save-questions`

**Authentication:** Required (Director only)

**Rate Limit:** 30 requests per minute

### Request Body

```json
{
  "questions": [
    {
      "module_id": "module-uuid",
      "question": "What is the correct safety procedure?",
      "difficulty": "medium",
      "choices": ["A", "B", "C", "D"],
      "correct_index": 2,
      "explanation": "Option C is correct because...",
      "tags": ["safety", "procedures"],
      "source": "ai_generated"
    }
  ]
}
```

### Validation

- **questions**: Array of 1-50 questions
- **choices**: Exactly 4 options
- **correct_index**: 0-3
- **source**: One of `manual`, `ai_generated`, `imported`

### Response (201 Created)

```json
{
  "message": "Questions saved successfully",
  "saved_count": 10,
  "question_ids": ["q-uuid-1", "q-uuid-2", ...]
}
```

### Errors

- `400` - Validation error
- `403` - Insufficient permissions
- `409` - Duplicate question detected

---

## Submit Quiz Answer

Submit an answer to a quiz question.

**Endpoint:** `POST /api/codex/quiz/:question_id/answer`

**Authentication:** Required

### Request Body

```json
{
  "selected_index": 2,
  "time_seconds": 15
}
```

### Response (200 OK)

```json
{
  "correct": true,
  "explanation": "Excellent! Option C is correct because...",
  "xp_earned": 5,
  "statistics": {
    "times_answered": 125,
    "times_correct": 98,
    "success_rate": 0.784
  }
}
```

---

## Module Statistics

Get statistics for a specific module.

**Endpoint:** `GET /api/codex/modules/:id/stats`

**Authentication:** Required (Manager+)

### Response (200 OK)

```json
{
  "module_id": "module-uuid",
  "total_completions": 45,
  "average_score": 0.82,
  "average_time_minutes": 28,
  "completion_rate": 0.73,
  "difficulty_rating": 3.2,
  "top_performers": [
    {
      "user_id": "user-1",
      "score": 0.95,
      "completion_time": 22
    }
  ]
}
```
