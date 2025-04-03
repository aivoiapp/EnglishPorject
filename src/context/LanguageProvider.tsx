import React, { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LanguageContext, { LanguageContextType } from './LanguageContext';

// Import translation files
import translationEN from '../locales/en/translation.json';
import translationES from '../locales/es/translation.json';

// Define the type for supported languages
type SupportedLanguages = 'en' | 'es';

// Define types for translation structure based on i18next's expected types
interface TranslationContent {
  [key: string]: string | TranslationContent | Array<string | TranslationContent>;
}

// Define namespace structure that matches ResourceLanguage from i18next
interface ResourceNamespaces {
  [namespace: string]: TranslationContent;
}

// i18next resources configuration that matches the Resource type expected by i18next
const resources: {
  [language: string]: ResourceNamespaces;
} = {
  en: { translation: translationEN },
  es: { translation: translationES },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Default language if none is detected
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguages>('es'); // Default to Spanish

  const changeLanguage = (lang: string) => { // Accept string type
    if (resources[lang as SupportedLanguages]) { // Cast to SupportedLanguages
      i18n.changeLanguage(lang);
      setLanguage(lang as SupportedLanguages);
      localStorage.setItem('i18nextLng', lang);
    }
  };

  // Initialize language based on browser settings
  useEffect(() => {
    // Get browser language and simplify it (e.g., 'en-US' → 'en')
    const browserLang = i18n.language.split('-')[0] as SupportedLanguages;
    
    // If browser language is not supported, default to Spanish
    // Otherwise use the browser language
    if (!Object.keys(resources).includes(browserLang)) {
      i18n.changeLanguage('es');
      setLanguage('es');
    } else {
      i18n.changeLanguage(browserLang);
      setLanguage(browserLang);
    }
  }, []);

  const contextValue: LanguageContextType = {
    language,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;