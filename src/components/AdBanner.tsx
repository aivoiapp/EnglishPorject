import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AdBanner - Componente para mostrar anuncios de Google AdSense
 * 
 * @param adClient - ID de cliente de AdSense (formato: ca-pub-XXXXXXXXXXXXXXXX)
 * @param adSlot - ID del slot de anuncio
 * @param adFormat - Formato del anuncio (auto, rectangle, horizontal, vertical)
 * @param fullWidthResponsive - Si el anuncio debe ser responsive a ancho completo
 * @param className - Clases CSS adicionales
 * @param style - Estilos CSS adicionales
 */
const AdBanner: React.FC<AdBannerProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Cargar el script de AdSense si aún no está cargado
    const hasAdScript = document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    
    if (!hasAdScript) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.adClient = adClient;
      document.head.appendChild(script);
    }

    // Inicializar el anuncio
    try {
      if (adRef.current && typeof window !== 'undefined') {
        // Esperar a que AdSense esté disponible
        const interval = setInterval(() => {
          if (window.adsbygoogle) {
            clearInterval(interval);
            // Corregir el tipado para el método push
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }, 300);

        // Limpiar el intervalo si el componente se desmonta
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Error al cargar el anuncio:', error);
    }
  }, [adClient]);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...style,
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdBanner;