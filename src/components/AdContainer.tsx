import React from 'react';
import AdBanner from './AdBanner';
import { useTranslation } from 'react-i18next';

export type AdPosition = 
  | 'top' // Parte superior de la página
  | 'bottom' // Parte inferior de la página
  | 'between-sections' // Entre secciones
  | 'sidebar' // Barra lateral (solo en pantallas grandes)
  | 'footer' // Antes del footer
  | 'article-middle'; // En medio de contenido tipo artículo

interface AdContainerProps {
  position: AdPosition;
  className?: string;
  style?: React.CSSProperties;
  adClient: string;
  adSlot: string;
}

/**
 * AdContainer - Componente contenedor para anuncios que gestiona la visualización
 * según la posición y el tamaño de pantalla
 */
const AdContainer: React.FC<AdContainerProps> = ({
  position,
  className = '',
  style = {},
  adClient,
  adSlot,
}) => {
  const { t } = useTranslation();
  // Configuraciones específicas según la posición
  const getAdConfig = () => {
    switch (position) {
      case 'top':
        return {
          format: 'horizontal' as const,
          className: 'py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
          style: { minHeight: '90px', maxHeight: '100px' },
        };
      case 'bottom':
        return {
          format: 'horizontal' as const,
          className: 'py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700',
          style: { minHeight: '90px', maxHeight: '100px' },
        };
      case 'between-sections':
        return {
          format: 'rectangle' as const,
          className: 'py-4 my-8 bg-gray-50 dark:bg-gray-800 rounded-lg',
          style: { minHeight: '250px', maxHeight: '280px' },
        };
      case 'sidebar':
        return {
          format: 'vertical' as const,
          className: 'hidden lg:block py-4 bg-gray-50 dark:bg-gray-800 rounded-lg',
          style: { minHeight: '600px', maxWidth: '300px' },
        };
      case 'footer':
        return {
          format: 'horizontal' as const,
          className: 'py-4 mt-8 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg',
          style: { minHeight: '90px', maxHeight: '100px' },
        };
      case 'article-middle':
        return {
          format: 'rectangle' as const,
          className: 'py-4 my-6 bg-gray-50 dark:bg-gray-800 rounded-lg',
          style: { minHeight: '250px', maxHeight: '280px' },
        };
      default:
        return {
          format: 'auto' as const,
          className: '',
          style: {},
        };
    }
  };

  const config = getAdConfig();

  return (
    <div 
      className={`ad-container-${position} ${config.className} ${className}`}
      style={{
        ...config.style,
        ...style,
      }}
    >
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">{t('ads.advertisement', 'Publicidad')}</div>
      <AdBanner 
        adClient={adClient}
        adSlot={adSlot}
        adFormat={config.format}
        fullWidthResponsive={true}
      />
    </div>
  );
};

export default AdContainer;