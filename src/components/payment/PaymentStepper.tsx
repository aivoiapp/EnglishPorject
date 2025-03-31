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
import { jsPDF } from 'jspdf';
import { storePaymentData, generatePaymentReceipt } from '../../services/paymentService';
import { sendPaymentFormData } from '../../services/makeService';

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
        
        // Generar el PDF
        const doc = new jsPDF();
        const currentDate = format(new Date(), 'dd/MM/yyyy');
        const currentMonth = format(new Date(), 'MMMM yyyy');

        doc.setFontSize(20);
        doc.text('Recibo de Pago', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Fecha: ${currentDate}`, 20, 40);
        doc.text(`Nombre: ${formData.fullName}`, 20, 50);
        doc.text(`Email: ${formData.email}`, 20, 60);
        doc.text(`Teléfono: ${formData.phone}`, 20, 70);
        
        doc.text('Detalles del Curso:', 20, 100);
        doc.text(`Nivel: ${formData.courseLevel}`, 30, 110);
        doc.text(`Horario: ${formData.courseSchedule}`, 30, 120);
        
        doc.text('Detalles del Pago:', 20, 140);
        if (formData.paymentType === 'monthly') {
          doc.text(`Tipo: Mensual (${formData.monthsCount} ${formData.monthsCount > 1 ? 'meses' : 'mes'})`, 30, 150);
        } else {
          doc.text('Tipo: Nivel Completo (6 meses con 10% descuento)', 30, 150);
        }
        
        if (formData.startDate && formData.endDate) {
          doc.text(`Período: ${format(formData.startDate, 'MMMM yyyy', { locale: es })} a ${format(formData.endDate, 'MMMM yyyy', { locale: es })}`, 30, 160);
          doc.text(`Monto: S/. ${formData.amount.toFixed(2)}`, 30, 170);
          doc.text(`Método de pago: ${formData.paymentMethod}`, 30, 180);
        }
        
        doc.setFontSize(10);
        doc.text('English Academy - Comprobante de Pago', 105, 285, { align: 'center' });
        
        const fileName = `recibo-${currentMonth}-${formData.fullName.replace(/ /g, '-')}.pdf`;
        doc.save(fileName);
        
        // Enviar datos y PDF a Make.com
        const pdfBlob = doc.output('blob');
        await sendPaymentFormData(formData, pdfBlob);
        
        // Mostrar mensaje de confirmación
        setReceiptGenerated(true);
        
        // Llamar a la función onFormSubmit para completar el proceso
        onFormSubmit(formData);
      } catch (error) {
        console.error('Error al generar o enviar el comprobante:', error);
        // En caso de error, usar la función del servicio como respaldo
        generatePaymentReceipt(formData, formData.paymentMethod);
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
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar y descargar comprobante <FaCheck className="ml-2" />
                  </>
                )}
              </button>
              {receiptGenerated && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center"
                >
                  <p>¡Comprobante generado y descargado correctamente!</p>
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