/**
 * Tipos para la integración con Izipay Popup (Producción)
 */

export interface KRPaymentResponse {
  paymentStatus: 'PAID' | 'UNPAID' | 'FAILED';
  orderId: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  paymentMethodType?: string;
  pan?: string;
  timestamp?: string;
}

export interface KRPaymentInterface {
  LoadForm: (config: {
    authorization: string;
    callbackResponse: (response: KRPaymentResponse) => void;
  }) => void;
  CloseForm?: () => void;
}

declare global {
  interface Window {
    Izipay?: {
      new (config: IzipayConfig): KRPaymentInterface;
    };
  }
}

export interface IzipayConfig {
  render: {
    typeForm: 'pop-up' | 'embedded';
    target?: string;
    width?: string;
    position?: 'center' | 'top' | 'bottom';
    closeButton?: boolean;
    container?: string;
    showButtonProcessForm?: boolean;
  };
  paymentForm: {
    formToken: string;
    publicKey: string;
    language: 'es-ES' | 'en-US';
  };
}