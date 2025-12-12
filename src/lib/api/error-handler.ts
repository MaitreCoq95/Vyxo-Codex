/**
 * Vyxo Codex 2.0 - API Error Handler
 * Gestion centralisée des erreurs pour les routes API
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(403, message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(429, message, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

/**
 * Handler centralisé pour les erreurs API
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Erreur Zod (validation)
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      },
      { status: 400 }
    );
  }

  // Erreur API personnalisée
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  // Erreur Supabase
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string; details?: string };

    // Erreurs Supabase courantes
    if (supabaseError.code === '23505') {
      // Unique violation
      return NextResponse.json(
        {
          error: 'Resource already exists',
          code: 'DUPLICATE_ERROR',
          details: supabaseError.details,
        },
        { status: 409 }
      );
    }

    if (supabaseError.code === '23503') {
      // Foreign key violation
      return NextResponse.json(
        {
          error: 'Referenced resource not found',
          code: 'FOREIGN_KEY_ERROR',
          details: supabaseError.details,
        },
        { status: 400 }
      );
    }

    if (supabaseError.code === 'PGRST116') {
      // Row not found
      return NextResponse.json(
        {
          error: 'Resource not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }
  }

  // Erreur générique
  const message = error instanceof Error ? error.message : 'Internal server error';

  return NextResponse.json(
    {
      error: message,
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Wrapper pour les handlers API avec gestion automatique des erreurs
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  }) as T;
}

/**
 * Validation de l'authentification
 */
export async function requireAuth(request: Request): Promise<string> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  if (!token) {
    throw new AuthenticationError('No token provided');
  }

  // Ici vous pouvez valider le token avec Supabase
  // Pour l'instant on retourne juste le token
  return token;
}

/**
 * Validation du service role
 */
export function requireServiceRole(request: Request): void {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  if (token !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AuthorizationError('Service role key required');
  }
}

/**
 * Extraire l'utilisateur authentifié depuis Supabase
 */
export async function getAuthenticatedUser(request: Request) {
  const { createClient } = await import('@supabase/supabase-js');

  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError();
  }

  const token = authHeader.substring(7);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return data.user;
}

/**
 * Logger structuré pour les erreurs
 */
export function logError(error: unknown, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    error: {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...(error instanceof ApiError && {
        statusCode: error.statusCode,
        code: error.code,
        details: error.details,
      }),
    },
  };

  console.error('API Error:', JSON.stringify(errorInfo, null, 2));

  // En production, vous pourriez envoyer à un service de monitoring
  // comme Sentry, Datadog, etc.
  if (process.env.NODE_ENV === 'production') {
    // await sendToMonitoring(errorInfo);
  }
}
