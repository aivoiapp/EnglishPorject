import { createContext } from 'react';

// Definición del tipo para el contexto de moneda
export interface CurrencyContextType {
  currency: 'PEN' | 'USD';
  currencySymbol: string;
  price: number;
  discountedPrice: number;
  isPeruvianUser: boolean;
  setUserCountry: (countryCode: string) => void;
}

// Creación del contexto con un valor inicial undefined
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export default CurrencyContext;