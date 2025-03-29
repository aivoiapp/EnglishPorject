import React, { useState } from 'react';
import axios from 'axios';
import type { KRResponse } from '../../types/kr-payment';

export interface IzipayPaymentPopupProps {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  paymentMethod: 'tarjeta' | 'yape-pasarela' | 'yape-izipay';
  onSuccess: (response: KRResponse) => void;
  onError: (error: { code: string; message: string }) => void;
}

const IzipayPaymentPopup: React.FC<IzipayPaymentPopupProps> = ({
  amount,
  currency,
  orderId,
  customerEmail,
  onSuccess,
  onError,
  paymentMethod = 'tarjeta',
}) => {
  const [loading, setLoading] = useState(false);

  const loadIzipayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="kr-payment-form.min.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
      script.async = true;

      // ✅ Agregamos la clave pública para KR desde variable de entorno
      const publicKey = import.meta.env.VITE_IZIPAY_PUBLIC_KEY;
      if (!publicKey) {
        console.error('❌ Error: VITE_IZIPAY_PUBLIC_KEY no está definida en el archivo .env');
        reject(new Error('Clave pública de Izipay no configurada. Verifica la variable VITE_IZIPAY_PUBLIC_KEY en tu archivo .env'));
        return;
      }
      
      // Verificar formato de la clave pública
      if (!publicKey.includes(':publickey_')) {
        console.error('❌ Error: Formato incorrecto de VITE_IZIPAY_PUBLIC_KEY');
        reject(new Error('El formato de la clave pública de Izipay es incorrecto. Debe tener el formato: SHOP_ID:publickey_XXXX'));
        return;
      }
      
      script.setAttribute('kr-public-key', publicKey);

      const mode = 'TEST'; 
      script.setAttribute('kr-mode', mode);
      console.log(`🔧 Modo de Izipay configurado: ${mode}`);
      
      // Extraer el Shop ID de la clave pública para referencia
      const shopIdFromPublicKey = publicKey.split(':')[0];
      console.log('🔑 Usando Shop ID:', shopIdFromPublicKey);

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Error al cargar el script de Izipay'));

      document.head.appendChild(script);
    });
  };

  const initializePaymentForm = (formToken: string) => {
    if (window.KR) {
      window.KR.setFormConfig({
        formToken: formToken,
        amount: amount,
        orderId: orderId,
        currency: currency,
      });

      window.KR.onSubmit((response) => {
        if (response.status === 'SUCCESS') {
          onSuccess(response);
        } else {
          onError({
            code: response.errorCode || 'UNKNOWN_ERROR',
            message: response.errorMessage || 'Error en el proceso de pago',
          });
        }
      });

      // 🕐 Aseguramos que el modal tenga un pequeño retardo para cargar correctamente
      setTimeout(() => {
        window.KR?.openPopup();
      }, 300);
    } else {
      onError({
        code: 'SCRIPT_NOT_LOADED',
        message: 'No se pudo inicializar el formulario de pago',
      });
    }
  };

  const handlePaymentClick = async () => {
    try {
      setLoading(true);
      await loadIzipayScript();

      // Generar un orderId único si no es válido
      const validOrderId = orderId && orderId !== 'provided' 
        ? orderId 
        : `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Validar el email del cliente
      const validEmail = customerEmail && customerEmail !== 'provided' && customerEmail.includes('@')
        ? customerEmail
        : '';
      
      if (!validEmail) {
        throw new Error('Email de cliente no válido. Por favor proporcione un email válido.');
      }

      console.log('Enviando datos de pago:', {
        amount,
        currency,
        orderId: validOrderId,
        customerEmail: validEmail,
        paymentMethod
      });

      const response = await axios.post('/api/createPaymentToken', {
        amount,
        currency,
        orderId: validOrderId,
        customerEmail: validEmail,
        paymentMethod,
      });

      const { formToken } = response.data;
      if (!formToken) {
        throw new Error('Token de formulario no recibido');
      }

      initializePaymentForm(formToken);
    } catch (error) {
      console.error('Error al iniciar el proceso de pago:', error);
      onError({
        code: 'API_ERROR',
        message: error instanceof Error ? error.message : 'Error desconocido al procesar el pago'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePaymentClick}
      disabled={loading}
      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : (
        'Pagar ahora'
      )}
    </button>
  );
};

export default IzipayPaymentPopup;
