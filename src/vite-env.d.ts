/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_BASE_URL_API: string;
  readonly VITE_PRIMARY_COLOR: string;
  readonly VITE_SECONDARY_COLOR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
