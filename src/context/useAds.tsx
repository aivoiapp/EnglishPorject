import { useContext } from 'react';
import AdsContext from './AdsContext';

/**
 * Hook personalizado para acceder al contexto de anuncios
 * @returns El contexto de anuncios con todas sus funciones y estados
 */
export const useAds = () => {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAds debe ser usado dentro de un AdsProvider');
  }
  return context;
};

export default useAds;