/**
 * Servicio para la generación de documentos PDF a partir de elementos HTML
 * Utiliza html2canvas para capturar el contenido HTML y jsPDF para generar el PDF
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Opciones de configuración para la generación de PDF
 */
export interface HtmlToPdfOptions {
  /** Nombre del archivo PDF a generar (sin extensión) */
  fileName?: string;
  /** Título del documento PDF */
  title?: string;
  /** Margen superior en mm */
  marginTop?: number;
  /** Margen inferior en mm */
  marginBottom?: number;
  /** Margen izquierdo en mm */
  marginLeft?: number;
  /** Margen derecho en mm */
  marginRight?: number;
  /** Orientación del documento (portrait o landscape) */
  orientation?: 'portrait' | 'landscape';
  /** Formato del documento (a4, letter, etc.) */
  format?: string;
  /** Calidad de la imagen (1 = 100%, 2 = 200%, etc.) */
  scale?: number;
  /** Función para personalizar el documento PDF antes de guardarlo */
  onDocumentReady?: (doc: jsPDF) => void;
  /** Función para ejecutar después de guardar el PDF */
  onSaveSuccess?: (fileName: string) => void;
  /** Función para ejecutar en caso de error */
  onError?: (error: Error) => void;
}

/**
 * Genera un PDF a partir de un elemento HTML
 * 
 * @param element Elemento HTML a convertir en PDF (puede ser un selector CSS o un elemento HTML)
 * @param options Opciones de configuración
 * @returns Promesa que resuelve con el nombre del archivo generado
 * 
 * @example
 * // Uso básico con un selector
 * generatePdfFromHtml('#results-container', { fileName: 'resultados' });
 * 
 * @example
 * // Uso con un elemento y opciones personalizadas
 * const element = document.getElementById('results-container');
 * generatePdfFromHtml(element, {
 *   fileName: 'resultados-test',
 *   orientation: 'landscape',
 *   scale: 2,
 *   onDocumentReady: (doc) => {
 *     // Personalizar el documento antes de guardarlo
 *     doc.setFontSize(10);
 *     doc.text('Documento generado automáticamente', 10, 10);
 *   },
 *   onSaveSuccess: (fileName) => {
 *     console.log(`PDF guardado como ${fileName}`);
 *   }
 * });
 */
export const generatePdfFromHtml = async (
  element: string | HTMLElement,
  options: HtmlToPdfOptions = {}
): Promise<string> => {
  try {
    // Valores por defecto
    const {
      fileName = 'documento',
      title = '',
      marginTop = 0,
      marginLeft = 0,
      marginRight = 0,
      orientation = 'portrait',
      format = 'a4',
      scale = 1.5,
      onDocumentReady,
      onSaveSuccess
    } = options;
    
    // Obtener el elemento HTML
    const targetElement = typeof element === 'string'
      ? document.querySelector(element) as HTMLElement
      : element;
    
    if (!targetElement) {
      throw new Error('Elemento no encontrado');
    }
    
    // Capturar el elemento HTML como imagen
    const canvas = await html2canvas(targetElement, {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Crear documento PDF
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });
    
    // Calcular dimensiones
    const imgWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Añadir título si se proporciona
    if (title) {
      doc.setFontSize(16);
      doc.text(title, doc.internal.pageSize.getWidth() / 2, marginTop, { align: 'center' });
    }
    
    // Añadir la imagen al PDF
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(
      imgData,
      'PNG',
      marginLeft,
      title ? marginTop + 10 : marginTop,
      imgWidth,
      imgHeight
    );
    
    // Permitir personalización adicional del documento
    if (onDocumentReady && typeof onDocumentReady === 'function') {
      onDocumentReady(doc);
    }
    
    // Guardar el PDF
    const fullFileName = `${fileName}.pdf`;
    doc.save(fullFileName);
    
    // Callback de éxito
    if (onSaveSuccess && typeof onSaveSuccess === 'function') {
      onSaveSuccess(fullFileName);
    }
    
    return fullFileName;
  } catch (error) {
    console.error('Error al generar PDF desde HTML:', error);
    
    // Callback de error
    if (options.onError && typeof options.onError === 'function') {
      options.onError(error as Error);
    }
    
    throw error;
  }
};

/**
 * Genera un PDF a partir de múltiples elementos HTML, cada uno en una página separada
 * 
 * @param elements Array de elementos HTML o selectores CSS
 * @param options Opciones de configuración
 * @returns Promesa que resuelve con el nombre del archivo generado
 * 
 * @example
 * // Generar un PDF con múltiples páginas
 * generateMultiPagePdf(['#page1', '#page2', '#page3'], { fileName: 'documento-multipagina' });
 */
export const generateMultiPagePdf = async (
  elements: (string | HTMLElement)[],
  options: HtmlToPdfOptions = {}
): Promise<string> => {
  try {
    if (!elements.length) {
      throw new Error('No se proporcionaron elementos para generar el PDF');
    }
    
    // Valores por defecto
    const {
      fileName = 'documento-multipagina',
      orientation = 'portrait',
      format = 'a4',
      marginLeft = 0,
      marginRight = 0,
      marginTop = 0,
      scale = 1.5,
      onDocumentReady,
      onSaveSuccess
    } = options;
    
    // Crear documento PDF
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });
    
    // Procesar cada elemento
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      // Obtener el elemento HTML
      const targetElement = typeof element === 'string'
        ? document.querySelector(element) as HTMLElement
        : element;
      
      if (!targetElement) {
        console.warn(`Elemento ${i} no encontrado, se omitirá`);
        continue;
      }
      
      // Añadir nueva página excepto para el primer elemento
      if (i > 0) {
        doc.addPage();
      }
      
      // Capturar el elemento HTML como imagen
      const canvas = await html2canvas(targetElement, {
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Calcular dimensiones
      const imgWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Añadir la imagen al PDF
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(
        imgData,
        'PNG',
        marginLeft,
        marginTop,
        imgWidth,
        imgHeight
      );
    }
    
    // Permitir personalización adicional del documento
    if (onDocumentReady && typeof onDocumentReady === 'function') {
      onDocumentReady(doc);
    }
    
    // Guardar el PDF
    const fullFileName = `${fileName}.pdf`;
    doc.save(fullFileName);
    
    // Callback de éxito
    if (onSaveSuccess && typeof onSaveSuccess === 'function') {
      onSaveSuccess(fullFileName);
    }
    
    return fullFileName;
  } catch (error) {
    console.error('Error al generar PDF multipágina:', error);
    
    // Callback de error
    if (options.onError && typeof options.onError === 'function') {
      options.onError(error as Error);
    }
    
    throw error;
  }
};