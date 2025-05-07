import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
      
  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative language-selector">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('common.selectLanguage') || 'Select language'}
      >
        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="font-medium text-gray-800 dark:text-gray-200 uppercase">{language.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <button
              onClick={() => {
                changeLanguage('es');
    localStorage.setItem("preferredLang", 'es');
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${language === 'es' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <img
                src="/images/flags/es.svg"
                alt="Español"
                className="w-5 h-5 mr-3 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NTAgNTAwIj48cGF0aCBmaWxsPSIjYzYwYjFlIiBkPSJNMCAwaDc1MHY1MDBIMHoiLz48cGF0aCBmaWxsPSIjZmZjNDAwIiBkPSJNMCAxMjVoNzUwdjI1MEgweiIvPjwvc3ZnPg==';
                }}
              />
              <span>Español</span>
            </button>
            <button
              onClick={() => {
                changeLanguage('en');
    localStorage.setItem("preferredLang", 'en');
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <img
                src="/images/flags/en.svg"
                alt="English"
                className="w-5 h-5 mr-3 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjM1IDY1MCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxnIGlkPSJ1ayI+PHBhdGggZmlsbD0iIzAxMjE2OSIgZD0iTTAgMGg2MHYzMEgweiIvPjxwYXRoIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBkPSJNMCAwbDYwIDMwbTAtMzBMMCAzMCIvPjxwYXRoIHN0cm9rZT0iI2M4MTAyZSIgc3Ryb2tlLXdpZHRoPSI0IiBkPSJNMCAwbDYwIDMwbTAtMzBMMCAzMCIvPjxwYXRoIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIgZD0iTTMwIDBWMzBNMCAxNWg2MCIvPjxwYXRoIHN0cm9rZT0iI2M4MTAyZSIgc3Ryb2tlLXdpZHRoPSI2IiBkPSJNMzAgMFYzME0wIDE1aDYwIi8+PC9nPjwvZGVmcz48dXNlIHhsaW5rOmhyZWY9IiN1ayIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJzY2FsZSgyMC41ODMzMzMzMzMzMzMzMzIgMjEuNjY2NjY2NjY2NjY2NjY4KSIvPjwvc3ZnPg==';
                }}
              />
              <span>English</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
