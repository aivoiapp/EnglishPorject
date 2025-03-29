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
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Izipay) {
      const script = document.createElement('script');
      script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Izipay SDK cargado (Producción)');
        setSdkLoaded(true);
      };
      script.onerror = () => setSdkLoaded(false);
      document.head.appendChild(script);
    }
  }, []);

  const handlePaymentClick = async () => {
    try {
      if (!sdkLoaded) throw new Error('SDK no está cargado');
      setLoading(true);
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

      const iziConfig: IzipayConfig = {
        render: {
          typeForm: 'embedded',  // Change to embedded for modal
          target: '#izipay-modal-container',  // Target the modal container
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

      if (window.Izipay) {
        console.log('Izipay Object:', window.Izipay);
        const checkout = new window.Izipay(iziConfig);
        
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
            }
            setShowModal(false);  // Close modal after response
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

  return (
    <>
      <button
        onClick={() => setShowModal(true)}  // Open modal on button click
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

      {showModal && (
        <div id="izipay-modal-container" className="modal">
          {/* Modal content */}
          <button onClick={handlePaymentClick}>Confirmar Pago</button>
          <button onClick={() => setShowModal(false)}>Cerrar</button>
        </div>
      )}
    </>
  );
};

export default IzipayPaymentPopup;