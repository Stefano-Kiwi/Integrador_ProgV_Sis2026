/**
 * Centralización de todas las rutas y endpoints de la aplicación.
 * Permite gestionar de forma consistente URLs, documentación y configuración de autenticación/guards.
 */

export const APP_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    LOGIN: 'login',
    ME: 'me',
    VERIFY: 'verify',
  },
  USUARIOS: {
    ROOT: 'usuarios',
    BY_ID: ':id',
  },
  SEDES: {
    ROOT: 'sedes',
    BY_ID: ':id',
  },
  PLANES: {
    ROOT: 'planes',
    BY_ID: ':id',
  },
  CLASES: {
    ROOT: 'clases',
    BY_ID: ':id',
    RESERVA: 'reserva',
    CANCELAR_RESERVA: 'reserva/:id/cancelar',
    MI_LISTA_ESPERA: 'lista-espera/mia',
  },
  CANCHAS: {
    ROOT: 'canchas',
    BY_ID: ':id',
    RESERVA: 'reserva',
    RESERVAS: 'reservas',
    DISPONIBILIDAD: ':id/disponibilidad',
    CANCELAR_RESERVA: 'reserva/:id/cancelar',
    ESTADO: ':id/estado',
  },
  PAGOS: {
    ROOT: 'pagos',
    BY_ID: ':id',
    SIMULAR: 'simular',
  },
  ACCESO: {
    ROOT: 'acceso',
    QR: 'qr',
    VALIDAR: 'validar',
    EGRESO: 'egreso',
    AFORO: 'aforo/:sedeId',
    SINCRONIZAR: 'sincronizar',
    SNAPSHOT: 'sedes/:sedeId/snapshot',
  },
} as const;

/**
 * Rutas absolutas convenientes para configurar middleware, guards, o clientes frontend.
 */
export const API_PATHS = {
  AUTH_LOGIN: `/${APP_ROUTES.AUTH.ROOT}/${APP_ROUTES.AUTH.LOGIN}`,
  USUARIOS: `/${APP_ROUTES.USUARIOS.ROOT}`,
  SEDES: `/${APP_ROUTES.SEDES.ROOT}`,
  PLANES: `/${APP_ROUTES.PLANES.ROOT}`,
  CLASES: `/${APP_ROUTES.CLASES.ROOT}`,
  CLASES_RESERVA: `/${APP_ROUTES.CLASES.ROOT}/${APP_ROUTES.CLASES.RESERVA}`,
  CANCHAS: `/${APP_ROUTES.CANCHAS.ROOT}`,
  CANCHAS_RESERVA: `/${APP_ROUTES.CANCHAS.ROOT}/${APP_ROUTES.CANCHAS.RESERVA}`,
  PAGOS: `/${APP_ROUTES.PAGOS.ROOT}`,
  PAGOS_SIMULAR: `/${APP_ROUTES.PAGOS.ROOT}/${APP_ROUTES.PAGOS.SIMULAR}`,
} as const;

/**
 * Rutas públicas por defecto que no requieren token JWT.|
 */
export const DEFAULT_PUBLIC_PATHS: readonly string[] = [
  API_PATHS.AUTH_LOGIN,
  API_PATHS.SEDES,
  API_PATHS.PLANES,
] as const;
