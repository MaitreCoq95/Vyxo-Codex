import { describe, it, expect, beforeEach } from 'vitest';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  handleApiError,
} from './error-handler';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with correct properties', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('AppError');
      expect(error.isOperational).toBe(true);
    });

    it('should include details when provided', () => {
      const details = { field: 'email', reason: 'invalid' };
      const error = new AppError('Test error', 400, 'TEST_ERROR', details);

      expect(error.details).toEqual(details);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
      const error = new ValidationError('Invalid input');

      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('AuthenticationError', () => {
    it('should create auth error with 401 status', () => {
      const error = new AuthenticationError('Not authenticated');

      expect(error.message).toBe('Not authenticated');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });
  });

  describe('AuthorizationError', () => {
    it('should create authorization error with 403 status', () => {
      const error = new AuthorizationError('Forbidden');

      expect(error.message).toBe('Forbidden');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('AUTHORIZATION_ERROR');
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with 404 status', () => {
      const error = new NotFoundError('Resource not found');

      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error with 409 status', () => {
      const error = new ConflictError('Resource already exists');

      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with 429 status', () => {
      const error = new RateLimitError('Too many requests');

      expect(error.message).toBe('Too many requests');
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('ExternalServiceError', () => {
    it('should create external service error with 502 status', () => {
      const error = new ExternalServiceError('Service unavailable');

      expect(error.message).toBe('Service unavailable');
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });
});

describe('handleApiError', () => {
  it('should handle AppError correctly', () => {
    const error = new ValidationError('Invalid email');
    const response = handleApiError(error);

    expect(response.status).toBe(400);
    const body = response.json();
    expect(body).toMatchObject({
      error: {
        message: 'Invalid email',
        code: 'VALIDATION_ERROR',
      },
    });
  });

  it('should handle generic errors as 500', () => {
    const error = new Error('Something went wrong');
    const response = handleApiError(error);

    expect(response.status).toBe(500);
    const body = response.json();
    expect(body).toMatchObject({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });
  });

  it('should include details in error response', () => {
    const details = { field: 'email', constraint: 'format' };
    const error = new ValidationError('Invalid format', details);
    const response = handleApiError(error);

    const body = response.json();
    expect(body.error.details).toEqual(details);
  });

  it('should handle Zod validation errors', () => {
    const zodError = {
      name: 'ZodError',
      issues: [
        { path: ['email'], message: 'Invalid email' },
        { path: ['password'], message: 'Too short' },
      ],
    };

    const response = handleApiError(zodError as any);

    expect(response.status).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details).toBeDefined();
  });
});
