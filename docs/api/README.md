# Vyxo Codex 2.0 - API Documentation

Comprehensive documentation for the Vyxo Codex 2.0 API endpoints.

## Base URL

```
Production: https://vyxo-codex.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a valid session token from Supabase Auth.

### Authentication Header

```http
Authorization: Bearer <session_token>
```

### Getting a Session Token

1. Login via `/api/auth/login`
2. Use the returned session token in subsequent requests

## Rate Limiting

Rate limits are applied per IP address and endpoint:

| Preset | Limit | Window |
|--------|-------|--------|
| Strict | 10 req | 1 min |
| Standard | 30 req | 1 min |
| Generous | 100 req | 1 min |
| AI | 5 req | 1 min |
| Auth | 5 req | 15 min |
| Export | 3 req | 1 hour |

### Rate Limit Headers

```http
X-RateLimit-Limit: 30
X-RateLimit-Window: 60
Retry-After: 45
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400) - Invalid request data
- `AUTHENTICATION_ERROR` (401) - Missing or invalid authentication
- `AUTHORIZATION_ERROR` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error
- `EXTERNAL_SERVICE_ERROR` (502) - External service failure

## API Endpoints

### Authentication
- [POST /api/auth/login](./auth.md#login) - User login
- [POST /api/auth/register](./auth.md#register) - User registration
- [POST /api/auth/logout](./auth.md#logout) - User logout
- [POST /api/auth/reset-password](./auth.md#reset-password) - Password reset

### User Profile
- [GET /api/profile](./profile.md#get-profile) - Get user profile
- [PUT /api/profile](./profile.md#update-profile) - Update profile
- [GET /api/profile/stats](./profile.md#get-stats) - Get user statistics

### Codex (Learning Modules)
- [GET /api/codex/modules](./codex.md#list-modules) - List all modules
- [GET /api/codex/modules/:id](./codex.md#get-module) - Get module details
- [POST /api/codex/modules/:id/complete](./codex.md#complete-module) - Mark module complete
- [POST /api/codex/generate-questions](./codex.md#generate-questions) - AI-generate quiz questions
- [POST /api/codex/save-questions](./codex.md#save-questions) - Save quiz questions

### Challenges
- [GET /api/challenges](./challenges.md#list-challenges) - List challenges
- [GET /api/challenges/:id](./challenges.md#get-challenge) - Get challenge details
- [POST /api/challenges/:id/start](./challenges.md#start-challenge) - Start a challenge
- [POST /api/challenges/:id/complete](./challenges.md#complete-challenge) - Complete a challenge

### Teams
- [GET /api/teams](./teams.md#list-teams) - List teams
- [GET /api/teams/:id](./teams.md#get-team) - Get team details
- [POST /api/teams](./teams.md#create-team) - Create team (manager+)
- [PUT /api/teams/:id](./teams.md#update-team) - Update team (manager+)

### Analytics (Director Only)
- [GET /api/analytics/overview](./analytics.md#overview) - Company overview
- [GET /api/analytics/imo-score](./analytics.md#imo-score) - IMO score calculation
- [GET /api/analytics/progress](./analytics.md#progress) - Team progress
- [POST /api/analytics/export](./analytics.md#export) - Export analytics data

### Notifications
- [GET /api/notifications](./notifications.md#list) - List notifications
- [PUT /api/notifications/:id/read](./notifications.md#mark-read) - Mark as read
- [POST /api/notifications/subscribe](./notifications.md#subscribe) - Subscribe to push
- [POST /api/notifications/send](./notifications.md#send) - Send notification (internal)

## Code Examples

### JavaScript/TypeScript

```typescript
import { createClient } from '@/infrastructure/supabase/client';

// Initialize Supabase client
const supabase = createClient();

// Get session token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Make authenticated request
const response = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

### cURL

```bash
# Login
curl -X POST https://vyxo-codex.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecureP@ss123"}'

# Get profile (authenticated)
curl -X GET https://vyxo-codex.vercel.app/api/profile \
  -H "Authorization: Bearer <token>"
```

## Versioning

Current API version: `v1`

The API version is implicit in the base URL. Future versions will be available at `/api/v2`, etc.

## Changelog

### 2024-12-13
- Initial API documentation
- Added authentication endpoints
- Added codex module endpoints
- Added rate limiting
- Added comprehensive error handling

## Support

For API support, please contact:
- Email: support@vyxo-codex.com
- GitHub Issues: https://github.com/vyxo/vyxo-codex/issues
