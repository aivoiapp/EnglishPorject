import React, { useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LanguageContext, { LanguageContextType } from './LanguageContext';
import { detectPreferredLanguage } from '../services/geoLocationService';

// Importar archivos de traducción
import translationEN from '../locales/en/translation.json';
import translationES from '../locales/es/translation.json';

// Configuración de recursos de i18next
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

// Inicializar i18next
i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto si no se detecta ninguno
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false // No es necesario para React
    }
  });

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Función para cambiar el idioma
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    // Guardar la preferencia del usuario en localStorage
    localStorage.setItem('i18nextLng', lang);
  };

  // Detectar el idioma basado en la ubicación del usuario al cargar la aplicación
  useEffect(() => {
    const detectLanguageByIP = async () => {
      // Solo detectar si no hay una preferencia guardada en localStorage
      const savedLanguage = localStorage.getItem('i18nextLng');
      if (!savedLanguage || savedLanguage.startsWith('en-') || savedLanguage.startsWith('es-')) {
        setIsDetectingLocation(true);
        // Guardar el estado de detección en localStorage para que el LanguageSelector pueda mostrarlo
        localStorage.setItem('detecting_language', 'true');
        try {
          const detectedLanguage = await detectPreferredLanguage();
          if (detectedLanguage && detectedLanguage !== i18n.language) {
            console.log(`Idioma detectado por IP: ${detectedLanguage}`);
            i18n.changeLanguage(detectedLanguage);
            setLanguage(detectedLanguage);
          }
        } catch (error) {
          console.error('Error al detectar el idioma por IP:', error);
        } finally {
          setIsDetectingLocation(false);
          localStorage.setItem('detecting_language', 'false');
        }
      }
    };

    detectLanguageByIP();
  }, []);

  // Actualizar el estado cuando cambia el idioma en i18n
  useEffect(() => {
    const handleLanguageChanged = () => {
      setLanguage(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // Valor del contexto
  const contextValue: LanguageContextType = {
    language,
    changeLanguage,
    isDetectingLocation
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;