interface LoginRespuesta {
  access_token: string;
}

export async function iniciarSesion(
  email: string,
  password: string,
): Promise<void> {
  const respuesta = await fetch("/backend/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  if (respuesta.status === 401) {
    throw new Error("El correo o la contraseña son incorrectos.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo iniciar sesión. Código: ${respuesta.status}`,
    );
  }

  const datos: unknown = await respuesta.json();

  if (
    typeof datos !== "object" ||
    datos === null ||
    !("access_token" in datos) ||
    typeof datos.access_token !== "string" ||
    datos.access_token.length === 0
  ) {
    throw new Error("El servidor no devolvió un token válido.");
  }

  const resultado: LoginRespuesta = {
    access_token: datos.access_token,
  };

  localStorage.setItem("fitzone_token", resultado.access_token);
  sessionStorage.setItem("fitzone_token", resultado.access_token);
}

export function obtenerToken(): string | null {
  return localStorage.getItem("fitzone_token") || sessionStorage.getItem("fitzone_token");
}

export interface TokenPayload {
  sub?: string | number;
  id?: string | number;
  userId?: string | number;
  email?: string;
  rol?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodificarPayload(token: string): TokenPayload | null {
  try {
    const partes = token.split(".");
    if (partes.length !== 3) return null;

    // Convertir Base64Url a Base64 estándar
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonString = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonString) as TokenPayload;
  } catch {
    return null;
  }
}

export function obtenerUsuarioActual(): TokenPayload | null {
  const token = obtenerToken();
  if (!token) return null;
  return decodificarPayload(token);
}

export function esTokenValido(token: string | null = obtenerToken()): boolean {
  if (!token) return false;

  const payload = decodificarPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;

  const ahoraEnSegundos = Math.floor(Date.now() / 1000);
  return payload.exp > ahoraEnSegundos;
}

export function esGerenteValido(token: string | null = obtenerToken()): boolean {
  if (!esTokenValido(token)) return false;

  const payload = decodificarPayload(token!);
  if (!payload) return false;

  const rol = String(payload.rol || payload.role || "").toLowerCase();
  return rol === "gerente" || rol === "admin" || rol === "administrador";
}

export function cerrarSesion(): void {
  localStorage.removeItem("fitzone_token");
  sessionStorage.removeItem("fitzone_token");
}

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: {
    id_rol: number;
    clase_rol: string;
  };
  sede_base?: {
    id: number;
    nombre: string;
  } | null;
}

export async function obtenerMiPerfil(): Promise<UsuarioSesion> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (respuesta.status === 401) {
    cerrarSesion();
    throw new Error("Tu sesión venció o no es válida. Iniciá sesión nuevamente.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo consultar el perfil. Código: ${respuesta.status}`,
    );
  }

  const datos: unknown = await respuesta.json();

  if (
    typeof datos !== "object" ||
    datos === null ||
    !("id" in datos) ||
    typeof datos.id !== "number" ||
    !("nombre" in datos) ||
    typeof datos.nombre !== "string" ||
    !("apellido" in datos) ||
    typeof datos.apellido !== "string" ||
    !("email" in datos) ||
    typeof datos.email !== "string" ||
    !("rol" in datos) ||
    typeof datos.rol !== "object" ||
    datos.rol === null ||
    !("id_rol" in datos.rol) ||
    typeof datos.rol.id_rol !== "number" ||
    !("clase_rol" in datos.rol) ||
    typeof datos.rol.clase_rol !== "string"
  ) {
    throw new Error("El servidor devolvió un perfil con formato inesperado.");
  }

  return {
    id: datos.id,
    nombre: datos.nombre,
    apellido: datos.apellido,
    email: datos.email,
    rol: {
      id_rol: datos.rol.id_rol,
      clase_rol: datos.rol.clase_rol,
    },
  };
}

export type RolAplicacion =
  | "Cliente"
  | "Instructor"
  | "Gerente"
  | "Administrador";

export async function verificarPermiso(
  roles: RolAplicacion[],
): Promise<boolean> {
  const token = obtenerToken();

  if (!token) {
    throw new Error("Necesitás iniciar sesión.");
  }

  const respuesta = await fetch("/backend/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ roles }),
  });

  if (respuesta.status === 401) {
    cerrarSesion();
    throw new Error("Tu sesión venció o no es válida.");
  }

  if (respuesta.status === 403) {
    return false;
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron verificar los permisos. Código: ${respuesta.status}`,
    );
  }

  const datos: unknown = await respuesta.json();

  if (
    typeof datos !== "object" ||
    datos === null ||
    !("autorizado" in datos) ||
    typeof datos.autorizado !== "boolean"
  ) {
    throw new Error("El servidor devolvió una respuesta inesperada.");
  }

  return datos.autorizado;
}
