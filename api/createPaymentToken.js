// /api/createPaymentToken.js
import crypto from 'crypto';
import axios from 'axios';

// Configuración de Izipay
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';
const SHOP_ID = process.env.IZIPAY_SHOP_ID;
const SECRET_KEY = process.env.IZIPAY_SECRET_KEY;

// Validar variables de entorno
if (!SHOP_ID || !SECRET_KEY) {
  console.error('❌ Error: Faltan variables de entorno IZIPAY_SHOP_ID o IZIPAY_SECRET_KEY');
  throw new Error('Configuración incompleta de Izipay');
}

/**
 * Genera la firma HMAC-SHA256 para Izipay
 */
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

/**
 * Valida los datos del pago
 */
const validatePaymentData = ({ amount, currency, orderId, customerEmail, paymentMethod }) => {
  const errors = [];
  
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push('Monto inválido o menor a cero');
  }
  
  if (!currency || currency.length !== 3) {
    errors.push('Moneda debe ser código de 3 letras (ej: PEN)');
  }
  
  if (!orderId || orderId.trim() === '') {
    errors.push('orderId es requerido');
  }
  
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    errors.push('Email inválido');
  }

  if (!paymentMethod || !['yape-pasarela', 'yape-izipay', 'tarjeta'].includes(paymentMethod)) {
    errors.push('Método de pago no soportado');
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

export default async function handler(req, res) {
  // Configuración CORS para Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Método no permitido',
      allowedMethods: ['POST']
    });
  }

  try {
    const { amount, currency, orderId, customerEmail, paymentMethod } = req.body;

    console.log('📦 Datos recibidos:', { 
      amount, 
      currency, 
      orderId, 
      customerEmail: customerEmail ? 'provided' : 'missing',
      paymentMethod: paymentMethod || 'no especificado'
    });

    // Validar datos
    validatePaymentData(req.body);

    // Construir payload
    const payload = {
      amount: Math.round(parseFloat(amount)), // Asegurar formato numérico
      currency,
      orderId,
      formAction: 'PAYMENT',
      ctx_mode: 'PRODUCTION',
      paymentConfig: 'SINGLE',
      customer: { 
        email: customerEmail,
        billingDetails: {
          // Datos adicionales si es necesario
        }
      },
      transactionOptions: {
        cardOptions: { 
          paymentSource: 'INTERNET' 
        }
      },
      shopId: SHOP_ID,
      metadata: {
        source: 'Vite React App',
        integrationType: 'popup'
      }
    };

    // Configurar método de pago (corrección clave)
    if (paymentMethod === 'yape-pasarela' || paymentMethod === 'yape-izipay') {
      payload.paymentMethods = { 
        specificPaymentMethods: ['YAPE'],
        paymentMethodType: 'WALLET'
      };
    } else if (paymentMethod === 'tarjeta') {
      payload.paymentMethods = { 
        specificPaymentMethods: ['CARD'],
        paymentMethodType: 'CARD'
      };
    }

    // Generar firma
    const signature = generateSignature(payload, SECRET_KEY);

    // Llamar a Izipay
    const response = await axios.post(IZIPAY_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': signature,
        'Accept': 'application/json'
      },
      timeout: 10000 // Timeout de 10 segundos
    });

    // Validar respuesta
    if (!response.data?.formToken) {
      console.error('❌ Respuesta incompleta de Izipay:', response.data);
      throw new Error('No se recibió formToken en la respuesta');
    }

    console.log('✅ Pago creado exitosamente - Order ID:', orderId);

    return res.status(200).json({
      success: true,
      formToken: response.data.formToken,
      orderId,
      timestamp: new Date().toISOString(),
      paymentMethod // Devolver el método usado para referencia
    });

  } catch (error) {
    // Manejo estructurado de errores
    const errorResponse = {
      success: false,
      error: 'Error procesando pago',
      details: error.message,
      timestamp: new Date().toISOString()
    };

    if (error.response) {
      // Error de la API de Izipay
      console.error('❌ Error de Izipay:', {
        status: error.response.status,
        data: error.response.data,
        request: {
          url: error.config?.url,
          method: error.config?.method
        }
      });

      errorResponse.error = 'Error en pasarela de pago';
      errorResponse.details = error.response.data?.errorMessage || 'Error desconocido de Izipay';
      errorResponse.debug = {
        code: error.response.data?.errorCode,
        detail: error.response.data?.detailedErrorMessage
      };

      return res.status(error.response.status || 500).json(errorResponse);
    }

    console.error('❌ Error interno:', error.message);

    // Determinar código de estado apropiado
    const statusCode = error.message.includes('inválid') ? 400 : 500;

    return res.status(statusCode).json(errorResponse);
  }
}