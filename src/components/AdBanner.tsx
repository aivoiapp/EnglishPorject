import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  minContentLength?: number; // Longitud mínima de contenido para mostrar anuncios
  position?: string; // Posición del anuncio para verificaciones específicas
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
 * @param position - Posición del anuncio para verificaciones específicas
 */
const AdBanner: React.FC<AdBannerProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
  minContentLength = 800, // Aumentado a 800 caracteres para cumplir con políticas de AdSense
  position = 'default',
}) => {
  const { t } = useTranslation();
  const adRef = useRef<HTMLModElement>(null);
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [contentVerified, setContentVerified] = useState(false);

  useEffect(() => {
    // Verificar si hay suficiente contenido en la página para mostrar anuncios
    const checkContentQuality = () => {
      // Obtener el contenido principal de la página (excluyendo elementos de navegación, footer, etc.)
      const mainContent = document.querySelector('main') || document.body;
      const contentText = mainContent.textContent || '';
      const contentLength = contentText.trim().length;
      
      // Verificar si la página está en proceso de carga o edición
      const isLoadingOrEditing = (
        document.title.includes('Loading') ||
        document.title.includes('Cargando') ||
        window.location.pathname.includes('/edit') ||
        window.location.pathname.includes('/admin') ||
        window.location.pathname.includes('/dashboard') ||
        document.body.classList.contains('editing') ||
        document.body.classList.contains('loading')
      );
      
      // Verificar si la página tiene elementos interactivos mínimos
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea').length;
      const hasInteractiveElements = interactiveElements > 3;
      
      // Verificar si hay contenido significativo (no solo texto de navegación o footer)
      const mainContentSections = document.querySelectorAll('section, article, .content, main > div').length;
      const hasContentSections = mainContentSections > 1;
      
      // Verificar si hay imágenes o videos (contenido multimedia)
      const hasMultimedia = document.querySelectorAll('img, video, iframe, canvas').length > 0;
      
      // Verificar si hay párrafos de texto con contenido sustancial
      const paragraphs = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
      let meaningfulParagraphs = 0;
      paragraphs.forEach(p => {
        const text = p.textContent || '';
        if (text.trim().length > 20) { // Párrafos con al menos 20 caracteres
          meaningfulParagraphs++;
        }
      });
      
      // Requisitos específicos según la posición del anuncio
      let positionSpecificCheck = true;
      if (position === 'top') {
        // Para anuncios en la parte superior, ser más estrictos
        positionSpecificCheck = contentLength >= 1000 && meaningfulParagraphs >= 5;
      } else if (position === 'sidebar') {
        // Para anuncios en la barra lateral, verificar que haya suficiente contenido adyacente
        positionSpecificCheck = contentLength >= 1200 && hasMultimedia;
      }
      
      // Resultado final: debe cumplir todos los criterios
      const hasEnoughContent = contentLength >= minContentLength;
      const finalResult = hasEnoughContent && 
                          !isLoadingOrEditing && 
                          hasInteractiveElements && 
                          hasContentSections && 
                          meaningfulParagraphs >= 3 &&
                          positionSpecificCheck;
      
      // Actualizar estado
      setShouldShowAd(finalResult);
      setContentVerified(true);
      
      // Para depuración
      if (!finalResult) {
        console.log(`No se muestra anuncio: contenido=${contentLength}/${minContentLength}, ` +
          `cargando=${isLoadingOrEditing}, elementos=${interactiveElements}, ` +
          `secciones=${mainContentSections}, párrafos=${meaningfulParagraphs}, ` +
          `posición=${position}, verificación específica=${positionSpecificCheck}`);
      }
    };
    
    // Verificar contenido cuando el componente se monta
    // Usar un pequeño retraso para asegurar que todo el contenido esté cargado
    const timer = setTimeout(() => {
      checkContentQuality();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [minContentLength, position]);

  useEffect(() => {
    // Cargar el script de AdSense solo si hay suficiente contenido y se ha verificado
    if (shouldShowAd && contentVerified) {
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
    }
  }, [adClient, shouldShowAd, contentVerified]);

  // No renderizar nada si no hay suficiente contenido o no se ha verificado aún
  if (!shouldShowAd || !contentVerified) {
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