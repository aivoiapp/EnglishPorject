import crypto from 'crypto';
import axios from 'axios';

// ======================
// Configuración Inicial
// ======================
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreateToken';

// Obtener y limpiar las credenciales desde variables de entorno de Vercel
const SHOP_ID = process.env.IZIPAY_SHOP_ID ? process.env.IZIPAY_SHOP_ID.trim() : '';
const SECRET_KEY = process.env.IZIPAY_SECRET_KEY ? process.env.IZIPAY_SECRET_KEY.trim() : '';

// Registro de depuración para verificar las credenciales (sin mostrar la clave completa)
console.log('🔑 Credenciales configuradas:', {
  shopId: SHOP_ID ? '****' + SHOP_ID.substring(SHOP_ID.length - 4) : 'no disponible',
  secretKeyConfigured: SECRET_KEY ? 'Sí' : 'No',
  environment: process.env.NODE_ENV || 'development'
});

// Validación estricta al iniciar
if (!SHOP_ID || !SECRET_KEY) {
  const missing = [];
  if (!SHOP_ID) missing.push('IZIPAY_SHOP_ID');
  if (!SECRET_KEY) missing.push('IZIPAY_SECRET_KEY');
  console.error(`❌ ERROR CRÍTICO: Faltan variables de entorno: ${missing.join(', ')}`);
  throw new Error(`❌ Faltan variables de entorno: ${missing.join(', ')}. Verifica las variables de entorno en el panel de Vercel.`);
}

// Verificación adicional de formato
if (SHOP_ID.includes('tu_shop_id_aqui') || SECRET_KEY.includes('tu_secret_key_aqui')) {
  console.error('❌ ERROR: Las credenciales de Izipay parecen ser valores de ejemplo');
  throw new Error('Las credenciales de Izipay no han sido configuradas correctamente. Reemplaza los valores de ejemplo con tus credenciales reales en el panel de Vercel.');
}

// ======================
// Funciones Principales
// ======================
const generateSignature = (payload, secretKey) => {
  try {
    // Versión mejorada que ordena las claves del payload
    // Creamos una copia del payload sin el shopId para la firma
    const payloadForSignature = { ...payload };
    delete payloadForSignature.shopId; // Eliminamos shopId de la firma
    
    const orderedPayload = Object.keys(payloadForSignature)
      .sort()
      .reduce((obj, key) => {
        obj[key] = payloadForSignature[key];
        return obj;
      }, {});
    
    const contentToSign = JSON.stringify(orderedPayload);
    return crypto
      .createHmac('sha256', secretKey)
      .update(contentToSign)
      .digest('hex');
  } catch (error) {
    console.error('❌ Error generando firma:', error);
    throw new Error('Error al generar firma de seguridad');
  }
};

const validatePaymentData = (data) => {
  const { amount, currency, orderId, customerEmail, paymentMethod } = data;
  const errors = [];
  
  // Validación de campos
  if (!amount || isNaN(amount) || amount <= 0) errors.push('Monto inválido');
  if (!currency || currency.length !== 3) errors.push('Moneda inválida (ej: PEN)');
  if (!orderId?.trim()) errors.push('OrderID requerido');
  
  // Validación estricta de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customerEmail || !emailRegex.test(customerEmail)) {
    errors.push('Email inválido');
  }
  
  // Validación de métodos de pago
  const allowedMethods = ['yape-pasarela', 'yape-izipay', 'tarjeta'];
  if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
    errors.push(`Método de pago no soportado. Use: ${allowedMethods.join(', ')}`);
  }

  if (errors.length > 0) throw new Error(errors.join(' | '));
};

// ======================
// Handler Principal
// ======================
export default async function handler(req, res) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejo de OPTIONS
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método no permitido',
      allowedMethods: ['POST']
    });
  }

  try {
    // 1. Validar y registrar datos de entrada REALES
    const { amount, currency, orderId, customerEmail, paymentMethod } = req.body;
    
    // Validar que no se reciban valores 'provided'
    if (orderId === 'provided' || customerEmail === 'provided') {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: 'Los valores "provided" no son válidos para orderId o customerEmail',
        code: 'INVALID_DATA'
      });
    }
    
    console.log('📦 Datos recibidos:', { 
      amount,
      currency,
      orderId,
      customerEmail: customerEmail ? customerEmail.substring(0, 3) + '...@...' + (customerEmail.includes('@') ? customerEmail.split('@')[1] : 'invalid') : 'missing',
      paymentMethod: paymentMethod || 'no especificado'
    });

    validatePaymentData(req.body);

    // 2. Construir payload simplificado según el ejemplo proporcionado
    // El payload para CreateToken es mucho más simple que para CreatePayment
    const payload = {
      currency,
      customer: {
        email: customerEmail
      },
      orderId
    };
    
    // Registro del payload para depuración
    console.log('📦 Payload preparado:', JSON.stringify(payload, null, 2));
    
    // Nota: Ya no necesitamos configurar métodos de pago específicos para CreateToken

    // 3. Configurar método de pago correctamente
    if (paymentMethod.includes('yape')) {
      payload.paymentMethods = { 
        specificPaymentMethods: ['YAPE'],
        paymentMethodType: 'WALLET'
      };
    } else {
      payload.paymentMethods = { 
        specificPaymentMethods: ['CARD'],
        paymentMethodType: 'CARD'
      };
    }

    // 4. Preparar autenticación Basic Auth
    console.log('🔐 Preparando autenticación Basic Auth...');
    // Crear credenciales en formato Basic Auth (shopId:secretKey)
    const authString = `${SHOP_ID}:${SECRET_KEY}`;
    const base64Auth = Buffer.from(authString).toString('base64');

    // 5. Llamar a Izipay con headers completos
    console.log('🚀 Enviando solicitud a Izipay...');
    // Enviamos el payload con autenticación Basic
    const response = await axios.post(IZIPAY_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Auth}`,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    // 6. Validar respuesta exhaustivamente
    if (!response.data?.answer?.formToken) {
      console.error('❌ Respuesta inesperada:', response.data);
      throw new Error('FormToken no recibido en la respuesta');
    }

    console.log('✅ Transacción creada exitosamente para orderId:', orderId);
    return res.status(200).json({
      success: true,
      formToken: response.data.answer.formToken,
      orderId,
      timestamp: new Date().toISOString(),
      paymentMethod
    });

  } catch (error) {
    // Manejo profesional de errores
    const errorData = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      details: null,
      code: null
    };

    // Error de autenticación específico
    if (error.response?.data?.status === 'ERROR' || error.response?.data?.answer?.errorCode === 'INT_905') {
      console.error('🔐 Error de autenticación con Izipay', {
        status: error.response.status,
        shopId: SHOP_ID ? `****${SHOP_ID.slice(-4)}` : 'undefined',
        errorDetails: error.response.data.answer
      });

      errorData.error = 'Error de autenticación con Izipay';
      errorData.details = `Verifique que las credenciales (Shop ID y Secret Key) estén correctamente configuradas en las variables de entorno de Vercel. Este error suele ocurrir cuando las credenciales son inválidas o no coinciden con el entorno actual (${payload.ctx_mode}). Asegúrese de que está utilizando las credenciales correctas para el entorno ${payload.ctx_mode}.`;
      errorData.code = 'AUTH_ERROR';
      
      // Verificación adicional para ayudar en la depuración
      if (SHOP_ID.length < 5 || SECRET_KEY.length < 10) {
        errorData.details += ' Las credenciales parecen estar incompletas o malformadas.';
      }
      
      return res.status(401).json(errorData);
    }

    // Otros errores de API
    if (error.response?.data) {
      errorData.details = error.response.data.answer?.errorMessage;
      errorData.code = error.response.data.answer?.errorCode;
      console.error('❌ Error de Izipay:', {
        status: error.response.status,
        code: errorData.code,
        message: errorData.details
      });
    } else {
      console.error('💥 Error interno:', error.stack);
    }

    return res.status(error.response?.status || 500).json(errorData);
  }
}