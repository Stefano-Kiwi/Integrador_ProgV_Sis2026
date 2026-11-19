import { apiRequest } from "./apiClient";

export interface PlanApi {
  id: number;
  nombre: string;
  duracion_meses: number;
  precio: string | number;
}

export interface NuevoPlan {
  nombre: string;
  duracion_meses: number;
  precio: number;
}

export async function obtenerPlanes(): Promise<PlanApi[]> {
  return apiRequest<PlanApi[]>("/planes");
}

export async function crearPlan(datos: NuevoPlan): Promise<PlanApi> {
  return apiRequest<PlanApi>("/planes", {
    method: "POST",
    body: {
      nombre: datos.nombre.trim(),
      duracion_meses: datos.duracion_meses,
      precio: datos.precio,
    },
    requireAuth: true,
  });
}
