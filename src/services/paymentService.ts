/**
 * Servicio para gestionar la información de pagos y generar recibos
 */

import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PaymentFormData } from '../components/payment/PaymentForm';

// Almacenamiento temporal de la información del pago actual
let currentPaymentData: PaymentFormData | null = null;

/**
 * Almacena los datos del formulario de pago para su uso posterior
 * @param data Datos del formulario de pago
 */
export const storePaymentData = (data: PaymentFormData): void => {
  currentPaymentData = data;
};

/**
 * Obtiene los datos del pago actual
 * @returns Datos del formulario de pago o null si no hay datos
 */
export const getCurrentPaymentData = (): PaymentFormData | null => {
  return currentPaymentData;
};

/**
 * Limpia los datos del pago actual
 */
export const clearPaymentData = (): void => {
  currentPaymentData = null;
};

/**
 * Genera un recibo de pago en formato PDF
 * @param paymentData Datos del pago
 * @param paymentMethod Método de pago utilizado
 * @param transactionId Identificador de la transacción (opcional)
 * @returns Nombre del archivo generado
 */
export const generatePaymentReceipt = (
  paymentData: PaymentFormData,
  paymentMethod: string,
  transactionId?: string
): string => {
  const doc = new jsPDF();
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  const currentMonth = format(new Date(), 'MMMM yyyy');

  // Encabezado
  doc.setFontSize(20);
  doc.text('Recibo de Pago', 105, 20, { align: 'center' });
  
  // Información del estudiante
  doc.setFontSize(12);
  doc.text(`Fecha: ${currentDate}`, 20, 40);
  doc.text(`Nombre: ${paymentData.fullName}`, 20, 50);
  doc.text(`Email: ${paymentData.email}`, 20, 60);
  doc.text(`Teléfono: ${paymentData.phone}`, 20, 70);
  
  // Información del curso
  doc.text('Detalles del Curso:', 20, 100);
  doc.text(`Nivel: ${paymentData.courseLevel}`, 30, 110);
  doc.text(`Horario: ${paymentData.courseSchedule}`, 30, 120);
  
  // Información del pago
  doc.text('Detalles del Pago:', 20, 140);
  if (paymentData.paymentType === 'monthly') {
    doc.text(`Tipo: Mensual (${paymentData.monthsCount} ${paymentData.monthsCount > 1 ? 'meses' : 'mes'})`, 30, 150);
  } else {
    doc.text('Tipo: Nivel Completo (6 meses con 10% descuento)', 30, 150);
  }
  
  // Agregar período de pago
  if (paymentData.startDate && paymentData.endDate) {
    doc.text(`Período: ${format(paymentData.startDate, 'MMMM yyyy', { locale: es })} a ${format(paymentData.endDate, 'MMMM yyyy', { locale: es })}`, 30, 160);
    doc.text(`Monto: S/. ${paymentData.amount.toFixed(2)}`, 30, 170);
    doc.text(`Método de pago: ${paymentMethod}`, 30, 180);
  } else {
    doc.text(`Monto: S/. ${paymentData.amount.toFixed(2)}`, 30, 160);
    doc.text(`Método de pago: ${paymentMethod}`, 30, 170);
  }
  
  if (transactionId) {
    doc.text(`ID de Transacción: ${transactionId}`, 30, paymentData.startDate && paymentData.endDate ? 190 : 180);
  }
  
  // Pie de página
  doc.setFontSize(10);
  doc.text('English Academy - Comprobante de Pago', 105, 285, { align: 'center' });
  
  const fileName = `recibo-${currentMonth}-${paymentData.fullName.replace(/ /g, '-')}.pdf`;
  doc.save(fileName);
  return fileName;
};