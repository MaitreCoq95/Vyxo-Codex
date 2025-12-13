/**
 * Vyxo Codex 2.0 - Rate Limiting Middleware
 * Protection contre les abus d'API avec stockage en mémoire + Redis (optionnel)
 */

import { NextRequest, NextResponse } from 'next/server';
import { RateLimitError } from './error-handler';

interface RateLimitConfig {
  /**
   * Nombre maximum de requêtes autorisées
   */
  maxRequests: number;

  /**
   * Fenêtre de temps en secondes
   */
  windowSeconds: number;

  /**
   * Message d'erreur personnalisé
   */
  message?: string;

  /**
   * Fonction pour générer la clé de rate limit
   * Par défaut: IP address
   */
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Stockage en mémoire (alternative: Redis)
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Nettoyer les entrées expirées toutes les 60 secondes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * Obtenir l'IP du client
 */
function getClientIP(request: NextRequest): string {
  // Vérifier les headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Middleware de rate limiting
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<void> {
  const {
    maxRequests,
    windowSeconds,
    message,
    keyGenerator = (req) => `rate_limit:${getClientIP(req)}`,
  } = config;

  const key = keyGenerator(request);
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    // Nouvelle fenêtre
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, record);
    return;
  }

  // Incrémenter le compteur
  record.count++;

  if (record.count > maxRequests) {
    const resetIn = Math.ceil((record.resetTime - now) / 1000);
    throw new RateLimitError(
      message || `Trop de requêtes. Réessayez dans ${resetIn} secondes.`
    );
  }
}

/**
 * Wrapper pour créer un middleware de rate limiting
 */
export function withRateLimit<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  config: RateLimitConfig
): T {
  return (async (...args: any[]) => {
    const request = args[0] as NextRequest;

    try {
      await rateLimit(request, config);
      return await handler(...args);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          {
            error: error.message,
            code: 'RATE_LIMIT_EXCEEDED',
          },
          {
            status: 429,
            headers: {
              'Retry-After': config.windowSeconds.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Window': config.windowSeconds.toString(),
            },
          }
        );
      }
      throw error;
    }
  }) as T;
}

/**
 * Configurations prédéfinies
 */
export const RateLimitPresets = {
  /** Strict: 10 req / minute */
  strict: {
    maxRequests: 10,
    windowSeconds: 60,
    message: 'Trop de requêtes. Maximum 10 par minute.',
  },

  /** Standard: 30 req / minute */
  standard: {
    maxRequests: 30,
    windowSeconds: 60,
    message: 'Trop de requêtes. Maximum 30 par minute.',
  },

  /** Genereux: 100 req / minute */
  generous: {
    maxRequests: 100,
    windowSeconds: 60,
    message: 'Trop de requêtes. Maximum 100 par minute.',
  },

  /** AI: 5 req / minute (coûteux) */
  ai: {
    maxRequests: 5,
    windowSeconds: 60,
    message: 'Trop de requêtes IA. Maximum 5 par minute.',
  },

  /** Auth: 5 tentatives / 15 minutes */
  auth: {
    maxRequests: 5,
    windowSeconds: 900, // 15 minutes
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  },

  /** Export: 3 exports / heure */
  export: {
    maxRequests: 3,
    windowSeconds: 3600, // 1 heure
    message: 'Limite d\'exports atteinte. Maximum 3 par heure.',
  },
} as const;

/**
 * Rate limit par utilisateur authentifié
 */
export async function rateLimitByUser(
  request: NextRequest,
  userId: string,
  config: RateLimitConfig
): Promise<void> {
  const customConfig = {
    ...config,
    keyGenerator: () => `rate_limit:user:${userId}`,
  };

  await rateLimit(request, customConfig);
}

/**
 * Rate limit par endpoint
 */
export async function rateLimitByEndpoint(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): Promise<void> {
  const ip = getClientIP(request);
  const customConfig = {
    ...config,
    keyGenerator: () => `rate_limit:${endpoint}:${ip}`,
  };

  await rateLimit(request, customConfig);
}

/**
 * Obtenir les stats de rate limit pour une clé
 */
export function getRateLimitStats(key: string): {
  remaining: number;
  resetIn: number;
} | null {
  const record = rateLimitStore.get(key);

  if (!record) {
    return null;
  }

  const now = Date.now();
  const resetIn = Math.max(0, Math.ceil((record.resetTime - now) / 1000));

  return {
    remaining: Math.max(0, record.count),
    resetIn,
  };
}

/**
 * Réinitialiser le rate limit pour une clé
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Obtenir toutes les clés actives (debug uniquement)
 */
export function getActiveRateLimitKeys(): string[] {
  return Array.from(rateLimitStore.keys());
}

/**
 * Nettoyer toutes les entrées
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
