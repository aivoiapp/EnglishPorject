import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/useCurrency';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaFlag } from 'react-icons/fa';

const CountrySelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isPeruvianUser, setUserCountry } = useCurrency();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.country-selector')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Versión compacta para la barra de navegación
  if (compact) {
    return (
      <div className="relative country-selector">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={t('common.selectCountry', 'Seleccionar país')}
        >
          {isPeruvianUser ? (
            <FaFlag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <FaGlobeAmericas className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {isPeruvianUser ? 'PE' : 'INT'}
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
            <div className="py-1">
              <button
                onClick={() => {
                  setUserCountry('PE');
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${isPeruvianUser ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FaFlag className="w-4 h-4 mr-3" />
                <span>Perú</span>
              </button>
              <button
                onClick={() => {
                  setUserCountry('OTHER');
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${!isPeruvianUser ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FaGlobeAmericas className="w-4 h-4 mr-3" />
                <span>Internacional</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Versión completa para el footer o uso en otras partes
  return (
    <div className="mb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('common.selectCountry', 'Seleccionar país')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setUserCountry('PE')}
            className={`flex items-center justify-center p-2 rounded-md transition-all ${isPeruvianUser ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Perú"
          >
            <FaFlag className="text-lg" />
            <span className="ml-2 text-sm">Perú</span>
          </button>
          <button
            onClick={() => setUserCountry('OTHER')}
            className={`flex items-center justify-center p-2 rounded-md transition-all ${!isPeruvianUser ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Internacional"
          >
            <FaGlobeAmericas className="text-lg" />
            <span className="ml-2 text-sm">Internacional</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isPeruvianUser 
            ? t('common.peruPaymentMethods', 'Mostrando métodos de pago para Perú') 
            : t('common.internationalPaymentMethods', 'Mostrando métodos de pago internacionales')}
        </p>
      </div>
    </div>
  );
};

export default CountrySelector;

