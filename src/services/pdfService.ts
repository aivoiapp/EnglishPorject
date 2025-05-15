/**
 * Servicio para la generación de documentos PDF específicos para el test de nivel
 * Este servicio actúa como un wrapper sobre htmlToPdf para mantener compatibilidad
 * con implementaciones anteriores
 */

import { PlacementTestResult } from '../types';
import { UserData } from '../components/placement/UserForm';
import { generatePdfFromHtml } from './htmlToPdf';
import { TFunction } from 'i18next';

/**
 * Genera un PDF con los resultados del test de nivel
 *
 * @param _result Resultados del test de nivel
 * @param userData Datos del usuario
 * @param t Función de traducción de i18next
 * @returns Promesa que se resuelve cuando el PDF ha sido generado
 */
export const generatePlacementTestPDF = async (
  _result: PlacementTestResult,
  userData: UserData,
  t: TFunction
): Promise<void> => {
  try {
    const resultsContainer = document.getElementById('placement-results-container');
    if (!resultsContainer) {
      console.error('No se encontró el contenedor de resultados');
      return;
    }
    // Solo delega la generación técnica, sin lógica de ocultamiento ni pie de página
    await generatePdfFromHtml(resultsContainer, {
      fileName: `${t('placementTest.results.filePrefix', 'english-assessment')}-${userData.name || t('placementTest.results.defaultUser', 'user')}`,
      orientation: 'portrait',
      scale: 1.5,
      onSaveSuccess: (fileName: string) => {
        console.log(`PDF guardado como: ${fileName}`);
      },
      onError: (error: Error) => {
        console.error('Error al generar el PDF:', error);
      }
    });
  } catch (error) {
    console.error('Error al generar el PDF del test de nivel:', error);
  }
};