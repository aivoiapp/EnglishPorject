import axios from 'axios';
import { UNIFIED_WEBHOOK, verifyMakeConnection } from './verifyMakeConnection';
import { toast } from 'react-toastify';
import { PaymentFormData } from '../components/payment/paymentTypes';

export const sendPaymentFormData = async (paymentData: PaymentFormData) => {
  await verifyMakeConnection();

  const makePayload = {
    ...paymentData,
    formType: 'payment',
    source: 'web',
    connectionName: 'Cytalk Web App',
    timestamp: new Date().toISOString(),
    appVersion: '1.0.1'
  };

  const backendPayload = {
    paymentData,
    formType: 'payment',
    source: 'web',
    connectionName: 'Cytalk Web App',
    timestamp: new Date().toISOString(),
    appVersion: '1.0.1'
  };

  const results = { make: null, backend: null };

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, makePayload);
    results.make = makeRes.data;
  } catch (err) {
    console.error('❌ Error Make.com (Payment):', err);
    toast.error('Error enviando a Make.com');
  }

  try {
    const backendRes = await axios.post('https://cytalk-backend.onrender.com/api/forms/payment', backendPayload);
    results.backend = backendRes.data;
  } catch (err) {
    console.error('❌ Error Backend (Payment):', err);
    toast.error('Error enviando a Cytalk');
  }

  return results;
};