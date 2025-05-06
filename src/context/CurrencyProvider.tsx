import React, { useState, useEffect } from 'react';
import CurrencyContext, { CurrencyContextType } from './CurrencyContext';
import { useLanguage } from './useLanguage';
import { useTranslation } from 'react-i18next';

interface CurrencyProviderProps {
  children: React.ReactNode;
}

const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isPeruvianUser, setIsPeruvianUser] = useState(false);
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [currencySymbol, setCurrencySymbol] = useState('S/.');
  const [price, setPrice] = useState(200);
  const [discountedPrice, setDiscountedPrice] = useState(100);

  // Función para actualizar la moneda basada en la ubicación y el idioma
  const updateCurrency = React.useCallback((isPeru: boolean, lang: string) => {
    // Si el usuario es de Perú y la interfaz está en español, mostrar soles
    // En cualquier otro caso, mostrar dólares
    if (isPeru && lang === 'es') {
      setCurrency('PEN');
      setCurrencySymbol(t('hero.pricing.currency.PEN', 'S/.'));
      setPrice(400); // Precio regular en soles
      setDiscountedPrice(200); // Precio base para Perú: 200 soles
    } else {
      setCurrency('USD');
      setCurrencySymbol(t('hero.pricing.currency.USD', '$'));
      setPrice(200); // Precio regular en dólares
      setDiscountedPrice(100); // Precio base para otros países: 100 dólares
    }
  }, [t]);

  // Determinar el país del usuario basado en preferencias guardadas o idioma
  useEffect(() => {
    // Verificar si hay una preferencia guardada en localStorage
    const savedCountry = localStorage.getItem('userCountry');
    
    if (savedCountry) {
      const isPeru = savedCountry === 'PE';
      setIsPeruvianUser(isPeru);
      updateCurrency(isPeru, language);
    } else {
      // Si no hay preferencia guardada, usar el idioma como indicador
      // Asumir que si el idioma es español, el usuario podría ser de Perú
      const isPeru = language === 'es';
      setIsPeruvianUser(isPeru);
      localStorage.setItem('userCountry', isPeru ? 'PE' : 'OTHER');
      updateCurrency(isPeru, language);
    }
  }, [language, updateCurrency]);

  // Actualizar la moneda cuando cambia el idioma
  useEffect(() => {
    updateCurrency(isPeruvianUser, language);
  }, [language, isPeruvianUser, updateCurrency]);

  // Función para cambiar manualmente el país del usuario
  const setUserCountry = (countryCode: string) => {
    const isPeru = countryCode === 'PE';
    setIsPeruvianUser(isPeru);
    localStorage.setItem('userCountry', countryCode);
    updateCurrency(isPeru, language);
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
