import { useContext } from 'react';
import CurrencyContext from './CurrencyContext';

/**
 * Hook personalizado para acceder al contexto de moneda
 * @returns El contexto de moneda con todas sus funciones y estados
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency debe ser usado dentro de un CurrencyProvider');
  }
  return context;
};

export default useCurrency;