import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck, FaUser, FaBook, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa'; // Added relevant icons
import { usePaymentContext, PaymentFormData } from './paymentTypes';
import PaymentPersonalInfo from './PaymentPersonalInfo';
import PaymentCourseInfo from './PaymentCourseInfo';
import PaymentDetails from './PaymentDetails';
import PaymentMethods from './PaymentMethods';
import { format } from 'date-fns';

// Define MotivationalMessage component
const MotivationalMessage: React.FC<{step: number}> = ({ step }) => {
  const messages = [
    "¡Comencemos! Solo necesitamos algunos datos básicos.",
    "¡Excelente! Ahora cuéntanos sobre el curso que te interesa.",
    "¡Vas muy bien! Definamos los detalles del pago.",
    "Elige cómo prefieres realizar tu pago.",
    "¡Listo! Revisa los detalles y confirma tu pago."
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
  const { formData } = usePaymentContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPersonalInfoComplete() && isCourseInfoComplete() && 
        isPaymentDetailsComplete() && isPaymentMethodComplete()) {
      onFormSubmit(formData);
    } else {
      const firstIncompleteStep = stepCompletionStatus.findIndex(complete => !complete);
      if (firstIncompleteStep !== -1) {
        setCurrentStep(firstIncompleteStep);
      }
    }
  };

  const stepIcons = [
    <FaUser />,
    <FaBook />,
    <FaMoneyBillWave />,
    <FaCreditCard />,
    <FaCheck />
  ];

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[1200px] w-full mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-6 space-y-8">
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          {['Datos Personales', 'Datos del Curso', 'Detalles de Pago', 'Método de Pago', 'Resumen de Pago'].map((title, index) => (
            <div key={index} className={`flex items-center text-xs ${currentStep === index ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {stepIcons[index]} <span className="ml-1">{title}</span>
            </div>
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
                <h3 className="text-lg font-semibold">Resumen de pago</h3>
                <p>Estudiante: {formData.fullName}</p>
                <p>Nivel: {formData.courseLevel}</p>
                <p>Grupo: {formData.studentGroup}</p>
                <p>Horario: {formData.courseSchedule}</p>
                <p>Tipo de pago: {formData.paymentType}</p>
                <p>Período de pago: {format(formData.startDate, 'MMMM yyyy')} a {format(formData.endDate, 'MMMM yyyy')}</p>
                <p>Monto a pagar: S/. {formData.amount.toFixed(2)}</p>
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
            <FaArrowLeft className="mr-2" /> Anterior
          </button>
          {currentStep < 4 && canProceed && (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-3 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              Siguiente <FaArrowRight className="ml-2" />
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="submit"
              className="flex items-center px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Confirmar y Enviar <FaCheck className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default PaymentStepper;