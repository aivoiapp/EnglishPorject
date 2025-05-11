import React, { useEffect, useState } from 'react';
import { AdContainer } from './index';
import { useAds } from '../context';

interface SidebarAdsLayoutProps {
  children: React.ReactNode;
}

/**
 * SidebarAdsLayout - Componente que muestra el contenido principal con anuncios en la barra lateral
 * Solo muestra los anuncios en la barra lateral en pantallas grandes (lg y superiores)
 */
const SidebarAdsLayout: React.FC<SidebarAdsLayoutProps> = ({ children }) => {
  const { shouldShowAdByPosition, getAdClientId, getAdSlot } = useAds();
  const [hasEnoughContent, setHasEnoughContent] = useState(false);
  const showSidebarAd = shouldShowAdByPosition('SIDEBAR') && hasEnoughContent;
  
  // Verificar si hay suficiente contenido para mostrar anuncios
  useEffect(() => {
    const checkContentLength = () => {
      // Esperar a que el contenido se renderice completamente
      setTimeout(() => {
        const contentElement = document.querySelector('.flex-1');
        if (contentElement) {
          const contentText = contentElement.textContent || '';
          const contentLength = contentText.trim().length;
          const minContentLength = 800; // Requerir más contenido para anuncios laterales
          
          setHasEnoughContent(contentLength >= minContentLength);
          
          // Para depuración
          if (contentLength < minContentLength) {
            console.log(`No se muestran anuncios laterales: contenido insuficiente (${contentLength}/${minContentLength} caracteres)`);
          }
        }
      }, 500); // Pequeño retraso para asegurar que el contenido esté disponible
    };
    
    checkContentLength();
    
    // También verificar cuando cambie el contenido
    const observer = new MutationObserver(checkContentLength);
    const contentContainer = document.querySelector('.flex-1');
    
    if (contentContainer) {
      observer.observe(contentContainer, { childList: true, subtree: true });
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Contenido principal */}
        <div className="flex-1">{children}</div>

        {/* Barra lateral con anuncios (solo visible en pantallas grandes) */}
        {showSidebarAd && (
          <div className="lg:w-[300px] sticky top-24 self-start hidden lg:block">
            <AdContainer
              position="sidebar"
              adClient={getAdClientId()}
              adSlot={getAdSlot('SIDEBAR')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarAdsLayout;