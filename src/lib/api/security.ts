/**
 * Vyxo Codex 2.0 - Security Utilities
 * Headers de sécurité, sanitization, et protection contre les attaques
 */

import { NextResponse } from 'next/server';

/**
 * Headers de sécurité HTTP recommandés
 */
export const SECURITY_HEADERS = {
  // Protection XSS
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',

  // CSP (Content Security Policy)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://api.anthropic.com",
    "frame-ancestors 'none'",
  ].join('; '),

  // Permissions Policy (anciennement Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
  ].join(', '),

  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;

/**
 * Ajouter les headers de sécurité à une réponse
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Créer une réponse JSON avec headers de sécurité
 */
export function secureJsonResponse(
  data: any,
  init?: ResponseInit
): NextResponse {
  const response = NextResponse.json(data, init);
  return withSecurityHeaders(response);
}

/**
 * Sanitizer pour prévenir les injections XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizer pour les noms de fichiers
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
    .substring(0, 255);
}

/**
 * Sanitizer pour les chemins (éviter path traversal)
 */
export function sanitizePath(path: string): string {
  return path
    .replace(/\.\./g, '')
    .replace(/\/\//g, '/')
    .replace(/^\/+/, '')
    .substring(0, 1024);
}

/**
 * Valider une origine CORS
 */
export function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean);

  return allowedOrigins.some((allowed) => origin === allowed);
}

/**
 * Headers CORS pour les réponses API
 */
export function getCorsHeaders(origin?: string | null): Record<string, string> {
  if (!origin || !isAllowedOrigin(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 heures
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Détecter les tentatives d'injection SQL
 */
export function hasSqlInjectionPattern(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /(\bEXEC\b.*\()/i,
    /(\bOR\b.*1\s*=\s*1)/i,
    /('.*--)/,
    /(;.*\bDROP\b)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Détecter les tentatives de XSS
 */
export function hasXssPattern(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Détecter les tentatives de Path Traversal
 */
export function hasPathTraversalPattern(input: string): boolean {
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e\//i,
    /\.\.%2f/i,
  ];

  return pathTraversalPatterns.some((pattern) => pattern.test(input));
}

/**
 * Valider et nettoyer un input utilisateur
 */
export function validateAndSanitizeInput(
  input: string,
  options: {
    allowHtml?: boolean;
    maxLength?: number;
    checkSqlInjection?: boolean;
    checkXss?: boolean;
    checkPathTraversal?: boolean;
  } = {}
): { valid: boolean; sanitized: string; errors: string[] } {
  const {
    allowHtml = false,
    maxLength = 10000,
    checkSqlInjection = true,
    checkXss = true,
    checkPathTraversal = true,
  } = options;

  const errors: string[] = [];
  let sanitized = input;

  // Vérifier la longueur
  if (input.length > maxLength) {
    errors.push(`Input trop long (max ${maxLength} caractères)`);
    sanitized = input.substring(0, maxLength);
  }

  // Vérifier SQL injection
  if (checkSqlInjection && hasSqlInjectionPattern(input)) {
    errors.push('Pattern SQL injection détecté');
  }

  // Vérifier XSS
  if (checkXss && hasXssPattern(input)) {
    errors.push('Pattern XSS détecté');
  }

  // Vérifier Path Traversal
  if (checkPathTraversal && hasPathTraversalPattern(input)) {
    errors.push('Pattern Path Traversal détecté');
  }

  // Sanitizer HTML si nécessaire
  if (!allowHtml) {
    sanitized = sanitizeHtml(sanitized);
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Hash un token pour le stockage sécurisé
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Générer un token aléatoire sécurisé
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Comparer deux strings de manière constant-time (éviter timing attacks)
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Middleware de sécurité pour les routes API
 */
export async function securityMiddleware(request: Request): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const url = new URL(request.url);

  // Vérifier l'origine pour CORS
  const origin = request.headers.get('origin');
  if (origin && !isAllowedOrigin(origin)) {
    return {
      allowed: false,
      reason: 'Origin not allowed',
    };
  }

  // Vérifier les patterns dangereux dans l'URL
  if (hasPathTraversalPattern(url.pathname)) {
    return {
      allowed: false,
      reason: 'Path traversal detected in URL',
    };
  }

  // Vérifier le user agent (bloquer les bots évidents)
  const userAgent = request.headers.get('user-agent');
  if (!userAgent || userAgent.length < 10) {
    return {
      allowed: false,
      reason: 'Invalid or missing user agent',
    };
  }

  // Vérifier la taille du body pour POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentLength = request.headers.get('content-length');
    const maxBodySize = 10 * 1024 * 1024; // 10MB

    if (contentLength && parseInt(contentLength) > maxBodySize) {
      return {
        allowed: false,
        reason: 'Request body too large',
      };
    }
  }

  return { allowed: true };
}

/**
 * Logger les tentatives d'attaque
 */
export function logSecurityEvent(
  type: 'sql_injection' | 'xss' | 'path_traversal' | 'rate_limit' | 'unauthorized',
  details: Record<string, any>
): void {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    ...details,
  };

  console.warn('🚨 Security Event:', JSON.stringify(event));

  // En production, envoyer à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // await sendToSecurityMonitoring(event);
  }
}
