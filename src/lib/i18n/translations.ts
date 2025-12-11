export type Language = "en" | "fr"

export type TranslationKeys = keyof typeof translations.en

export const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.codex": "Vyxo Codex",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Dashboard
    "dash.welcome": "Welcome back,",
    "dash.loading": "Loading dashboard...",
    "dash.title": "Dashboard",
    "dash.subtitle": "Welcome to Vyxo Codex.",
    "dash.activeClientsCount": "Active Learners", // Reused or can be changed

    // Header
    "header.searchPlaceholder": "Search modules...",
    "header.profile": "Profile",
    "header.settings": "Settings",
    "header.billing": "Billing",
    "header.logout": "Log out",
    "header.vyxoConsultant": "Vyxo Learner",
  },
  fr: {
    // Navigation
    "nav.dashboard": "Tableau de Bord",
    "nav.codex": "Vyxo Codex",
    "nav.settings": "Paramètres",
    "nav.logout": "Déconnexion",

    // Dashboard
    "dash.welcome": "Bon retour,",
    "dash.loading": "Chargement...",
    "dash.title": "Tableau de Bord",
    "dash.subtitle": "Bienvenue sur Vyxo Codex.",
    "dash.activeClientsCount": "Apprenants Actifs",

    // Header
    "header.searchPlaceholder": "Rechercher modules...",
    "header.profile": "Profil",
    "header.settings": "Paramètres",
    "header.billing": "Facturation",
    "header.logout": "Déconnexion",
    "header.vyxoConsultant": "Apprenant Vyxo",
  }
}
