/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_DEEPSEEK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}