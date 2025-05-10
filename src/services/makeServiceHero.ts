import axios from 'axios';
import { UNIFIED_WEBHOOK, verifyMakeConnection } from './verifyMakeConnection';
import { toast } from 'react-toastify';

export interface HeroFormData {
  name: string;
  email: string;
  phone: string;
}

export const sendHeroFormData = async (formData: HeroFormData) => {
  await verifyMakeConnection();

  const payload = {
    ...formData,
    formType: 'hero',
    source: 'web',
    connectionName: 'Cytalk Web App',
    timestamp: new Date().toISOString(),
    appVersion: '1.0.1'
  };

  const results = { make: null, backend: null };

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, payload);
    results.make = makeRes.data;
  } catch (err) {
    console.error('❌ Error Make.com (Hero):', err);
    toast.error('Error enviando a Make.com');
  }

  try {
    const backendRes = await axios.post('https://cytalk-backend.onrender.com/api/forms/hero', payload);
    results.backend = backendRes.data;
  } catch (err) {
    console.error('❌ Error Backend (Hero):', err);
    toast.error('Error enviando a Cytalk');
  }

  return results;
};