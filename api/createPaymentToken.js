const axios = require('axios');
const crypto = require('crypto');

// Configuración de Izipay
const IZIPAY_SHOP_ID = process.env.IZIPAY_SHOP_ID || '76277481';
const IZIPAY_SECRET_KEY = process.env.IZIPAY_SECRET_KEY || '1WnoQMibn4xsItKU';
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';

// Validar configuración al iniciar
if (!IZIPAY_SHOP_ID || !IZIPAY_SECRET_KEY) {
  console.error('❌ Error: Faltan variables de entorno IZIPAY_SHOP_ID o IZIPAY_SECRET_KEY');
}

/**
 * Genera la firma HMAC-SHA256 para la autenticación con Izipay
 * @param {Object} payload - Datos a firmar
 * @param {string} secretKey - Clave secreta para la firma
 * @returns {string} Firma generada
 */
const generateSignature = (payload, secretKey) => {
  if (!payload || !secretKey) {
    throw new Error('Payload y secretKey son requeridos para generar la firma');
  }
  
  try {
    const contentToSign = JSON.stringify(payload);
    return crypto.createHmac('sha256', secretKey).update(contentToSign).digest('hex');
  } catch (error) {
    console.error('❌ Error al generar la firma:', error);
    throw new Error('Error al generar la firma de autenticación');
  }
};

/**
 * Valida los datos de entrada para el pago
 * @param {Object} data - Datos del pago
 * @throws {Error} Si los datos no son válidos
 */
const validatePaymentData = (data) => {
  const { amount, currency, orderId, customerEmail } = data;
  
  if (!amount || isNaN(amount)) {
    throw new Error('El monto debe ser un número válido');
  }
  
  if (parseInt(amount, 10) <= 0) {
    throw new Error('El monto debe ser mayor a cero');
  }
  
  if (!currency || currency.length !== 3) {
    throw new Error('Moneda inválida (debe ser código de 3 letras)');
  }
  
  if (!orderId || orderId.trim() === '') {
    throw new Error('orderId es requerido');
  }
  
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new Error('Email del cliente inválido');
  }
};

module.exports = async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejo de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método no permitido',
      message: 'Solo se aceptan solicitudes POST'
    });
  }

  try {
    const { amount, currency, orderId, customerEmail, paymentMethod } = req.body;

    console.log('👉 Solicitud recibida:', { 
      amount, 
      currency, 
      orderId: orderId ? 'provided' : 'missing',
      customerEmail: customerEmail ? 'provided' : 'missing',
      paymentMethod: paymentMethod || 'no especificado'
    });

    // Validar datos de entrada
    validatePaymentData(req.body);

    // Construir payload para Izipay
    const payload = {
      amount: parseInt(amount, 10),
      currency,
      orderId,
      formAction: 'PAYMENT',
      ctx_mode: 'PRODUCTION',
      paymentConfig: 'SINGLE',
      customer: { 
        email: customerEmail,
        billingDetails: {
          // Agrega más detalles del cliente si es necesario
        }
      },
      transactionOptions: {
        cardOptions: {
          paymentSource: 'INTERNET',
          // Opciones adicionales para tarjetas
        }
      },
      shopId: IZIPAY_SHOP_ID,
      metadata: {
        // Puedes agregar metadatos adicionales para tracking
        source: 'React Popup Integration'
      }
    };

    // Configurar método de pago específico
    if (paymentMethod === 'yape-pasarela') {
      payload.paymentMethods = {
        specificPaymentMethods: ['YAPE']
      };
    } else if (paymentMethod === 'tarjeta') {
      payload.paymentMethods = {
        specificPaymentMethods: ['CARD']
      };
    } else {
      // Si no se especifica, dejamos que Izipay maneje todos los métodos disponibles
      payload.paymentMethods = {
        specificPaymentMethods: ['CARD', 'YAPE'] // Ajusta según necesites
      };
    }

    // Generar firma de autenticación
    const signature = generateSignature(payload, IZIPAY_SECRET_KEY);

    // Configurar headers para la solicitud a Izipay
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': signature,
      'Accept': 'application/json'
    };

    console.log('🔐 Enviando solicitud a Izipay con payload:', {
      ...payload,
      customer: { email: payload.customer.email } // No loggear datos sensibles
    });

    // Realizar la solicitud a la API de Izipay
    const response = await axios.post(IZIPAY_API_URL, payload, { 
      headers,
      timeout: 10000 // 10 segundos de timeout
    });

    // Validar respuesta de Izipay
    if (!response.data || !response.data.formToken) {
      throw new Error('Respuesta inválida de Izipay: falta formToken');
    }

    const { formToken } = response.data;

    console.log('✅ Pago procesado exitosamente, formToken recibido');
    
    return res.status(200).json({ 
      success: true,
      formToken,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Manejo detallado de errores
    const errorData = {
      timestamp: new Date().toISOString(),
      error: 'Error al procesar el pago',
      details: null,
      debug: null
    };

    // Determinar el código de estado adecuado
    let statusCode = 500;
    
    if (error.response) {
      // Error de la API de Izipay
      statusCode = error.response.status || 500;
      errorData.details = error.response.data?.message || 'Error en la respuesta de Izipay';
      errorData.debug = error.response.data;
      
      console.error('❌ Error en la respuesta de Izipay:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      statusCode = 503;
      errorData.details = 'No se recibió respuesta del servidor de Izipay';
      errorData.debug = error.message;
      
      console.error('❌ No se recibió respuesta de Izipay:', error.message);
    } else if (error instanceof Error) {
      // Error en el código o validación
      statusCode = 400;
      errorData.details = error.message;
      
      console.error('❌ Error en el procesamiento:', error.message);
    } else {
      // Error desconocido
      errorData.details = 'Error desconocido al procesar el pago';
      errorData.debug = error;
      
      console.error('❌ Error desconocido:', error);
    }

    return res.status(statusCode).json(errorData);
  }
};