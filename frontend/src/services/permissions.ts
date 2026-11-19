import type { UsuarioSesion } from "./authService";

export interface PermisosUsuario {
  esGerente: boolean;
  esAdministrador: boolean;
  esInstructor: boolean;
  sedeAsignadaId: number | null;
  sedeAsignadaNombre: string | null;
  puedeGestionarTodasLasSedes: boolean;
  puedeCambiarDeSede: boolean;
  puedeCrearSedes: boolean;
  puedeEliminarClases: boolean;
  puedeEliminarCanchas: boolean;
  puedeCrearYEditarClases: boolean;
  puedeCrearYEditarCanchas: boolean;
}

const RUTAS_ADMIN = [
  "/admin",
  "/admin/sedes",
  "/admin/personal",
  "/admin/instructores",
  "/admin/tipos-clase",
  "/admin/tipos-cancha",
  "/admin/planes",
  "/admin/socios",
  "/admin/membresias",
  "/admin/clases",
  "/admin/canchas",
  "/admin/reservas",
  "/admin/controlacceso",
  "/admin/pagos",
  "/admin/reportes",
  "/admin/configuracion",
];

// Gerente opera exclusivamente sobre su sede asignada (sin crear/administrar otras sedes)
const RUTAS_GERENTE = [
  "/admin",
  "/admin/controlacceso",
  "/admin/clases",
  "/admin/canchas",
  "/admin/reservas",
  "/admin/socios",
  "/admin/membresias",
  "/admin/pagos",
  "/admin/reportes",
];

const RUTAS_INSTRUCTOR = [
  "/admin/clases",
  "/admin/instructores",
  "/admin/tipos-clase",
  "/admin/controlacceso",
];

/**
 * Fuente única de verdad para permisos en el frontend.
 * - Administrador: rol superior con control sobre todas las sedes y permisos de eliminación.
 * - Gerente: restringido a su sede asignada (sede_base), sin permisos para eliminar clases ni canchas.
 */
export function getPermisosUsuario(usuario?: UsuarioSesion | null): PermisosUsuario {
  const rol = usuario?.rol?.clase_rol ?? "";
  const esGerente = rol === "Gerente";
  const esAdministrador = rol === "Administrador";
  const esInstructor = rol === "Instructor";
  const sedeAsignadaId = usuario?.sede_base?.id ?? null;
  const sedeAsignadaNombre = usuario?.sede_base?.nombre ?? null;

  return {
    esGerente,
    esAdministrador,
    esInstructor,
    sedeAsignadaId,
    sedeAsignadaNombre,
    puedeGestionarTodasLasSedes: esAdministrador,
    puedeCambiarDeSede: !esGerente,
    puedeCrearSedes: esAdministrador,
    puedeEliminarClases: esAdministrador,
    puedeEliminarCanchas: esAdministrador,
    puedeCrearYEditarClases: esAdministrador || esGerente,
    puedeCrearYEditarCanchas: esAdministrador || esGerente,
  };
}

export function getRutasPermitidasAdmin(usuario?: UsuarioSesion | null): string[] {
  const p = getPermisosUsuario(usuario);
  if (p.esAdministrador) return RUTAS_ADMIN;
  if (p.esGerente) return RUTAS_GERENTE;
  if (p.esInstructor) return RUTAS_INSTRUCTOR;
  return [];
}

/** Valida si el usuario autenticado puede navegar a una ruta específica dentro de /admin. */
export function puedeAccederARutaAdmin(
  pathname: string,
  usuario?: UsuarioSesion | null
): boolean {
  const p = getPermisosUsuario(usuario);
  if (!usuario) return true; // aún cargando perfil
  if (usuario.rol.clase_rol === "Cliente") return false;
  if (p.esAdministrador) return true;

  if (p.esGerente) {
    // Bloquear alta de sedes, configuración global y acceso a otras sedes
    if (pathname.startsWith("/admin/configuracion")) return false;
    if (pathname === "/admin/sedes/nueva") return false;
    const matchSede = pathname.match(/^\/admin\/sedes\/(\d+)/);
    if (matchSede && Number(matchSede[1]) !== p.sedeAsignadaId) return false;
    return true;
  }

  return true;
}
