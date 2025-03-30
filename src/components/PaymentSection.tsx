import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import type { PaymentFormData } from './payment/paymentTypes';
import { storePaymentData, generatePaymentReceipt, getCurrentPaymentData} from '../services/paymentService';
import { sendPaymentFormData } from '../services/makeService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import PaymentForm from './payment/PaymentForm';


interface PaymentSectionProps {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ name, email, phone }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [receiptGenerated, setReceiptGenerated] = useState(false);

  useEffect(() => {
    console.log('PaymentSection props updated:', { name, email, phone });
  }, [name, email, phone]);

  const handleDownloadReceipt = async () => {
    const currentData = paymentData || getCurrentPaymentData();
    if (currentData) {
      try {
        const doc = new jsPDF();
        const currentDate = format(new Date(), 'dd/MM/yyyy');
        const currentMonth = format(new Date(), 'MMMM yyyy');

        doc.setFontSize(20);
        doc.text('Recibo de Pago', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Fecha: ${currentDate}`, 20, 40);
        doc.text(`Nombre: ${currentData.fullName}`, 20, 50);
        doc.text(`Email: ${currentData.email}`, 20, 60);
        doc.text(`Teléfono: ${currentData.phone}`, 20, 70);
        
        doc.text('Detalles del Curso:', 20, 100);
        doc.text(`Nivel: ${currentData.courseLevel}`, 30, 110);
        doc.text(`Horario: ${currentData.courseSchedule}`, 30, 120);
        
        doc.text('Detalles del Pago:', 20, 140);
        if (currentData.paymentType === 'monthly') {
          doc.text(`Tipo: Mensual (${currentData.monthsCount} ${currentData.monthsCount > 1 ? 'meses' : 'mes'})`, 30, 150);
        } else {
          doc.text('Tipo: Nivel Completo (6 meses con 10% descuento)', 30, 150);
        }
        
        if (currentData.startDate && currentData.endDate) {
          doc.text(`Período: ${format(currentData.startDate, 'MMMM yyyy', { locale: es })} a ${format(currentData.endDate, 'MMMM yyyy', { locale: es })}`, 30, 160);
          doc.text(`Monto: S/. ${currentData.amount.toFixed(2)}`, 30, 170);
          doc.text(`Método de pago: ${currentData.paymentMethod}`, 30, 180);
        }
        
        doc.setFontSize(10);
        doc.text('English Academy - Comprobante de Pago', 105, 285, { align: 'center' });
        
        const fileName = `recibo-${currentMonth}-${currentData.fullName.replace(/ /g, '-')}.pdf`;
        doc.save(fileName);
        
        const pdfBlob = doc.output('blob');
        await sendPaymentFormData(currentData, pdfBlob);
        
        setReceiptGenerated(true);
      } catch (error) {
        console.error('Error al enviar datos del pago:', error);
        generatePaymentReceipt(currentData, currentData.paymentMethod);
        setReceiptGenerated(true);
      }
    }
  };

  const handleFormSubmit = async (data: PaymentFormData) => {
    storePaymentData(data);
    setPaymentData(data);
    setShowPaymentForm(false);
  };

  // Remove the import if not needed
  // import { clearPaymentData } from '../services/paymentService';
  
  // If needed, use it in your code
  const handleBackToForm = () => {
    setShowPaymentForm(true);
    // Use clearPaymentData if necessary
    // clearPaymentData();
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
                fullName: paymentData?.fullName || name || '',
                email: paymentData?.email || email || '',
                phone: paymentData?.phone || phone || '',
                courseLevel: paymentData?.courseLevel || 'Básico',
                studentGroup: paymentData?.studentGroup || '',
                courseSchedule: paymentData?.courseSchedule || '',
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
                  </div>
                </div>
              )}

              {/* El componente IzipayPaymentPopup ha sido eliminado */}

              <div className="space-y-4 mt-6">
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
    </section>
  );
};

export default PaymentSection;