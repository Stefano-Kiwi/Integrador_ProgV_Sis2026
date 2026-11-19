import { apiRequest } from "./apiClient";
import { obtenerMiPerfil } from "./authService";

export interface CanchaApi {
  id: number;
  sede_id: number;
  tipo_cancha_id: number;
  nombre: string;
  costo_hora: string;
  estado: "HABILITADA" | "EN_MANTENIMIENTO";
  sede: {
    id: number;
    nombre: string;
    direccion: string;
    localidad: string;
    aforo_maximo: number;
  };
  tipo_cancha: {
    id: number;
    nombre: string;
  };
}

export interface PrecioCalculadoApi {
  precio_base: number;
  descuento: number;
  recargo: number;
  monto_total: number;
  estrategias_aplicadas: string[];
}

export interface FranjaDisponibilidadApi {
  hora_inicio: number;
  hora_fin: number;
  estado: "LIBRE" | "OCUPADA" | "MANTENIMIENTO";
  precio: PrecioCalculadoApi;
}

export interface DisponibilidadCanchaApi {
  cancha_id: number;
  fecha: string;
  cancha_estado: "HABILITADA" | "EN_MANTENIMIENTO";
  franjas: FranjaDisponibilidadApi[];
}

export interface NuevaReservaCancha {
  cancha_id: number;
  usuario_id: number;
  fecha: string;
  hora_inicio: number;
}

export interface ReservaCanchaRespuesta {
  reserva_id: number;
  estado: string;
  monto_total: string | number;
  precio?: PrecioCalculadoApi;
  mensaje: string;
}

export interface NuevaCancha {
  nombre: string;
  sede_id: number;
  tipo_cancha_id: number;
  costo_hora: number;
}

export interface CancelacionCanchaRespuesta {
  reserva_id: number;
  estado: string;
  con_penalidad: boolean;
  penalidad: number;
  monto_reembolsable: number;
  mensaje: string;
}

export async function obtenerCanchas(): Promise<CanchaApi[]> {
  return apiRequest<CanchaApi[]>("/canchas");
}

export async function obtenerCanchaPorId(id: number): Promise<CanchaApi> {
  return apiRequest<CanchaApi>(`/canchas/${id}`);
}

export async function obtenerDisponibilidadCancha(
  canchaId: number,
  fecha: string
): Promise<DisponibilidadCanchaApi> {
  return apiRequest<DisponibilidadCanchaApi>(
    `/canchas/${canchaId}/disponibilidad?fecha=${encodeURIComponent(fecha)}`,
    { requireAuth: true }
  );
}

export async function reservarCancha(
  canchaId: number,
  fecha: string,
  horaInicio: number,
  usuarioId?: number
): Promise<ReservaCanchaRespuesta> {
  const uid = usuarioId ?? (await obtenerMiPerfil()).id;
  const datos: NuevaReservaCancha = {
    cancha_id: canchaId,
    usuario_id: uid,
    fecha,
    hora_inicio: horaInicio,
  };
  return apiRequest<ReservaCanchaRespuesta>("/canchas/reserva", {
    method: "POST",
    body: datos,
    requireAuth: true,
  });
}

export async function cancelarReservaCancha(
  reservaId: number
): Promise<CancelacionCanchaRespuesta> {
  return apiRequest<CancelacionCanchaRespuesta>(`/canchas/reserva/${reservaId}/cancelar`, {
    method: "PATCH",
    requireAuth: true,
  });
}

export async function crearCancha(datos: NuevaCancha): Promise<CanchaApi> {
  return apiRequest<CanchaApi>("/canchas", {
    method: "POST",
    body: datos,
    requireAuth: true,
  });
}

export async function cambiarEstadoCancha(
  canchaId: number,
  estado: "HABILITADA" | "EN_MANTENIMIENTO"
): Promise<CanchaApi> {
  return apiRequest<CanchaApi>(`/canchas/${canchaId}/estado`, {
    method: "PATCH",
    body: { estado },
    requireAuth: true,
  });
}

export interface MiReservaCanchaApi {
  id: number;
  fecha: string;
  hora_inicio: number;
  estado: string;
  monto_total: string | number;
  cancha: {
    id: number;
    nombre: string;
    tipo_cancha: {
      id: number;
      nombre: string;
    };
    sede: {
      id: number;
      nombre: string;
      localidad: string;
    };
  };
}

export async function obtenerMisReservasCancha(): Promise<MiReservaCanchaApi[]> {
  return apiRequest<MiReservaCanchaApi[]>("/canchas/reservas/mias", {
    requireAuth: true,
  });
}
