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
const WEBHOOKS = {
  HERO_FORM: import.meta.env.VITE_MAKE_WEBHOOK_HERO || 'https://hook.eu1.make.com/your-hero-form-webhook',
  CONTACT_FORM: import.meta.env.VITE_MAKE_WEBHOOK_CONTACT || 'https://hook.eu1.make.com/your-contact-form-webhook',
  PLACEMENT_TEST: import.meta.env.VITE_MAKE_WEBHOOK_PLACEMENT || 'https://hook.eu1.make.com/your-placement-test-webhook',
  PAYMENT_FORM: import.meta.env.VITE_MAKE_WEBHOOK_PAYMENT || 'https://hook.eu1.make.com/your-payment-form-webhook'
};

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
    const response = await axios.post('https://hook.us2.make.com/gyebx6etjrubt48brle65sdvhdsm07qq', {
      ...formData,
      source: 'Hero Form',
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
    console.log('Sending contact form data to Make.com webhook:', WEBHOOKS.CONTACT_FORM);
    const response = await axios.post(WEBHOOKS.CONTACT_FORM, {
      ...formData,
      source: 'Contact Form',
      timestamp: new Date().toISOString()
    });
    
    console.log('Contact form data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending contact form data:', error);
    // Proporcionar información más detallada sobre el error
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
export const convertPdfToBase64 = (pdfBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!pdfBlob) {
      console.error('Error: PDF blob is null or undefined');
      reject(new Error('PDF blob is null or undefined'));
      return;
    }
    
    console.log(`Converting PDF to base64 (size: ${Math.round(pdfBlob.size / 1024)} KB)`);
    
    const reader = new FileReader();
    
    reader.onloadend = () => {
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
      console.error('FileReader error:', event);
      reject(new Error('FileReader error: ' + (reader.error?.message || 'Unknown error')));
    };
    
    try {
      reader.readAsDataURL(pdfBlob);
    } catch (error) {
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
    
    // Convertir el PDF a base64
    const pdfBase64 = await convertPdfToBase64(pdfBlob);
    console.log('PDF converted to base64 successfully');
    
    // Crear el objeto de datos para enviar
    const formData = {
      userData,
      testResult,
      pdfAttachment: {
        filename: `placement-test-${userData.name || 'user'}.pdf`,
        data: pdfBase64,
        mimeType: 'application/pdf'
      },
      source: 'Placement Test',
      timestamp: new Date().toISOString()
    };
    
    // Enviar los datos a Make.com
    console.log('Sending placement test data to Make.com webhook:', WEBHOOKS.PLACEMENT_TEST);
    const response = await axios.post(WEBHOOKS.PLACEMENT_TEST, formData);
    
    console.log('Placement test data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending placement test data:', error);
    // Proporcionar información más detallada sobre el error
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
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
export const sendPaymentFormData = async (
  paymentData: PaymentFormData,
  pdfBlob: Blob
): Promise<MakeWebhookResponse> => {
  try {
    console.log('Processing payment form data for Make.com webhook');
    
    // Convertir el PDF a base64
    const pdfBase64 = await convertPdfToBase64(pdfBlob);
    console.log('PDF converted to base64 successfully');
    
    // Crear el objeto de datos para enviar
    const formData = {
      paymentData,
      pdfAttachment: {
        filename: `payment-receipt-${paymentData.fullName.replace(/ /g, '-')}.pdf`,
        data: pdfBase64,
        mimeType: 'application/pdf'
      },
      source: 'Payment Form',
      timestamp: new Date().toISOString()
    };
    
    // Enviar los datos a Make.com
    console.log('Sending payment form data to Make.com webhook:', WEBHOOKS.PAYMENT_FORM);
    const response = await axios.post(WEBHOOKS.PAYMENT_FORM, formData);
    
    console.log('Payment form data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending payment form data:', error);
    // Proporcionar información más detallada sobre el error
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Fin del servicio de integración con Make.com