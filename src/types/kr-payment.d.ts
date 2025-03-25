// Type definitions for KR Payment Library

interface KRResponse {
  status: string;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  errorCode?: string;
  errorMessage?: string;
  // Otras propiedades específicas que pueda devolver la API
}

interface KRFormConfig {
  formToken: string;
  amount: number;
  orderId: string;
  currency?: string;
  language?: string;
  paymentMethods?: string[];
  // Otras configuraciones específicas
}

interface KRPaymentForm {
  setFormConfig: (config: KRFormConfig) => void;
  onSubmit: (callback: (response: KRResponse) => void) => void;
  openPaymentForm: () => void;
  closePaymentForm?: () => void;
  showForm?: (containerId: string) => void;
  hideForm?: () => void;
  // Otros métodos específicos de la API
}

declare global {
  interface Window {
    KR: KRPaymentForm;
  }
}

export {};