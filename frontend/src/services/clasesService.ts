import { obtenerToken } from "./authService";

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

export async function obtenerClases(): Promise<ClaseApi[]> {
  const respuesta = await fetch("/backend/clases");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron consultar las clases (${respuesta.status}).`
    );
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("El backend no devolvió un listado de clases.");
  }

  return datos as ClaseApi[];
}

export async function obtenerClasePorId(
  id: number
): Promise<ClaseApi> {
  const respuesta = await fetch(`/backend/clases/${id}`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo consultar la clase (${respuesta.status}).`
    );
  }

  return (await respuesta.json()) as ClaseApi;
}


export interface NuevaClase {
  sede_id: number;
  tipo_clase_id: number;
  instructor_id: number;
  inicio_at: string;
  fin_at: string;
  capacidad_maxima: number;
}

export async function crearClase(
  datos: NuevaClase
): Promise<ClaseApi> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión para crear clases.");
  }

  const respuesta = await fetch("/backend/clases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (respuesta.status === 401) {
    throw new Error("La sesión venció. Iniciá sesión nuevamente.");
  }

  if (respuesta.status === 403) {
    throw new Error("No tenés permisos para programar clases.");
  }

  if (!respuesta.ok) {
    const errorServidor: unknown = await respuesta.json().catch(() => null);
    let mensaje = `Error al crear la clase (${respuesta.status}).`;

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

  return (await respuesta.json()) as ClaseApi;
}


export interface ResultadoInscripcion {
  estado: "CONFIRMADA" | "EN_ESPERA";
  reserva_id?: number;
  lista_espera_id?: number;
  posicion?: number;
  mensaje: string;
}

export async function inscribirUsuarioClase(
  claseId: number,
  usuarioId: number
): Promise<ResultadoInscripcion> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/clases/reserva", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      clase_id: claseId,
      usuario_id: usuarioId,
    }),
  });

  if (!respuesta.ok) {
    const error: unknown = await respuesta.json().catch(() => null);

    let mensaje = `No se pudo registrar la inscripción (${respuesta.status}).`;

    if (typeof error === "object" && error !== null && "message" in error) {
      const detalle = error.message;
      if (typeof detalle === "string") mensaje = detalle;
      else if (Array.isArray(detalle)) mensaje = detalle.join(", ");
    }

    throw new Error(mensaje);
  }

  return (await respuesta.json()) as ResultadoInscripcion;
}
