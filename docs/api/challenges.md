# Challenges API

Endpoints for managing daily/weekly challenges and competitions.

## List Challenges

Get available challenges for the current user.

**Endpoint:** `GET /api/challenges`

**Authentication:** Required

**Rate Limit:** 30 requests per minute

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status: `active`, `completed`, `expired` |
| difficulty | string | Filter by difficulty: `easy`, `medium`, `hard` |
| type | string | Filter by type: `daily`, `weekly`, `special` |

### Response (200 OK)

```json
{
  "challenges": [
    {
      "id": "challenge-uuid",
      "title": "Daily Streak Master",
      "description": "Complete 5 modules without breaking your streak",
      "type": "daily",
      "difficulty": "medium",
      "xp_reward": 100,
      "badge_reward": "streak-master-badge",
      "time_limit_minutes": 1440,
      "requirements": {
        "modules_count": 5,
        "maintain_streak": true
      },
      "progress": {
        "current": 3,
        "required": 5,
        "percentage": 0.6
      },
      "status": "active",
      "expires_at": "2024-12-14T23:59:59Z",
      "participants_count": 234
    }
  ],
  "total": 5
}
```

---

## Get Challenge

Get detailed information about a specific challenge.

**Endpoint:** `GET /api/challenges/:id`

**Authentication:** Required

### Response (200 OK)

```json
{
  "id": "challenge-uuid",
  "title": "Weekly Champion",
  "description": "Be in top 10 of your team this week",
  "type": "weekly",
  "difficulty": "hard",
  "xp_reward": 500,
  "badge_reward": "weekly-champion",
  "time_limit_minutes": 10080,
  "requirements": {
    "team_rank": 10,
    "min_modules": 20
  },
  "rules": [
    "Complete at least 20 modules",
    "Achieve top 10 rank in your team",
    "Maintain 80% quiz accuracy"
  ],
  "rewards": {
    "xp": 500,
    "badge": {
      "id": "weekly-champion",
      "name": "Weekly Champion",
      "rarity": "legendary"
    }
  },
  "leaderboard": [
    {
      "rank": 1,
      "user_name": "John D.",
      "score": 2450,
      "modules_completed": 35
    }
  ],
  "user_status": {
    "enrolled": true,
    "started_at": "2024-12-08T00:00:00Z",
    "current_rank": 5,
    "progress": 0.75
  }
}
```

---

## Start Challenge

Enroll in a challenge.

**Endpoint:** `POST /api/challenges/:id/start`

**Authentication:** Required

### Response (200 OK)

```json
{
  "message": "Challenge started successfully",
  "challenge_id": "challenge-uuid",
  "started_at": "2024-12-13T10:30:00Z",
  "expires_at": "2024-12-14T23:59:59Z"
}
```

### Errors

- `400` - Already enrolled in this challenge
- `403` - Challenge requirements not met
- `404` - Challenge not found or expired

---

## Complete Challenge

Mark a challenge as completed and claim rewards.

**Endpoint:** `POST /api/challenges/:id/complete`

**Authentication:** Required

### Request Body

```json
{
  "completion_proof": {
    "modules_completed": ["mod-1", "mod-2", "mod-3"],
    "final_score": 2450
  }
}
```

### Response (200 OK)

```json
{
  "message": "Challenge completed successfully!",
  "rewards": {
    "xp_earned": 500,
    "badges_unlocked": [
      {
        "id": "weekly-champion",
        "name": "Weekly Champion",
        "description": "Top performer of the week"
      }
    ],
    "leaderboard_rank": 5
  },
  "achievements": [
    {
      "id": "first-challenge",
      "title": "Challenge Accepted",
      "description": "Complete your first challenge"
    }
  ],
  "next_challenges": ["challenge-2", "challenge-3"]
}
```

### Errors

- `400` - Challenge requirements not met
- `404` - Challenge not found or not started
- `409` - Already completed

---

## Challenge Leaderboard

Get leaderboard for a specific challenge.

**Endpoint:** `GET /api/challenges/:id/leaderboard`

**Authentication:** Required

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max results (default: 10, max: 100) |
| scope | string | `global`, `team`, `company` |

### Response (200 OK)

```json
{
  "challenge_id": "challenge-uuid",
  "scope": "company",
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "user-uuid",
      "user_name": "John D.",
      "avatar_url": "https://...",
      "score": 2450,
      "modules_completed": 35,
      "streak": 15,
      "completed_at": "2024-12-13T18:45:00Z"
    }
  ],
  "current_user": {
    "rank": 12,
    "score": 1850,
    "modules_completed": 28
  },
  "total_participants": 234
}
```

---

## Create Challenge

Create a new challenge (Director only).

**Endpoint:** `POST /api/challenges`

**Authentication:** Required (Director only)

**Rate Limit:** 10 requests per minute

### Request Body

```json
{
  "title": "New Challenge",
  "description": "Challenge description",
  "type": "weekly",
  "difficulty": "medium",
  "xp_reward": 300,
  "badge_reward": "badge-id",
  "time_limit_minutes": 10080,
  "requirements": {
    "modules_count": 15,
    "min_score": 0.8
  },
  "target_audience": {
    "teams": ["team-1", "team-2"],
    "roles": ["operator", "manager"]
  },
  "starts_at": "2024-12-15T00:00:00Z",
  "ends_at": "2024-12-21T23:59:59Z"
}
```

### Response (201 Created)

```json
{
  "challenge_id": "new-challenge-uuid",
  "message": "Challenge created successfully",
  "participants_notified": 125
}
```

### Errors

- `400` - Validation error
- `403` - Insufficient permissions
