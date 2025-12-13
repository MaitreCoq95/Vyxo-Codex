import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  sanitizeHtml,
  sanitizeFilename,
  detectSqlInjection,
  detectXss,
  detectPathTraversal,
  isValidEmail,
  isStrongPassword,
  hashPassword,
  verifyPassword,
} from './security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('Hello<>World')).toBe('HelloWorld');
    });

    it('should preserve safe characters', () => {
      expect(sanitizeInput('Hello World 123')).toBe('Hello World 123');
      expect(sanitizeInput('test@email.com')).toBe('test@email.com');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML entities', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(sanitizeHtml('Hello & goodbye')).toBe('Hello &amp; goodbye');
    });

    it('should handle quotes', () => {
      expect(sanitizeHtml('"quotes"')).toBe('&quot;quotes&quot;');
      expect(sanitizeHtml("'apostrophes'")).toBe('&#x27;apostrophes&#x27;');
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove path traversal attempts', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd');
      expect(sanitizeFilename('../../file.txt')).toBe('file.txt');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeFilename('file<>|:.txt')).toBe('file.txt');
    });

    it('should preserve valid filenames', () => {
      expect(sanitizeFilename('document-2024.pdf')).toBe('document-2024.pdf');
      expect(sanitizeFilename('image_01.jpg')).toBe('image_01.jpg');
    });
  });

  describe('detectSqlInjection', () => {
    it('should detect SQL injection attempts', () => {
      expect(detectSqlInjection("'; DROP TABLE users; --")).toBe(true);
      expect(detectSqlInjection("1' OR '1'='1")).toBe(true);
      expect(detectSqlInjection("admin' --")).toBe(true);
      expect(detectSqlInjection("UNION SELECT * FROM users")).toBe(true);
    });

    it('should allow safe inputs', () => {
      expect(detectSqlInjection('normal text')).toBe(false);
      expect(detectSqlInjection('user@email.com')).toBe(false);
      expect(detectSqlInjection('John Doe')).toBe(false);
    });
  });

  describe('detectXss', () => {
    it('should detect XSS attempts', () => {
      expect(detectXss('<script>alert("xss")</script>')).toBe(true);
      expect(detectXss('<img src=x onerror=alert(1)>')).toBe(true);
      expect(detectXss('javascript:alert(1)')).toBe(true);
      expect(detectXss('<iframe src="evil.com">')).toBe(true);
    });

    it('should allow safe inputs', () => {
      expect(detectXss('Hello World')).toBe(false);
      expect(detectXss('This is a normal sentence.')).toBe(false);
    });
  });

  describe('detectPathTraversal', () => {
    it('should detect path traversal attempts', () => {
      expect(detectPathTraversal('../../../etc/passwd')).toBe(true);
      expect(detectPathTraversal('..\\..\\windows\\system32')).toBe(true);
      expect(detectPathTraversal('/etc/passwd')).toBe(true);
    });

    it('should allow safe paths', () => {
      expect(detectPathTraversal('documents/file.pdf')).toBe(false);
      expect(detectPathTraversal('images/photo.jpg')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@company.co.uk')).toBe(true);
      expect(isValidEmail('admin+tag@domain.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should accept strong passwords', () => {
      expect(isStrongPassword('SecureP@ss123')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd!')).toBe(true);
      expect(isStrongPassword('C0mpl3x!Pass')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isStrongPassword('short')).toBe(false);
      expect(isStrongPassword('nouppercase123!')).toBe(false);
      expect(isStrongPassword('NOLOWERCASE123!')).toBe(false);
      expect(isStrongPassword('NoNumbers!@#')).toBe(false);
      expect(isStrongPassword('NoSpecialChar123')).toBe(false);
    });
  });

  describe('Password hashing', () => {
    it('should hash and verify passwords correctly', async () => {
      const password = 'SecureP@ss123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'SecureP@ss123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword('WrongPassword', hash);
      expect(isValid).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'SecureP@ss123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });
});
