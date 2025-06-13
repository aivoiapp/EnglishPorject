import { CouponApiResponse } from '../types/wheelTypes';

/**
 * Servicio para manejar la generación de cupones desde la ruleta
 */
export const wheelService = {
  /**
   * Genera un cupón con el porcentaje de descuento especificado
   * @param discountPercentage Porcentaje de descuento para el cupón (entre 0 y 40)
   * @returns Promesa con la respuesta de la API
   */
  generateCoupon: async (discountPercentage: number): Promise<CouponApiResponse> => {
    try {
      // Validar que el porcentaje de descuento no exceda el máximo permitido (40%)
      const validDiscount = Math.min(discountPercentage, 40);
      
      const response = await fetch('https://cytalk-backend.onrender.com/coupons/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ discountPercentage: validDiscount })
      });
      
      if (!response.ok) {
        // Si el servidor responde con un error, intentar obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `Error ${response.status}: ${response.statusText}`
        };
      }
      
      // Procesar la respuesta exitosa
      const data = await response.json();
      return {
        success: true,
        code: data.code,
        discountPercentage: validDiscount,
        expirationDate: data.expirationDate
      };
    } catch (error) {
      console.error('Error al generar el cupón:', error);
      return {
        success: false,
        message: 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.'
      };
    }
  },
  
  /**
   * Función de respaldo para generar un cupón cuando el API no está disponible
   * Genera un código aleatorio con el formato CYT-XXXX-XXXX
   * @param discountPercentage Porcentaje de descuento para el cupón
   * @returns Un objeto con el código generado y el porcentaje de descuento
   */
  generateFallbackCoupon: (discountPercentage: number): CouponApiResponse => {
    // Generar un código aleatorio con el formato CYT-XXXX-XXXX
    const generateRandomCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const part1 = Array(4).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
      const part2 = Array(4).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
      return `CYT-${part1}-${part2}`;
    };
    
    // Calcular fecha de expiración (30 días a partir de hoy)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    return {
      success: true,
      code: generateRandomCode(),
      discountPercentage: Math.min(discountPercentage, 40), // Asegurar que no exceda el 40%
      expirationDate: expirationDate.toISOString()
    };
  }
};