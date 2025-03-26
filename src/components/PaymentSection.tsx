import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { CreditCard } from 'lucide-react';

interface PaymentSectionProps {
  name: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ name }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
    script.setAttribute('kr-public-key', import.meta.env.VITE_PUBLIC_KEY);
    script.setAttribute('kr-language', 'es-ES');
    script.setAttribute('kr-currency', 'PEN');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      if (paymentMethod === 'Yape') {
        setShowPaymentSuccess(true);
        generateReceipt(name, paymentMethod);
      } else if (paymentMethod === 'Visa') {
        const KR = window.KR;
        if (KR) {
          KR.setFormConfig({
            formToken: import.meta.env.VITE_FORM_TOKEN,
            amount: 100,
            orderId: `ORDER-${Date.now()}`,
          });
          KR.onSubmit((response) => {
            if (response.status === 'SUCCESS') {
              setShowPaymentSuccess(true);
              generateReceipt(name, paymentMethod);
            }
          });
          KR.openPaymentForm();
        }
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const generateReceipt = (name: string, paymentMethod: string) => {
    const doc = new jsPDF();
    const currentDate = format(new Date(), 'dd/MM/yyyy');
    const currentMonth = format(new Date(), 'MMMM yyyy');

    doc.setFontSize(20);
    doc.text('Recibo de Pago', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${currentDate}`, 20, 40);
    doc.text(`Nombre: ${name}`, 20, 50);
    doc.text(`Mes: ${currentMonth}`, 20, 60);
    doc.text(`Monto: S/. 100.00`, 20, 70);
    doc.text(`Método de pago: ${paymentMethod}`, 20, 80);
    
    doc.save(`recibo-${currentMonth}.pdf`);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Realiza tu pago</h2>
        <div className="max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Método de pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Selecciona un método</option>
                  <option value="Yape">Yape</option>
                  <option value="Visa">Visa</option>
                </select>
              </div>
              {paymentMethod && (
                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="mr-2" />
                  Pagar S/. 100
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">¡Pago exitoso!</h3>
            <p className="mb-4 dark:text-gray-300">Tu recibo ha sido generado y descargado automáticamente.</p>
            <button
              onClick={() => setShowPaymentSuccess(false)}
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