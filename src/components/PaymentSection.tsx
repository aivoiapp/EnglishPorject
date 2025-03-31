import React, { useState, useEffect } from 'react';
import type { PaymentFormData } from './payment/paymentTypes';
import { storePaymentData } from '../services/paymentService';
import PaymentForm from './payment/PaymentForm';


interface PaymentSectionProps {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ name, email, phone }) => {
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);

  useEffect(() => {
    console.log('PaymentSection props updated:', { name, email, phone });
  }, [name, email, phone]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    storePaymentData(data);
    setPaymentData(data);
  };

  return (
    <section id="payment" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Realiza tu pago</h2>
        
        <div className="max-w-4xl mx-auto">
          <PaymentForm 
            onFormSubmit={handleFormSubmit} 
            initialData={{
              fullName: paymentData?.fullName || name || '',
              email: paymentData?.email || email || '',
              phone: paymentData?.phone || phone || '',
              courseLevel: paymentData?.courseLevel || 'Principiantes',
              studentGroup: paymentData?.studentGroup || '',
              courseSchedule: paymentData?.courseSchedule || '',
              paymentType: paymentData?.paymentType || 'monthly',
              monthsCount: paymentData?.monthsCount || 1,
              amount: paymentData?.amount || 100,
              paymentMethod: paymentData?.paymentMethod || '',
              operationNumber: paymentData?.operationNumber || '',
              bank: paymentData?.bank || '',
              generateReceipt: paymentData?.generateReceipt || false,
              ruc: paymentData?.ruc || ''
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;