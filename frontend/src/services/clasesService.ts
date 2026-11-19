import { apiRequest } from "./apiClient";

export interface ClaseApi {
  id: number;
  sede_id: number;
  tipo_clase_id: number;
  instructor_id: number;
  inicio_at: string;
  fin_at: string;
  capacidad_maxima: number;
  cupo_disponible: number;
  tipo_clase: {
    id: number;
    nombre: string;
  };
  instructor: {
    id: number;
    usuario_id: number;
    usuario: {
      id: number;
      nombre: string;
      apellido: string;
      email: string;
    };
  };
  sede: {
    id: number;
    nombre: string;
    direccion: string;
    localidad: string;
    aforo_maximo: number;
  };
}

export interface NuevaClase {
  sede_id: number;
  tipo_clase_id: number;
  instructor_id: number;
  inicio_at: string;
  fin_at: string;
  capacidad_maxima: number;
}

export interface ResultadoInscripcion {
  estado: "CONFIRMADA" | "EN_ESPERA";
  reserva_id?: number;
  lista_espera_id?: number;
  posicion?: number;
  mensaje: string;
}

export interface CancelacionClaseRespuesta {
  reserva_id: number;
  estado: string;
  con_penalidad: boolean;
  mensaje: string;
  promovido_desde_lista_espera: {
    listaEsperaId: number;
    usuarioId: number;
    reservaId: number;
    claseId: number;
    notificacion: string;
  } | null;
}

export interface EntradaListaEsperaApi {
  lista_espera_id: number;
  clase_id: number;
  estado: string;
  posicion: number;
  creada_at: string;
  clase: ClaseApi;
}

export async function obtenerClases(): Promise<ClaseApi[]> {
  return apiRequest<ClaseApi[]>("/clases");
}

export async function obtenerClasePorId(id: number): Promise<ClaseApi> {
  return apiRequest<ClaseApi>(`/clases/${id}`);
}

export async function crearClase(datos: NuevaClase): Promise<ClaseApi> {
  return apiRequest<ClaseApi>("/clases", {
    method: "POST",
    body: datos,
    requireAuth: true,
  });
}

export async function inscribirUsuarioClase(
  claseId: number,
  usuarioId: number
): Promise<ResultadoInscripcion> {
  return apiRequest<ResultadoInscripcion>("/clases/reserva", {
    method: "POST",
    body: { clase_id: claseId, usuario_id: usuarioId },
    requireAuth: true,
  });
}

export async function cancelarReservaClase(
  reservaId: number
): Promise<CancelacionClaseRespuesta> {
  return apiRequest<CancelacionClaseRespuesta>(`/clases/reserva/${reservaId}/cancelar`, {
    method: "PATCH",
    requireAuth: true,
  });
}

export async function obtenerMiListaEspera(): Promise<EntradaListaEsperaApi[]> {
  return apiRequest<EntradaListaEsperaApi[]>("/clases/lista-espera/mia", {
    requireAuth: true,
  });
}
