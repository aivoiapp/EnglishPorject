import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import KRGlue from '@lyracom/embedded-form-glue';

interface CreatePaymentTokenResponse {
  formToken: string;
}

interface KRClientAnswer {
  orderStatus: string;
  orderId: string;
  [key: string]: unknown;
}

interface KRPaymentResponse {
  clientAnswer: KRClientAnswer;
  rawClientAnswer: string;
  formId: string;
  [key: string]: unknown;
}

interface KRError {
  errorCode: string;
  errorMessage: string;
}

interface KRInstance {
  removeForms: () => Promise<void>;
  setFormConfig: (config: Record<string, unknown>) => Promise<void>;
  setFormToken: (token: string) => Promise<void>;
  renderElements: (selector: string) => Promise<void>;
  onSubmit: (callback: (response: KRPaymentResponse) => boolean | void) => Promise<void>;
  onError: (callback: (error: KRError) => void) => Promise<void>;
}

interface IzipayPaymentPopupProps {
  onSuccess: (response: KRPaymentResponse) => void;
  onError: (error: Error) => void;
}

function IzipayPaymentPopup({ onSuccess, onError }: IzipayPaymentPopupProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const krRef = useRef<KRInstance | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupPaymentForm = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post<CreatePaymentTokenResponse>('/api/createPaymentToken');
        const formToken = data.formToken;

        const endpoint = import.meta.env.VITE_IZIPAY_ENDPOINT;
        const publicKey = import.meta.env.VITE_IZIPAY_PUBLIC_KEY;

        if (!endpoint || !publicKey) throw new Error('Faltan las variables de entorno de Izipay');

        const glue = await KRGlue.loadLibrary(endpoint, 'V4.0');
        const KR = glue.KR as unknown as KRInstance;
        if (!isMounted) return;
        krRef.current = KR;

        await KR.setFormConfig({
          formToken,
          'kr-language': 'es-PE',
        });

        await KR.setFormToken(formToken);

        await KR.onSubmit((response: KRPaymentResponse) => {
          const { orderStatus } = response.clientAnswer;
          if (orderStatus === 'PAID') {
            KR.removeForms();
            onSuccess(response);
          } else {
            const message = 'El pago no fue exitoso.';
            setErrorMessage(message);
            onError(new Error(message));
          }
          return;
        });

        await KR.onError((error: KRError) => {
          const message = error.errorMessage || 'Error desconocido';
          setErrorMessage(message);
          onError(new Error(message));
        });

        await KR.renderElements('#kr-form');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al inicializar el formulario de pago.';
        setErrorMessage(message);
        onError(new Error(message));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupPaymentForm();

    return () => {
      isMounted = false;
      if (krRef.current) {
        krRef.current.removeForms().catch(() => {});
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="izipay-popup">
      {loading && <p>Cargando formulario de pago...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div id="kr-form">
        <div className="kr-embedded"></div>
      </div>
    </div>
  );
}

export default IzipayPaymentPopup;
