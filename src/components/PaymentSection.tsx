import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { PaymentForm, PaymentFormData } from './payment';
import { storePaymentData, generatePaymentReceipt, getCurrentPaymentData, clearPaymentData } from '../services/paymentService';


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
  const paymentMethod = 'Simulación'; // Updated to reflect simulation

  const handlePayment = () => {
    // Simulate a successful payment
    setShowPaymentSuccess(true);
    const currentData = paymentData || getCurrentPaymentData();
    if (currentData) {
      const simulatedTransactionId = `SIM-${Date.now()}`;
      generatePaymentReceipt(currentData, paymentMethod, simulatedTransactionId);
    }
  };

  const handleFormSubmit = (data: PaymentFormData) => {
    console.log('Form submitted with data:', data); // Add this line for debugging
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
                    <p><span className="font-medium">Método de pago:</span> {paymentData.paymentMethod}</p>
                    {paymentData.generateReceipt && (
                      <p><span className="font-medium">RUC:</span> {paymentData.ruc}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Método de pago</label>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Simulación de pago (sin pasarela de pago real)</p>
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