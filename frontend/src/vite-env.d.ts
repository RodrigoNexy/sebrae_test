/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LARAVEL_URL?: string;
  /** Base da API (ex.: http://localhost:8000). Vazio = URLs relativas + proxy do Vite. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
