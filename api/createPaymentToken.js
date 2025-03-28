import crypto from 'crypto';
import axios from 'axios';

/**
 * Genera una firma HMAC-SHA256 para la autenticación con Izipay
 * @param {Object} payload - El payload a firmar
 * @param {string} secretKey - La clave secreta para generar la firma
 * @returns {string} - La firma generada
 */
const generateSignature = (payload, secretKey) => {
  const contentToSign = JSON.stringify(payload);
  return crypto.createHmac('sha256', secretKey).update(contentToSign).digest('hex');
};

export default async function handler(req, res) {
  // CORS para permitir llamadas desde cualquier origen (ajústalo según seguridad)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Aceptamos solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { amount, currency, orderId, customerEmail, paymentMethod } = req.body;

    if (!amount || !currency || !orderId || !customerEmail) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Acceder a las claves del entorno
    const IZIPAY_SHOP_ID = process.env.IZIPAY_SHOP_ID;
    const IZIPAY_SECRET_KEY = process.env.IZIPAY_SECRET_KEY;
    const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';

    if (!IZIPAY_SHOP_ID || !IZIPAY_SECRET_KEY) {
      return res.status(500).json({ error: 'Credenciales Izipay no configuradas' });
    }

    const payload = {
      amount: parseInt(amount, 10),
      currency,
      orderId,
      formAction: 'PAYMENT',
      ctx_mode: 'PRODUCTION',
      paymentConfig: 'SINGLE',
      customer: { email: customerEmail },
      transactionOptions: {
        cardOptions: {
          paymentSource: 'INTERNET',
        }
      },
      shopId: IZIPAY_SHOP_ID
    };

    if (paymentMethod === 'yape-pasarela') {
      payload.paymentMethods = {
        specificPaymentMethods: ['YAPE']
      };
    } else if (paymentMethod === 'tarjeta') {
      payload.paymentMethods = {
        specificPaymentMethods: ['CARD']
      };
    }

    // Generar firma HMAC-SHA256
    const signature = generateSignature(payload, IZIPAY_SECRET_KEY);

    // Headers de autorización
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': signature
    };

    const response = await axios.post(IZIPAY_API_URL, payload, { headers });

    if (!response.data || !response.data.answer || !response.data.answer.formToken) {
      throw new Error('Respuesta inesperada de Izipay');
    }

    return res.status(200).json({ formToken: response.data.answer.formToken });

  } catch (error) {
    console.error('🔴 Error al procesar el pago:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message || 'Error interno'
    });
  }
}
