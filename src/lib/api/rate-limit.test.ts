import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  rateLimit,
  RateLimitPresets,
  rateLimitByUser,
  rateLimitByEndpoint,
  getRateLimitStats,
  resetRateLimit,
  clearRateLimitStore,
} from './rate-limit';
import { RateLimitError } from './error-handler';

// Helper to create mock NextRequest
function createMockRequest(ip: string = '127.0.0.1'): NextRequest {
  const headers = new Headers();
  headers.set('x-forwarded-for', ip);

  return {
    headers,
    url: 'http://localhost:3000/api/test',
    method: 'GET',
  } as any as NextRequest;
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  describe('rateLimit', () => {
    it('should allow requests within limit', async () => {
      const config = {
        maxRequests: 3,
        windowSeconds: 60,
      };
      const request = createMockRequest();

      await expect(rateLimit(request, config)).resolves.toBeUndefined();
      await expect(rateLimit(request, config)).resolves.toBeUndefined();
      await expect(rateLimit(request, config)).resolves.toBeUndefined();
    });

    it('should block requests exceeding limit', async () => {
      const config = {
        maxRequests: 2,
        windowSeconds: 60,
      };
      const request = createMockRequest();

      await rateLimit(request, config);
      await rateLimit(request, config);

      await expect(rateLimit(request, config)).rejects.toThrow(RateLimitError);
    });

    it('should use custom key generator', async () => {
      const config = {
        maxRequests: 2,
        windowSeconds: 60,
        keyGenerator: () => 'custom-key',
      };

      const request1 = createMockRequest('192.168.1.1');
      const request2 = createMockRequest('192.168.1.2');

      // Both requests use same key, so they share rate limit
      await rateLimit(request1, config);
      await rateLimit(request2, config);

      await expect(rateLimit(request1, config)).rejects.toThrow(RateLimitError);
    });

    it('should reset after window expires', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 1, // 1 second window
      };
      const request = createMockRequest();

      await rateLimit(request, config);
      await expect(rateLimit(request, config)).rejects.toThrow(RateLimitError);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should allow request again
      await expect(rateLimit(request, config)).resolves.toBeUndefined();
    });

    it('should track different IPs separately', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 60,
      };

      const request1 = createMockRequest('192.168.1.1');
      const request2 = createMockRequest('192.168.1.2');

      await rateLimit(request1, config);
      await expect(rateLimit(request1, config)).rejects.toThrow(RateLimitError);

      // Different IP should have its own limit
      await expect(rateLimit(request2, config)).resolves.toBeUndefined();
    });

    it('should use custom error message', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 60,
        message: 'Custom rate limit message',
      };
      const request = createMockRequest();

      await rateLimit(request, config);

      try {
        await rateLimit(request, config);
        expect.fail('Should have thrown RateLimitError');
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).message).toContain('Custom');
      }
    });
  });

  describe('RateLimitPresets', () => {
    it('should have strict preset', () => {
      expect(RateLimitPresets.strict).toEqual({
        maxRequests: 10,
        windowSeconds: 60,
        message: expect.any(String),
      });
    });

    it('should have standard preset', () => {
      expect(RateLimitPresets.standard).toEqual({
        maxRequests: 30,
        windowSeconds: 60,
        message: expect.any(String),
      });
    });

    it('should have ai preset', () => {
      expect(RateLimitPresets.ai).toEqual({
        maxRequests: 5,
        windowSeconds: 60,
        message: expect.any(String),
      });
    });

    it('should have auth preset with longer window', () => {
      expect(RateLimitPresets.auth).toEqual({
        maxRequests: 5,
        windowSeconds: 900,
        message: expect.any(String),
      });
    });
  });

  describe('rateLimitByUser', () => {
    it('should rate limit by user ID', async () => {
      const config = {
        maxRequests: 2,
        windowSeconds: 60,
      };
      const request = createMockRequest();
      const userId = 'user-123';

      await rateLimitByUser(request, userId, config);
      await rateLimitByUser(request, userId, config);

      await expect(rateLimitByUser(request, userId, config)).rejects.toThrow(
        RateLimitError
      );
    });

    it('should track different users separately', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 60,
      };
      const request = createMockRequest();

      await rateLimitByUser(request, 'user-1', config);
      await expect(rateLimitByUser(request, 'user-1', config)).rejects.toThrow(
        RateLimitError
      );

      // Different user should have own limit
      await expect(
        rateLimitByUser(request, 'user-2', config)
      ).resolves.toBeUndefined();
    });
  });

  describe('rateLimitByEndpoint', () => {
    it('should rate limit by endpoint and IP', async () => {
      const config = {
        maxRequests: 2,
        windowSeconds: 60,
      };
      const request = createMockRequest('192.168.1.1');

      await rateLimitByEndpoint(request, '/api/test', config);
      await rateLimitByEndpoint(request, '/api/test', config);

      await expect(
        rateLimitByEndpoint(request, '/api/test', config)
      ).rejects.toThrow(RateLimitError);
    });

    it('should track different endpoints separately', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 60,
      };
      const request = createMockRequest();

      await rateLimitByEndpoint(request, '/api/endpoint1', config);
      await expect(
        rateLimitByEndpoint(request, '/api/endpoint1', config)
      ).rejects.toThrow(RateLimitError);

      // Different endpoint should have own limit
      await expect(
        rateLimitByEndpoint(request, '/api/endpoint2', config)
      ).resolves.toBeUndefined();
    });
  });

  describe('Rate Limit Stats', () => {
    it('should return null for non-existent key', () => {
      const stats = getRateLimitStats('non-existent-key');
      expect(stats).toBeNull();
    });

    it('should return stats for active rate limit', async () => {
      const config = {
        maxRequests: 5,
        windowSeconds: 60,
      };
      const request = createMockRequest();

      await rateLimit(request, config);
      await rateLimit(request, config);

      const key = 'rate_limit:127.0.0.1';
      const stats = getRateLimitStats(key);

      expect(stats).toBeDefined();
      expect(stats?.remaining).toBeGreaterThan(0);
      expect(stats?.resetIn).toBeGreaterThan(0);
      expect(stats?.resetIn).toBeLessThanOrEqual(60);
    });
  });

  describe('resetRateLimit', () => {
    it('should reset rate limit for a key', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 60,
      };
      const request = createMockRequest();

      await rateLimit(request, config);
      await expect(rateLimit(request, config)).rejects.toThrow(RateLimitError);

      const key = 'rate_limit:127.0.0.1';
      resetRateLimit(key);

      // Should be able to make requests again
      await expect(rateLimit(request, config)).resolves.toBeUndefined();
    });
  });

  describe('clearRateLimitStore', () => {
    it('should clear all rate limits', async () => {
      const config = {
        maxRequests: 1,
        windowSeconds: 60,
      };

      const request1 = createMockRequest('192.168.1.1');
      const request2 = createMockRequest('192.168.1.2');

      await rateLimit(request1, config);
      await rateLimit(request2, config);

      clearRateLimitStore();

      // Both should be able to make requests again
      await expect(rateLimit(request1, config)).resolves.toBeUndefined();
      await expect(rateLimit(request2, config)).resolves.toBeUndefined();
    });
  });
});
