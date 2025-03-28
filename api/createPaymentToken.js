console.log('BODY RECIBIDO:', req.body);
console.log('CLAVES:', process.env.IZIPAY_SHOP_ID, process.env.IZIPAY_SECRET_KEY);

// Función serverless para integrar la pasarela de pago de Izipay
const crypto = require('crypto');
const axios = require('axios');

// Constantes de configuración
const IZIPAY_SHOP_ID = process.env.IZIPAY_SHOP_ID || '76277481';
const IZIPAY_SECRET_KEY = process.env.IZIPAY_SECRET_KEY || '1WnoQMibn4xsItKU';
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';

/**
 * Genera una firma HMAC-SHA256 para la autenticación con Izipay
 * @param {Object} payload - El payload a firmar
 * @param {string} secretKey - La clave secreta para generar la firma
 * @returns {string} - La firma generada
 */
const generateSignature = (payload, secretKey) => {
  // Convertir el payload a string JSON y ordenarlo alfabéticamente
  const contentToSign = JSON.stringify(payload);
  
  // Generar la firma HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(contentToSign)
    .digest('hex');
  
  return signature;
};

/**
 * Manejador de la función serverless
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
module.exports = async (req, res) => {
  // Configurar CORS para permitir solicitudes desde el frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verificar que la solicitud sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Extraer datos de la solicitud
    const { amount, currency, orderId, customerEmail, paymentMethod } = req.body;

    // Validar datos requeridos
    if (!amount || !currency || !orderId || !customerEmail) {
      return res.status(400).json({
        error: 'Datos incompletos. Se requieren: amount, currency, orderId y customerEmail'
      });
    }

    // Crear el payload para Izipay
    const payload = {
      amount: parseInt(amount, 10),
      currency: currency,
      orderId: orderId,
      formAction: 'PAYMENT',
      ctx_mode: 'TEST',
      paymentConfig: 'SINGLE',
      customer: { email: customerEmail },
      transactionOptions: {
        cardOptions: {
          paymentSource: 'INTERNET'
        }
      },
      shopId: IZIPAY_SHOP_ID
    };
    
    // Si el método de pago es Yape, configurar las opciones de pago para incluir Yape
    if (paymentMethod === 'yape-pasarela') {
      payload.paymentMethods = {
        specificPaymentMethods: ['YAPE']
      };
    } else if (paymentMethod === 'tarjeta') {
      payload.paymentMethods = {
        specificPaymentMethods: ['CARD']
      };
    }

    // Generar la firma HMAC
    const signature = generateSignature(payload, IZIPAY_SECRET_KEY);

    // Configurar los headers para la solicitud a Izipay
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${signature}`
    };

    // Realizar la solicitud a Izipay
    const response = await axios.post(IZIPAY_API_URL, payload, { headers });

    // Extraer el formToken de la respuesta
    const { formToken } = response.data;

    // Devolver el formToken al frontend
    return res.status(200).json({ formToken });
  } catch (error) {
    console.error('Error al procesar el pago:', error.response?.data || error.message);
    
    // Devolver mensaje de error
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Error al procesar el pago'
    });
  }
};