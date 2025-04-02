import axios from 'axios';

/**
 * Interfaz para la respuesta de la API de geolocalización
 */
interface GeoLocationResponse {
  country_code: string;
  country_name: string;
  city: string;
  latitude: number;
  longitude: number;
  ip: string;
  languages: string;
}

/**
 * Mapa de códigos de país a códigos de idioma
 */
const countryToLanguageMap: Record<string, string> = {
  // Países de habla hispana
  'ES': 'es', // España
  'MX': 'es', // México
  'AR': 'es', // Argentina
  'CO': 'es', // Colombia
  'PE': 'es', // Perú
  'CL': 'es', // Chile
  'EC': 'es', // Ecuador
  'GT': 'es', // Guatemala
  'CU': 'es', // Cuba
  'BO': 'es', // Bolivia
  'DO': 'es', // República Dominicana
  'HN': 'es', // Honduras
  'PY': 'es', // Paraguay
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panamá
  'UY': 'es', // Uruguay
  'VE': 'es', // Venezuela
  'PR': 'es', // Puerto Rico
  
  // Países de habla inglesa
  'US': 'en', // Estados Unidos
  'GB': 'en', // Reino Unido
  'CA': 'en', // Canadá (podría ser 'fr' en algunas regiones)
  'AU': 'en', // Australia
  'NZ': 'en', // Nueva Zelanda
  'IE': 'en', // Irlanda
  'ZA': 'en', // Sudáfrica
  'SG': 'en', // Singapur
  'PH': 'en', // Filipinas
  
  // Otros países (se puede expandir según necesidades)
  'BR': 'pt', // Brasil
  'PT': 'pt', // Portugal
  'FR': 'fr', // Francia
  'DE': 'de', // Alemania
  'IT': 'it', // Italia
  'JP': 'ja', // Japón
  'CN': 'zh', // China
  'RU': 'ru', // Rusia
};

/**
 * Detecta la ubicación del usuario basada en su dirección IP
 * @returns Promesa que resuelve a un objeto con la información de geolocalización
 */
export const detectUserLocation = async (): Promise<GeoLocationResponse | null> => {
  try {
    // Utilizamos ipapi.co que ofrece un servicio gratuito de geolocalización por IP
    const response = await axios.get<GeoLocationResponse>('https://ipapi.co/json/');
    console.log('Geolocalización detectada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al detectar la ubicación del usuario:', error);
    return null;
  }
};

/**
 * Determina el idioma preferido basado en el código de país
 * @param countryCode Código ISO del país (2 letras)
 * @returns Código del idioma ('es' o 'en')
 */
export const getLanguageFromCountry = (countryCode: string): string => {
  const language = countryToLanguageMap[countryCode.toUpperCase()];
  // Solo permitimos español o inglés, con inglés como opción predeterminada
  if (language === 'es') {
    return 'es';
  }
  return 'en'; // Inglés como opción predeterminada para cualquier otro idioma
};

/**
 * Detecta el idioma preferido basado en la ubicación del usuario
 * @returns Promesa que resuelve al código de idioma ('es' o 'en')
 */
export const detectPreferredLanguage = async (): Promise<string> => {
  try {
    const location = await detectUserLocation();
    if (location && location.country_code) {
      return getLanguageFromCountry(location.country_code);
    }
    return 'en'; // Inglés como idioma por defecto si no se puede determinar la ubicación
  }
    catch (error) {
    console.error('Error al detectar el idioma preferido:', error);
    return 'es';
  }
};