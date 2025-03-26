/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IZIPAY_TOKEN_DEV: string;
  readonly VITE_IZIPAY_KEY_RSA_DEV: string;
  readonly VITE_IZIPAY_TOKEN_PROD: string;
  readonly VITE_IZIPAY_KEY_RSA_PROD: string;
  readonly VITE_APP_DEEPSEEK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}