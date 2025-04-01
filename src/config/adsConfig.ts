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
  
  // En cualquier otro caso, mostrar el anuncio
  return true;
};