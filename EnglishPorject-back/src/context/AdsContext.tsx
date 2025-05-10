import { createContext } from 'react';
import { ADS_CONFIG } from '../config/adsConfig';

// Definición del tipo para el contexto de anuncios
export interface AdsContextType {
  isAdsEnabled: boolean;
  toggleAds: (enabled: boolean) => void;
  shouldShowAdByPosition: (position: keyof typeof ADS_CONFIG.SLOTS) => boolean;
  getAdClientId: () => string;
  getAdSlot: (position: keyof typeof ADS_CONFIG.SLOTS) => string;
}

// Creación del contexto con un valor inicial undefined
const AdsContext = createContext<AdsContextType | undefined>(undefined);

export default AdsContext;