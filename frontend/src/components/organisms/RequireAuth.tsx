import { Navigate, Outlet, useLocation } from "react-router-dom";
import { obtenerToken, obtenerUsuarioActual } from "../../services/authService";

const ROLES_PERMITIDOS_ADMIN = ["gerente", "administrador", "instructor"];

/**
 * Guardia de rutas para /admin:
 * - Sin token -> /admin/login
 * - Socio / Cliente (id_rol === 1 o clase_rol === "Cliente") -> /403 (no accede a /admin)
 */
export default function RequireAuth() {
  const location = useLocation();
  const token = obtenerToken();

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const payload = obtenerUsuarioActual();
  const idRol = typeof payload?.id_rol === "number" ? payload.id_rol : null;
  const rolTexto = String(payload?.clase_rol ?? payload?.rol ?? payload?.role ?? "").toLowerCase();

  const esCliente = idRol === 1 || rolTexto === "cliente";
  const rolAutorizado =
    !esCliente &&
    (idRol === 2 || idRol === 3 || idRol === 4 || ROLES_PERMITIDOS_ADMIN.includes(rolTexto));

  if (!rolAutorizado) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
