/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVEKIT_URL: string
  readonly VITE_LIVEKIT_TOKEN: string       // static token (testing)
  readonly VITE_LIVEKIT_TOKEN_URL: string   // token endpoint (production)
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
