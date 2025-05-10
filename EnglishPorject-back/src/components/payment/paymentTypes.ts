import { createContext, useContext } from 'react';
import { addMonths } from 'date-fns';

export interface CouponData {
  code: string;
  discountPercentage: number;
  isValid: boolean;
}

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
  originalAmount: number;
  appliedCoupons: CouponData[];
  paymentMethod: string;
  operationNumber: string;
  bank: string;
  generateReceipt: boolean;
  ruc: string;
  error?: 'coupon_already_applied' | 'invalid_coupon' | 'max_discount_exceeded' | 'max_discount_coupon_applied' | 'cannot_add_max_discount_coupon';
}

export type PaymentMethodType = 'transferencia' | 'yape-qr' | 'tarjeta' | '';

export interface PaymentContextType {
  formData: PaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleStartDateChange: (date: Date | null) => void;
  handlePaymentMethodChange: (method: PaymentMethodType) => void;
  applyCoupon: (couponCode: string) => void;
  removeCoupon: (couponCode: string) => void;
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

// Función para calcular el monto basado en el tipo de pago, la cantidad de meses y los cupones aplicados
export const calculateAmount = (
  paymentType: 'monthly' | 'fullLevel', 
  monthsCount: number = 1, 
  basePrice: number = 200, // Precio base original sin descuento
  appliedCoupons: CouponData[] = []
): { originalAmount: number; finalAmount: number } => {
  
  // Precio base sin descuentos
  let originalAmount = paymentType === 'monthly' 
    ? basePrice * monthsCount 
    : basePrice * 6; // 6 meses sin descuento
  
  // Aplicar descuento del 10% solo para nivel completo
  if (paymentType === 'fullLevel') {
    originalAmount *= 0.9;
  }

  // Aplicar descuentos de cupones sobre el monto base
  let finalAmount = originalAmount;
  appliedCoupons.forEach(coupon => {
    if (coupon.isValid) {
      finalAmount = finalAmount * (1 - coupon.discountPercentage / 100);
    }
  });
  
  return { 
    originalAmount: paymentType === 'fullLevel' ? basePrice * 6 : originalAmount, 
    finalAmount 
  };
};

// Función para calcular el porcentaje total de descuento aplicado
export const calculateTotalDiscountPercentage = (appliedCoupons: CouponData[] = []): number => {
  return appliedCoupons.reduce((total, coupon) => total + coupon.discountPercentage, 0);
};