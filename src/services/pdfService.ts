/**
 * Servicio para la generación de documentos PDF
 */

import { jsPDF } from 'jspdf';
import { PlacementTestResult } from '../types';
import { UserData } from '../components/placement/UserForm';

/**
 * Genera un PDF con los resultados del test de nivel
 * @param result Resultado del test
 * @param userData Datos del usuario
 * @returns Nombre del archivo generado
 */
export const generatePlacementTestPDF = (result: PlacementTestResult, userData: UserData): string => {
  if (!result) return '';

  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text('Evaluación de Nivel de Inglés', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Nombre: ${userData.name || 'No proporcionado'}`, 20, 30);
  doc.text(`Email: ${userData.email || 'No proporcionado'}`, 20, 37);
  doc.text(`Edad: ${userData.age}`, 20, 44);
  
  doc.setFontSize(16);
  doc.text(`Nivel: ${result.level}`, 20, 55);
  doc.text(`Puntuación: ${result.score}/100`, 20, 65);
  
  if (result.recommendedGroup) {
    doc.text(`Grupo recomendado: ${result.recommendedGroup}`, 20, 75);
  }
  
  doc.setFontSize(14);
  doc.text('Fortalezas:', 20, 90);
  result.strengths.forEach((strength, i) => {
    doc.text(`- ${strength}`, 30, 100 + (i * 7));
  });
  
  const weaknessesStartY = 100 + (result.strengths.length * 7) + 10;
  doc.text('Áreas de mejora:', 20, weaknessesStartY);
  result.weaknesses.forEach((weakness, i) => {
    doc.text(`- ${weakness}`, 30, weaknessesStartY + 10 + (i * 7));
  });
  
  const recStartY = weaknessesStartY + 10 + (result.weaknesses.length * 7) + 10;
  doc.text('Recomendación:', 20, recStartY);
  const splitRecommendation = doc.splitTextToSize(result.recommendation, 170);
  doc.text(splitRecommendation, 20, recStartY + 10);
  
  const nextStepsY = recStartY + 10 + (splitRecommendation.length * 7) + 10;
  doc.text('Próximos pasos:', 20, nextStepsY);
  result.nextSteps.forEach((step, i) => {
    const splitStep = doc.splitTextToSize(`${i+1}. ${step}`, 170);
    doc.text(splitStep, 20, nextStepsY + 10 + (i * 14));
  });
  
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text('English Academy - Evaluación de Nivel', 105, 285, { align: 'center' });
  }
  
  const fileName = `english-assessment-${userData.name || 'user'}.pdf`;
  doc.save(fileName);
  return fileName;
};