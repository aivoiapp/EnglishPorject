/**
 * Servicio para gestionar la información de pagos y generar recibos
 */

import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PaymentFormData } from '../components/payment/paymentTypes';

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
 * Genera un recibo de pago en formato PDF con diseño profesional
 * @param paymentData Datos del pago
 * @param paymentMethod Método de pago utilizado
 * @param transactionId Identificador de la transacción (opcional)
 * @returns Nombre del archivo generado
 */
export const generatePaymentReceipt = (
  paymentData: PaymentFormData,
  paymentMethod: string,
  transactionId?: string
): { fileName: string; pdfDoc: jsPDF } => {
  // Crear documento PDF
  const doc = new jsPDF();
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  const currentMonth = format(new Date(), 'MMMM yyyy');
  
  // Colores corporativos
  const primaryColor = [37, 99, 235]; // Azul - #2563EB
  const secondaryColor = [55, 65, 81]; // Gris oscuro - #374151
  const accentColor = [79, 70, 229]; // Indigo - #4F46E5
  const textColor = [31, 41, 55]; // Gris muy oscuro - #1F2937
  const lightBgColor = [243, 244, 246]; // Gris muy claro - #F3F4F6
  
  // Función para dibujar rectángulos redondeados
  const roundedRect = (x: number, y: number, w: number, h: number, r: number, color: number[]) => {
    const xr = x + r;
    const yr = y + r;
    const wr = x + w - r;
    const hr = y + h - r;
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setFillColor(color[0], color[1], color[2]);
    
    doc.moveTo(xr, y);
    doc.lineTo(wr, y);
    doc.curveTo(x + w, y, x + w, y, x + w, yr);
    doc.lineTo(x + w, hr);
    doc.curveTo(x + w, y + h, x + w, y + h, wr, y + h);
    doc.lineTo(xr, y + h);
    doc.curveTo(x, y + h, x, y + h, x, hr);
    doc.lineTo(x, yr);
    doc.curveTo(x, y, x, y, xr, y);
    doc.fill();
  };
  
  // Encabezado con fondo de color
  roundedRect(0, 0, 210, 40, 0, primaryColor);
  
  // Título del documento
  doc.setTextColor(255, 255, 255); // Blanco
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPROBANTE DE PAGO', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('English Academy', 105, 30, { align: 'center' });
  
  // Información del estudiante - Sección con fondo claro
  roundedRect(15, 50, 180, 60, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL ESTUDIANTE', 25, 62);
  
  // Datos del estudiante
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 25, 75);
  doc.text('Nombre:', 25, 85);
  doc.text('Email:', 25, 95);
  doc.text('Teléfono:', 25, 105);
  
  doc.setFont('helvetica', 'normal');
  doc.text(currentDate, 65, 75);
  doc.text(paymentData.fullName, 65, 85);
  doc.text(paymentData.email, 65, 95);
  doc.text(paymentData.phone, 65, 105);
  
  // Información del curso - Sección con fondo claro
  roundedRect(15, 120, 180, 40, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLES DEL CURSO', 25, 132);
  
  // Datos del curso
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Nivel:', 25, 145);
  doc.text('Horario:', 25, 155);
  
  doc.setFont('helvetica', 'normal');
  doc.text(paymentData.courseLevel, 65, 145);
  doc.text(paymentData.courseSchedule, 65, 155);
  
  // Información del pago - Sección con fondo de acento
  roundedRect(15, 170, 180, 80, 5, [accentColor[0], accentColor[1], accentColor[2], 0.1]);
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, 170, 180, 80, 'S');
  
  // Título de sección
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLES DEL PAGO', 25, 182);
  
  // Datos del pago
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Tipo:', 25, 195);
  
  // Determinar el método de pago con nombre más descriptivo
  const paymentMethodName = paymentMethod === 'transferencia' ? 'Transferencia Bancaria' :
                           paymentMethod === 'yape-qr' ? 'Yape con QR' :
                           paymentMethod === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : paymentMethod;
  
  // Iconos para métodos de pago (simulados con texto)
  let paymentIcon = '💳';
  if (paymentMethod === 'transferencia') paymentIcon = '🏦';
  if (paymentMethod === 'yape-qr') paymentIcon = '📱';
  
  doc.setFont('helvetica', 'normal');
  if (paymentData.paymentType === 'monthly') {
    doc.text(`Mensual (${paymentData.monthsCount} ${paymentData.monthsCount > 1 ? 'meses' : 'mes'})`, 65, 195);
  } else {
    doc.text('Nivel Completo (6 meses con 10% descuento)', 65, 195);
  }
  
  doc.setFont('helvetica', 'bold');
  if (paymentData.startDate && paymentData.endDate) {
    doc.text('Período:', 25, 205);
    doc.text('Monto:', 25, 215);
    doc.text('Método de pago:', 25, 225);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`${format(paymentData.startDate, 'MMMM yyyy', { locale: es })} a ${format(paymentData.endDate, 'MMMM yyyy', { locale: es })}`, 65, 205);
    doc.text(`S/. ${paymentData.amount.toFixed(2)}`, 65, 215);
    doc.text(`${paymentIcon} ${paymentMethodName}`, 65, 225);
    
    if (paymentData.operationNumber) {
      doc.setFont('helvetica', 'bold');
      doc.text('N° Operación:', 25, 235);
      doc.setFont('helvetica', 'normal');
      doc.text(paymentData.operationNumber, 65, 235);
    }
    
    if (paymentMethod === 'tarjeta' && paymentData.bank) {
      doc.setFont('helvetica', 'bold');
      doc.text('Banco:', 25, 245);
      doc.setFont('helvetica', 'normal');
      doc.text(paymentData.bank, 65, 245);
    }
  } else {
    doc.text('Monto:', 25, 205);
    doc.text('Método de pago:', 25, 215);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`S/. ${paymentData.amount.toFixed(2)}`, 65, 205);
    doc.text(`${paymentIcon} ${paymentMethodName}`, 65, 215);
    
    if (paymentData.operationNumber) {
      doc.setFont('helvetica', 'bold');
      doc.text('N° Operación:', 25, 225);
      doc.setFont('helvetica', 'normal');
      doc.text(paymentData.operationNumber, 65, 225);
    }
    
    if (paymentMethod === 'tarjeta' && paymentData.bank) {
      doc.setFont('helvetica', 'bold');
      doc.text('Banco:', 25, 235);
      doc.setFont('helvetica', 'normal');
      doc.text(paymentData.bank, 65, 235);
    }
  }
  
  if (transactionId) {
    const yPos = paymentData.startDate && paymentData.endDate ? 
                (paymentMethod === 'tarjeta' && paymentData.bank ? 255 : 245) : 
                (paymentMethod === 'tarjeta' && paymentData.bank ? 245 : 235);
    
    doc.setFont('helvetica', 'bold');
    doc.text('ID Transacción:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(transactionId, 65, yPos);
  }
  
  // Agregar código QR simulado
  roundedRect(150, 195, 35, 35, 0, [0, 0, 0]);
  doc.setFillColor(255, 255, 255);
  // Usar el método nativo de jsPDF para el rectángulo interno
  doc.roundedRect(152, 197, 31, 31, 0, 0, 'F');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text('Código QR', 167.5, 213, { align: 'center' });
  
  // Pie de página
  roundedRect(0, 270, 210, 27, 0, secondaryColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('English Academy - Comprobante de Pago', 105, 280, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Este documento es un comprobante válido de su pago', 105, 286, { align: 'center' });
  doc.text(`Generado el: ${currentDate}`, 105, 292, { align: 'center' });
  
  const fileName = `recibo-${currentMonth}-${paymentData.fullName.replace(/ /g, '-')}.pdf`;
  doc.save(fileName);
  return { fileName, pdfDoc: doc }; // Devolver tanto el nombre del archivo como el objeto jsPDF
};