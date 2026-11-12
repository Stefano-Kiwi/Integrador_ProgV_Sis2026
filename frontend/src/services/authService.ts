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

  sessionStorage.setItem("fitzone_token", resultado.access_token);
}

export function obtenerToken(): string | null {
  return sessionStorage.getItem("fitzone_token");
}

export function cerrarSesion(): void {
  sessionStorage.removeItem("fitzone_token");
}