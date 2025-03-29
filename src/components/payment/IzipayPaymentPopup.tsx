import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { KRPaymentResponse, IzipayConfig } from '../../types/kr-payment';

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
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const scriptId = 'izipay-sdk-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Izipay SDK cargado (Producción)');
        setSdkLoaded(true);
      };
      script.onerror = () => {
        console.error('❌ Error al cargar el SDK de Izipay');
        setSdkLoaded(false);
      };
      document.head.appendChild(script);

      // Dynamically load the CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://static.micuentaweb.pe/static/css/krypton-client/V4.0/ext/classic-reset.css';
      document.head.appendChild(link);
    } else {
      setSdkLoaded(true);
    }

    return () => {
      // Cleanup script if necessary
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handlePaymentClick = async () => {
    try {
      if (!sdkLoaded) throw new Error('SDK no está cargado');
      setLoading(true);
      setErrorMessage(null); // Clear previous error messages
      console.log('Button clicked');

      const validOrderId = orderId.startsWith('PROD-') 
        ? orderId 
        : `PROD-${orderId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      console.log('Valid Order ID:', validOrderId);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        throw new Error('Email inválido para producción');
      }

      const { data } = await axios.post<{ formToken: string }>('/api/createPaymentToken', {
        amount,
        currency,
        orderId: validOrderId,
        customerEmail,
        mode: 'PRODUCTION'
      });

      console.log('Form Token:', data.formToken);

      // Validate formToken
      if (!data.formToken) {
        throw new Error('Form token is invalid or empty');
      }

      const iziConfig: IzipayConfig = {
        render: {
          typeForm: 'pop-up',
          container: 'izipay-modal-container',
          showButtonProcessForm: true,
          closeButton: true,
          position: 'center'
        },
        paymentForm: {
          formToken: data.formToken,
          publicKey: import.meta.env.VITE_IZIPAY_PUBLIC_KEY,
          language: 'es-ES'
        }
      };

      if (window.Izipay) {
        console.log('Izipay Object:', window.Izipay);
        const checkout = new window.Izipay(iziConfig);
        console.log('Checkout instance created:', checkout);
        
        checkout.LoadForm({
          authorization: data.formToken,
          callbackResponse: (response) => {
            console.log('Payment Response:', response);

            if (response.paymentStatus === 'PAID') {
              onSuccess({
                ...response,
                transactionId: response.transactionId || `TX-${Date.now()}`
              });
            } else {
              onError({
                code: response.errorCode || 'PAYMENT_FAILED',
                message: response.errorMessage || 'Pago rechazado'
              });
              setErrorMessage(response.errorMessage || 'Pago rechazado');
            }
          }
        });
      }

    } catch (error) {
      console.error('🔥 Error producción:', error);
      onError({
        code: 'CHECKOUT_ERROR',
        message: error instanceof Error ? error.message : 'Error crítico en pasarela'
      });
      setErrorMessage(error instanceof Error ? error.message : 'Error crítico en pasarela');
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
        data-testid="izipay-prod-button"
      >
        {loading ? (
          <div className="spinner">
            <span className="spinner-dot"></span>
            <span className="spinner-dot"></span>
            <span className="spinner-dot"></span>
          </div>
        ) : (
          'Pagar con Izipay'
        )}
      </button>

      <div id="izipay-modal-container" className="modal">
        {/* This is where the embedded form will be rendered */}
      </div>

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  );
};

export default IzipayPaymentPopup;