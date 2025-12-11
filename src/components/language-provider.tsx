"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, Language, TranslationKeys } from "@/lib/i18n/translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKeys) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    const savedLang = localStorage.getItem("vyxo-language") as Language
    if (savedLang) {
      setLanguage(savedLang)
    } else {
      // Set French as default if no saved preference
      setLanguage("fr")
      localStorage.setItem("vyxo-language", "fr")
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("vyxo-language", lang)
  }

  const t = (key: TranslationKeys) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
