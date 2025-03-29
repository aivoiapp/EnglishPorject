import crypto from 'crypto';
import axios from 'axios';

// ======================
// Configuración Producción
// ======================
const IZIPAY_API_URL = 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreateToken'; // Verify if this is the correct endpoint for payment

// Credenciales PRODUCCIÓN (deben estar en variables de entorno de Vercel)
const SHOP_ID = process.env.IZIPAY_SHOP_ID?.trim() || '';
const SECRET_KEY = process.env.IZIPAY_SECRET_KEY?.trim() || '';

// Validación estricta
if (!SHOP_ID || !SECRET_KEY) {
  throw new Error('❌ Faltan credenciales PRODUCCIÓN de IZIPAY');
}

// ======================
// Handler Principal
// ======================
export default async function handler(req, res) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Validar datos básicos
    const { amount, currency, orderId, customerEmail } = req.body; // Include amount in the request body
    if (!amount || !currency || !orderId || !customerEmail) {
      throw new Error('Parámetros incompletos');
    }

    // 1. Construir payload según documentación oficial
    const payload = {
      amount: Math.round(amount * 100), // Convert amount to cents
      currency,
      orderId,
      customer: {
        email: customerEmail
      }
    };

    // 2. Autenticación Basic (Producción)
    const authString = `${SHOP_ID}:${SECRET_KEY}`;
    const base64Auth = Buffer.from(authString).toString('base64');

    // 3. Llamar a API de producción
    const response = await axios.post(IZIPAY_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Auth}`,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    // 4. Manejar respuesta
    if (!response.data?.answer?.formToken) {
      throw new Error('No se recibió formToken');
    }

    return res.status(200).json({
      success: true,
      formToken: response.data.answer.formToken,
      mode: "PRODUCTION",
      orderId
    });

  } catch (error) {
    console.error('Error en producción:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.answer?.errorMessage || 'Error en procesamiento'
    });
  }
}