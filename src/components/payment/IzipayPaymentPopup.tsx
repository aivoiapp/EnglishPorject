import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { KRPaymentResponse, IzipayConfig, KRPaymentInterface } from '../../types/kr-payment';

declare global {
  interface Window {
    Izipay: {
      new (config: IzipayConfig): KRPaymentInterface;
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      if (!sdkLoaded) throw new Error('El SDK aún no se ha cargado.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        throw new Error('Email inválido.');
      }

      const { data } = await axios.post<{ formToken: string }>('/api/createPaymentToken', {
        amount,
        currency,
        orderId,
        customerEmail,
        mode: 'PRODUCTION',
      });

      const formToken = data.formToken;
      if (!formToken) throw new Error('No se recibió un formToken válido');

      const iziConfig: IzipayConfig = {
        render: {
          typeForm: 'pop-up',
          container: 'izipay-modal-container',
          showButtonProcessForm: true,
          closeButton: true,
          position: 'center',
        },
        paymentForm: {
          formToken,
          publicKey: import.meta.env.VITE_IZIPAY_PUBLIC_KEY!,
          language: 'es-ES',
        },
      };

      if (window.Izipay) {
        const checkout = new window.Izipay(iziConfig);

        checkout.LoadForm({
          authorization: formToken,
          callbackResponse: (response: KRPaymentResponse) => {
            if (response.paymentStatus === 'PAID') {
              onSuccess(response);
            } else {
              const code = response.errorCode || 'FAILED';
              const message = response.errorMessage || 'Pago no completado';
              onError({ code, message });
              setErrorMessage(message);
            }
          },
        });
      } else {
        throw new Error('Izipay SDK no está disponible.');
      }

    } catch (error: unknown) {
      console.error('🔥 Error en handlePaymentClick:', error);
      const err = error instanceof Error ? error : new Error('Error inesperado');
      onError({
        code: 'EXCEPTION',
        message: err.message,
      });
      setErrorMessage(err.message);
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

      <div id="izipay-modal-container" />

      {errorMessage && <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>}
    </>
  );
};

export default IzipayPaymentPopup;

