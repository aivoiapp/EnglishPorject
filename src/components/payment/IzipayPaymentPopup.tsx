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
  

  // =================================================================
  // 1. Cargar SDK de producción (Solo una vez)
  // =================================================================
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Izipay) {
      const script = document.createElement('script');
      script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
      script.async = true;
      script.onload = () => console.log('✅ Izipay SDK cargado (Producción)');
      
      document.head.appendChild(script);
    }
  }, []);

  // =================================================================
  // 2. Generar token y abrir popup
  // =================================================================
  const handlePaymentClick = async () => {
    try {
      setLoading(true);

      // Validaciones de producción
      const validOrderId = orderId.startsWith('PROD-') 
        ? orderId 
        : `PROD-${orderId}-${Date.now()}`;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        throw new Error('Email inválido para producción');
      }

      // Obtener formToken del backend
      const { data } = await axios.post<{ formToken: string }>('/api/createPaymentToken', {
        amount,
        currency,
        orderId: validOrderId,
        customerEmail,
        mode: 'PRODUCTION'
      });

      // Configuración de producción
      const iziConfig: IzipayConfig = {
        render: {
          typeForm: 'pop-up',
          width: '450px',
          position: 'center',
          closeButton: true
        },
        paymentForm: {
          formToken: data.formToken,
          publicKey: import.meta.env.VITE_IZIPAY_PUBLIC_KEY,
          language: 'es-ES'
        }
      };

      // Instanciar checkout
      if (window.Izipay) {
        const checkout = new window.Izipay(iziConfig);
        

        // Manejar respuesta de producción
        checkout.LoadForm({
          authorization: data.formToken,
          callbackResponse: (response) => {
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
    } finally {
      setLoading(false);
    }
  };

  // =================================================================
  // 3. UI de Botón de producción
  // =================================================================
  return (
    <button
      onClick={handlePaymentClick}
      disabled={loading}
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
  );
};

export default IzipayPaymentPopup;