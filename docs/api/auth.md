# Authentication API

Authentication endpoints for user login, registration, and password management.

## Login

Authenticate a user and receive a session token.

**Endpoint:** `POST /api/auth/login`

**Rate Limit:** 5 requests per 15 minutes (auth preset)

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "remember": true
}
```

### Response (200 OK)

```json
{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1702468800,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "operator"
    }
  }
}
```

### Errors

- `400` - Validation error (invalid email/password format)
- `401` - Invalid credentials
- `429` - Too many login attempts

### Example

```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecureP@ss123',
  }),
});

const { session } = await response.json();
```

---

## Register

Register a new user account.

**Endpoint:** `POST /api/auth/register`

**Rate Limit:** 5 requests per 15 minutes

### Request Body

```json
{
  "email": "newuser@example.com",
  "password": "SecureP@ss123",
  "confirmPassword": "SecureP@ss123",
  "full_name": "John Doe",
  "company_name": "Acme Corp",
  "role": "operator"
}
```

### Validation Rules

- **email**: Valid email format
- **password**: Minimum 8 characters, must include uppercase, lowercase, number, and special character
- **full_name**: 2-100 characters
- **company_name**: 2-100 characters
- **role**: One of `operator`, `manager`, `director`

### Response (201 Created)

```json
{
  "user": {
    "id": "uuid",
    "email": "newuser@example.com",
    "full_name": "John Doe",
    "role": "operator",
    "company_id": "company-uuid"
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

### Errors

- `400` - Validation error
- `409` - Email already exists
- `429` - Too many registration attempts

---

## Reset Password

Request a password reset email.

**Endpoint:** `POST /api/auth/reset-password`

**Rate Limit:** 5 requests per 15 minutes

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Response (200 OK)

```json
{
  "message": "Password reset email sent. Please check your inbox."
}
```

### Errors

- `400` - Invalid email format
- `429` - Too many reset requests

### Example

```typescript
await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
  }),
});
```

---

## Update Password

Update user password (requires valid reset token).

**Endpoint:** `POST /api/auth/update-password`

**Authentication:** Required (reset token)

### Request Body

```json
{
  "newPassword": "NewSecureP@ss123",
  "confirmPassword": "NewSecureP@ss123"
}
```

### Response (200 OK)

```json
{
  "message": "Password updated successfully"
}
```

### Errors

- `400` - Validation error (password requirements not met)
- `401` - Invalid or expired reset token

---

## Logout

End the current user session.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

### Response (200 OK)

```json
{
  "message": "Logout successful"
}
```

### Example

```typescript
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});
```
