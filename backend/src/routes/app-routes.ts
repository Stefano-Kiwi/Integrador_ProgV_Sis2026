/**
 * Centralización de todas las rutas y endpoints de la aplicación.
 * Permite gestionar de forma consistente URLs, documentación y configuración de autenticación/guards.
 */

export const APP_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    LOGIN: 'login',
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
  },
  CANCHAS: {
    ROOT: 'canchas',
    BY_ID: ':id',
    RESERVA: 'reserva',
  },
  PAGOS: {
    ROOT: 'pagos',
    BY_ID: ':id',
    SIMULAR: 'simular',
  },
  MOCK: {
    ROOT: 'mock',
    USUARIOS: 'usuarios',
    SEDES: 'sedes',
    PLANES: 'planes',
    CLASES: 'clases',
    CLASES_RESERVA: 'clases/reserva',
    CANCHAS: 'canchas',
    CANCHAS_RESERVA: 'canchas/reserva',
    PAGOS_SIMULAR: 'pagos/simular',
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
 * Rutas públicas por defecto que no requieren token JWT.
 */
export const DEFAULT_PUBLIC_PATHS: readonly string[] = [
  API_PATHS.AUTH_LOGIN,
  API_PATHS.SEDES,
  API_PATHS.PLANES,
  `/${APP_ROUTES.MOCK.ROOT}`,
] as const;
