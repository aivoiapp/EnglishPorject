/**
 * Configuración de anuncios para la aplicación
 * 
 * Este archivo centraliza la configuración de Google AdSense para facilitar
 * la gestión de los anuncios en toda la aplicación.
 */

export const ADS_CONFIG = {
  // ID de cliente de Google AdSense
  CLIENT_ID: 'ca-pub-7980871205017621',
  
  // Slots de anuncios para diferentes posiciones
  SLOTS: {
    TOP: 'XXXXXXXXXX', // Anuncio horizontal superior
    BOTTOM: 'XXXXXXXXXX', // Anuncio horizontal inferior
    BETWEEN_SECTIONS: 'XXXXXXXXXX', // Anuncio rectangular entre secciones
    SIDEBAR: 'XXXXXXXXXX', // Anuncio vertical para barra lateral
    FOOTER: 'XXXXXXXXXX', // Anuncio antes del footer
    ARTICLE_MIDDLE: 'XXXXXXXXXX', // Anuncio en medio de contenido tipo artículo
  },
  
  // Configuración general
  SETTINGS: {
    // Habilitar/deshabilitar anuncios globalmente
    ENABLED: true,
    
    // Habilitar/deshabilitar anuncios por posición
    POSITIONS_ENABLED: {
      TOP: true,
      BOTTOM: true,
      BETWEEN_SECTIONS: true,
      SIDEBAR: true,
      FOOTER: true,
      ARTICLE_MIDDLE: true,
    },
    
    // Configuración para dispositivos móviles
    MOBILE: {
      // Reducir cantidad de anuncios en móviles para mejorar experiencia
      REDUCE_ADS: true,
      // Posiciones a mostrar en móviles cuando REDUCE_ADS es true
      POSITIONS_TO_SHOW: ['BETWEEN_SECTIONS', 'FOOTER'],
    },
  },
};

/**
 * Función para verificar si un anuncio debe mostrarse según la configuración
 * y el tipo de dispositivo
 */
export const shouldShowAd = (position: keyof typeof ADS_CONFIG.SLOTS): boolean => {
  const { ENABLED, POSITIONS_ENABLED, MOBILE } = ADS_CONFIG.SETTINGS;
  
  // Si los anuncios están deshabilitados globalmente, no mostrar
  if (!ENABLED) return false;
  
  // Si la posición específica está deshabilitada, no mostrar
  const positionKey = position as keyof typeof POSITIONS_ENABLED;
  if (!POSITIONS_ENABLED[positionKey]) return false;
  
  // Verificar si estamos en un dispositivo móvil
  const isMobile = window.innerWidth < 768;
  
  // Si estamos en móvil y la reducción de anuncios está activada,
  // solo mostrar en las posiciones permitidas para móvil
  if (isMobile && MOBILE.REDUCE_ADS) {
    return MOBILE.POSITIONS_TO_SHOW.includes(position);
  }
  
  // Verificar si la página está en proceso de carga o no tiene contenido visible
  if (typeof document !== 'undefined') {
    // No mostrar anuncios en páginas sin título o con títulos genéricos
    const pageTitle = document.title;
    if (!pageTitle || pageTitle === 'Untitled' || pageTitle === 'Loading...') {
      console.log('No se muestran anuncios: página sin título o en carga');
      return false;
    }
    
    // No mostrar anuncios en páginas de error
    if (window.location.pathname.includes('/error') || 
        window.location.pathname.includes('/404') ||
        document.body.textContent?.includes('404 Not Found')) {
      console.log('No se muestran anuncios: página de error');
      return false;
    }
  }
  
  // En cualquier otro caso, mostrar el anuncio
  return true;
};

/**
 * Función para verificar si una página tiene suficiente contenido para mostrar anuncios
 * Esta función puede ser llamada desde componentes individuales para verificaciones adicionales
 * 
 * Implementa verificaciones más estrictas para cumplir con las políticas de Google AdSense
 */
export const hasEnoughContent = (minContentLength = 1200): boolean => {
  if (typeof document === 'undefined') return false;
  
  // Obtener el contenido principal de la página
  const mainContent = document.querySelector('main') || document.body;
  const contentText = mainContent.textContent || '';
  const contentLength = contentText.trim().length;
  
  // Verificar si hay suficiente contenido (aumentado el mínimo a 1200 caracteres)
  const hasEnough = contentLength >= minContentLength;
  
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
  // (una página vacía o de error normalmente no tiene muchos elementos interactivos)
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea').length;
  const hasInteractiveElements = interactiveElements > 5; // Aumentado a 5 elementos interactivos mínimos
  
  // Verificar si hay contenido significativo (no solo texto de navegación o footer)
  const mainContentSections = document.querySelectorAll('section, article, .content, main > div').length;
  const hasContentSections = mainContentSections > 2; // Aumentado a 2 secciones mínimas
  
  // Verificar si hay imágenes o videos (contenido multimedia)
  const multimediaElements = document.querySelectorAll('img, video, iframe, canvas').length;
  const hasMultimedia = multimediaElements > 1; // Al menos 2 elementos multimedia
  
  // Verificar si hay párrafos de texto con contenido sustancial
  const paragraphs = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
  let meaningfulParagraphs = 0;
  let totalTextLength = 0;
  
  paragraphs.forEach(p => {
    const text = p.textContent || '';
    const trimmedText = text.trim();
    if (trimmedText.length > 30) { // Párrafos con al menos 30 caracteres
      meaningfulParagraphs++;
      totalTextLength += trimmedText.length;
    }
  });
  
  // Verificar si hay contenido de valor (no texto de relleno o Lorem Ipsum)
  const hasLoremIpsum = contentText.toLowerCase().includes('lorem ipsum') || 
                       contentText.toLowerCase().includes('dolor sit amet');
  
  // Verificar si el contenido es inteligible (no texto de relleno)
  const hasIntelligibleContent = !hasLoremIpsum && meaningfulParagraphs >= 4;
  
  // Resultado final: debe cumplir todos los criterios para mostrar anuncios
  const finalResult = hasEnough && 
                     !isLoadingOrEditing && 
                     hasInteractiveElements && 
                     hasContentSections && 
                     hasMultimedia && 
                     hasIntelligibleContent && 
                     totalTextLength >= minContentLength;
  
  if (!finalResult) {
    console.log(`No se muestran anuncios: ${contentLength}/${minContentLength} caracteres, ` +
      `cargando/editando: ${isLoadingOrEditing}, ` +
      `elementos interactivos: ${interactiveElements}, ` +
      `secciones de contenido: ${mainContentSections}, ` +
      `elementos multimedia: ${multimediaElements}, ` +
      `párrafos significativos: ${meaningfulParagraphs}, ` +
      `contenido Lorem Ipsum: ${hasLoremIpsum}, ` +
      `longitud total de texto: ${totalTextLength}`);
  }
  
  return finalResult;
}