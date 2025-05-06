import React, { useState, useEffect } from 'react';
import { usePaymentContext, CouponData, calculateTotalDiscountPercentage } from './paymentTypes';
import { FaTag, FaTimes, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentCoupons: React.FC = () => {
  const { t } = useTranslation();
  const { formData, applyCoupon, removeCoupon } = usePaymentContext();
  const { currencySymbol } = useCurrency();
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [showMaxDiscountWarning, setShowMaxDiscountWarning] = useState(false);
  
  // Calcular el porcentaje total de descuento actual
  const totalDiscountPercentage = calculateTotalDiscountPercentage(formData.appliedCoupons);
  
  // Efecto para mostrar advertencia cuando el descuento se acerca al máximo
  useEffect(() => {
    setShowMaxDiscountWarning(totalDiscountPercentage >= 40 && totalDiscountPercentage < 50);
  }, [totalDiscountPercentage]);
  
  // Efecto para manejar errores del contexto
  useEffect(() => {
    if (formData.error) {
      switch (formData.error) {
        case 'coupon_already_applied':
          setError(t('payment.coupons.alreadyApplied', 'Este cupón ya ha sido aplicado'));
          break;
        case 'invalid_coupon':
          setError(t('payment.coupons.invalidCoupon', 'Cupón inválido o expirado'));
          break;
        case 'max_discount_exceeded':
          setError(t('payment.coupons.maxDiscountExceeded', 'No se puede exceder el 50% de descuento total'));
          break;
        case 'max_discount_coupon_applied':
          setError(t('payment.coupons.maxDiscountCouponApplied', 'Ya tienes un cupón con el máximo descuento permitido (50%)'));
          break;
        case 'cannot_add_max_discount_coupon':
          setError(t('payment.coupons.cannotAddMaxDiscountCoupon', 'No puedes agregar un cupón de 50% cuando ya tienes otros cupones aplicados'));
          break;
        default:
          setError('');
      }
    }
  }, [formData.error, t]);

  const handleApplyCoupon = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir comportamiento por defecto que podría causar navegación
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError(t('payment.coupons.emptyCode', 'Por favor ingresa un código de cupón'));
      return;
    }

    // Intentar aplicar el cupón
    applyCoupon(couponCode);
    setCouponCode('');
  };

  const handleRemoveCoupon = (code: string) => {
    removeCoupon(code);
  };

  const calculateTotalDiscount = () => {
    if (formData.appliedCoupons.length === 0) return 0;
    
    return formData.originalAmount - formData.amount;
  };

  const totalDiscount = calculateTotalDiscount();

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        <FaTag className="inline-block mr-2" />
        {t('payment.coupons.title', 'Cupones de Descuento')}
      </h3>
      
      {/* Advertencia de límite de descuento */}
      <AnimatePresence>
        {showMaxDiscountWarning && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <p className="text-yellow-700 dark:text-yellow-400 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {t('payment.coupons.approachingMaxDiscount', 'Estás cerca del límite máximo de descuento (50%)')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
           
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder={t('payment.coupons.placeholder', 'Ingresa código de cupón')}
          className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleApplyCoupon}
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          disabled={totalDiscountPercentage >= 50}
        >
          <FaPlus className="mr-2" />
          {t('payment.coupons.apply', 'Aplicar')}
        </button>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      
      {formData.appliedCoupons.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 dark:text-white">
            {t('payment.coupons.appliedCoupons', 'Cupones aplicados')}:
            <span className="ml-2 text-blue-600 dark:text-blue-400 text-sm">
              ({t('payment.coupons.totalDiscountPercentage', 'Descuento total')}: {totalDiscountPercentage}%)
            </span>
          </h4>
          <ul className="space-y-2">
            {formData.appliedCoupons.map((coupon: CouponData) => (
              <motion.li 
                key={coupon.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
              >
                <div>
                  <span className="font-medium dark:text-white">{coupon.code}</span>
                  <span className="ml-2 text-green-600 dark:text-green-400">-{coupon.discountPercentage}%</span>
                </div>
                <button
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={t('payment.coupons.remove', 'Eliminar cupón')}
                >
                  <FaTimes />
                </button>
              </motion.li>
            ))}
          </ul>
          
          {totalDiscount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <p className="text-green-700 dark:text-green-400 font-medium">
                {t('payment.coupons.totalDiscount', 'Descuento total')}: 
                <span className="font-bold">{currencySymbol} {(formData.originalAmount - formData.amount).toFixed(2)} ({formData.originalAmount > 0 ? ((formData.originalAmount - formData.amount) / formData.originalAmount * 100).toFixed(2) : 0}%)</span>
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentCoupons;