/**
 * Servicio para la integración con Make.com
 * Proporciona funciones para enviar datos a webhooks y manejar archivos PDF
 */

import axios from 'axios';
import { PaymentFormData } from '../components/payment/PaymentForm';

// Interfaz para la respuesta de Make.com
interface MakeWebhookResponse {
  success: boolean;
  webhookId?: string;
  executionId?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
}

// URLs de los webhooks de Make.com desde variables de entorno
const UNIFIED_WEBHOOK = 'https://hook.us2.make.com/gyebx6etjrubt48brle65sdvhdsm07qq';

/**
 * Envía los datos del formulario Hero a Make.com
 * @param formData Datos del formulario
 * @returns Promesa con la respuesta
 */
export const sendHeroFormData = async (formData: {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}) => {
  try {
    const response = await axios.post(UNIFIED_WEBHOOK, {
      ...formData,
      formType: 'hero',
      timestamp: new Date().toISOString()
    });
    
    console.log('Hero form data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending hero form data:', error);
    throw error;
  }
};

/**
 * Envía los datos del formulario de Contacto a Make.com
 * @param formData Datos del formulario
 * @returns Promesa con la respuesta
 */
export const sendContactFormData = async (formData: {
  name: string;
  phone: string;
  selectedGroup: string;
  selectedAgent: {
    name: string;
    phone: string;
  };
}): Promise<MakeWebhookResponse> => {
  try {
    console.log('Sending contact form data to Make.com webhook:', UNIFIED_WEBHOOK);
    const response = await axios.post(UNIFIED_WEBHOOK, {
      ...formData,
      formType: 'contact',
      timestamp: new Date().toISOString()
    });
    
    console.log('Contact form data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending contact form data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw error;
  }
};

/**
 * Convierte un archivo PDF a base64
 * @param pdfBlob Blob del PDF
 * @returns Promesa con el string en base64
 */
/**
 * Convierte un archivo PDF a base64
 * @param pdfBlob Blob del PDF
 * @returns Promesa con el string en base64
 */
/**
 * Convierte un archivo PDF a base64 con validaciones mejoradas
 * @param pdfBlob Blob del PDF
 * @returns Promesa con el string en base64
 */
export const convertPdfToBase64 = (pdfBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validación del blob de entrada
    if (!pdfBlob) {
      console.error('Error: PDF blob is null or undefined');
      reject(new Error('PDF blob is null or undefined'));
      return;
    }
    
    // Validación del tipo MIME
    if (!pdfBlob.type.includes('pdf') && !pdfBlob.type.includes('application/octet-stream')) {
      console.error(`Error: Invalid MIME type for PDF: ${pdfBlob.type}`);
      console.warn('Continuing anyway as the MIME type might be incorrectly set...');
      // No rechazamos aquí para permitir PDFs con tipo MIME incorrecto
    }
    
    // Validación del tamaño
    if (pdfBlob.size === 0) {
      console.error('Error: PDF blob is empty (0 bytes)');
      reject(new Error('PDF blob is empty (0 bytes)'));
      return;
    }
    
    // Tamaño máximo razonable (50MB)
    const MAX_PDF_SIZE = 50 * 1024 * 1024;
    if (pdfBlob.size > MAX_PDF_SIZE) {
      console.error(`Error: PDF size exceeds maximum allowed (${Math.round(pdfBlob.size / (1024 * 1024))} MB > ${MAX_PDF_SIZE / (1024 * 1024)} MB)`);
      reject(new Error(`PDF size exceeds maximum allowed (${Math.round(pdfBlob.size / (1024 * 1024))} MB)`));
      return;
    }
    
    console.log(`Converting PDF to base64 (size: ${Math.round(pdfBlob.size / 1024)} KB, type: ${pdfBlob.type})`);
    
    const reader = new FileReader();
    
    // Timeout para evitar bloqueos indefinidos
    const timeoutId = setTimeout(() => {
      console.error('Error: FileReader operation timed out after 30 seconds');
      reject(new Error('FileReader operation timed out'));
    }, 30000); // 30 segundos
    
    reader.onloadend = () => {
      clearTimeout(timeoutId); // Limpiar el timeout
      
      try {
        if (typeof reader.result === 'string') {
          // Extraer solo la parte base64 sin el prefijo de data URL
          const parts = reader.result.split(',');
          if (parts.length < 2) {
            console.error('Error: Invalid data URL format');
            reject(new Error('Invalid data URL format'));
            return;
          }
          
          const base64String = parts[1];
          
          // Validar que el resultado es realmente base64 válido
          if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
            console.error('Error: Generated base64 contains invalid characters');
            reject(new Error('Generated base64 contains invalid characters'));
            return;
          }
          
          // Validar longitud mínima para un PDF válido
          if (base64String.length < 100) {
            console.error(`Error: Base64 result too short (${base64String.length} chars), likely not a valid PDF`);
            reject(new Error('Base64 result too short, likely not a valid PDF'));
            return;
          }
          
          console.log(`PDF successfully converted to base64 (length: ${base64String.length} chars)`);
          resolve(base64String);
        } else {
          console.error('Error: FileReader result is not a string');
          reject(new Error('FileReader result is not a string'));
        }
      } catch (error) {
        console.error('Error in FileReader onloadend handler:', error);
        reject(error);
      }
    };
    
    reader.onerror = (event) => {
      clearTimeout(timeoutId); // Limpiar el timeout
      console.error('FileReader error:', event);
      reject(new Error('FileReader error: ' + (reader.error?.message || 'Unknown error')));
    };
    
    try {
      reader.readAsDataURL(pdfBlob);
    } catch (error) {
      clearTimeout(timeoutId); // Limpiar el timeout
      console.error('Error calling readAsDataURL:', error);
      reject(error);
    }
  });
};

/**
 * Envía los resultados del Placement Test junto con el PDF a Make.com
 * @param userData Datos del usuario
 * @param testResult Resultados del test
 * @param pdfBlob Blob del PDF generado
 * @returns Promesa con la respuesta
 */
/**
 * Envía los resultados del Placement Test junto con el PDF a Make.com
 * @param userData Datos del usuario
 * @param testResult Resultados del test
 * @param pdfBlob Blob del PDF generado
 * @returns Promesa con la respuesta
 */
export const sendPlacementTestData = async (
  userData: {
    name: string;
    email: string;
    age: string;
    selfAssessedLevel: string;
    learningGoals: string;
  },
  testResult: {
    level: string;
    score: number;
    recommendedGroup?: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    nextSteps: string[];
  },
  pdfBlob: Blob
): Promise<MakeWebhookResponse> => {
  try {
    console.log('Processing placement test data for Make.com webhook');
    
    // Validar el blob del PDF antes de intentar convertirlo
    if (!pdfBlob) {
      throw new Error('PDF blob is null or undefined');
    }
    
    if (pdfBlob.size === 0) {
      throw new Error('PDF blob is empty (0 bytes)');
    }
    
    console.log(`PDF blob details - Size: ${Math.round(pdfBlob.size / 1024)} KB, Type: ${pdfBlob.type}`);
    
    // Convert the PDF to base64
    const pdfBase64 = await convertPdfToBase64(pdfBlob);
    console.log('PDF converted to base64 successfully');
    
    // Validar que el base64 generado sea válido
    if (!pdfBase64 || pdfBase64.length < 100) {
      throw new Error(`Invalid base64 data generated (length: ${pdfBase64?.length || 0} chars)`);
    }
    
    // Create the data object to send
    const formData = {
      userData,
      testResult,
      pdfAttachment: {
        filename: `placement-test-${userData.name || 'user'}.pdf`,
        data: pdfBase64,
        mimeType: 'application/pdf',
        contentEncoding: 'base64' // Especificar explícitamente la codificación
      },
      source: 'Placement Test',
      timestamp: new Date().toISOString(),
      formType: 'placement'
    };
    
    // Send the data to Make.com
    console.log('Sending placement test data to Make.com webhook:', UNIFIED_WEBHOOK);
    const response = await axios.post(UNIFIED_WEBHOOK, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 segundos de timeout para evitar problemas de conexión
    });
    
    console.log('Placement test data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending placement test data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        request: error.request ? 'Request was made but no response received' : 'Request setup error'
      });
    } else if (error instanceof Error) {
      console.error('Error message:', error.message, 'Stack:', error.stack);
    }
    throw error;
  }
};

/**
 * Envía los datos del formulario de Pago junto con el PDF a Make.com
 * @param paymentData Datos del pago
 * @param pdfBlob Blob del PDF generado
 * @returns Promesa con la respuesta
 */
/**
 * Envía los datos del formulario de Pago junto con el PDF a Make.com
 * @param paymentData Datos del pago
 * @param pdfBlob Blob del PDF generado
 * @returns Promesa con la respuesta
 */
export const sendPaymentFormData = async (
  paymentData: PaymentFormData,
  pdfBlob: Blob
): Promise<MakeWebhookResponse> => {
  try {
    console.log('Processing payment form data for Make.com webhook');
    
    // Validar el blob del PDF antes de intentar convertirlo
    if (!pdfBlob) {
      throw new Error('PDF blob is null or undefined');
    }
    
    if (pdfBlob.size === 0) {
      throw new Error('PDF blob is empty (0 bytes)');
    }
    
    console.log(`PDF blob details - Size: ${Math.round(pdfBlob.size / 1024)} KB, Type: ${pdfBlob.type}`);
    
    // Convert the PDF to base64
    const pdfBase64 = await convertPdfToBase64(pdfBlob);
    console.log('PDF converted to base64 successfully');
    
    // Validar que el base64 generado sea válido
    if (!pdfBase64 || pdfBase64.length < 100) {
      throw new Error(`Invalid base64 data generated (length: ${pdfBase64?.length || 0} chars)`);
    }
    
    // Create the data object to send
    const formData = {
      paymentData,
      pdfAttachment: {
        filename: `payment-receipt-${paymentData.fullName.replace(/ /g, '-')}.pdf`,
        data: pdfBase64,
        mimeType: 'application/pdf',
        contentEncoding: 'base64' // Especificar explícitamente la codificación
      },
      source: 'Payment Form',
      timestamp: new Date().toISOString(),
      formType: 'payment'
    };
    
    // Send the data to Make.com
    console.log('Sending payment form data to Make.com webhook:', UNIFIED_WEBHOOK);
    const response = await axios.post(UNIFIED_WEBHOOK, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 segundos de timeout para evitar problemas de conexión
    });
    
    console.log('Payment form data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending payment form data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        request: error.request ? 'Request was made but no response received' : 'Request setup error'
      });
    } else if (error instanceof Error) {
      console.error('Error message:', error.message, 'Stack:', error.stack);
    }
    throw error;
  }
};

// Fin del servicio de integración con Make.com