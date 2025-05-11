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
// Eliminar el componente de ejemplo innecesario y la importación redundante
export const generatePlacementTestPDF = (result: PlacementTestResult, userData: UserData, t: (key: string) => string): string => {
  if (!result) return '';

  // Crear documento PDF
  const doc = new jsPDF();
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  
  // Añadir logo de CyTalk
  const logoPath = new URL('/images/Cytalk_logo.png', window.location.origin).href;
  doc.addImage(logoPath, 'PNG', 10, 10, 20, 20);
  
  // Remove the line: const { t } = useTranslation();
  
  // Colores corporativos mejorados para un aspecto más profesional
  const primaryColor = [37, 99, 235]; // Azul - #2563EB
  const secondaryColor = [55, 65, 81]; // Gris oscuro - #374151
  const accentColor = [79, 70, 229]; // Indigo - #4F46E5
  const textColor = [31, 41, 55]; // Gris muy oscuro - #1F2937
  const lightBgColor = [243, 244, 246]; // Gris muy claro - #F3F4F6
  
  // Colores adicionales para elementos visuales
  const successColor = [22, 163, 74]; // Verde - #16A34A
  const warningColor = [234, 88, 12]; // Naranja - #EA580C
  const dangerColor = [220, 38, 38]; // Rojo - #DC2626
  // const infoColor = [59, 130, 246]; // Azul claro - #3B82F6 - No utilizado
  
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
  
  // Encabezado con fondo de color y degradado
  roundedRect(0, 0, 210, 40, 0, primaryColor);
  
  // Añadir un detalle decorativo al encabezado
  doc.setDrawColor(255, 255, 255, 0.3);
  doc.setLineWidth(1);
  doc.line(0, 35, 210, 35);
  
  // Título del documento con sombra sutil
  // Efecto de sombra (muy sutil)
  doc.setTextColor(20, 70, 180, 0.5);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(t('placementTest.title').toUpperCase(), 106, 21, { align: 'center' });
  
  // Texto principal
  doc.setTextColor(255, 255, 255); // Blanco
  doc.text(t('placementTest.title').toUpperCase(), 105, 20, { align: 'center' });
  
  // Subtítulo con estilo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t('header.title'), 105, 30, { align: 'center' });
  
  // Añadir fecha en el encabezado
  doc.setFontSize(8);
  doc.text(`Fecha: ${currentDate}`, 190, 10, { align: 'right' });
  
  // Información del estudiante - Sección con fondo claro
  roundedRect(15, 50, 180, 60, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('placementTest.personalInfo').toUpperCase(), 25, 62);
  
  // Datos del estudiante
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t('placementTest.results.date') + ':', 25, 75);
  doc.text(t('placementTest.name') + ':', 25, 85);
  doc.text(t('placementTest.email') + ':', 25, 95);
  doc.text(t('placementTest.age') + ':', 25, 105);
  
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
  doc.text(t('placementTest.results.title').toUpperCase(), 25, 132);
  
  // Datos del resultado
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t('placementTest.results.level') + ':', 25, 145);
  doc.text(t('placementTest.results.score') + ':', 25, 155);
  
  // Mostrar nivel con un color que represente el nivel
  let levelColor = accentColor; // Color por defecto (indigo)
  
  // Asignar colores según el nivel
  if (result.level === 'A1' || result.level === 'A2') {
    levelColor = dangerColor; // Rojo para principiante
  } else if (result.level === 'B1' || result.level === 'B2') {
    levelColor = warningColor; // Naranja para intermedio
  } else if (result.level === 'C1' || result.level === 'C2') {
    levelColor = successColor; // Verde para avanzado
  }
  
  // Crear un indicador visual del nivel
  const levelIndicator = (level: string) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    
    if (currentIndex === -1) return '';
    
    let indicator = '';
    for (let i = 0; i < levels.length; i++) {
      if (i === currentIndex) {
        indicator += '■ ';
      } else {
        indicator += '□ ';
      }
    }
    return indicator;
  };
  
  // Mostrar nivel con color
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.text(result.level, 65, 145);
  
  // Añadir indicador visual del nivel
  doc.setFontSize(9);
  doc.text(levelIndicator(result.level), 85, 145);
  
  // Mostrar puntuación
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.score}/100`, 65, 155);
  
  // Visualización gráfica del nivel
  const barWidth = 120;
  const barHeight = 15;
  const barX = 65;
  const barY = 165;
  
  // Fondo de la barra de progreso con gradiente
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(barX, barY, barWidth, barHeight, 3, 3, 'F');
  
  // Añadir marcas de nivel en la barra
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  
  // Divisiones para los niveles A1, A2, B1, B2, C1, C2
  const divisions = 6;
  for (let i = 1; i < divisions; i++) {
    const x = barX + (barWidth / divisions) * i;
    doc.line(x, barY, x, barY + barHeight);
  }
  
  // Etiquetas de nivel debajo de la barra
  doc.setFontSize(7);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  levels.forEach((level, i) => {
    const x = barX + (barWidth / divisions) * (i + 0.5);
    doc.text(level, x, barY + barHeight + 7, { align: 'center' });
  });
  
  // Progreso según la puntuación
  const progressWidth = (result.score / 100) * barWidth;
  
  // Aplicar color para la barra de progreso (sin gradiente ya que jsPDF no soporta createLinearGradient)
  doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
  // Nota: Se usa el color sólido en lugar del gradiente que no está disponible
  if (progressWidth > 0) {
    // Usar un rectángulo redondeado solo si hay suficiente progreso
    const radius = progressWidth > 6 ? 3 : 0;
    doc.roundedRect(barX, barY, progressWidth, barHeight, radius, radius, 'F');
    
    // Añadir brillo a la barra de progreso
    doc.setFillColor(255, 255, 255, 0.3);
    doc.roundedRect(barX, barY, progressWidth, barHeight / 2, radius, radius, 'F');
  }
  
  // Mostrar la puntuación en la barra
  if (progressWidth > 30) {
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${result.score}%`, barX + progressWidth - 15, barY + barHeight - 4);
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
    doc.text(t('placementTest.results.recommendedGroup').toUpperCase(), 25, 192);
    
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
  doc.text(t('placementTest.results.strengths').toUpperCase(), 25, strengthsY + 12);
  
  // Listar fortalezas
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Limitar a 5 fortalezas máximo para evitar desbordamiento
  const maxStrengths = result.strengths.slice(0, 5);
  maxStrengths.forEach((strength, i) => {
    // Truncar texto largo y añadir elipsis si es necesario
    const displayText = strength.length > 35 ? strength.substring(0, 32) + '...' : strength;
    // Dividir el texto si es necesario para evitar desbordamiento
    const splitStrength = doc.splitTextToSize(`• ${displayText}`, 75);
    const yPos = strengthsY + 25 + (i * 12); // Aumentar espacio vertical entre líneas
    if (yPos < strengthsY + 65) { // Asegurar que no se salga del recuadro
      doc.text(splitStrength, 20, yPos);
    }
  });
  
  // Indicar si hay más fortalezas que no se muestran
  if (result.strengths.length > 5) {
    const yPos = strengthsY + 25 + (5 * 12);
    if (yPos < strengthsY + 65) {
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`(+${result.strengths.length - 5} más)`, 20, yPos);
    }
  }
  
  // Debilidades - Columna derecha
  roundedRect(110, strengthsY, 85, 70, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('placementTest.results.weaknesses').toUpperCase(), 120, strengthsY + 12);
  
  // Listar debilidades
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Limitar a 5 debilidades máximo para evitar desbordamiento
  const maxWeaknesses = result.weaknesses.slice(0, 5);
  maxWeaknesses.forEach((weakness, i) => {
    // Truncar texto largo y añadir elipsis si es necesario
    const displayText = weakness.length > 35 ? weakness.substring(0, 32) + '...' : weakness;
    // Dividir el texto si es necesario para evitar desbordamiento
    const splitWeakness = doc.splitTextToSize(`• ${displayText}`, 75);
    const yPos = strengthsY + 25 + (i * 12); // Aumentar espacio vertical entre líneas
    if (yPos < strengthsY + 65) { // Asegurar que no se salga del recuadro
      doc.text(splitWeakness, 115, yPos);
    }
  });
  
  // Indicar si hay más debilidades que no se muestran
  if (result.weaknesses.length > 5) {
    const yPos = strengthsY + 25 + (5 * 12);
    if (yPos < strengthsY + 65) {
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`(+${result.weaknesses.length - 5} más)`, 115, yPos);
    }
  }
  
  // Recomendación - Sección con fondo claro
const recY = strengthsY + 80;
  
  // Calcular altura necesaria para la recomendación
  doc.setFontSize(10);
  const splitRecommendation = doc.splitTextToSize(result.recommendation, 170);
  // Calcular altura dinámica basada en el contenido (mínimo 50, máximo 80)
  const recHeight = Math.min(Math.max(splitRecommendation.length * 5 + 30, 50), 80);
  
  roundedRect(15, recY, 180, recHeight, 5, lightBgColor);
  
  // Título de sección
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('placementTest.results.recommendation').toUpperCase(), 25, recY + 12);
  
  // Texto de recomendación
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Limitar la longitud del texto si es demasiado largo
  if (splitRecommendation.length > 8) {
    // Mostrar solo las primeras 8 líneas
    const truncatedRecommendation = splitRecommendation.slice(0, 8);
    doc.text(truncatedRecommendation, 20, recY + 25);
    
    // Añadir indicador de texto truncado
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('(Texto completo disponible en la versión digital)', 20, recY + recHeight - 5);
  } else {
    doc.text(splitRecommendation, 20, recY + 25);
  }
  
  // Próximos pasos - Nueva página si es necesario
  if (recY + recHeight + 10 > 270) {
    doc.addPage();
    
    // Encabezado en nueva página
    roundedRect(0, 0, 210, 20, 0, primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('placementTest.title').toUpperCase(), 105, 15, { align: 'center' });
    
    // Próximos pasos en nueva página
    roundedRect(15, 30, 180, 100, 5, lightBgColor);
    
    // Título de sección
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('placementTest.results.nextSteps').toUpperCase(), 25, 42);
    
    // Listar próximos pasos
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Limitar a 4 pasos máximo para evitar desbordamiento
    const maxSteps = result.nextSteps.slice(0, 4);
    let currentY = 55;
    
    maxSteps.forEach((step, i) => {
      // Truncar pasos muy largos
      const truncatedStep = step.length > 100 ? step.substring(0, 97) + '...' : step;
      const splitStep = doc.splitTextToSize(`${i+1}. ${truncatedStep}`, 170);
      
      // Limitar a 3 líneas por paso
      const displayLines = splitStep.slice(0, 3);
      const stepHeight = displayLines.length * 5;
      
      // Verificar si hay espacio suficiente
      if (currentY + stepHeight + 5 < 130) {
        doc.text(displayLines, 20, currentY);
        currentY += stepHeight + 8;
      }
    });
    
    // Indicar si hay más pasos que no se muestran
    if (result.nextSteps.length > 4) {
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`(+${result.nextSteps.length - 4} pasos adicionales disponibles en la versión digital)`, 20, 125);
    }
  } else {
    // Próximos pasos en la misma página
    const stepsY = recY + recHeight + 10;
    
    // Calcular espacio disponible
    const availableHeight = 270 - stepsY - 30; // Restar espacio para pie de página
    const stepsHeight = Math.min(availableHeight, 100); // Altura máxima de 100
    
    roundedRect(15, stepsY, 180, stepsHeight, 5, lightBgColor);
    
    // Título de sección
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRÓXIMOS PASOS', 25, stepsY + 12);
    
    // Listar próximos pasos
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Determinar cuántos pasos mostrar según el espacio disponible
    const maxStepsToShow = Math.min(result.nextSteps.length, 3);
    const maxSteps = result.nextSteps.slice(0, maxStepsToShow);
    
    let currentY = stepsY + 25;
    
    maxSteps.forEach((step, i) => {
      // Truncar pasos muy largos
      const truncatedStep = step.length > 100 ? step.substring(0, 97) + '...' : step;
      const splitStep = doc.splitTextToSize(`${i+1}. ${truncatedStep}`, 170);
      
      // Limitar a 3 líneas por paso
      const displayLines = splitStep.slice(0, 3);
      const stepHeight = displayLines.length * 5;
      
      // Verificar si hay espacio suficiente
      if (currentY + stepHeight + 5 < stepsY + stepsHeight - 5) {
        doc.text(displayLines, 20, currentY);
        currentY += stepHeight + 8;
      }
    });
    
    // Indicar si hay más pasos que no se muestran
    if (result.nextSteps.length > maxStepsToShow) {
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`(+${result.nextSteps.length - maxStepsToShow} pasos adicionales disponibles en la versión digital)`, 20, stepsY + stepsHeight - 5);
    }
  }
  
  // Pie de página en todas las páginas
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Pie de página con fondo de color y degradado
    roundedRect(0, 270, 210, 27, 0, secondaryColor);
    
    // Añadir un detalle decorativo al pie de página
    doc.setDrawColor(255, 255, 255, 0.2);
    doc.setLineWidth(0.5);
    doc.line(15, 275, 195, 275);
    
    // Información del pie de página
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Cytalk English Academy - ${t('placementTest.title')}`, 105, 280, { align: 'center' });
    
    // Texto secundario con estilo mejorado
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(t('placementTest.results.officialDocument'), 105, 286, { align: 'center' });
    
    // Añadir número de página y fecha
    // Corregir el formato de la clave de traducción para que sea compatible
    const pageInfo = t('placementTest.results.pageInfo').replace('{page}', i.toString())
      .replace('{total}', pageCount.toString())
      .replace('{date}', currentDate);
    doc.text(pageInfo, 105, 292, { align: 'center' });
    
    // Añadir un pequeño logo o marca de agua
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255, 0.7);
    doc.text('© Cytalk English Academy 2023', 195, 295, { align: 'right' });
  }
  
  const fileName = `english-assessment-${userData.name || 'user'}.pdf`;
  doc.save(fileName);
  return fileName;
};