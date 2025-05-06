import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck, FaUser, FaBook, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa'; // Added relevant icons
import { usePaymentContext, PaymentFormData } from './paymentTypes';
import PaymentPersonalInfo from './PaymentPersonalInfo';
import PaymentCourseInfo from './PaymentCourseInfo';
import PaymentDetails from './PaymentDetails';
import PaymentMethods from './PaymentMethods';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { storePaymentData, generatePaymentReceipt } from '../../services/paymentService';
import { sendPaymentFormData } from '../../services/makeService';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/useCurrency';

// Define MotivationalMessage component
const MotivationalMessage: React.FC<{step: number}> = ({ step }) => {
  const { t } = useTranslation();
  const messages = [
    t('payment.motivationalMessages.step0', '¡Comencemos! Solo necesitamos algunos datos básicos.'),
    t('payment.motivationalMessages.step1', '¡Excelente! Ahora cuéntanos sobre el curso que te interesa.'),
    t('payment.motivationalMessages.step2', '¡Vas muy bien! Definamos los detalles del pago.'),
    t('payment.motivationalMessages.step3', 'Elige cómo prefieres realizar tu pago.'),
    t('payment.motivationalMessages.step4', '¡Listo! Revisa los detalles y confirma tu pago.')
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6 text-blue-800 dark:text-blue-300"
    >
      {messages[step]}
    </motion.div>
  );
};

const PaymentStepper: React.FC<{onFormSubmit: (data: PaymentFormData) => void}> = ({ onFormSubmit }) => {
  const { t } = useTranslation();
  const { formData } = usePaymentContext();
  const { currencySymbol } = useCurrency();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptGenerated, setReceiptGenerated] = useState(false);

  // Define completion check functions
  const isPersonalInfoComplete = () => {
    return !!formData.fullName && !!formData.email && !!formData.phone;
  };

  const isCourseInfoComplete = () => {
    return !!formData.courseLevel && !!formData.studentGroup && !!formData.courseSchedule;
  };

  const isPaymentDetailsComplete = () => {
    return !!formData.paymentType && (formData.paymentType === 'monthly' ? formData.monthsCount > 0 : true);
  };

  const isPaymentMethodComplete = () => {
    return !!formData.paymentMethod && !!formData.operationNumber && (formData.paymentMethod === 'tarjeta' ? !!formData.bank : true);
  };

  const isSummaryComplete = () => {
    return true; // Assume summary is always complete
  };

  const stepCompletionStatus = [
    isPersonalInfoComplete(),
    isCourseInfoComplete(),
    isPaymentDetailsComplete(),
    isPaymentMethodComplete(),
    isSummaryComplete()
  ];

  const canProceed = stepCompletionStatus[currentStep];

  const nextStep = () => {
    if (currentStep < 4 && canProceed && !isAnimating) {
      setIsAnimating(true);
      setCurrentStep(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentStep(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPersonalInfoComplete() && isCourseInfoComplete() && 
        isPaymentDetailsComplete() && isPaymentMethodComplete()) {
      try {
        setIsSubmitting(true);
        
        // Almacenar los datos del pago
        storePaymentData(formData);
        
        // Generar el PDF usando el servicio mejorado
        generatePaymentReceipt(
          formData,
          formData.paymentMethod,
          undefined // No hay ID de transacción en este punto
        );
        
       
        
        // Enviar datos y PDF a Make.com
        await sendPaymentFormData(formData);
        
        // Mostrar mensaje de confirmación
        setReceiptGenerated(true);
        
        // Llamar a la función onFormSubmit para completar el proceso
        onFormSubmit(formData);
      } catch (error) {
        console.error('Error al generar o enviar el comprobante:', error);
        // En caso de error, usar la función del servicio como respaldo
        const { pdfDoc } = generatePaymentReceipt(formData, formData.paymentMethod, undefined);
        pdfDoc.save(`recibo-${formData.fullName.replace(/ /g, '-')}.pdf`);
        setReceiptGenerated(true);
        onFormSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstIncompleteStep = stepCompletionStatus.findIndex(complete => !complete);
      if (firstIncompleteStep !== -1) {
        setCurrentStep(firstIncompleteStep);
      }
    }
  };

  // Iconos con colores personalizados para cada paso
  const stepIconColors = [
    'text-indigo-500 dark:text-indigo-400',  // Datos Personales
    'text-blue-500 dark:text-blue-400',     // Datos del Curso
    'text-green-500 dark:text-green-400',   // Detalles de Pago
    'text-purple-500 dark:text-purple-400', // Método de Pago
    'text-teal-500 dark:text-teal-400'      // Resumen de Pago
  ];

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[1200px] w-full mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-6 space-y-8">
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-4">
          {[
            t('payment.stepper.personalInfo', 'Datos Personales'), 
            t('payment.stepper.courseInfo', 'Datos del Curso'), 
            t('payment.stepper.paymentDetails', 'Detalles de Pago'), 
            t('payment.stepper.paymentMethod', 'Método de Pago'), 
            t('payment.stepper.paymentSummary', 'Resumen de Pago')
          ].map((title, index) => (
            <motion.div 
              key={index} 
              className={`flex flex-col items-center ${currentStep === index ? 'scale-110' : ''}`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div 
                className={`flex items-center justify-center p-3 rounded-full mb-2 ${currentStep === index ? `${stepIconColors[index]} bg-${stepIconColors[index].split('-')[1]}-100 dark:bg-${stepIconColors[index].split('-')[1]}-900/30 border-2 border-${stepIconColors[index].split('-')[1]}-300 dark:border-${stepIconColors[index].split('-')[1]}-700` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                initial={{ scale: 1 }}
                animate={currentStep === index ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: currentStep === index ? Infinity : 0, repeatDelay: 5 }}
              >
                {index === 0 && <FaUser className="text-2xl" />}
                {index === 1 && <FaBook className="text-2xl" />}
                {index === 2 && <FaMoneyBillWave className="text-2xl" />}
                {index === 3 && <FaCreditCard className="text-2xl" />}
                {index === 4 && <FaCheck className="text-2xl" />}
              </motion.div>
              <span className={`text-xs font-medium text-center ${currentStep === index ? stepIconColors[index] : 'text-gray-600 dark:text-gray-400'}`}>{title}</span>
            </motion.div>
          ))}
        </div>

        <MotivationalMessage step={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentStep === 0 && <PaymentPersonalInfo />}
            {currentStep === 1 && <PaymentCourseInfo />}
            {currentStep === 2 && <PaymentDetails />}
            {currentStep === 3 && <PaymentMethods />}
            {currentStep === 4 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('payment.summary.title', 'Resumen de pago')}</h3>
                <p>{t('payment.summary.student', 'Estudiante')}: {formData.fullName}</p>
                <p>Nivel: {formData.courseLevel}</p>
                <p>Grupo: {formData.studentGroup}</p>
                <p>{t('payment.summary.schedule', 'Horario')}: {formData.courseSchedule}</p>
                <p>{t('payment.summary.paymentType', 'Tipo de pago')}: {formData.paymentType === 'monthly' ? t('payment.paymentDetails.monthly', 'Mensual') : t('payment.paymentDetails.fullLevel', 'Nivel Completo')}</p>
                <p>{t('payment.summary.period', 'Período de pago')}: {format(formData.startDate, 'MMMM yyyy', { locale: es })} a {format(formData.endDate, 'MMMM yyyy', { locale: es })}</p>
                
                {/* Mostrar información de cupones si hay alguno aplicado */}
                {formData.appliedCoupons && formData.appliedCoupons.length > 0 && (
                  <div className="mt-2 mb-2">
                    <p>{t('payment.summary.couponsApplied', 'Cupones aplicados')}:</p>
                    <ul className="list-disc pl-5">
                      {formData.appliedCoupons.map(coupon => (
                        <li key={coupon.code}>
                          {coupon.code} <span className="text-green-600 dark:text-green-400">(-{coupon.discountPercentage}%)</span>
                        </li>
                      ))}
                    </ul>
                    <p className="line-through text-gray-500">
                      {t('payment.summary.originalAmount', 'Precio original')}: {currencySymbol} {formData.originalAmount ? formData.originalAmount.toFixed(2) : formData.amount.toFixed(2)}
                    </p>
                  </div>
                )}
                
                <p className="font-medium">
                  {t('payment.summary.amount', 'Monto a pagar')}: {currencySymbol} {formData.amount.toFixed(2)}
                  {formData.appliedCoupons && formData.appliedCoupons.length > 0 && (
                    <span className="text-green-600 dark:text-green-400 text-sm ml-2">
                      ({t('payment.summary.withDiscount', 'con descuento')})
                    </span>
                  )}
                </p>
                
                <p>{t('payment.summary.paymentMethod', 'Método de pago')}: {
                  formData.paymentMethod === 'transferencia' 
                    ? t('payment.paymentMethods.bankTransfer', 'Transferencia Bancaria') 
                    : formData.paymentMethod === 'yape-qr' 
                      ? t('payment.paymentMethods.yapeQr', 'Yape con QR') 
                      : formData.paymentMethod === 'tarjeta' 
                        ? t('payment.paymentMethods.creditCard', 'Tarjeta de Crédito/Débito') 
                        : formData.paymentMethod
                }</p>
                <p>{t('payment.summary.operationNumber', 'Número de operación')}: {formData.operationNumber}</p>
                {formData.paymentMethod === 'tarjeta' && formData.bank && <p>{t('payment.summary.bank', 'Banco')}: {formData.bank}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6 gap-4">
          <button
            type="button"
            onClick={prevStep}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors ${currentStep === 0 ? 'invisible' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
          >
            <FaArrowLeft className="mr-2" /> {t('navigation.previous', 'Anterior')}
          </button>
          {currentStep < 4 && canProceed && (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-3 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              {t('navigation.next', 'Siguiente')} <FaArrowRight className="ml-2" />
            </button>
          )}
          {currentStep === 4 && (
            <div className="flex flex-col">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-6 py-3 rounded-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('payment.summary.processing', 'Procesando...')}
                  </>
                ) : (
                  <>
                    {t('payment.summary.confirmAndDownload', 'Confirmar y descargar comprobante')} <FaCheck className="ml-2" />
                  </>
                )}
              </button>
              {receiptGenerated && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center"
                >
                  <p>{t('payment.summary.receiptGeneratedSuccess', '¡Comprobante generado y descargado correctamente!')}</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default PaymentStepper;