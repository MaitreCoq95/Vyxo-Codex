/**
 * Vyxo Codex 2.0 - Validation Schemas
 * Schémas Zod réutilisables pour la validation des formulaires et API
 */

import { z } from 'zod';

/**
 * Schémas de base réutilisables
 */

export const EmailSchema = z
  .string()
  .email('Email invalide')
  .min(5, 'Email trop court')
  .max(255, 'Email trop long')
  .toLowerCase()
  .trim();

export const PasswordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe est trop long')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const UUIDSchema = z
  .string()
  .uuid('ID invalide');

export const DateStringSchema = z
  .string()
  .datetime('Date invalide');

export const PhoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide')
  .optional();

export const URLSchema = z
  .string()
  .url('URL invalide')
  .max(2048, 'URL trop longue');

/**
 * Schémas User & Profile
 */

export const UserRoleSchema = z.enum(['operator', 'manager', 'director']);

export const ProfileCreateSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  role: UserRoleSchema,
  company_id: UUIDSchema,
  team_id: UUIDSchema.optional(),
  email: EmailSchema,
});

export const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  role: UserRoleSchema.optional(),
  team_id: UUIDSchema.optional().nullable(),
  mentor_level: z.boolean().optional(),
});

/**
 * Schémas Authentication
 */

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
  remember: z.boolean().optional(),
});

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  company_name: z.string().min(2).max(200),
  role: UserRoleSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const ResetPasswordSchema = z.object({
  email: EmailSchema,
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Le nouveau mot de passe doit être différent',
  path: ['newPassword'],
});

/**
 * Schémas Team
 */

export const TeamCreateSchema = z.object({
  name: z.string().min(2, 'Le nom de l\'équipe doit contenir au moins 2 caractères').max(100),
  manager_id: UUIDSchema,
  description: z.string().max(500).optional(),
});

export const TeamUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  manager_id: UUIDSchema.optional(),
  description: z.string().max(500).optional(),
});

/**
 * Schémas Challenge
 */

export const ChallengeTypeSchema = z.enum([
  'quiz',
  'practical',
  'case_study',
  'document_review',
]);

export const ChallengeDifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const ChallengeCreateSchema = z.object({
  type: ChallengeTypeSchema,
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  difficulty: ChallengeDifficultySchema,
  module_id: z.string().optional(),
  points: z.number().int().min(1).max(1000),
  time_limit_minutes: z.number().int().min(1).max(120).optional(),
});

export const ChallengeSubmitSchema = z.object({
  challenge_id: UUIDSchema,
  answer: z.record(z.any()), // JSON flexible
  time_spent_seconds: z.number().int().min(0),
});

/**
 * Schémas Quiz
 */

export const QuizQuestionSchema = z.object({
  question: z.string().min(10, 'La question doit contenir au moins 10 caractères').max(1000),
  choices: z.array(z.string().min(1)).length(4, 'Il faut exactement 4 choix'),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(20, 'L\'explication doit contenir au moins 20 caractères').max(2000),
  difficulty: ChallengeDifficultySchema,
  tags: z.array(z.string()).min(1, 'Au moins un tag requis').max(10),
  moduleId: z.string().optional(),
});

export const QuizAnswerSchema = z.object({
  question_id: UUIDSchema,
  selected_index: z.number().int().min(0).max(3),
  time_spent_seconds: z.number().int().min(0).max(600),
});

export const QuizSessionSchema = z.object({
  module_id: z.string().optional(),
  difficulty: ChallengeDifficultySchema.optional(),
  question_count: z.number().int().min(1).max(50).default(10),
});

/**
 * Schémas Incident
 */

export const IncidentSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const IncidentCreateSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(200),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères').max(5000),
  severity: IncidentSeveritySchema,
  category: z.string().min(1).max(50),
  team_id: UUIDSchema,
  affected_users: z.array(UUIDSchema).optional(),
  attachments: z.array(z.string()).optional(),
});

export const IncidentUpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  severity: IncidentSeveritySchema.optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  resolution_notes: z.string().max(2000).optional(),
});

/**
 * Schémas Vyxo Flash
 */

export const VyxoFlashCreateSchema = z.object({
  team_id: UUIDSchema,
  titre: z.string().min(5).max(200),
  hook: z.string().min(10).max(500),
  contexte: z.string().min(20).max(2000),
  exercice_pratique: z.object({
    description: z.string().min(10).max(1000),
    question: z.string().min(5).max(500),
    points_cles: z.array(z.string().min(5).max(200)).min(3).max(5),
  }),
  message_cle: z.string().min(10).max(200),
  action_immediate: z.string().min(10).max(500),
  critical_gap: z.record(z.any()).optional(),
  affected_users: z.array(UUIDSchema).optional(),
});

export const VyxoFlashCompleteSchema = z.object({
  flash_id: UUIDSchema,
  notes: z.string().max(2000).optional(),
  team_feedback: z.string().max(1000).optional(),
});

/**
 * Schémas Duel
 */

export const DuelCreateSchema = z.object({
  challenged_id: UUIDSchema,
  module_id: z.string(),
  question_count: z.number().int().min(3).max(20).default(5),
  difficulty: ChallengeDifficultySchema.default('medium'),
  stake_points: z.number().int().min(10).max(500).optional(),
});

export const DuelAnswerSchema = z.object({
  duel_id: UUIDSchema,
  question_id: UUIDSchema,
  selected_index: z.number().int().min(0).max(3),
  time_spent_seconds: z.number().int().min(0).max(120),
});

/**
 * Schémas Badge
 */

export const BadgeAwardSchema = z.object({
  user_id: UUIDSchema,
  badge_id: z.string().min(1).max(50),
  reason: z.string().max(500).optional(),
});

/**
 * Schémas Company
 */

export const CompanyCreateSchema = z.object({
  name: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères').max(200),
  industry: z.string().max(100).optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  country: z.string().length(2, 'Code pays ISO à 2 lettres').optional(),
  logo_url: URLSchema.optional(),
});

export const CompanyUpdateSchema = CompanyCreateSchema.partial();

/**
 * Schémas Analytics & Reporting
 */

export const DateRangeSchema = z.object({
  start_date: DateStringSchema,
  end_date: DateStringSchema,
}).refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
  message: 'La date de fin doit être après la date de début',
  path: ['end_date'],
});

export const AnalyticsQuerySchema = z.object({
  metric: z.enum(['streaks', 'completion_rate', 'imo_score', 'badges', 'duels', 'incidents']),
  group_by: z.enum(['day', 'week', 'month', 'user', 'team']).optional(),
  filters: z.record(z.any()).optional(),
}).merge(DateRangeSchema.partial());

/**
 * Schémas Export
 */

export const ExportFormatSchema = z.enum(['pdf', 'csv', 'json', 'xlsx']);

export const ExportRequestSchema = z.object({
  type: z.enum(['report', 'analytics', 'user_data', 'team_data', 'certificates']),
  format: ExportFormatSchema,
  filters: z.record(z.any()).optional(),
  include_metadata: z.boolean().default(true),
});

/**
 * Schémas File Upload
 */

export const FileUploadSchema = z.object({
  file_name: z.string().min(1).max(255),
  file_type: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i, 'Type MIME invalide'),
  file_size: z.number().int().min(1).max(10 * 1024 * 1024, 'Fichier trop volumineux (max 10MB)'),
  bucket: z.enum(['certificates', 'practical-validations', 'attachments']),
});

/**
 * Helper pour extraire les types TypeScript des schémas
 */

export type UserRole = z.infer<typeof UserRoleSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type TeamCreate = z.infer<typeof TeamCreateSchema>;
export type ChallengeType = z.infer<typeof ChallengeTypeSchema>;
export type ChallengeDifficulty = z.infer<typeof ChallengeDifficultySchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type IncidentSeverity = z.infer<typeof IncidentSeveritySchema>;
export type IncidentCreate = z.infer<typeof IncidentCreateSchema>;
export type VyxoFlashCreate = z.infer<typeof VyxoFlashCreateSchema>;
export type DuelCreate = z.infer<typeof DuelCreateSchema>;
export type ExportFormat = z.infer<typeof ExportFormatSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;
