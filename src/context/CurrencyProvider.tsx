import React, { useState, useEffect } from 'react';
import CurrencyContext, { CurrencyContextType } from './CurrencyContext';
import { useLanguage } from './useLanguage';
import { useTranslation } from 'react-i18next';

interface CurrencyProviderProps {
  children: React.ReactNode;
}

const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  useLanguage();
  useTranslation();
  const [isPeruvianUser, setIsPeruvianUser] = useState(false);
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [currencySymbol, setCurrencySymbol] = useState('S/.');
  const [price, setPrice] = useState(200); // Precio base original
  const [discountedPrice, setDiscountedPrice] = useState(200); // Ahora mismo igual al precio base

  const updateCurrency = React.useCallback((isPeru: boolean) => {
    if (isPeru) {
      setCurrency('PEN');
      setCurrencySymbol('S/.');
      setPrice(200); // Precio base real
      setDiscountedPrice(200); // Sin descuento por defecto
    } else {
      setCurrency('USD');
      setCurrencySymbol('$');
      setPrice(100); // Precio base real
      setDiscountedPrice(100); // Sin descuento por defecto
    }
  }, []);
  
  // Eliminar dependencia del idioma en los efectos
  useEffect(() => {
    const savedCountry = localStorage.getItem('userCountry');
    const isPeru = savedCountry === 'PE';
    
    setIsPeruvianUser(isPeru);
    updateCurrency(isPeru);
  }, [updateCurrency]);

  const setUserCountry = (countryCode: string) => {
    const isPeru = countryCode === 'PE';
    setIsPeruvianUser(isPeru);
    localStorage.setItem('userCountry', countryCode);
    updateCurrency(isPeru);
  };

  // Valor del contexto
  const contextValue: CurrencyContextType = {
    currency,
    currencySymbol,
    price,
    discountedPrice,
    isPeruvianUser,
    setUserCountry
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
