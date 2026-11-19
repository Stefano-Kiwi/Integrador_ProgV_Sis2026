interface ImportMetaEnv {
    readonly VITE_CLUB_NAME: string;
    readonly VITE_SEDE_ID: string;
    readonly VITE_SEDE_NOMBRE: string;
    readonly VITE_SEDE_LOCALIDAD: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}