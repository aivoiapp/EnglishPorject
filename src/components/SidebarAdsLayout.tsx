import React from 'react';
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
  const showSidebarAd = shouldShowAdByPosition('SIDEBAR');

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