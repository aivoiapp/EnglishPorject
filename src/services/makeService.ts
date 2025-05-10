
/**
 * Servicio para la integración con Make.com y Backend Cytalk
 */

import axios from 'axios';
import { toast } from 'react-toastify';
import { PaymentFormData } from '../components/payment/paymentTypes';
import { ContactFormData, HeroFormData, PlacementTestData } from '../components/forms/formTypes';


const UNIFIED_WEBHOOK = 'https://hook.us2.make.com/gyebx6etjrubt48brle65sdvhdsm07qq';
const BACKEND_BASE_URL = 'https://cytalk-backend.onrender.com';

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

const buildPayload = <T>(formData: T, formType: string) => ({
  ...formData,
  formType,
  source: 'web',
  connectionName: 'Cytalk Web App',
  timestamp: new Date().toISOString(),
  appVersion: '1.0.1'
});

export const sendHeroFormData = async (formData: HeroFormData) => {
  const payload = buildPayload(formData, 'hero');
  const results = { make: null, backend: null };
  await verifyMakeConnection();

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 15000
    });
    results.make = makeRes.data;
    console.log('sendHeroFormData enviado a Make.com con éxito');
  } catch (error) {
    console.error('❌ Error Make.com:', error);
    toast.error('No se pudo enviar a Make.com');
  }

  try {
    const backendRes = await axios.post(`${BACKEND_BASE_URL}/api/forms/hero`, payload);
    results.backend = backendRes.data;
    console.log('sendHeroFormData enviado al backend con éxito');
  } catch (error) {
    console.error('❌ Error Backend:', error);
    toast.error('No se pudo guardar el registro en Cytalk');
  }

  return results;
};

export const sendContactFormData = async (formData: ContactFormData) => {
  const payload = buildPayload(formData, 'contact');
  const results = { make: null, backend: null };
  await verifyMakeConnection();

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 15000
    });
    results.make = makeRes.data;
    console.log('sendContactFormData enviado a Make.com con éxito');
  } catch (error) {
    console.error('❌ Error Make.com:', error);
    toast.error('No se pudo enviar a Make.com');
  }

  try {
    const backendRes = await axios.post(`${BACKEND_BASE_URL}/api/forms/contact`, payload);
    results.backend = backendRes.data;
    console.log('sendContactFormData enviado al backend con éxito');
  } catch (error) {
    console.error('❌ Error Backend:', error);
    toast.error('No se pudo guardar el registro en Cytalk');
  }

  return results;
};

export const sendPlacementTestData = async (userData: {
  name?: string;
  email?: string;
  age?: string;
  selfAssessedLevel?: string;
  learningGoals?: string;
}, testResult: {
  level?: string;
  score?: number;
  recommendedGroup?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
  nextSteps?: string[] | string;
}) => {
  // Crear un objeto completo que cumpla con la interfaz PlacementTestData
  const formData: PlacementTestData = {
    userName: userData.name || '',
    userEmail: userData.email || '',
    userAge: userData.age || '',
    selfAssessedLevel: userData.selfAssessedLevel || 'beginner',
    learningGoals: userData.learningGoals || '',
    testLevel: testResult.level || '',
    testScore: testResult.score || 0,
    recommendedGroup: testResult.recommendedGroup || '',
    strengths: testResult.strengths?.join(', ') || '',
    weaknesses: testResult.weaknesses?.join(', ') || '',
    recommendation: testResult.recommendation || '',
    nextSteps: Array.isArray(testResult.nextSteps) ? testResult.nextSteps.join(' | ') : testResult.nextSteps || '',
    // Campos adicionales que podrían estar faltando
    nivelActual: userData.selfAssessedLevel || '',
    disponibilidad: '',
    objetivos: [userData.learningGoals || ''],
    // Hardcodear el código de cupón como solicitado
    generatedCouponCode: 'CYTALK50-B1X7'
  };

  const payload = buildPayload(formData, 'placement');
  const results = { make: null, backend: null };
  await verifyMakeConnection();

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 15000
    });
    results.make = makeRes.data;
    console.log('sendPlacementTestData enviado a Make.com con éxito');
  } catch (error) {
    console.error('❌ Error Make.com:', error);
    toast.error('No se pudo enviar a Make.com');
  }

  try {
    const backendRes = await axios.post(`${BACKEND_BASE_URL}/api/forms/placement`, payload);
    results.backend = backendRes.data;
    console.log('sendPlacementTestData enviado al backend con éxito');
  } catch (error) {
    console.error('❌ Error Backend:', error);
    toast.error('No se pudo guardar el registro en Cytalk');
  }

  return results;
};

export const sendPaymentFormData = async (formData: PaymentFormData) => {
  // Crear el payload directamente con los datos necesarios
  const payload = {
    // Datos del estudiante
    studentName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    
    // Datos del curso
    courseLevel: formData.courseLevel,
    courseType: formData.paymentType === 'fullLevel' ? 'Intensive' : 'Monthly',
    courseName: `English Level ${formData.courseLevel} - ${formData.paymentType === 'fullLevel' ? 'Intensive' : 'Monthly'}`,
    studentGroup: formData.studentGroup,
    
    // Datos del horario y período
    schedule: formData.courseSchedule || '',
    startDate: formData.startDate.toISOString().split('T')[0],
    endDate: formData.endDate.toISOString().split('T')[0],
    period: `${new Date(formData.startDate).toLocaleDateString('es-ES', {month: 'long', year: 'numeric'})} a ${new Date(formData.endDate).toLocaleDateString('es-ES', {month: 'long', year: 'numeric'})}`,
    
    // Datos del pago
    amount: formData.amount,
    paymentMethod: formData.paymentMethod,
    transactionId: formData.operationNumber,
    operationNumber: formData.operationNumber,
    paymentDate: new Date().toISOString(),
    
    // Datos para facturación
    receipt: formData.operationNumber ? `https://example.com/receipts/${formData.operationNumber}.pdf` : '',
    ruc: formData.ruc || '',
    documentId: formData.operationNumber || '',
    
    // Metadatos
    formType: 'payment',
    source: 'EnglishAcademy',
    connectionName: 'Hero form cytalk',
    timestamp: new Date().toISOString(),
    appVersion: '1.0.1'
  };
  
  const results = { make: null, backend: null };
  await verifyMakeConnection();

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Connection-Key': 'englishacademy-web-app'
      },
      timeout: 15000
    });
    results.make = makeRes.data;
    console.log('sendPaymentFormData enviado a Make.com con éxito');
  } catch (error) {
    console.error('❌ Error Make.com:', error);
    toast.error('No se pudo enviar a Make.com');
    
    try {
      console.log('Reintentando envío del formulario de pago después de 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const retryPayload = {
        ...payload,
        isRetry: true
      };
      
      const makeRes = await axios.post(UNIFIED_WEBHOOK, retryPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Connection-Key': 'englishacademy-web-app'
        }
      });
      
      results.make = makeRes.data;
      console.log('sendPaymentFormData enviado a Make.com con éxito en el reintento');
    } catch (retryError) {
      console.error('❌ Error en reintento Make.com:', retryError);
    }
  }

  try {
    const backendRes = await axios.post(`${BACKEND_BASE_URL}/api/forms/payment`, payload);
    results.backend = backendRes.data;
    console.log('sendPaymentFormData enviado al backend con éxito');
  } catch (error) {
    console.error('❌ Error Backend:', error);
    toast.error('No se pudo guardar el registro en Cytalk');
    
    try {
      console.log('Reintentando envío del formulario de pago al backend después de 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const retryPayload = {
        ...payload,
        isRetry: true
      };
      
      const backendRes = await axios.post(`${BACKEND_BASE_URL}/api/forms/payment`, retryPayload);
      results.backend = backendRes.data;
      console.log('sendPaymentFormData enviado al backend con éxito en el reintento');
    } catch (retryError) {
      console.error('❌ Error en reintento Backend:', retryError);
    }
  }

  return results;
};
