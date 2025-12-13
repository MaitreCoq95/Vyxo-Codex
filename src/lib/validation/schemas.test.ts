import { describe, it, expect } from 'vitest';
import {
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  UpdatePasswordSchema,
  ProfileUpdateSchema,
  ChallengeSchema,
  ModuleSchema,
  QuizQuestionSchema,
  StreakSchema,
} from './schemas';

describe('Authentication Schemas', () => {
  describe('LoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'SecureP@ss123',
        remember: true,
      };

      expect(() => LoginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'SecureP@ss123',
      };

      expect(() => LoginSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '',
      };

      expect(() => LoginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('RegisterSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'new@example.com',
        password: 'SecureP@ss123',
        confirmPassword: 'SecureP@ss123',
        full_name: 'John Doe',
        company_name: 'Acme Corp',
        role: 'operator' as const,
      };

      expect(() => RegisterSchema.parse(validData)).not.toThrow();
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'new@example.com',
        password: 'SecureP@ss123',
        confirmPassword: 'DifferentP@ss123',
        full_name: 'John Doe',
        company_name: 'Acme Corp',
        role: 'operator' as const,
      };

      expect(() => RegisterSchema.parse(invalidData)).toThrow();
    });

    it('should reject weak passwords', () => {
      const invalidData = {
        email: 'new@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        full_name: 'John Doe',
        company_name: 'Acme Corp',
        role: 'operator' as const,
      };

      expect(() => RegisterSchema.parse(invalidData)).toThrow();
    });

    it('should reject invalid roles', () => {
      const invalidData = {
        email: 'new@example.com',
        password: 'SecureP@ss123',
        confirmPassword: 'SecureP@ss123',
        full_name: 'John Doe',
        company_name: 'Acme Corp',
        role: 'superadmin',
      };

      expect(() => RegisterSchema.parse(invalidData)).toThrow();
    });
  });

  describe('ResetPasswordSchema', () => {
    it('should validate email', () => {
      expect(() => ResetPasswordSchema.parse({ email: 'user@example.com' })).not.toThrow();
    });

    it('should reject invalid email', () => {
      expect(() => ResetPasswordSchema.parse({ email: 'invalid' })).toThrow();
    });
  });

  describe('UpdatePasswordSchema', () => {
    it('should validate matching passwords', () => {
      const validData = {
        newPassword: 'NewSecureP@ss123',
        confirmPassword: 'NewSecureP@ss123',
      };

      expect(() => UpdatePasswordSchema.parse(validData)).not.toThrow();
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        newPassword: 'NewSecureP@ss123',
        confirmPassword: 'DifferentP@ss123',
      };

      expect(() => UpdatePasswordSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('Profile Schema', () => {
  describe('ProfileUpdateSchema', () => {
    it('should validate profile updates', () => {
      const validData = {
        full_name: 'Jane Smith',
        avatar_url: 'https://example.com/avatar.jpg',
      };

      expect(() => ProfileUpdateSchema.parse(validData)).not.toThrow();
    });

    it('should allow partial updates', () => {
      expect(() => ProfileUpdateSchema.parse({ full_name: 'Jane Smith' })).not.toThrow();
      expect(() => ProfileUpdateSchema.parse({ avatar_url: 'https://example.com/avatar.jpg' })).not.toThrow();
    });
  });
});

describe('Challenge Schema', () => {
  describe('ChallengeSchema', () => {
    it('should validate challenge data', () => {
      const validData = {
        title: 'Daily Challenge',
        description: 'Complete 5 modules today',
        difficulty: 'medium' as const,
        xp_reward: 100,
        time_limit_minutes: 30,
        requirements: { modules_count: 5 },
      };

      expect(() => ChallengeSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid difficulty', () => {
      const invalidData = {
        title: 'Challenge',
        difficulty: 'ultra-hard',
        xp_reward: 100,
      };

      expect(() => ChallengeSchema.parse(invalidData)).toThrow();
    });

    it('should reject negative XP', () => {
      const invalidData = {
        title: 'Challenge',
        difficulty: 'easy' as const,
        xp_reward: -50,
      };

      expect(() => ChallengeSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('Module Schema', () => {
  describe('ModuleSchema', () => {
    it('should validate module data', () => {
      const validData = {
        title: 'Introduction to Safety',
        description: 'Learn basic safety protocols',
        difficulty: 'easy' as const,
        estimated_duration: 30,
        xp_reward: 50,
        content: { sections: [] },
        tags: ['safety', 'basics'],
      };

      expect(() => ModuleSchema.parse(validData)).not.toThrow();
    });

    it('should require positive duration', () => {
      const invalidData = {
        title: 'Module',
        difficulty: 'easy' as const,
        estimated_duration: 0,
        xp_reward: 50,
      };

      expect(() => ModuleSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('Quiz Question Schema', () => {
  describe('QuizQuestionSchema', () => {
    it('should validate quiz question', () => {
      const validData = {
        module_id: 'module-123',
        question: 'What is the correct procedure?',
        difficulty: 'medium' as const,
        choices: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_index: 0,
        explanation: 'Option A is correct because...',
        tags: ['safety', 'procedures'],
      };

      expect(() => QuizQuestionSchema.parse(validData)).not.toThrow();
    });

    it('should require exactly 4 choices', () => {
      const invalidData = {
        module_id: 'module-123',
        question: 'Question?',
        difficulty: 'easy' as const,
        choices: ['A', 'B'],
        correct_index: 0,
        explanation: 'Explanation',
      };

      expect(() => QuizQuestionSchema.parse(invalidData)).toThrow();
    });

    it('should validate correct_index range', () => {
      const invalidData = {
        module_id: 'module-123',
        question: 'Question?',
        difficulty: 'easy' as const,
        choices: ['A', 'B', 'C', 'D'],
        correct_index: 4, // out of range
        explanation: 'Explanation',
      };

      expect(() => QuizQuestionSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('Streak Schema', () => {
  describe('StreakSchema', () => {
    it('should validate streak data', () => {
      const validData = {
        current_streak: 5,
        longest_streak: 10,
        last_activity_date: new Date().toISOString(),
      };

      expect(() => StreakSchema.parse(validData)).not.toThrow();
    });

    it('should reject negative streaks', () => {
      const invalidData = {
        current_streak: -1,
        longest_streak: 10,
      };

      expect(() => StreakSchema.parse(invalidData)).toThrow();
    });
  });
});
