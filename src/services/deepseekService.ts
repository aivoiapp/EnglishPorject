/**
 * Servicio para manejar las llamadas a la API de DeepSeek
 */

import type { DeepSeekRequestBody, DeepSeekResponse } from '../types/deepseek';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Verifica si la API key está configurada
 * @returns {boolean} - true si la API key está configurada, false en caso contrario
 */
export const isApiKeyConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_APP_DEEPSEEK_API_KEY;
  return !!apiKey && apiKey.length > 0;
};

/**
 * Obtiene la API key de las variables de entorno
 * @returns {string} - La API key o una cadena vacía si no está configurada
 */
export const getApiKey = (): string => {
  return import.meta.env.VITE_APP_DEEPSEEK_API_KEY || '';
};

/**
 * Realiza una llamada a la API de DeepSeek
 * @param {string} prompt - El prompt a enviar a la API
 * @returns {Promise<DeepSeekResponse>} - La respuesta de la API parseada como JSON
 * @throws {Error} - Si hay un error en la llamada a la API
 */
export const callDeepSeekApi = async (prompt: string): Promise<DeepSeekResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key no configurada');
  }
  
  console.log('Iniciando llamada a la API DeepSeek...');
  
  const requestBody: DeepSeekRequestBody = {
    model: 'deepseek-chat',
    messages: [{
      role: 'user',
      content: prompt
    }]
  };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });
  
  console.log('Estado de la respuesta API:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error en la respuesta de la API:', errorText);
    throw new Error(`Error en la llamada a la API: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data: DeepSeekResponse = await response.json();
  console.log('Respuesta de la API recibida:', data);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    console.error('Formato de respuesta de API inesperado:', data);
    throw new Error('Formato de respuesta de API inesperado');
  }
  
  return data;
};

/**
 * Parsea la respuesta de la API como JSON y la convierte al tipo específico requerido
 * @param {DeepSeekResponse} data - La respuesta de la API
 * @returns {T} - El objeto JSON parseado y convertido al tipo específico
 * @throws {Error} - Si hay un error al parsear la respuesta
 */
export const parseApiResponse = <T>(data: DeepSeekResponse): T => {
  try {
    const content = data.choices[0].message.content;
    console.log('Contenido a parsear:', content);
    
    // Intentar extraer JSON si está envuelto en backticks o comillas
    let jsonContent = content;
    
    // Buscar contenido JSON entre backticks (```json ... ```)
    const backtickMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (backtickMatch && backtickMatch[1]) {
      console.log('Encontrado JSON entre backticks');
      jsonContent = backtickMatch[1].trim();
    }
    
    // Limpiar caracteres no imprimibles y espacios en blanco al inicio y final
    // Replace the problematic regex with this version
    jsonContent = jsonContent.trim()
      .replace(/[^\x20-\x7E]/g, '');
    
    // Verificar si el contenido comienza y termina con corchetes o llaves (indicativo de JSON)
    if (!((jsonContent.startsWith('{') && jsonContent.endsWith('}')) || 
          (jsonContent.startsWith('[') && jsonContent.endsWith(']')))) {
      console.warn('El contenido no parece ser un JSON válido:', jsonContent);
      // Intentar encontrar un objeto o array JSON dentro del texto
      const possibleJsonMatch = jsonContent.match(/([{[].*?[}\]])/s);
      if (possibleJsonMatch && possibleJsonMatch[1]) {
        console.log('Intentando extraer JSON del texto:', possibleJsonMatch[1]);
        jsonContent = possibleJsonMatch[1];
      }
    }
    
    console.log('Intentando parsear como JSON:', jsonContent);
    const parsedData = JSON.parse(jsonContent) as unknown;
    
    // Validar y asegurar que los datos cumplen con la estructura esperada
    console.log('Datos parseados correctamente:', parsedData);
    return parsedData as T;
  } catch (error) {
    console.error('Error al parsear la respuesta JSON de la API:', error);
    console.log('Contenido que no se pudo parsear:', data.choices[0]?.message?.content);
    
    // Intentar una estrategia alternativa: buscar cualquier estructura JSON en el texto
    try {
      const content = data.choices[0].message.content;
      const jsonRegex = /[{[]([\s\S]*?)[}\]]/g;
      let match;
      let largestMatch = '';
      
      // Encontrar el fragmento JSON más grande en el texto
      while ((match = jsonRegex.exec(content)) !== null) {
        if (match[0].length > largestMatch.length) {
          largestMatch = match[0];
        }
      }
      
      if (largestMatch) {
        console.log('Intentando parsear fragmento JSON encontrado:', largestMatch);
        const parsedData = JSON.parse(largestMatch) as unknown;
        console.log('Fragmento parseado correctamente como alternativa');
        return parsedData as T;
      }
    } catch (secondError) {
      console.error('También falló el intento alternativo de parseo:', secondError);
    }
    
    throw new Error('Error al parsear la respuesta JSON de la API');
  }
};