/**
 * Servicio para la integración con Make.com
 * Proporciona funciones para enviar datos a webhooks
 */

import axios from 'axios';
import { PaymentFormData } from '../components/payment/paymentTypes';

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

// Función para verificar y renovar la conexión con Make.com si es necesario
const verifyMakeConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.post(UNIFIED_WEBHOOK, {
      action: 'verify_connection',
      timestamp: new Date().toISOString()
    });
    
    console.log('Connection verification response:', response.data);
    return true;
  } catch (error) {
    console.error('Error verifying Make.com connection:', error);
    return false;
  }
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
}) => {
  try {
    await verifyMakeConnection();
    
    const response = await axios.post(UNIFIED_WEBHOOK, {
      ...formData,
      formType: 'hero',
      source: 'EnglishAcademy',
      connectionName: 'Hero form cytalk',
      timestamp: new Date().toISOString(),
      appVersion: '1.0.1'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 15000
    });
    
    console.log('Hero form data sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending hero form data:', error);
    try {
      console.log('Retrying hero form submission after 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post(UNIFIED_WEBHOOK, {
        ...formData,
        formType: 'hero',
        source: 'EnglishAcademy',
        connectionName: 'Hero form cytalk',
        timestamp: new Date().toISOString(),
        appVersion: '1.0.1',
        isRetry: true
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Connection-Key': 'englishacademy-web-app'
        }
      });
      
      console.log('Hero form data sent successfully on retry:', response.data);
      return response.data;
    } catch (retryError) {
      console.error('Error on retry sending hero form data:', retryError);
      throw retryError;
    }
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
    await verifyMakeConnection();
    
    const response = await axios.post(UNIFIED_WEBHOOK, {
      ...formData,
      formType: 'contact',
      source: 'EnglishAcademy',
      connectionName: 'Hero form cytalk',
      timestamp: new Date().toISOString(),
      appVersion: '1.0.1'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 15000
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
    
    try {
      console.log('Retrying contact form submission after 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post(UNIFIED_WEBHOOK, {
        ...formData,
        formType: 'contact',
        source: 'EnglishAcademy',
        connectionName: 'Hero form cytalk',
        timestamp: new Date().toISOString(),
        appVersion: '1.0.1',
        isRetry: true
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Connection-Key': 'englishacademy-web-app'
        }
      });
      
      console.log('Contact form data sent successfully on retry:', response.data);
      return response.data;
    } catch (retryError) {
      console.error('Error on retry sending contact form data:', retryError);
      throw retryError;
    }
  }
};

/**
 * Envía los resultados del Placement Test a Make.com
 * @param userData Datos del usuario
 * @param testResult Resultados del test
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
  }
): Promise<MakeWebhookResponse> => {
  try {
    await verifyMakeConnection();

    // Estructura plana con prefijos para evitar colisiones
    const payload = {
      // User Data
      userName: userData.name,
      userEmail: userData.email,
      userAge: userData.age,
      selfAssessedLevel: userData.selfAssessedLevel,
      learningGoals: userData.learningGoals,
      
      // Test Results
      testLevel: testResult.level,
      testScore: testResult.score,
      recommendedGroup: testResult.recommendedGroup || 'No especificado',
      strengths: testResult.strengths.join('; '),
      weaknesses: testResult.weaknesses.join('; '),
      recommendation: testResult.recommendation,
      nextSteps: testResult.nextSteps.join(' | '),
      
      // Metadata
      source: 'EnglishAcademy',
      connectionName: 'Hero form cytalk',
      timestamp: new Date().toISOString(),
      formType: 'placement',
      appVersion: '1.0.1'
    };

    console.log('Enviando datos de placement test:', JSON.stringify(payload, null, 2));

    const response = await axios.post(UNIFIED_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 30000
    });

    console.log('Datos de placement enviados exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error enviando datos de placement:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }

    // Reintento mejorado
    try {
      console.log('Reintentando envío después de 5 segundos...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      const response = await axios.post(UNIFIED_WEBHOOK, {
        // User Data
        userName: userData.name,
        userEmail: userData.email,
        userAge: userData.age,
        selfAssessedLevel: userData.selfAssessedLevel,
        learningGoals: userData.learningGoals,
        
        // Test Results
        testLevel: testResult.level,
        testScore: testResult.score,
        recommendedGroup: testResult.recommendedGroup || 'No especificado',
        strengths: testResult.strengths.join('; '),
        weaknesses: testResult.weaknesses.join('; '),
        recommendation: testResult.recommendation,
        nextSteps: testResult.nextSteps.join(' | '),
        
        // Metadata
        source: 'EnglishAcademy',
        connectionName: 'Hero form cytalk',
        timestamp: new Date().toISOString(),
        formType: 'placement',
        appVersion: '1.0.1',
        isRetry: true
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Connection-Key': 'englishacademy-web-app'
        },
        timeout: 30000
      });

      console.log('Envío exitoso en reintento:', response.data);
      return response.data;
    } catch (retryError) {
      console.error('Error en reintento:', retryError);
      throw retryError;
    }
  }
};

/**
 * Envía los datos del formulario de Pago a Make.com
 * @param paymentData Datos del pago
 * @returns Promesa con la respuesta
 */
export const sendPaymentFormData = async (
  paymentData: PaymentFormData
): Promise<MakeWebhookResponse> => {
  try {
    await verifyMakeConnection();
    
    const formData = {
      paymentData,
      source: 'EnglishAcademy',
      connectionName: 'Hero form cytalk',
      timestamp: new Date().toISOString(),
      formType: 'payment',
      appVersion: '1.0.1'
    };
    
    const response = await axios.post(UNIFIED_WEBHOOK, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 30000
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
    }
    
    try {
      console.log('Retrying payment form submission after 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post(UNIFIED_WEBHOOK, FormData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Connection-Key': 'englishacademy-web-app'
        },
        timeout: 30000
      });
      
      console.log('Payment form data sent successfully on retry:', response.data);
      return response.data;
    } catch (retryError) {
      console.error('Error on retry sending payment form data:', retryError);
      throw retryError;
    }
  }
};