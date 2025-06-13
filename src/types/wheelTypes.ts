// Tipos para la ruleta de descuentos

// Interfaz para los segmentos de la ruleta
export interface WheelSegment {
  color: string;      // Color del segmento
  label: string;      // Etiqueta que se muestra en el segmento (ej: "10%")
  value: number;      // Valor numérico del descuento (ej: 10)
}

// Interfaz para el resultado de la generación de cupones
export interface CouponGenerationResult {
  code: string;                // Código del cupón generado
  discountPercentage: number;  // Porcentaje de descuento del cupón
  isValid: boolean;            // Indica si el cupón es válido
  expirationDate?: string;     // Fecha de expiración del cupón (opcional)
}

// Interfaz para la respuesta del API al generar un cupón
export interface CouponApiResponse {
  success: boolean;            // Indica si la operación fue exitosa
  code?: string;               // Código del cupón generado (si success es true)
  message?: string;            // Mensaje de error (si success es false)
  discountPercentage?: number; // Porcentaje de descuento del cupón
  expirationDate?: string;     // Fecha de expiración del cupón
}