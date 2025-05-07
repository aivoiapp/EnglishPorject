import React, { useState, useEffect } from 'react';
import CurrencyContext from './CurrencyContext';
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

  // Add setUserCountry function
  const setUserCountry = (countryCode: string) => {
    if (countryCode === 'PE') {
      setIsPeruvianUser(true);
      updateCurrency(true);
    } else {
      setIsPeruvianUser(false);
      updateCurrency(false);
    }
  };

  // Detección de país mediante IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        const isPeru = data.country === "PE";
        setIsPeruvianUser(isPeru);
        updateCurrency(isPeru);
      })
      .catch(err => {
        console.error("Error detecting location", err);
        updateCurrency(false); // fallback USD
      });
  }, [updateCurrency]);

  return (
    <CurrencyContext.Provider
      value={{
        isPeruvianUser,
        currency,
        currencySymbol,
        price,
        discountedPrice,
        setUserCountry, // <-- Add this line
        updateCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;