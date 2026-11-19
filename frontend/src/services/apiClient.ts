import { obtenerToken } from "./authService";

const BASE_URL = "/backend";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function extraerMensajeError(respuesta: Response): Promise<string> {
  const cuerpo: unknown = await respuesta.json().catch(() => null);
  if (typeof cuerpo === "object" && cuerpo !== null && "message" in cuerpo) {
    const detalle = (cuerpo as { message: unknown }).message;
    if (typeof detalle === "string") return detalle;
    if (Array.isArray(detalle)) return detalle.join(", ");
  }
  if (respuesta.status === 401) return "Tu sesión expiró o no es válida. Iniciá sesión nuevamente.";
  if (respuesta.status === 403) return "No tenés permisos para realizar esta acción.";
  return `Error del servidor (${respuesta.status}).`;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  requireAuth?: boolean;
}

/** Cliente HTTP común sobre /backend que adjunta automáticamente el JWT cuando existe. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, requireAuth = false } = options;
  const token = obtenerToken();

  if (requireAuth && !token) {
    throw new ApiError(401, "Necesitás iniciar sesión para realizar esta operación.");
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const respuesta = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, await extraerMensajeError(respuesta));
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  return (await respuesta.json()) as T;
}

/** Descarga un archivo binario (ej. comprobante PDF) adjuntando el token JWT. */
export async function apiRequestBlob(path: string): Promise<Blob> {
  const token = obtenerToken();
  if (!token) {
    throw new ApiError(401, "Necesitás iniciar sesión para descargar el archivo.");
  }

  const respuesta = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, await extraerMensajeError(respuesta));
  }

  return respuesta.blob();
}
