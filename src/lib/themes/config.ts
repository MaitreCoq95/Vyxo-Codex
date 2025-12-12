export type Theme = 'light' | 'dark' | 'operator' | 'manager' | 'director';

export const themes = {
  light: {
    name: 'Clair',
    description: 'Thème clair classique',
    colors: {
      background: 'slate-50',
      foreground: 'slate-900',
      card: 'white',
      cardHover: 'slate-50',
      border: 'slate-200',
      primary: 'cyan-500',
      primaryHover: 'cyan-600',
      secondary: 'indigo-500',
      success: 'emerald-500',
      warning: 'amber-500',
      danger: 'rose-500',
      muted: 'slate-100',
      mutedForeground: 'slate-600',
    },
    gradients: {
      primary: 'from-cyan-500 to-indigo-500',
      secondary: 'from-indigo-500 to-purple-500',
      success: 'from-emerald-500 to-teal-500',
      warning: 'from-amber-500 to-orange-500',
      danger: 'from-rose-500 to-red-500',
      hero: 'from-slate-900 via-indigo-900 to-cyan-900',
    },
    ui: {
      buttonSize: 'default',
      fontSize: 'base',
      spacing: 'normal',
      borderRadius: 'lg',
    }
  },
  
  dark: {
    name: 'Sombre',
    description: 'Thème sombre moderne',
    colors: {
      background: 'slate-950',
      foreground: 'slate-50',
      card: 'slate-900',
      cardHover: 'slate-800',
      border: 'slate-800',
      primary: 'cyan-400',
      primaryHover: 'cyan-300',
      secondary: 'indigo-400',
      success: 'emerald-400',
      warning: 'amber-400',
      danger: 'rose-400',
      muted: 'slate-800',
      mutedForeground: 'slate-400',
    },
    gradients: {
      primary: 'from-cyan-400 to-indigo-400',
      secondary: 'from-indigo-400 to-purple-400',
      success: 'from-emerald-400 to-teal-400',
      warning: 'from-amber-400 to-orange-400',
      danger: 'from-rose-400 to-red-400',
      hero: 'from-slate-950 via-indigo-950 to-cyan-950',
    },
    ui: {
      buttonSize: 'default',
      fontSize: 'base',
      spacing: 'normal',
      borderRadius: 'lg',
    }
  },
  
  operator: {
    name: 'Terrain',
    description: 'Optimisé pour mobile et simplicité',
    colors: {
      background: 'white',
      foreground: 'slate-900',
      card: 'white',
      cardHover: 'cyan-50',
      border: 'slate-200',
      primary: 'cyan-600',
      primaryHover: 'cyan-700',
      secondary: 'indigo-600',
      success: 'emerald-600',
      warning: 'amber-600',
      danger: 'rose-600',
      muted: 'slate-100',
      mutedForeground: 'slate-600',
    },
    gradients: {
      primary: 'from-cyan-600 via-cyan-500 to-indigo-500',
      secondary: 'from-indigo-600 to-purple-600',
      success: 'from-emerald-600 to-teal-600',
      warning: 'from-amber-600 to-orange-600',
      danger: 'from-rose-600 to-red-600',
      hero: 'from-cyan-600 to-indigo-600',
    },
    ui: {
      buttonSize: 'lg',
      fontSize: 'base',
      spacing: 'relaxed',
      borderRadius: 'xl',
    }
  },
  
  manager: {
    name: 'Pilotage',
    description: 'Équilibre entre données et actions',
    colors: {
      background: 'slate-50',
      foreground: 'slate-900',
      card: 'white',
      cardHover: 'indigo-50',
      border: 'slate-200',
      primary: 'indigo-500',
      primaryHover: 'indigo-600',
      secondary: 'cyan-500',
      success: 'emerald-500',
      warning: 'amber-500',
      danger: 'rose-500',
      muted: 'slate-100',
      mutedForeground: 'slate-600',
    },
    gradients: {
      primary: 'from-indigo-500 to-cyan-500',
      secondary: 'from-cyan-500 to-blue-500',
      success: 'from-emerald-500 to-teal-500',
      warning: 'from-amber-500 to-rose-500',
      danger: 'from-rose-500 to-red-600',
      hero: 'from-indigo-600 via-indigo-500 to-cyan-500',
    },
    ui: {
      buttonSize: 'default',
      fontSize: 'sm',
      spacing: 'normal',
      borderRadius: 'lg',
    }
  },
  
  director: {
    name: 'Direction',
    description: 'Données denses et analytics',
    colors: {
      background: 'slate-100',
      foreground: 'slate-900',
      card: 'white',
      cardHover: 'slate-50',
      border: 'slate-300',
      primary: 'slate-700',
      primaryHover: 'slate-800',
      secondary: 'cyan-600',
      success: 'emerald-600',
      warning: 'amber-600',
      danger: 'rose-600',
      muted: 'slate-200',
      mutedForeground: 'slate-500',
    },
    gradients: {
      primary: 'from-slate-700 via-indigo-600 to-cyan-600',
      secondary: 'from-cyan-600 to-blue-600',
      success: 'from-emerald-600 to-teal-600',
      warning: 'from-amber-600 to-orange-600',
      danger: 'from-rose-600 to-red-600',
      hero: 'from-slate-800 via-slate-700 to-slate-600',
    },
    ui: {
      buttonSize: 'sm',
      fontSize: 'sm',
      spacing: 'tight',
      borderRadius: 'md',
    }
  }
} as const;

export type ThemeConfig = typeof themes[keyof typeof themes];
