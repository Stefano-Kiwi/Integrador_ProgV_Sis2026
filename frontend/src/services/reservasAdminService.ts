
import { obtenerToken } from "./authService";

export interface NuevaReservaAdmin {
  cancha_id: number;
  usuario_id: number;
  fecha: string;
  hora_inicio: number;
}

export interface ReservaAdminCreada {
  reserva_id: number;
  estado: string;
  monto_total: number | string;
  mensaje: string;
}

export async function crearReservaAdmin(
  datos: NuevaReservaAdmin
): Promise<ReservaAdminCreada> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/canchas/reserva", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (respuesta.status === 401) {
    throw new Error("Tu sesión expiró. Iniciá sesión nuevamente.");
  }

  if (respuesta.status === 403) {
    throw new Error("No tenés permisos para registrar reservas.");
  }

  if (respuesta.status === 409) {
    throw new Error(
      "La cancha ya está reservada en ese horario. Elegí otro turno."
    );
  }

  if (!respuesta.ok) {
    const errorServidor: unknown = await respuesta
      .json()
      .catch(() => null);

    let mensaje = `No se pudo crear la reserva (${respuesta.status}).`;

    if (
      typeof errorServidor === "object" &&
      errorServidor !== null &&
      "message" in errorServidor
    ) {
      const detalle = errorServidor.message;

      if (typeof detalle === "string") {
        mensaje = detalle;
      } else if (Array.isArray(detalle)) {
        mensaje = detalle.join(", ");
      }
    }

    throw new Error(mensaje);
  }

  return (await respuesta.json()) as ReservaAdminCreada;
}


export interface ReservaCanchaApi {
  id: number;
  cancha_id: number;
  usuario_id: number;
  fecha: string;
  hora_inicio: number;
  estado: "PENDIENTE_PAGO" | "CONFIRMADA" | "CANCELADA";
  precio_base: string | number;
  monto_total: string | number;
  creada_at: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
  };
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

export async function obtenerReservasAdmin():
  Promise<ReservaCanchaApi[]> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch(
    "/backend/canchas/reservas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (respuesta.status === 404) {
    throw new Error(
      "El backend todavía no tiene habilitado " +
      "GET /canchas/reservas."
    );
  }

  if (respuesta.status === 401) {
    throw new Error(
      "Tu sesión expiró. Volvé a iniciar sesión."
    );
  }

  if (respuesta.status === 403) {
    throw new Error(
      "No tenés permisos para consultar todas las reservas."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron consultar las reservas (${respuesta.status}).`
    );
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error(
      "El servidor no devolvió un listado de reservas."
    );
  }

  return datos as ReservaCanchaApi[];
}
