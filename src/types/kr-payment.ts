/**
 * Tipos para la integración con la pasarela de pagos Izipay (KR Payment)
 */

export interface KRResponse {
  status: 'SUCCESS' | 'ERROR' | 'PENDING' | 'success' | 'error' | 'pending';
  transactionId?: string;
  orderDetails?: {
    orderId: string;
    amount: number;
    currency: string;
  };
  customerDetails?: {
    email: string;
  };
  errorCode?: string;
  errorMessage?: string;
  paymentMethod?: {
    type: string;
    brand?: string;
    pan?: string; // Últimos 4 dígitos de la tarjeta
  };
  timestamp?: string;
}

/**
 * Configuración del formulario de pago
 */
export interface KRFormConfig {
  formToken: string;
  amount?: number;
  orderId?: string;
  currency?: string;
}

/**
 * Interfaz para el objeto KR global
 */
export interface KRPaymentInterface {
  setFormConfig: (config: KRFormConfig) => void;
  onSubmit: (callback: (response: KRResponse) => void) => void;
  openPopup: () => void;
}

/**
 * Extender la interfaz Window para incluir el objeto KR
 */
declare global {
  interface Window {
    KR?: KRPaymentInterface;
  }
}