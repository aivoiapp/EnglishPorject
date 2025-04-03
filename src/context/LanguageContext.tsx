import { createContext } from 'react';

// Definición del tipo para el contexto de idioma
export interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

// Creación del contexto con un valor inicial undefined
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export default LanguageContext;