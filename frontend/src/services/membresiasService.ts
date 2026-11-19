import { apiRequest } from "./apiClient";
import type { PlanApi } from "./planesService";

export type EstadoMembresiaApi = "PENDIENTE_PAGO" | "ACTIVO" | "VENCIDO" | "SUSPENDIDO";

export interface MembresiaApi {
  id: number;
  usuario_id: number;
  plan_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoMembresiaApi;
  renovacion_automatica: boolean;
  plan_membresia?: PlanApi;
}

export interface EstadoMembresiaRespuesta {
  usuario_id: number;
  tipo_usuario: "SOCIO" | "CLIENTE_EXTERNO";
  estado: EstadoMembresiaApi | "SIN_MEMBRESIA";
  membresia: MembresiaApi | null;
}

export async function contratarMembresia(
  planId: number,
  renovacionAutomatica = false,
  usuarioId?: number
): Promise<MembresiaApi> {
  return apiRequest<MembresiaApi>("/membresias", {
    method: "POST",
    body: {
      plan_id: planId,
      renovacion_automatica: renovacionAutomatica,
      ...(usuarioId ? { usuario_id: usuarioId } : {}),
    },
    requireAuth: true,
  });
}

export async function obtenerMiEstadoMembresia(): Promise<EstadoMembresiaRespuesta> {
  return apiRequest<EstadoMembresiaRespuesta>("/membresias/mi-estado", {
    requireAuth: true,
  });
}

export async function obtenerEstadoMembresiaUsuario(
  usuarioId: number
): Promise<EstadoMembresiaRespuesta> {
  return apiRequest<EstadoMembresiaRespuesta>(`/membresias/usuario/${usuarioId}`, {
    requireAuth: true,
  });
}

export async function renovarMembresia(
  membresiaId: number,
  opciones: { plan_id?: number; renovacion_automatica?: boolean } = {}
): Promise<MembresiaApi> {
  return apiRequest<MembresiaApi>(`/membresias/${membresiaId}/renovar`, {
    method: "PATCH",
    body: opciones,
    requireAuth: true,
  });
}

export async function suspenderMembresia(membresiaId: number): Promise<MembresiaApi> {
  return apiRequest<MembresiaApi>(`/membresias/${membresiaId}/suspender`, {
    method: "PATCH",
    requireAuth: true,
  });
}

export async function procesarVencimientos(): Promise<{
  vencidas_actualizadas: number;
  ejecutado_at: string;
}> {
  return apiRequest("/membresias/procesar-vencimientos", {
    method: "POST",
    requireAuth: true,
  });
}
