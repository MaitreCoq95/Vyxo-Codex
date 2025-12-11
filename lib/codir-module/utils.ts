// =====================================================
// VYXO CODIR MODULE - UTILITY FUNCTIONS
// =====================================================

import type {
  CodirDecision,
  CodirAction,
  CodirProjet,
  CodirImpact,
  CodirTheme,
} from '@/types/codir-module';

// =====================================================
// DATE UTILITIES
// =====================================================

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateLong(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return `Il y a ${Math.abs(diffInDays)} jours`;
  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return 'Demain';
  if (diffInDays <= 7) return `Dans ${diffInDays} jours`;
  if (diffInDays <= 30) return `Dans ${Math.floor(diffInDays / 7)} semaines`;
  return `Dans ${Math.floor(diffInDays / 30)} mois`;
}

export function isOverdue(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

export function getDaysUntil(deadline: string | null | undefined): number {
  if (!deadline) return 0;
  const date = new Date(deadline);
  const now = new Date();
  return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// =====================================================
// STATUS & STATE UTILITIES
// =====================================================

export function getEtatLabel(etat: string, type: 'decision' | 'action' | 'projet' | 'reunion'): string {
  const labels: Record<string, Record<string, string>> = {
    decision: {
      idee: 'Idée',
      validee: 'Validée',
      en_cours: 'En cours',
      terminee: 'Terminée',
      abandonnee: 'Abandonnée',
    },
    action: {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminée',
      blocked: 'Bloquée',
    },
    projet: {
      en_cours: 'En cours',
      termine: 'Terminé',
      suspendu: 'Suspendu',
      annule: 'Annulé',
    },
    reunion: {
      planifiee: 'Planifiée',
      en_cours: 'En cours',
      terminee: 'Terminée',
    },
  };

  return labels[type]?.[etat] || etat;
}

export function getEtatColor(etat: string, type: 'decision' | 'action' | 'projet' | 'reunion'): string {
  const colors: Record<string, Record<string, string>> = {
    decision: {
      idee: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      validee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      en_cours: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      terminee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      abandonnee: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    action: {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    projet: {
      en_cours: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      termine: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      suspendu: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      annule: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    reunion: {
      planifiee: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      en_cours: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      terminee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
  };

  return colors[type]?.[etat] || 'bg-gray-100 text-gray-800';
}

export function getPrioriteLabel(priorite: number): string {
  const labels: Record<number, string> = {
    1: 'Haute',
    2: 'Moyenne',
    3: 'Basse',
  };
  return labels[priorite] || 'Moyenne';
}

export function getPrioriteColor(priorite: number): string {
  const colors: Record<number, string> = {
    1: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    3: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return colors[priorite] || colors[2];
}

export function getImpactLabel(impact: CodirImpact): string {
  const labels: Record<CodirImpact, string> = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
  };
  return labels[impact] || impact;
}

export function getImpactColor(impact: CodirImpact): string {
  const colors: Record<CodirImpact, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[impact] || colors.medium;
}

export function getThemeColor(theme: CodirTheme): string {
  const colors: Record<CodirTheme, string> = {
    Produit: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Finance: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    Commercial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Ops: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Organisation: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    Tech: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  };
  return colors[theme] || 'bg-gray-100 text-gray-800';
}

// =====================================================
// PROGRESS & STATS UTILITIES
// =====================================================

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getProgressColor(progress: number): string {
  if (progress < 33) return 'bg-red-500';
  if (progress < 66) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function getProgressLabel(progress: number): string {
  if (progress === 0) return 'Non démarré';
  if (progress === 100) return 'Terminé';
  if (progress < 33) return 'Début';
  if (progress < 66) return 'En cours';
  return 'Avancé';
}

// =====================================================
// FILTERING UTILITIES
// =====================================================

export function filterDecisionsByTheme(decisions: CodirDecision[], theme: CodirTheme | null): CodirDecision[] {
  if (!theme) return decisions;
  return decisions.filter(d => d.theme === theme);
}

export function filterDecisionsByEtat(decisions: CodirDecision[], etat: string | null): CodirDecision[] {
  if (!etat) return decisions;
  return decisions.filter(d => d.etat === etat);
}

export function filterActionsByEtat(actions: CodirAction[], etat: string | null): CodirAction[] {
  if (!etat) return actions;
  return actions.filter(a => a.etat === etat);
}

export function filterProjetsByEtat(projets: CodirProjet[], etat: string | null): CodirProjet[] {
  if (!etat) return projets;
  return projets.filter(p => p.etat === etat);
}

export function searchItems<T extends { titre?: string; nom?: string; description?: string }>(
  items: T[],
  query: string
): T[] {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(
    item =>
      item.titre?.toLowerCase().includes(lowerQuery) ||
      item.nom?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery)
  );
}

// =====================================================
// SORTING UTILITIES
// =====================================================

export function sortByDate<T extends { date?: string; deadline?: string; date_decision?: string }>(
  items: T[],
  direction: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.date || a.deadline || a.date_decision || '';
    const dateB = b.date || b.deadline || b.date_decision || '';
    return direction === 'asc'
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });
}

export function sortByPriority<T extends { priorite: number }>(
  items: T[],
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    return direction === 'asc'
      ? a.priorite - b.priorite
      : b.priorite - a.priorite;
  });
}

export function sortByProgress<T extends { avancement?: number; pourcentage_avancement?: number }>(
  items: T[],
  direction: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const progressA = a.avancement || a.pourcentage_avancement || 0;
    const progressB = b.avancement || b.pourcentage_avancement || 0;
    return direction === 'asc'
      ? progressA - progressB
      : progressB - progressA;
  });
}

// =====================================================
// VALIDATION UTILITIES
// =====================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function validateFutureDate(dateStr: string): boolean {
  if (!validateDate(dateStr)) return false;
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day
  return date >= now;
}

// =====================================================
// FORMAT UTILITIES
// =====================================================

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('fr-FR').format(value);
}

// =====================================================
// AUTO-SYNTHESIS UTILITIES
// =====================================================

export function generateSynthese(pointsDiscutes: string): string {
  // Simple synthesis: extract first sentence of each paragraph
  const paragraphs = pointsDiscutes.split('\n\n');
  const firstSentences = paragraphs
    .map(p => {
      const sentences = p.split(/[.!?]/);
      return sentences[0]?.trim();
    })
    .filter(Boolean)
    .slice(0, 3); // Take first 3 key points

  return firstSentences.join('. ') + '.';
}

export function extractKeyPoints(text: string): string[] {
  // Extract bullet points or numbered items
  const lines = text.split('\n');
  const keyPoints = lines
    .filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('-') ||
             trimmed.startsWith('•') ||
             /^\d+\./.test(trimmed);
    })
    .map(line => line.replace(/^[-•\d.]+\s*/, '').trim());

  return keyPoints;
}

// =====================================================
// EXPORT UTILITIES
// =====================================================

export function exportToMarkdown(data: {
  titre: string;
  date?: string;
  contenu: string;
}): string {
  return `# ${data.titre}

${data.date ? `**Date**: ${formatDate(data.date)}\n\n` : ''}

${data.contenu}

---
*Généré par Vyxo Central Hub*
`;
}

export function exportToJSON<T>(data: T): string {
  return JSON.stringify(data, null, 2);
}

// =====================================================
// INITIALS UTILITIES
// =====================================================

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
