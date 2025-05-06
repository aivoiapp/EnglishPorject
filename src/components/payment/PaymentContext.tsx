import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { addMonths } from 'date-fns';
import { PaymentContext, PaymentFormData, PaymentMethodType, CouponData, calculateAmount } from './paymentTypes';
import { useCurrency } from '../../context/useCurrency';

interface PaymentProviderProps {
  children: ReactNode;
  initialData?: Partial<PaymentFormData>;
  onFormSubmit: (data: PaymentFormData) => void;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children, initialData = {}, onFormSubmit }) => {
  const { discountedPrice } = useCurrency();
  
  // Lista de cupones disponibles (en un entorno real, esto vendría de una API o base de datos)
  const availableCoupons = useMemo(() => ({
    'GRAMMAR1': { code: 'GRAMMAR1', discountPercentage: 1, isValid: true },
    'VOCABPLUS2': { code: 'VOCABPLUS2', discountPercentage: 2, isValid: true },
    'TALKTIME3': { code: 'TALKTIME3', discountPercentage: 3, isValid: true },
    'READFAST4': { code: 'READFAST4', discountPercentage: 4, isValid: true },
    'WRITESMART5': { code: 'WRITESMART5', discountPercentage: 5, isValid: true },
    'LISTENBETTER6': { code: 'LISTENBETTER6', discountPercentage: 6, isValid: true },
    'ENGLISHEXPRESS7': { code: 'ENGLISHEXPRESS7', discountPercentage: 7, isValid: true },
    'SPEAKFLUENT8': { code: 'SPEAKFLUENT8', discountPercentage: 8, isValid: true },
    'IDIOMBOOST9': { code: 'IDIOMBOOST9', discountPercentage: 9, isValid: true },
    'FLUENT10': { code: 'FLUENT10', discountPercentage: 10, isValid: true },
    'POWER20': { code: 'POWER20', discountPercentage: 20, isValid: true },
    'BOOST30': { code: 'BOOST30', discountPercentage: 30, isValid: true },
    'SKILL40': { code: 'SKILL40', discountPercentage: 40, isValid: true },
    'MASTER50': { code: 'MASTER50', discountPercentage: 50, isValid: true },
    'TAEKWONDO50': { code: 'TAEKWONDO50', discountPercentage: 50, isValid: true },
  } as Record<string, CouponData>), []);

  const initialFormState = useMemo<PaymentFormData>(() => {
    const basePrice = discountedPrice; // Precio base según la ubicación (ya configurado en CurrencyProvider)
    const { originalAmount, finalAmount } = calculateAmount('monthly', 1, basePrice, []);
    
    return {
      fullName: '',
      email: '',
      phone: '',
      courseLevel: 'Principiantes',
      courseSchedule: '',
      studentGroup: '',
      paymentType: 'monthly',
      monthsCount: 1,
      startDate: new Date(),
      endDate: addMonths(new Date(), 1),
      originalAmount: originalAmount,
      amount: finalAmount,
      appliedCoupons: [],
      paymentMethod: '',
      operationNumber: '',
      bank: '',
      generateReceipt: false,
      ruc: '',
    };
  }, [discountedPrice]);

  const [formData, setFormData] = useState<PaymentFormData>(() => {
    const paymentType = initialData.paymentType === 'fullLevel' ? 'fullLevel' : 'monthly';
    const monthsCount = paymentType === 'fullLevel' ? 6 : (initialData.monthsCount || 1);
    const startDate = initialData.startDate || new Date();
    const endDate = initialData.startDate 
      ? addMonths(initialData.startDate, paymentType === 'fullLevel' ? 6 : monthsCount)
      : addMonths(new Date(), 1);
    
    const appliedCoupons = initialData.appliedCoupons || [];
    const { originalAmount, finalAmount } = calculateAmount(paymentType, monthsCount, discountedPrice, appliedCoupons);
    
    return { 
      ...initialFormState,
      ...initialData,
      paymentType,
      monthsCount,
      startDate,
      endDate,
      originalAmount,
      amount: finalAmount,
      appliedCoupons: appliedCoupons
    };
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => {
        const newPaymentType = initialData.paymentType === 'fullLevel' ? 'fullLevel' : prev.paymentType;
        const newMonths = newPaymentType === 'fullLevel' ? 6 : initialData.monthsCount || prev.monthsCount;
        const appliedCoupons = initialData.appliedCoupons || prev.appliedCoupons;
        
        const { originalAmount, finalAmount } = calculateAmount(
          newPaymentType, 
          newMonths, 
          discountedPrice, 
          appliedCoupons
        );
        
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
          originalAmount,
          amount: finalAmount,
          appliedCoupons
        };
      });
    }
  }, [initialData, initialFormState, discountedPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (name === 'paymentType') {
        const paymentType = value as 'monthly' | 'fullLevel';
        const monthsCount = paymentType === 'fullLevel' ? 6 : prev.monthsCount;
        
        const { originalAmount, finalAmount } = calculateAmount(
          paymentType, 
          monthsCount, 
          discountedPrice, 
          prev.appliedCoupons
        );
        
        return {
          ...prev,
          paymentType,
          monthsCount,
          originalAmount,
          amount: finalAmount,
          endDate: addMonths(prev.startDate, monthsCount)
        };
      }
      
      if (name === 'monthsCount') {
        const monthsCount = Math.min(Math.max(parseInt(value) || 1, 1), 12);
        
        const { originalAmount, finalAmount } = calculateAmount(
          prev.paymentType, 
          monthsCount, 
          discountedPrice, 
          prev.appliedCoupons
        );
        
        return {
          ...prev,
          monthsCount,
          originalAmount,
          amount: finalAmount,
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

  // Función para aplicar un cupón
  const applyCoupon = (couponCode: string) => {
    setFormData(prev => {
      // Verificar si el cupón ya está aplicado
      const couponAlreadyApplied = prev.appliedCoupons.some(coupon => coupon.code === couponCode);
      if (couponAlreadyApplied) {
        return { ...prev, error: 'coupon_already_applied' }; // Cupón ya aplicado
      }
      
      // Verificar si el cupón existe y es válido
      const coupon = availableCoupons[couponCode];
      if (!coupon) {
        return { ...prev, error: 'invalid_coupon' }; // Cupón inválido
      }
      
      // Calcular el porcentaje total de descuento actual
      const currentTotalDiscount = prev.appliedCoupons.reduce(
        (total, coupon) => total + coupon.discountPercentage, 0
      );
      
      // Verificar si al agregar este cupón se excedería el límite del 50%
      if (currentTotalDiscount + coupon.discountPercentage > 50) {
        return { ...prev, error: 'max_discount_exceeded' }; // Se excede el límite de 50%
      }
      
      // Verificar si hay un cupón de 50% ya aplicado
      const hasMaxDiscountCoupon = prev.appliedCoupons.some(c => c.discountPercentage === 50);
      if (hasMaxDiscountCoupon) {
        return { ...prev, error: 'max_discount_coupon_applied' }; // Ya hay un cupón de 50%
      }
      
      // Si el nuevo cupón es de 50% y ya hay otros cupones aplicados
      if (coupon.discountPercentage === 50 && prev.appliedCoupons.length > 0) {
        return { ...prev, error: 'cannot_add_max_discount_coupon' }; // No se puede agregar un cupón de 50% con otros cupones
      }
      
      // Añadir el cupón a la lista de cupones aplicados
      const updatedCoupons = [...prev.appliedCoupons, coupon];
      
      // Recalcular el monto con el nuevo cupón aplicado
      const { originalAmount, finalAmount } = calculateAmount(
        prev.paymentType, 
        prev.monthsCount, 
        discountedPrice, 
        updatedCoupons
      );
      
      // Devolver el nuevo estado sin cambiar ninguna otra propiedad que pueda causar navegación
      return {
        ...prev,
        appliedCoupons: updatedCoupons,
        originalAmount,
        amount: finalAmount,
        error: undefined // Limpiar cualquier error previo
      };
    });
  };

  
  // Función para eliminar un cupón
  const removeCoupon = (couponCode: string) => {
    setFormData(prev => {
      // Filtrar el cupón a eliminar
      const updatedCoupons = prev.appliedCoupons.filter(coupon => coupon.code !== couponCode);
      
      // Recalcular el monto sin el cupón eliminado
      const { originalAmount, finalAmount } = calculateAmount(
        prev.paymentType, 
        prev.monthsCount, 
        discountedPrice, 
        updatedCoupons
      );
      
      return {
        ...prev,
        appliedCoupons: updatedCoupons,
        originalAmount,
        amount: finalAmount
      };
    });
  };

  const value = {
    formData,
    setFormData,
    handleInputChange,
    handleStartDateChange,
    handlePaymentMethodChange,
    applyCoupon,
    removeCoupon,
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