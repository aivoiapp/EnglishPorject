import { createContext, useContext } from 'react';
import { addMonths } from 'date-fns';

export interface PaymentFormData {
  fullName: string;
  email: string;
  phone: string;
  courseLevel: string;
  courseSchedule: string;
  studentGroup: string;
  paymentType: 'monthly' | 'fullLevel';
  monthsCount: number;
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentMethod: string;
  operationNumber: string;
  bank: string;
  generateReceipt: boolean;
  ruc: string;
}

export type PaymentMethodType = 'transferencia' | 'yape-qr' | 'tarjeta' | '';

export interface PaymentContextType {
  formData: PaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleStartDateChange: (date: Date | null) => void;
  handlePaymentMethodChange: (method: PaymentMethodType) => void;
  initialFormState: PaymentFormData;
  handleSubmit: (e: React.FormEvent) => void;
}

// Crear el contexto con un valor inicial undefined
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de pago
export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};

// Exportar el contexto para que pueda ser utilizado por el proveedor
export { PaymentContext };

// Función para calcular la fecha de finalización basada en la fecha de inicio y el tipo de pago
export const calculateEndDate = (startDate: Date, paymentType: 'monthly' | 'fullLevel', monthsCount: number = 1): Date => {
  return addMonths(startDate, paymentType === 'fullLevel' ? 6 : monthsCount);
};

// Función para calcular el monto basado en el tipo de pago y la cantidad de meses
export const calculateAmount = (paymentType: 'monthly' | 'fullLevel', monthsCount: number = 1): number => {
  return paymentType === 'monthly' ? 100 * monthsCount : 100 * 6 * 0.9;
};