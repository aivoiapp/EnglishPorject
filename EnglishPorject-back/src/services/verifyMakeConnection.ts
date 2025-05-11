
import axios from 'axios';

export const UNIFIED_WEBHOOK = 'https://hook.us2.make.com/gyebx6etjrubt48brle65sdvhdsm07qq';

export const verifyMakeConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.post(UNIFIED_WEBHOOK, {
      action: 'verify_connection',
      timestamp: new Date().toISOString()
    });
    console.log('✔️ Verificación de conexión con Make.com exitosa:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión con Make.com:', error);
    return false;
  }
};
