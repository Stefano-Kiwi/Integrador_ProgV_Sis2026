import { obtenerToken, obtenerMiPerfil } from "./authService";

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

export async function obtenerCanchas(): Promise<CanchaApi[]> {
  const respuesta = await fetch("/backend/canchas");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar las canchas. Código: ${respuesta.status}`
    );
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("La API no devolvió un listado de canchas.");
  }

  return datos as CanchaApi[];
}

export async function obtenerCanchaPorId(
  id: number
): Promise<CanchaApi> {
  const respuesta = await fetch(`/backend/canchas/${id}`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo obtener la cancha. Código: ${respuesta.status}`
    );
  }

  return (await respuesta.json()) as CanchaApi;
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
  mensaje: string;
}

export async function reservarCancha(
  canchaId: number,
  fecha: string,
  horaInicio: number
): Promise<ReservaCanchaRespuesta> {
  const token = obtenerToken();

  if (!token) {
    throw new Error(
      "Necesitás iniciar sesión para reservar una cancha."
    );
  }

  // Obtener el ID verdadero del usuario autenticado.
  const usuario = await obtenerMiPerfil();

  const datos: NuevaReservaCancha = {
    cancha_id: canchaId,
    usuario_id: usuario.id,
    fecha,
    hora_inicio: horaInicio,
  };

  const respuesta = await fetch("/backend/canchas/reserva", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (respuesta.status === 401) {
    throw new Error(
      "Tu sesión expiró. Iniciá sesión nuevamente."
    );
  }

  if (respuesta.status === 409) {
    throw new Error(
      "Ese horario ya está reservado. Elegí otro."
    );
  }

  if (!respuesta.ok) {
    const errorServidor: unknown = await respuesta
      .json()
      .catch(() => null);

    let mensaje = `Error del servidor (${respuesta.status}).`;

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

  return (await respuesta.json()) as ReservaCanchaRespuesta;
}

export interface NuevaCancha {
  nombre: string;
  sede_id: number;
  tipo_cancha_id: number;
  costo_hora: number;
}

export async function crearCancha(
  datos: NuevaCancha
): Promise<CanchaApi> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/canchas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (respuesta.status === 401) {
    throw new Error("Tu sesión no es válida o expiró.");
  }

  if (respuesta.status === 403) {
    throw new Error(
      "No tenés permisos para registrar canchas."
    );
  }

  if (!respuesta.ok) {
    const errorServidor = await respuesta
      .json()
      .catch(() => null);

    const detalle = errorServidor?.message;

    throw new Error(
      Array.isArray(detalle)
        ? detalle.join(", ")
        : typeof detalle === "string"
          ? detalle
          : `Error al crear la cancha (${respuesta.status}).`
    );
  }

  return (await respuesta.json()) as CanchaApi;
}
