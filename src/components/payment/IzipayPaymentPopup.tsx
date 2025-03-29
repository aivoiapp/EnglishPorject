import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { KRPaymentResponse } from '../../types/kr-payment';

interface KRFormConfig {
  form: {
    action: 'payment';
    container: string;
  };
}

declare global {
  interface Window {
    KR: {
      setFormConfig: (config: KRFormConfig) => void;
      setFormToken: (token: string) => void;
      onSubmit: (callback: (res: KRPaymentResponse) => void) => void;
      removeForms: () => void;
    };
  }
}

export interface IzipayPaymentPopupProps {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  onSuccess: (response: KRPaymentResponse) => void;
  onError: (error: { code: string; message: string }) => void;
}

const IzipayPaymentPopup: React.FC<IzipayPaymentPopupProps> = ({
  amount,
  currency,
  orderId,
  customerEmail,
  onSuccess,
  onError,
}) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scriptId = 'izipay-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      script.onerror = () => {
        setSdkLoaded(false);
        setErrorMessage('Error al cargar el SDK de Izipay');
      };
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://static.micuentaweb.pe/static/css/krypton-client/V4.0/ext/classic-reset.css';
      document.head.appendChild(link);
    } else {
      setSdkLoaded(true);
    }
  }, []);

  const handlePaymentClick = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      if (!sdkLoaded || !window.KR) {
        throw new Error('Izipay SDK no está disponible.');
      }

      const res = await axios.post('/api/createPaymentToken', {
        amount,
        currency,
        orderId,
        customerEmail,
        mode: 'PRODUCTION',
      });

      const token = res.data.formToken;
      if (!token) {
        throw new Error('Token de formulario inválido');
      }

      window.KR.setFormConfig({
        form: {
          action: 'payment',
          container: 'kr-form',
        },
      });

      window.KR.setFormToken(token);

      window.KR.onSubmit((res: KRPaymentResponse) => {
        if (res.paymentStatus === 'PAID') {
          window.KR.removeForms();
          onSuccess(res);
        } else {
          onError({
            code: res.errorCode || 'REJECTED',
            message: res.errorMessage || 'Pago rechazado',
          });
          setErrorMessage('El pago no fue exitoso.');
        }
      });

    } catch (error: unknown) {
      console.error('🔥 Error en handlePaymentClick:', error);
      const err = error instanceof Error ? error : new Error('Error inesperado');
      setErrorMessage(err.message);
      onError({ code: 'EXCEPTION', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePaymentClick}
        disabled={loading || !sdkLoaded}
        className="izipay-production-button"
      >
        {loading ? 'Procesando...' : 'Pagar con Izipay'}
      </button>

      <div id="kr-form" className="mt-4" />

      {errorMessage && (
        <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>
      )}
    </>
  );
};

export default IzipayPaymentPopup;