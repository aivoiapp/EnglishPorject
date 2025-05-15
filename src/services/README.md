# Servicios de Generación de PDF

## Servicio HTML a PDF

El servicio `htmlToPdf.ts` proporciona funciones para convertir elementos HTML en documentos PDF utilizando las bibliotecas `html2canvas` y `jsPDF`. Este enfoque permite generar PDFs con diseños más fieles a la representación visual de la interfaz de usuario.

### Funciones Disponibles

#### `generatePdfFromHtml`

Genera un PDF a partir de un elemento HTML.

```typescript
generatePdfFromHtml(
  element: string | HTMLElement,
  options: HtmlToPdfOptions = {}
): Promise<string>
```

#### `generateMultiPagePdf`

Genera un PDF con múltiples páginas, cada una a partir de un elemento HTML diferente.

```typescript
generateMultiPagePdf(
  elements: (string | HTMLElement)[],
  options: HtmlToPdfOptions = {}
): Promise<string>
```

### Opciones de Configuración

```typescript
interface HtmlToPdfOptions {
  fileName?: string;            // Nombre del archivo PDF (sin extensión)
  title?: string;               // Título del documento PDF
  marginTop?: number;           // Margen superior en mm
  marginBottom?: number;        // Margen inferior en mm
  marginLeft?: number;          // Margen izquierdo en mm
  marginRight?: number;         // Margen derecho en mm
  orientation?: 'portrait' | 'landscape'; // Orientación del documento
  format?: string;              // Formato del documento (a4, letter, etc.)
  scale?: number;               // Calidad de la imagen (1 = 100%, 2 = 200%, etc.)
  onDocumentReady?: (doc: jsPDF) => void; // Función para personalizar el documento
  onSaveSuccess?: (fileName: string) => void; // Función para ejecutar después de guardar
  onError?: (error: Error) => void; // Función para ejecutar en caso de error
}
```

## Ejemplos de Uso

### Ejemplo Básico

```typescript
import { generatePdfFromHtml } from '../services/htmlToPdf';

const handleGeneratePDF = async () => {
  const container = document.getElementById('mi-contenedor');
  if (!container) return;
  
  try {
    await generatePdfFromHtml(container, {
      fileName: 'mi-documento',
      title: 'Mi Documento PDF',
      orientation: 'portrait'
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
  }
};
```

### Ejemplo con Selector CSS

```typescript
import { generatePdfFromHtml } from '../services/htmlToPdf';

const handleGeneratePDF = async () => {
  try {
    await generatePdfFromHtml('#mi-contenedor', {
      fileName: 'mi-documento',
      scale: 2 // Mayor calidad
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
  }
};
```

### Ejemplo con Personalización Avanzada

```typescript
import { generatePdfFromHtml } from '../services/htmlToPdf';
import { format } from 'date-fns';

const handleGeneratePDF = async () => {
  try {
    const currentDate = format(new Date(), 'dd/MM/yyyy');
    
    await generatePdfFromHtml('#mi-contenedor', {
      fileName: `reporte-${currentDate}`,
      orientation: 'landscape',
      scale: 1.5,
      onDocumentReady: (doc) => {
        // Añadir encabezado y pie de página
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          
          // Encabezado
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Generado el: ${currentDate}`, 10, 10);
          
          // Pie de página
          doc.setFontSize(8);
          doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
          doc.text('© Mi Empresa 2023', 200, 290, { align: 'right' });
        }
      },
      onSaveSuccess: (fileName) => {
        console.log(`PDF guardado como: ${fileName}`);
        // Mostrar notificación al usuario
        alert(`Documento PDF generado correctamente: ${fileName}`);
      }
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
  }
};
```

### Ejemplo de PDF Multipágina

```typescript
import { generateMultiPagePdf } from '../services/htmlToPdf';

const handleGenerateMultiPagePDF = async () => {
  try {
    await generateMultiPagePdf(
      ['#pagina1', '#pagina2', '#pagina3'], 
      {
        fileName: 'documento-multipagina',
        onDocumentReady: (doc) => {
          // Añadir numeración de páginas
          const pageCount = doc.getNumberOfPages();
          for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
          }
        }
      }
    );
  } catch (error) {
    console.error('Error al generar PDF multipágina:', error);
  }
};
```

## Consejos para Mejorar la Calidad del PDF

1. **Ajustar la escala**: Aumentar el valor de `scale` mejora la calidad de la imagen, pero también aumenta el tamaño del archivo.

2. **Preparar el contenido HTML**: Asegúrate de que el contenido HTML tenga un ancho definido y esté correctamente estilizado para impresión.

3. **Usar estilos de impresión**: Puedes definir estilos CSS específicos para impresión que se aplicarán al generar el PDF.

4. **Manejar elementos complejos**: Algunos elementos como iframes, canvas o elementos con `position: fixed` pueden no renderizarse correctamente.

5. **Probar con diferentes navegadores**: La renderización puede variar ligeramente entre navegadores.

## Integración con Componentes React

Para integrar este servicio en un componente React, puedes usar una referencia al elemento DOM:

```tsx
import React, { useRef } from 'react';
import { generatePdfFromHtml } from '../services/htmlToPdf';

const MiComponente: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleGeneratePDF = async () => {
    if (!contentRef.current) return;
    
    try {
      await generatePdfFromHtml(contentRef.current, {
        fileName: 'mi-componente',
        title: 'Mi Componente PDF'
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };
  
  return (
    <div>
      <div ref={contentRef} className="mi-contenido">
        {/* Contenido que se convertirá en PDF */}
        <h1>Título del Documento</h1>
        <p>Este contenido se convertirá en un PDF.</p>
      </div>
      
      <button onClick={handleGeneratePDF}>
        Descargar como PDF
      </button>
    </div>
  );
};

export default MiComponente;
```