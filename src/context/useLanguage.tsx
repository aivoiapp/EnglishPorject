import { useContext } from 'react';
import LanguageContext from './LanguageContext';

/**
 * Hook personalizado para acceder al contexto de idioma
 * @returns El contexto de idioma con todas sus funciones y estados
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
};

export default useLanguage;