import React from 'react';
import { PaymentProvider } from './PaymentContext';
import { PaymentFormData, usePaymentContext } from './paymentTypes';
import PaymentStepper from './PaymentStepper';
import '../../phone-input.css';

interface PaymentFormProps {
  onFormSubmit: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onFormSubmit, initialData = {} }) => {
  return (
    <PaymentProvider initialData={initialData} onFormSubmit={onFormSubmit}>
      <FormContent onFormSubmit={onFormSubmit} />
    </PaymentProvider>
  );
};

const FormContent: React.FC<{ onFormSubmit: (data: PaymentFormData) => void }> = ({ onFormSubmit }) => {
  const { formData } = usePaymentContext();

  const submitForm = () => {
    onFormSubmit(formData); // Pass formData to onFormSubmit
  };

  return <PaymentStepper onFormSubmit={submitForm} />;
};

export default PaymentForm;