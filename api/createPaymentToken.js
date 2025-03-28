const axios = require('axios');
const crypto = require('crypto');

const IZIPAY_SHOP_ID = process.env.IZIPAY_SHOP_ID || '76277481';
const IZIPAY_SECRET_KEY = process.env.IZIPAY_SECRET_KEY || '1WnoQMibn4xsItKU';
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';

const generateSignature = (payload, secretKey) => {
  const contentToSign = JSON.stringify(payload);
  return crypto.createHmac('sha256', secretKey).update(contentToSign).digest('hex');
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { amount, currency, orderId, customerEmail, paymentMethod } = req.body;

    console.log('👉 BODY RECIBIDO:', req.body);
    console.log('🔐 CLAVES:', IZIPAY_SHOP_ID, 'SECRET_KEY: oculta');

    if (!amount || !currency || !orderId || !customerEmail) {
      return res.status(400).json({
        error: 'Faltan datos: amount, currency, orderId o customerEmail.'
      });
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
          paymentSource: 'INTERNET'
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

    const signature = generateSignature(payload, IZIPAY_SECRET_KEY);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': signature
    };

    const response = await axios.post(IZIPAY_API_URL, payload, { headers });

    const { formToken } = response.data;

    if (!formToken) {
      throw new Error('No se recibió formToken de Izipay');
    }

    return res.status(200).json({ formToken });
  } catch (error) {
    console.error('❌ Error al procesar el pago:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Respuesta inesperada de Izipay',
      debug: error.response?.data || error.message
    });
  }
};


