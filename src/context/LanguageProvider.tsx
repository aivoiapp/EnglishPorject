import React, { useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LanguageContext, { LanguageContextType } from './LanguageContext';
import { detectPreferredLanguage } from '../services/geoLocationService';

// Import translation files
import translationEN from '../locales/en/translation.json';
import translationES from '../locales/es/translation.json';

// i18next resources configuration
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Default language if none is detected
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  // Function to change language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  // Detect language based on user's location asynchronously
  useEffect(() => {
    const detectLanguageByIP = async () => {
      const savedLanguage = localStorage.getItem('i18nextLng');

      // If a language is already saved, do nothing
      if (savedLanguage) return;

      try {
        const detectedLanguage = await detectPreferredLanguage();
        if (detectedLanguage && detectedLanguage !== i18n.language) {
          i18n.changeLanguage(detectedLanguage);
          setLanguage(detectedLanguage);
        }
      } catch (error) {
        console.error('Error detecting language by IP:', error);
      }
    };

    detectLanguageByIP();
  }, []);

  // Context value
  const contextValue: LanguageContextType = {
    language,
    changeLanguage,
    isDetectingLocation: false // No need for a loading state
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;