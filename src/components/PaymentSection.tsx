import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { PaymentForm, PaymentFormData } from './payment';
import { storePaymentData, generatePaymentReceipt, getCurrentPaymentData, clearPaymentData } from '../services/paymentService';
import { sendPaymentFormData } from '../services/makeService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';


interface PaymentSectionProps {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ name, email, phone, documentType, documentNumber }) => {
  // Add debug logging with more visibility
  console.log('%c PaymentSection received props:', 'background: #ff0; color: #000', { name, email, phone, documentType, documentNumber });
  
  // Verificar si los datos están llegando correctamente
  useEffect(() => {
    console.log('%c PaymentSection props updated:', 'background: #0f0; color: #000', { name, email, phone, documentType, documentNumber });
  }, [name, email, phone, documentType, documentNumber]);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const paymentMethod = 'Simulación'; // Updated to reflect simulation

  const handleDownloadReceipt = async () => {
    // Generar y descargar el recibo directamente sin mostrar el modal de éxito
    const currentData = paymentData || getCurrentPaymentData();
    if (currentData) {
      try {
        const simulatedTransactionId = `SIM-${Date.now()}`;
        
        // Generar el PDF y obtener el blob
        const doc = new jsPDF();
        const currentDate = format(new Date(), 'dd/MM/yyyy');
        const currentMonth = format(new Date(), 'MMMM yyyy');

        // Encabezado
        doc.setFontSize(20);
        doc.text('Recibo de Pago', 105, 20, { align: 'center' });
        
        // Información del estudiante
        doc.setFontSize(12);
        doc.text(`Fecha: ${currentDate}`, 20, 40);
        doc.text(`Nombre: ${currentData.fullName}`, 20, 50);
        doc.text(`Documento: ${currentData.documentType.toUpperCase()} ${currentData.documentNumber}`, 20, 60);
        doc.text(`Email: ${currentData.email}`, 20, 70);
        doc.text(`Teléfono: ${currentData.phone}`, 20, 80);
        
        // Información del curso
        doc.text('Detalles del Curso:', 20, 100);
        doc.text(`Nivel: ${currentData.courseLevel}`, 30, 110);
        doc.text(`Horario: ${currentData.courseSchedule}`, 30, 120);
        
        // Información del pago
        doc.text('Detalles del Pago:', 20, 140);
        if (currentData.paymentType === 'monthly') {
          doc.text(`Tipo: Mensual (${currentData.monthsCount} ${currentData.monthsCount > 1 ? 'meses' : 'mes'})`, 30, 150);
        } else {
          doc.text('Tipo: Nivel Completo (6 meses con 10% descuento)', 30, 150);
        }
        
        // Agregar período de pago
        if (currentData.startDate && currentData.endDate) {
          doc.text(`Período: ${format(currentData.startDate, 'MMMM yyyy', { locale: es })} a ${format(currentData.endDate, 'MMMM yyyy', { locale: es })}`, 30, 160);
          doc.text(`Monto: S/. ${currentData.amount.toFixed(2)}`, 30, 170);
          doc.text(`Método de pago: ${paymentMethod}`, 30, 180);
        } else {
          doc.text(`Monto: S/. ${currentData.amount.toFixed(2)}`, 30, 160);
          doc.text(`Método de pago: ${paymentMethod}`, 30, 170);
        }
        
        if (simulatedTransactionId) {
          doc.text(`ID de Transacción: ${simulatedTransactionId}`, 30, currentData.startDate && currentData.endDate ? 190 : 180);
        }
        
        // Pie de página
        doc.setFontSize(10);
        doc.text('English Academy - Comprobante de Pago', 105, 285, { align: 'center' });
        
        const fileName = `recibo-${currentMonth}-${currentData.fullName.replace(/ /g, '-')}.pdf`;
        doc.save(fileName);
        
        // Obtener el blob del PDF para enviarlo a Make.com
        const pdfBlob = doc.output('blob');
        
        // Enviar los datos y el PDF a Make.com
        await sendPaymentFormData(currentData, pdfBlob);
        console.log('Datos y PDF del pago enviados correctamente a Make.com');
        
        setReceiptGenerated(true);
      } catch (error) {
        console.error('Error al enviar datos del pago a Make.com:', error);
        // Generar el PDF localmente de todos modos para no interrumpir la experiencia del usuario
        const simulatedTransactionId = `SIM-${Date.now()}`;
        generatePaymentReceipt(currentData, paymentMethod, simulatedTransactionId);
        setReceiptGenerated(true);
      }
    }
  };

  const handleFormSubmit = async (data: PaymentFormData) => {
    console.log('Form submitted with data:', data); // Add this line for debugging
    storePaymentData(data);
    setPaymentData(data);
    
    // Generar el comprobante de pago inmediatamente después de enviar el formulario
    try {
      const simulatedTransactionId = `SIM-${Date.now()}`;
      
      // Generar el PDF y obtener el blob
      const doc = new jsPDF();
      const currentDate = format(new Date(), 'dd/MM/yyyy');
      const currentMonth = format(new Date(), 'MMMM yyyy');

      // Encabezado
      doc.setFontSize(20);
      doc.text('Recibo de Pago', 105, 20, { align: 'center' });
      
      // Información del estudiante
      doc.setFontSize(12);
      doc.text(`Fecha: ${currentDate}`, 20, 40);
      doc.text(`Nombre: ${data.fullName}`, 20, 50);
      doc.text(`Documento: ${data.documentType.toUpperCase()} ${data.documentNumber}`, 20, 60);
      doc.text(`Email: ${data.email}`, 20, 70);
      doc.text(`Teléfono: ${data.phone}`, 20, 80);
      
      // Información del curso
      doc.text('Detalles del Curso:', 20, 100);
      doc.text(`Nivel: ${data.courseLevel}`, 30, 110);
      doc.text(`Horario: ${data.courseSchedule}`, 30, 120);
      
      // Información del pago
      doc.text('Detalles del Pago:', 20, 140);
      if (data.paymentType === 'monthly') {
        doc.text(`Tipo: Mensual (${data.monthsCount} ${data.monthsCount > 1 ? 'meses' : 'mes'})`, 30, 150);
      } else {
        doc.text('Tipo: Nivel Completo (6 meses con 10% descuento)', 30, 150);
      }
      
      // Agregar período de pago
      if (data.startDate && data.endDate) {
        doc.text(`Período: ${format(data.startDate, 'MMMM yyyy', { locale: es })} a ${format(data.endDate, 'MMMM yyyy', { locale: es })}`, 30, 160);
        doc.text(`Monto: S/. ${data.amount.toFixed(2)}`, 30, 170);
        doc.text(`Método de pago: ${paymentMethod}`, 30, 180);
      } else {
        doc.text(`Monto: S/. ${data.amount.toFixed(2)}`, 30, 160);
        doc.text(`Método de pago: ${paymentMethod}`, 30, 170);
      }
      
      if (simulatedTransactionId) {
        doc.text(`ID de Transacción: ${simulatedTransactionId}`, 30, data.startDate && data.endDate ? 190 : 180);
      }
      
      // Pie de página
      doc.setFontSize(10);
      doc.text('English Academy - Comprobante de Pago', 105, 285, { align: 'center' });
      
      const fileName = `recibo-${currentMonth}-${data.fullName.replace(/ /g, '-')}.pdf`;
      doc.save(fileName);
      
      // Obtener el blob del PDF para enviarlo a Make.com
      const pdfBlob = doc.output('blob');
      
      // Enviar los datos y el PDF a Make.com
      await sendPaymentFormData(data, pdfBlob);
      console.log('Datos y PDF del pago enviados correctamente a Make.com');
      
      setReceiptGenerated(true);
    } catch (error) {
      console.error('Error al enviar datos del pago a Make.com:', error);
      // Generar el PDF localmente de todos modos para no interrumpir la experiencia del usuario
      const simulatedTransactionId = `SIM-${Date.now()}`;
      generatePaymentReceipt(data, paymentMethod, simulatedTransactionId);
      setReceiptGenerated(true);
    }
    
    setShowPaymentForm(false);
  };

  const handleBackToForm = () => {
    setShowPaymentForm(true);
    // No limpiamos los datos para que se mantengan cuando el usuario regresa al formulario
    // Aseguramos que paymentData se mantenga intacto para que se use como initialData en el formulario
    console.log('Volviendo al formulario con datos:', paymentData);
  };

  const handleCloseSuccess = () => {
    setShowPaymentSuccess(false);
    setShowPaymentForm(true);
    clearPaymentData();
    setPaymentData(null);
    setReceiptGenerated(false);
  };

  return (
    <section id="payment" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Realiza tu pago</h2>
        
        {showPaymentForm ? (
          <div className="max-w-4xl mx-auto">
            <PaymentForm 
              onFormSubmit={handleFormSubmit} 
              initialData={{
                // Si tenemos datos guardados del formulario, los usamos, sino usamos los props
                fullName: paymentData?.fullName || name || '',
                email: paymentData?.email || email || '',
                phone: paymentData?.phone || phone || '',
                documentType: paymentData?.documentType || ((documentType === 'dni' || documentType === 'ce') ? documentType as 'dni' | 'ce' : 'dni'),
                documentNumber: paymentData?.documentNumber || documentNumber || '',
                courseLevel: paymentData?.courseLevel || 'Básico',
                studentGroup: paymentData?.studentGroup || '',
                courseSchedule: paymentData?.courseSchedule || '',
                // Preservar todos los datos de pago si existen
                paymentType: paymentData?.paymentType || 'monthly',
                monthsCount: paymentData?.monthsCount || 1,
                amount: paymentData?.amount || 100,
                paymentMethod: paymentData?.paymentMethod || '',
                operationNumber: paymentData?.operationNumber || '',
                bank: paymentData?.bank || '',
                generateReceipt: paymentData?.generateReceipt || false,
                ruc: paymentData?.ruc || ''
              }}
            />
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              {paymentData && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">Resumen de pago</h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><span className="font-medium">Estudiante:</span> {paymentData.fullName}</p>
                    <p><span className="font-medium">Documento:</span> {paymentData.documentType.toUpperCase()} {paymentData.documentNumber}</p>
                    <p><span className="font-medium">Nivel:</span> {paymentData.courseLevel}</p>
                    <p><span className="font-medium">Grupo:</span> {paymentData.studentGroup}</p>
                    <p><span className="font-medium">Horario:</span> {paymentData.courseSchedule}</p>
                    <p><span className="font-medium">Tipo de pago:</span> {paymentData.paymentType === 'monthly' ? 
                      `Mensual (${paymentData.monthsCount} ${paymentData.monthsCount > 1 ? 'meses' : 'mes'})` : 
                      'Nivel Completo (6 meses con 10% descuento)'}</p>
                    <p><span className="font-medium">Período de pago:</span> {paymentData.startDate && paymentData.endDate ? 
                      `${format(paymentData.startDate, 'MMMM yyyy', { locale: es })} a ${format(paymentData.endDate, 'MMMM yyyy', { locale: es })}` : 
                      'No especificado'}</p>
                    <p className="text-lg font-semibold">Monto a pagar: S/. {paymentData.amount.toFixed(2)}</p>
                    <p><span className="font-medium">Método de pago:</span> {paymentData.paymentMethod}</p>
                    {paymentData.generateReceipt && (
                      <p><span className="font-medium">RUC:</span> {paymentData.ruc}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleBackToForm}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Volver al formulario
                  </button>
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Download className="mr-2" />
                    Descargar comprobante
                  </button>
                </div>
                {receiptGenerated && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                    <p className="text-center">¡Comprobante descargado correctamente!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">¡Pago exitoso!</h3>
            <p className="mb-4 dark:text-gray-300">Tu recibo ha sido generado y descargado automáticamente.</p>
            <button
              onClick={handleCloseSuccess}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentSection;