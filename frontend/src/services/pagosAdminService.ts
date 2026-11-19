
import { obtenerToken } from "./authService";

export type EstadoPagoApi =
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO";

export interface PagoApi {
  id: number;
  membresia_id: number | null;
  reserva_cancha_id: number | null;
  monto: string | number;
  estado: EstadoPagoApi;
  creado_at: string;
  pagado_at: string | null;
  comprobante: {
    id: number;
    archivo_url: string;
    emitido_at: string;
  } | null;
  membresia: {
    id: number;
    usuario_id: number;
    plan_id: number;
  } | null;
  reserva_cancha: {
    id: number;
    usuario_id: number;
    cancha_id: number;
    fecha: string;
    hora_inicio: number;
  } | null;
}

async function consultarPagos(
  ruta: string
): Promise<unknown> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch(`/backend${ruta}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (respuesta.status === 401) {
    throw new Error(
      "Tu sesión venció. Iniciá sesión nuevamente."
    );
  }

  if (respuesta.status === 403) {
    throw new Error(
      "El backend permite consultar el listado de pagos " +
      "solo al rol Administrador. Tu cuenta puede ser Gerente."
    );
  }

  if (respuesta.status === 404) {
    throw new Error("El pago solicitado no existe.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar pagos (${respuesta.status}).`
    );
  }

  return respuesta.json();
}

export async function obtenerPagosAdmin(): Promise<PagoApi[]> {
  const datos = await consultarPagos("/pagos");

  if (!Array.isArray(datos)) {
    throw new Error(
      "El backend no devolvió un listado de pagos."
    );
  }

  return datos as PagoApi[];
}

export async function obtenerPagoAdminPorId(
  id: number
): Promise<PagoApi> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Identificador de pago inválido.");
  }

  return (await consultarPagos(`/pagos/${id}`)) as PagoApi;
}
