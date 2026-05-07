/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_HOST: string
    readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.jpg' {
    const src: string
    export default src
}

declare module '*.png' {
    const src: string
    export default src
}

declare module '*.woff' {
    const src: string
    export default src
}

declare module '*.woff2' {
    const src: string
    export default src
}
