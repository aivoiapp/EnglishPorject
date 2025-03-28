import crypto from 'crypto';
import axios from 'axios';

// ======================
// Configuración Inicial
// ======================
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';
const SHOP_ID = process.env.IZIPAY_SHOP_ID?.trim();
const SECRET_KEY = process.env.IZIPAY_SECRET_KEY?.trim();

// Validación estricta al iniciar
if (!SHOP_ID || !SECRET_KEY) {
  const missing = [];
  if (!SHOP_ID) missing.push('IZIPAY_SHOP_ID');
  if (!SECRET_KEY) missing.push('IZIPAY_SECRET_KEY');
  throw new Error(`❌ Faltan variables de entorno: ${missing.join(', ')}`);
}

// ======================
// Funciones Principales
// ======================
const generateSignature = (payload, secretKey) => {
  try {
    const contentToSign = JSON.stringify(payload);
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) errors.push('Email inválido');
  
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
    // 1. Validar datos de entrada
    console.log('📦 Datos recibidos:', { 
      amount: req.body.amount,
      currency: req.body.currency,
      orderId: req.body.orderId ? 'provided' : 'missing',
      customerEmail: req.body.customerEmail ? 'provided' : 'missing',
      paymentMethod: req.body.paymentMethod || 'no especificado'
    });

    validatePaymentData(req.body);

    // 2. Construir payload
    const payload = {
      amount: Math.round(parseFloat(req.body.amount)),
      currency: req.body.currency,
      orderId: req.body.orderId,
      formAction: 'PAYMENT',
      ctx_mode: 'PRODUCTION',
      paymentConfig: 'SINGLE',
      customer: { 
        email: req.body.customerEmail,
        billingDetails: {
          language: 'es' // Campo adicional útil
        }
      },
      transactionOptions: {
        cardOptions: { 
          paymentSource: 'INTERNET',
          captureDelay: 0 // Para captura inmediata
        }
      },
      shopId: SHOP_ID,
      metadata: {
        source: 'React Popup',
        integrationVersion: '2.0'
      }
    };

    // 3. Configurar método de pago
    if (req.body.paymentMethod.includes('yape')) {
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

    // 4. Generar firma
    console.log('🔐 Generando firma de seguridad...');
    const signature = generateSignature(payload, SECRET_KEY);

    // 5. Llamar a Izipay
    console.log('🚀 Enviando solicitud a Izipay...');
    const response = await axios.post(IZIPAY_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': signature,
        'Accept': 'application/json',
        'X-API-Version': '2021-08-01' // Header adicional recomendado
      },
      timeout: 10000
    });

    // 6. Validar respuesta
    if (!response.data?.formToken) {
      console.error('❌ Respuesta inesperada:', response.data);
      throw new Error('FormToken no recibido en la respuesta');
    }

    console.log('✅ Transacción creada exitosamente');
    return res.status(200).json({
      success: true,
      formToken: response.data.formToken,
      orderId: req.body.orderId,
      timestamp: new Date().toISOString(),
      paymentMethod: req.body.paymentMethod
    });

  } catch (error) {
    // Manejo detallado de errores
    console.error('💥 Error en el proceso:', {
      message: error.message,
      stack: error.stack,
      responseData: error.response?.data
    });

    // Respuesta al cliente
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };

    // Caso especial: Error de autenticación
    if (error.response?.data?.answer?.errorCode === 'INT_905') {
      errorResponse.error = 'Error de autenticación con Izipay';
      errorResponse.details = 'Verifique SHOP_ID y SECRET_KEY';
      errorResponse.code = 'AUTH_ERROR';
      return res.status(401).json(errorResponse);
    }

    // Otros errores de Izipay
    if (error.response?.data) {
      errorResponse.details = error.response.data.answer?.errorMessage;
      errorResponse.code = error.response.data.answer?.errorCode;
    }

    return res.status(error.response?.status || 500).json(errorResponse);
  }
}