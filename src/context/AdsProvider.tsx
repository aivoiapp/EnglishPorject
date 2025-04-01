import React, { useState, useEffect } from 'react';
import AdsContext, { AdsContextType } from './AdsContext';
import { ADS_CONFIG, shouldShowAd } from '../config/adsConfig';

// Interfaz para las propiedades del proveedor
interface AdsProviderProps {
  children: React.ReactNode;
}

// Interfaz para NetworkInformation API
interface NetworkInformation {
  downlink: number;
  saveData: boolean;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

/**
 * Componente proveedor para el contexto de anuncios
 * Gestiona el estado de los anuncios y proporciona funciones para interactuar con ellos
 */
export const AdsProvider: React.FC<AdsProviderProps> = ({ children }) => {
  // Estado para controlar si los anuncios están habilitados
  const [isAdsEnabled, setIsAdsEnabled] = useState(ADS_CONFIG.SETTINGS.ENABLED);

  // Efecto para detectar si el usuario está en modo de bajo ancho de banda
  useEffect(() => {
    // Detectar conexión lenta
    const connection = (navigator as unknown as { connection?: NetworkInformation }).connection;
    if (connection) {
      const isLowBandwidth = connection.downlink < 1.5 || connection.saveData;
      if (isLowBandwidth) {
        setIsAdsEnabled(false);
      }
    }

    // Escuchar cambios en la conexión
    const handleConnectionChange = () => {
      const conn = (navigator as unknown as { connection?: NetworkInformation }).connection;
      if (conn) {
        const isLowBandwidth = conn.downlink < 1.5 || conn.saveData;
        setIsAdsEnabled(!isLowBandwidth);
      }
    };

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  // Función para habilitar/deshabilitar anuncios
  const toggleAds = (enabled: boolean) => {
    setIsAdsEnabled(enabled);
  };

  // Función para verificar si un anuncio debe mostrarse en una posición específica
  const shouldShowAdByPosition = (position: keyof typeof ADS_CONFIG.SLOTS): boolean => {
    if (!isAdsEnabled) return false;
    return shouldShowAd(position);
  };

  // Función para obtener el ID de cliente de AdSense
  const getAdClientId = (): string => {
    return ADS_CONFIG.CLIENT_ID;
  };

  // Función para obtener el slot de anuncio según la posición
  const getAdSlot = (position: keyof typeof ADS_CONFIG.SLOTS): string => {
    return ADS_CONFIG.SLOTS[position];
  };

  const value: AdsContextType = {
    isAdsEnabled,
    toggleAds,
    shouldShowAdByPosition,
    getAdClientId,
    getAdSlot,
  };

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};

export default AdsProvider;