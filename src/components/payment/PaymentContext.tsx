import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { addMonths } from 'date-fns';
import { PaymentContext, PaymentFormData, PaymentMethodType } from './paymentTypes';

interface PaymentProviderProps {
  children: ReactNode;
  initialData?: Partial<PaymentFormData>;
  onFormSubmit: (data: PaymentFormData) => void;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children, initialData = {}, onFormSubmit }) => {
  const initialFormState = useMemo<PaymentFormData>(() => ({
    fullName: '',
    email: '',
    phone: '',
    courseLevel: 'Básico',
    courseSchedule: '',
    studentGroup: '',
    paymentType: 'monthly',
    monthsCount: 1,
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    amount: 100,
    paymentMethod: '',
    operationNumber: '',
    bank: '',
    generateReceipt: false,
    ruc: '',
  }), []);

  const [formData, setFormData] = useState<PaymentFormData>({ 
    ...initialFormState,
    ...initialData,
    paymentType: initialData.paymentType === 'fullLevel' ? 'fullLevel' : 'monthly',
    startDate: initialData.startDate || new Date(),
    endDate: initialData.startDate 
      ? addMonths(
          initialData.startDate, 
          initialData.paymentType === 'fullLevel' ? 6 : initialData.monthsCount || 1
        )
      : addMonths(new Date(), 1),
    amount: initialData.paymentType === 'fullLevel' 
      ? 100 * 6 * 0.9 
      : 100 * (initialData.monthsCount || 1)
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => {
        const newPaymentType = initialData.paymentType === 'fullLevel' ? 'fullLevel' : prev.paymentType;
        const newMonths = newPaymentType === 'fullLevel' ? 6 : initialData.monthsCount || prev.monthsCount;
        
        return {
          ...initialFormState,
          ...prev,
          ...initialData,
          paymentType: newPaymentType,
          monthsCount: newMonths,
          startDate: initialData.startDate || prev.startDate,
          endDate: addMonths(
            initialData.startDate || prev.startDate,
            newPaymentType === 'fullLevel' ? 6 : newMonths
          ),
          amount: newPaymentType === 'monthly' 
            ? 100 * newMonths 
            : 100 * 6 * 0.9
        };
      });
    }
  }, [initialData, initialFormState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (name === 'paymentType') {
        const paymentType = value as 'monthly' | 'fullLevel';
        const monthsCount = paymentType === 'fullLevel' ? 6 : prev.monthsCount;
        
        return {
          ...prev,
          paymentType,
          monthsCount,
          amount: paymentType === 'monthly' ? 100 * monthsCount : 100 * 6 * 0.9,
          endDate: addMonths(prev.startDate, monthsCount)
        };
      }
      
      if (name === 'monthsCount') {
        const monthsCount = Math.min(Math.max(parseInt(value) || 1, 1), 12);
        return {
          ...prev,
          monthsCount,
          amount: prev.paymentType === 'monthly' ? 100 * monthsCount : prev.amount,
          endDate: addMonths(prev.startDate, monthsCount)
        };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        startDate: date,
        endDate: addMonths(date, prev.paymentType === 'monthly' ? prev.monthsCount : 6)
      }));
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethodType) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  const value = {
    formData,
    setFormData,
    handleInputChange,
    handleStartDateChange,
    handlePaymentMethodChange,
    initialFormState,
    handleSubmit
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Este componente se exporta para que el fast refresh funcione correctamente
export const PaymentContextExport = () => null;