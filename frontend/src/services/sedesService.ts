import { obtenerToken, cerrarSesion } from "./authService";

export interface SedeApi {
  id: number;
  nombre: string;
  direccion: string;
  localidad: string;
  aforo_maximo: number;
  creada_at: string;
}

export async function obtenerSedes(): Promise<SedeApi[]> {
  const respuesta = await fetch("/backend/sedes");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar las sedes. Código: ${respuesta.status}`,
    );
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("El servidor no devolvió un listado de sedes.");
  }

  return datos as SedeApi[];
}

export async function obtenerSedePorId(id: number): Promise<SedeApi> {
  const respuesta = await fetch(`/backend/sedes/${id}`);

  if (respuesta.status === 404) {
    throw new Error("La sede solicitada no existe.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo cargar la sede. Código: ${respuesta.status}`,
    );
  }

  return respuesta.json();
}

export interface NuevaSede {
  nombre: string;
  direccion: string;
  localidad: string;
  aforo_maximo: number;
}

export async function crearSede(datos: NuevaSede): Promise<SedeApi> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión para crear una sede.");
  }

  const respuesta = await fetch("/backend/sedes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre: datos.nombre.trim(),
      direccion: datos.direccion.trim(),
      localidad: datos.localidad.trim(),
      aforo_maximo: datos.aforo_maximo,
    }),
  });

  if (respuesta.status === 401) {
    cerrarSesion();
    throw new Error("Tu sesión no es válida o venció. Iniciá sesión nuevamente.");
  }

  if (respuesta.status === 403) {
    throw new Error("Tu cuenta no tiene permiso para crear sedes.");
  }

  if (respuesta.status === 409) {
    throw new Error("Ya existe una sede con ese nombre.");
  }

  if (respuesta.status === 400) {
    throw new Error(
      "Revisá los datos: nombre, dirección y localidad son obligatorios, " +
      "y la capacidad debe ser un número entero mayor que cero.",
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo crear la sede. Código: ${respuesta.status}`,
    );
  }

  return respuesta.json();
}