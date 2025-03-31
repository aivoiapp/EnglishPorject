/**
 * Servicio para la generación de documentos PDF
 */

import { jsPDF } from 'jspdf';
import { PlacementTestResult } from '../types';
import { UserData } from '../components/placement/UserForm';
import { format } from 'date-fns';


/**
 * Genera un PDF con los resultados del test de nivel con diseño profesional
 * @param result Resultado del test
 * @param userData Datos del usuario
 * @returns Nombre del archivo generado
 */
export const generatePlacementTestPDF = (result: PlacementTestResult, userData: UserData): string => {
  if (!result) return '';

  // Crear documento PDF
  const doc = new jsPDF();
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  
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
  doc.text('EVALUACIÓN DE NIVEL DE INGLÉS', 105, 20, { align: 'center' });
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
  doc.text('Edad:', 25, 105);
  
  doc.setFont('helvetica', 'normal');
  doc.text(currentDate, 65, 75);
  doc.text(userData.name || 'No proporcionado', 65, 85);
  doc.text(userData.email || 'No proporcionado', 65, 95);
  doc.text(userData.age || 'No proporcionado', 65, 105);
  
  // Resultados del test - Sección con fondo claro
  roundedRect(15, 120, 180, 50, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESULTADOS DEL TEST', 25, 132);
  
  // Datos del resultado
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Nivel:', 25, 145);
  doc.text('Puntuación:', 25, 155);
  
  // Mostrar nivel con un color que represente el nivel
  let levelColor = [79, 70, 229]; // Color por defecto (indigo)
  
  // Asignar colores según el nivel
  if (result.level === 'A1' || result.level === 'A2') {
    levelColor = [220, 38, 38]; // Rojo para principiante
  } else if (result.level === 'B1' || result.level === 'B2') {
    levelColor = [234, 88, 12]; // Naranja para intermedio
  } else if (result.level === 'C1' || result.level === 'C2') {
    levelColor = [22, 163, 74]; // Verde para avanzado
  }
  
  // Mostrar nivel con color
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.text(result.level, 65, 145);
  
  // Mostrar puntuación
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.score}/100`, 65, 155);
  
  // Visualización gráfica del nivel
  const barWidth = 120;
  const barHeight = 15;
  const barX = 65;
  const barY = 165;
  
  // Fondo de la barra de progreso
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(barX, barY, barWidth, barHeight, 3, 3, 'F');
  
  // Progreso según la puntuación
  const progressWidth = (result.score / 100) * barWidth;
  doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
  if (progressWidth > 0) {
    // Usar un rectángulo redondeado solo si hay suficiente progreso
    const radius = progressWidth > 6 ? 3 : 0;
    doc.roundedRect(barX, barY, progressWidth, barHeight, radius, radius, 'F');
  }
  
  // Grupo recomendado - Sección con fondo de acento
  if (result.recommendedGroup) {
    roundedRect(15, 180, 180, 30, 5, [accentColor[0], accentColor[1], accentColor[2], 0.1]);
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.rect(15, 180, 180, 30, 'S');
    
    // Título de sección
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GRUPO RECOMENDADO', 25, 192);
    
    // Datos del grupo
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(result.recommendedGroup, 25, 202);
  }
  
  // Fortalezas y debilidades - Sección con dos columnas
  const strengthsY = result.recommendedGroup ? 220 : 180;
  
  // Fortalezas - Columna izquierda
  roundedRect(15, strengthsY, 85, 70, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORTALEZAS', 25, strengthsY + 12);
  
  // Listar fortalezas
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.strengths.forEach((strength, i) => {
    const yPos = strengthsY + 25 + (i * 10);
    if (yPos < strengthsY + 65) { // Asegurar que no se salga del recuadro
      doc.text(`• ${strength}`, 20, yPos);
    }
  });
  
  // Debilidades - Columna derecha
  roundedRect(110, strengthsY, 85, 70, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ÁREAS DE MEJORA', 120, strengthsY + 12);
  
  // Listar debilidades
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.weaknesses.forEach((weakness, i) => {
    const yPos = strengthsY + 25 + (i * 10);
    if (yPos < strengthsY + 65) { // Asegurar que no se salga del recuadro
      doc.text(`• ${weakness}`, 115, yPos);
    }
  });
  
  // Recomendación - Sección con fondo claro
  const recY = strengthsY + 80;
  roundedRect(15, recY, 180, 50, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIÓN PERSONALIZADA', 25, recY + 12);
  
  // Texto de recomendación
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const splitRecommendation = doc.splitTextToSize(result.recommendation, 170);
  doc.text(splitRecommendation, 20, recY + 25);
  
  // Próximos pasos - Nueva página si es necesario
  if (recY + 60 > 270) {
    doc.addPage();
    
    // Encabezado en nueva página
    roundedRect(0, 0, 210, 20, 0, primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EVALUACIÓN DE NIVEL DE INGLÉS', 105, 15, { align: 'center' });
    
    // Próximos pasos en nueva página
    roundedRect(15, 30, 180, 100, 5, lightBgColor);
    
    // Título de sección
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRÓXIMOS PASOS', 25, 42);
    
    // Listar próximos pasos
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.nextSteps.forEach((step, i) => {
      const splitStep = doc.splitTextToSize(`${i+1}. ${step}`, 170);
      const stepHeight = splitStep.length * 5;
      doc.text(splitStep, 20, 55 + (i * (stepHeight + 8)));
    });
  } else {
    // Próximos pasos en la misma página
    const stepsY = recY + 60;
    roundedRect(15, stepsY, 180, 100, 5, lightBgColor);
    
    // Título de sección
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRÓXIMOS PASOS', 25, stepsY + 12);
    
    // Listar próximos pasos
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.nextSteps.forEach((step, i) => {
      const splitStep = doc.splitTextToSize(`${i+1}. ${step}`, 170);
      const stepHeight = splitStep.length * 5;
      doc.text(splitStep, 20, stepsY + 25 + (i * (stepHeight + 8)));
    });
  }
  
  // Pie de página en todas las páginas
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Pie de página con fondo de color
    roundedRect(0, 270, 210, 27, 0, secondaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('English Academy - Evaluación de Nivel', 105, 280, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Este documento es un informe oficial de su evaluación de nivel', 105, 286, { align: 'center' });
    doc.text(`Generado el: ${currentDate}`, 105, 292, { align: 'center' });
  }
  
  const fileName = `english-assessment-${userData.name || 'user'}.pdf`;
  doc.save(fileName);
  return fileName;
};