import React, { useState, useEffect } from 'react';
import type { PaymentFormData } from './payment/paymentTypes';
import { storePaymentData } from '../services/paymentService';
import PaymentForm from './payment/PaymentForm';
import { useTranslation } from 'react-i18next';


interface PaymentSectionProps {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ name, email, phone }) => {
  const { t } = useTranslation();
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);

  useEffect(() => {
    console.log('PaymentSection props updated:', { name, email, phone });
  }, [name, email, phone]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    storePaymentData(data);
    setPaymentData(data);
  };

  return (
    <section id="payment" className="py-16 bg-gradient-to-b from-[#e5e5d8] to-[#d8d8c8] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">{t('payment.title', 'Hazlo oficial: inscríbete y asegura tu progreso')}</h2>
        
        <div className="max-w-4xl mx-auto">
          <PaymentForm 
            onFormSubmit={handleFormSubmit} 
            initialData={{
              fullName: paymentData?.fullName || name || '',
              email: paymentData?.email || email || '',
              phone: paymentData?.phone || phone || '',
              courseLevel: paymentData?.courseLevel || t('payment.courseInfo.beginners', 'Principiantes'),
              studentGroup: paymentData?.studentGroup || '',
              courseSchedule: paymentData?.courseSchedule || '',
              paymentType: paymentData?.paymentType || 'monthly',
              monthsCount: paymentData?.monthsCount || 1,
              amount: paymentData?.amount || 200,
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