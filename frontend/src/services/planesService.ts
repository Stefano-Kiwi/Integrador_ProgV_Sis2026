
import { obtenerToken } from "./authService";

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
  const respuesta = await fetch("/backend/planes");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar los planes (${respuesta.status}).`
    );
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("El backend no devolvió una lista de planes.");
  }

  return datos as PlanApi[];
}

export async function crearPlan(
  datos: NuevoPlan
): Promise<PlanApi> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/planes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre: datos.nombre.trim(),
      duracion_meses: datos.duracion_meses,
      precio: datos.precio,
    }),
  });

  if (respuesta.status === 401) {
    throw new Error("Tu sesión expiró. Iniciá sesión nuevamente.");
  }

  if (respuesta.status === 403) {
    throw new Error("No tenés permisos para crear planes.");
  }

  if (respuesta.status === 409) {
    throw new Error("Ya existe un plan con ese nombre.");
  }

  if (!respuesta.ok) {
    const error: unknown = await respuesta.json().catch(() => null);
    let mensaje = `No se pudo crear el plan (${respuesta.status}).`;

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      const detalle = error.message;

      if (typeof detalle === "string") {
        mensaje = detalle;
      } else if (Array.isArray(detalle)) {
        mensaje = detalle.join(", ");
      }
    }

    throw new Error(mensaje);
  }

  return (await respuesta.json()) as PlanApi;
}
