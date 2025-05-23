import React, { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { useTranslation } from 'react-i18next';
import { hasEnoughContent } from '../config/adsConfig';

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
  const [showAd, setShowAd] = useState(false);
  
  // Verificar si hay suficiente contenido para mostrar anuncios
  useEffect(() => {
    // Diferentes posiciones pueden requerir diferentes cantidades de contenido
    // Valores aumentados significativamente para cumplir con las políticas de AdSense
    const minContentByPosition = {
      'top': 1500,
      'bottom': 1800,
      'between-sections': 1600,
      'sidebar': 1800,
      'footer': 1500,
      'article-middle': 2000
    };
    
    const minContentRequired = minContentByPosition[position] || 1500;
    
    // Verificación adicional para posiciones específicas
    const checkPositionSpecificRequirements = () => {
      // Obtener el contenido principal de la página
      
      // Verificar si estamos en una página con suficiente contenido para anuncios
      if (window.location.pathname === '/' || 
          window.location.pathname.includes('/admin') || 
          window.location.pathname.includes('/login')) {
        // En páginas de inicio o administrativas, ser más estrictos
        return false;
      }
      
      // No mostrar anuncios en páginas que están siendo editadas o cargadas
      if (document.title.includes('Loading') || 
          document.title.includes('Cargando') || 
          document.body.classList.contains('editing')) {
        return false;
      }
      
      return true;
    };
    
    // Esperar a que el contenido se cargue completamente
    // Aumentado el tiempo de espera para asegurar que todo el contenido esté disponible
    setTimeout(() => {
      const hasContent = hasEnoughContent(minContentRequired);
      const passesPositionCheck = checkPositionSpecificRequirements();
      setShowAd(hasContent && passesPositionCheck);
      
      if (!hasContent || !passesPositionCheck) {
        console.log(`Anuncio en posición ${position} no mostrado: contenido suficiente=${hasContent}, verificación de posición=${passesPositionCheck}`);
      }
    }, 2000); // Aumentado a 2 segundos para asegurar carga completa
  }, [position]);
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

  // No renderizar nada si no hay suficiente contenido
  if (!showAd) {
    return null;
  }

  return (
    <div 
      className={`ad-container-${position} ${config.className} ${className}`}
      style={{
        ...config.style,
        ...style,
      }}
    >
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1 font-bold">{t('ads.advertisement', 'Advertisement')}</div>
      <AdBanner 
        adClient={adClient}
        adSlot={adSlot}
        adFormat={config.format}
        fullWidthResponsive={position !== 'sidebar'}
        minContentLength={position === 'sidebar' ? 1200 : 1000} // Aumentado el requisito de contenido mínimo
        position={position} // Pasar la posición para verificaciones específicas
      />
    </div>
  );
};

export default AdContainer;