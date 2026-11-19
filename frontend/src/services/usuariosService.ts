import { cerrarSesion, obtenerToken } from "./authService";

export interface UsuarioApi {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono: string | null;
  creado_at: string;
  rol: {
    id_rol: number;
    clase_rol: string;
  };
  sede_base: {
    id: number;
    nombre: string;
  } | null;
}

function esUsuarioApi(valor: unknown): valor is UsuarioApi {
  if (typeof valor !== "object" || valor === null) return false;

  const usuario = valor as Record<string, unknown>;
  const rol = usuario.rol;
  const sede = usuario.sede_base;

  return (
    typeof usuario.id === "number" &&
    typeof usuario.nombre === "string" &&
    typeof usuario.apellido === "string" &&
    typeof usuario.email === "string" &&
    typeof usuario.dni === "string" &&
    (usuario.telefono === null ||
      typeof usuario.telefono === "string") &&
    typeof usuario.creado_at === "string" &&
    typeof rol === "object" &&
    rol !== null &&
    "id_rol" in rol &&
    typeof rol.id_rol === "number" &&
    "clase_rol" in rol &&
    typeof rol.clase_rol === "string" &&
    (sede === null ||
      (typeof sede === "object" &&
        "id" in sede &&
        typeof sede.id === "number" &&
        "nombre" in sede &&
        typeof sede.nombre === "string"))
  );
}

export async function obtenerUsuarios(): Promise<UsuarioApi[]> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/usuarios", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (respuesta.status === 401) {
    cerrarSesion();
    throw new Error("Tu sesión venció o no es válida.");
  }

  if (respuesta.status === 403) {
    throw new Error("No tenés permiso para consultar los usuarios.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar los usuarios. Código: ${respuesta.status}`,
    );
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos) || !datos.every(esUsuarioApi)) {
    throw new Error("El servidor devolvió usuarios con formato inesperado.");
  }

  return datos;
}

export async function obtenerUsuarioPorId(
  id: number,
): Promise<UsuarioApi> {
  const usuarios = await obtenerUsuarios();
  const usuario = usuarios.find((item) => item.id === id);

  if (!usuario) {
    throw new Error("El usuario solicitado no existe.");
  }

  return usuario;
}

export interface RegistrarUsuarioPayload {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  sede_base_id?: number;
  id_rol?: number;
}

export async function registrarUsuario(
  datos: RegistrarUsuarioPayload,
): Promise<UsuarioApi> {
  const respuesta = await fetch("/backend/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...datos,
      id_rol: datos.id_rol ?? 1, // Siempre rol 1 (Cliente) por defecto
    }),
  });

  if (respuesta.status === 409) {
    throw new Error("El email o el DNI ya se encuentran registrados en el sistema.");
  }

  if (respuesta.status === 400) {
    const errorBody = await respuesta.json().catch(() => null);
    const mensaje = Array.isArray(errorBody?.message)
      ? errorBody.message.join(", ")
      : errorBody?.message || "Los datos ingresados son inválidos. Revisa el formulario.";
    throw new Error(mensaje);
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo completar el registro. Código: ${respuesta.status}`,
    );
  }

  const nuevoUsuario: unknown = await respuesta.json();
  return nuevoUsuario as UsuarioApi;
}