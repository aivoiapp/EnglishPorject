import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  minContentLength?: number; // Longitud mínima de contenido para mostrar anuncios
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
 * @param minContentLength - Longitud mínima de contenido en la página para mostrar el anuncio
 */
const AdBanner: React.FC<AdBannerProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
  minContentLength = 500, // Por defecto, requerir al menos 500 caracteres de contenido
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [shouldShowAd, setShouldShowAd] = useState(false);

  useEffect(() => {
    // Verificar si hay suficiente contenido en la página para mostrar anuncios
    const checkContentLength = () => {
      // Obtener el contenido principal de la página (excluyendo elementos de navegación, footer, etc.)
      const mainContent = document.querySelector('main') || document.body;
      const contentText = mainContent.textContent || '';
      const contentLength = contentText.trim().length;
      
      // Solo mostrar anuncios si hay suficiente contenido
      setShouldShowAd(contentLength >= minContentLength);
      
      // Para depuración
      if (contentLength < minContentLength) {
        console.log(`No se muestra anuncio: contenido insuficiente (${contentLength}/${minContentLength} caracteres)`); 
      }
    };
    
    // Verificar contenido cuando el componente se monta
    checkContentLength();
    
    // Cargar el script de AdSense si aún no está cargado y hay suficiente contenido
    if (shouldShowAd) {
      const hasAdScript = document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
      
      if (!hasAdScript) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.dataset.adClient = adClient;
        document.head.appendChild(script);
      }
    }

    // Inicializar el anuncio solo si hay suficiente contenido
    try {
      if (shouldShowAd && adRef.current && typeof window !== 'undefined') {
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
  }, [adClient, shouldShowAd, minContentLength]);

  // No renderizar nada si no hay suficiente contenido
  if (!shouldShowAd) {
    return null;
  }
  
  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          margin: '0 auto',
          border: '1px solid #eaeaea',
          borderRadius: '4px',
          padding: '4px',
          backgroundColor: '#f9f9f9',
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