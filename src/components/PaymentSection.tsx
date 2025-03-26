import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { PaymentForm, PaymentFormData } from './payment';
import { storePaymentData, generatePaymentReceipt, getCurrentPaymentData, clearPaymentData } from '../services/paymentService';

// Definición de tipos para Izipay
interface IzipayConfig {
  config: {
    render: {
      typeForm: string;
    };
    style?: {
      theme?: string;
      buttonColor?: string;
      // Propiedades adicionales de estilo con tipos específicos
      customCss?: string;
      inputStyle?: string;
      buttonStyle?: string;
    };
    // Propiedades adicionales de configuración con tipos específicos
    language?: string;
    currency?: string;
    amount?: number;
    orderId?: string;
    customer?: {
      email?: string;
      name?: string;
    };
  };
}

// Definición de la respuesta de Izipay
interface IzipayResponse {
  status: string;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  errorCode?: string;
  errorMessage?: string;
  // Propiedades adicionales específicas que pueden venir en la respuesta
  date?: string;
  time?: string;
  cardBrand?: string;
  cardNumber?: string;
  authorizationCode?: string;
  paymentMethodType?: string;
  paymentMethodToken?: string;
  customerName?: string;
  customerEmail?: string;
  Errors?: Record<string, string>;
}

interface IzipayInstance {
  LoadForm: (params: {
    authorization: string;
    keyRSA: string;
    callbackResponse: (response: IzipayResponse) => void;
  }) => void;
}

interface IzipayConstructor {
  new (config: { config: IzipayConfig }): IzipayInstance;
}

declare global {
  interface Window {
    Izipay: IzipayConstructor;
  }
}

interface PaymentSectionProps {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ name, email, phone, documentType, documentNumber }) => {
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const paymentMethod = 'Izipay'; // Valor fijo ya que solo usamos Izipay

  useEffect(() => {
    // Cargar el script de Izipay
    const script = document.createElement('script');
    script.src = 'https://checkout.izipay.pe/plugins/api/V1/assets/js/izipay.min.js';
    script.async = true;
    
    // También mantenemos el script de KR para compatibilidad con el método de pago Visa existente
    const krScript = document.createElement('script');
    krScript.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
    krScript.setAttribute('kr-public-key', import.meta.env.VITE_PUBLIC_KEY);
    krScript.setAttribute('kr-language', 'es-ES');
    krScript.setAttribute('kr-currency', 'PEN');
    
    document.body.appendChild(script);
    document.body.appendChild(krScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(krScript);
    };
  }, []);
  
  // Configuración de Izipay
  const iziConfig = {
    config: {
      render: {
        typeForm: 'pop-up'
      },
      style: {
        theme: 'classic',
        buttonColor: '#3B82F6'
      }
    }
  };

  const handlePayment = async () => {
    try {
      const callbackResponsePayment = (response: IzipayResponse) => {
        console.log('Izipay response:', response);
        if (response && response.status === 'success') {
          setShowPaymentSuccess(true);
          const currentData = paymentData || getCurrentPaymentData();
          if (currentData) {
            generatePaymentReceipt(currentData, paymentMethod, response.transactionId);
          }
        }
      };

      if (window.Izipay) {
        try {
          const checkout = new window.Izipay({ config: iziConfig });
          const authorization = import.meta.env.VITE_IZIPAY_TOKEN_DEV; // Use development token
          const keyRSA = import.meta.env.VITE_IZIPAY_KEY_RSA_DEV; // Use development RSA key

          checkout.LoadForm({
            authorization,
            keyRSA,
            callbackResponse: callbackResponsePayment
          });
        } catch (error) {
          console.error('Izipay error:', error instanceof Error ? error.message : 'Unknown error');
        }
      } else {
        console.error('Izipay SDK no está cargado correctamente');
      }
    } catch (error) {
      console.error('Payment failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleFormSubmit = (data: PaymentFormData) => {
    // Almacenar los datos del formulario para su uso posterior
    storePaymentData(data);
    setPaymentData(data);
    setShowPaymentForm(false);
  };

  const handleBackToForm = () => {
    setShowPaymentForm(true);
  };

  const handleCloseSuccess = () => {
    setShowPaymentSuccess(false);
    setShowPaymentForm(true);
    clearPaymentData();
    setPaymentData(null);
  };

  return (
    <section id="payment" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Realiza tu pago</h2>
        
        {showPaymentForm ? (
          <div className="max-w-4xl mx-auto">
            <PaymentForm 
              onFormSubmit={handleFormSubmit} 
              initialData={{
                firstName: name ? (name.split(' ')[0] || '') : '',
                lastName: name ? (name.split(' ').slice(1).join(' ') || '') : '',
                email: email || '',
                phone: phone || '',
                documentType: (documentType === 'dni' || documentType === 'ce') ? documentType : 'dni',
                documentNumber: documentNumber || '',
                courseLevel: 'Básico',
                studentGroup: '',
                // No preseleccionamos el horario, se seleccionará en el formulario
                courseSchedule: ''
              }}
            />
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              {paymentData && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">Resumen de pago</h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><span className="font-medium">Estudiante:</span> {paymentData.firstName} {paymentData.lastName}</p>
                    <p><span className="font-medium">Documento:</span> {paymentData.documentType.toUpperCase()} {paymentData.documentNumber}</p>
                    <p><span className="font-medium">Nivel:</span> {paymentData.courseLevel}</p>
                    <p><span className="font-medium">Grupo:</span> {paymentData.studentGroup}</p>
                    <p><span className="font-medium">Horario:</span> {paymentData.courseSchedule}</p>
                    <p><span className="font-medium">Tipo de pago:</span> {paymentData.paymentType === 'monthly' ? 
                      `Mensual (${paymentData.monthsCount} ${paymentData.monthsCount > 1 ? 'meses' : 'mes'})` : 
                      'Nivel Completo (6 meses con 10% descuento)'}</p>
                    <p className="text-lg font-semibold">Monto a pagar: S/. {paymentData.amount.toFixed(2)}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Método de pago</label>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Pago con tarjeta a través de Izipay</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleBackToForm}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Volver al formulario
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <CreditCard className="mr-2" />
                    Pagar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">¡Pago exitoso!</h3>
            <p className="mb-4 dark:text-gray-300">Tu recibo ha sido generado y descargado automáticamente.</p>
            <button
              onClick={handleCloseSuccess}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentSection;