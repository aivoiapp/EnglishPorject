import axios from 'axios';
import { UNIFIED_WEBHOOK, verifyMakeConnection } from './verifyMakeConnection';
import { toast } from 'react-toastify';

export interface ContactFormData {
  name: string;
  phone: string;
  selectedGroup: string;
  selectedAgent: {
    name: string;
    phone: string;
  };
}

export const sendContactFormData = async (formData: ContactFormData) => {
  await verifyMakeConnection();

  const payload = {
    ...formData,
    formType: 'contact',
    source: 'web',
    connectionName: 'Cytalk Web App',
    timestamp: new Date().toISOString(),
    appVersion: '1.0.1'
  };

  const results = {
    make: null,
    backend: null
  };

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, payload);
    results.make = makeRes.data;
  } catch (err) {
    console.error('❌ Error en Make.com (Contact):', err);
    toast.error('Error enviando a Make.com');
  }

  try {
    const backendRes = await axios.post('https://cytalk-backend.onrender.com/api/forms/contact', payload);
    results.backend = backendRes.data;
  } catch (err) {
    console.error('❌ Error en Backend (Contact):', err);
    toast.error('Error enviando a Cytalk');
  }

  return results;
};