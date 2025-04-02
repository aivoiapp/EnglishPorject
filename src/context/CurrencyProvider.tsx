import React, { useState, useEffect } from 'react';
import CurrencyContext, { CurrencyContextType } from './CurrencyContext';
import { useLanguage } from './useLanguage';
import { detectUserLocation } from '../services/geoLocationService';
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
      setPrice(200);
      setDiscountedPrice(100);
    } else {
      setCurrency('USD');
      setCurrencySymbol(t('hero.pricing.currency.USD', '$'));
      setPrice(100);
      setDiscountedPrice(50);
    }
  }, [t]);

  // Detectar la ubicación del usuario y determinar si es de Perú
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const location = await detectUserLocation();
        const isPeru = location?.country_code === 'PE';
        setIsPeruvianUser(isPeru);
        
        // Actualizar moneda basada en la ubicación y el idioma
        updateCurrency(isPeru, language);
      } catch (error) {
        console.error('Error al detectar la ubicación:', error);
        // Si hay un error, usar el idioma como fallback
        updateCurrency(false, language);
      }
    };

    detectLocation();
  }, [language, updateCurrency]);

  // Actualizar la moneda cuando cambia el idioma
  useEffect(() => {
    updateCurrency(isPeruvianUser, language);
  }, [language, isPeruvianUser, updateCurrency]);

  // Valor del contexto
  const contextValue: CurrencyContextType = {
    currency,
    currencySymbol,
    price,
    discountedPrice,
    isPeruvianUser
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;