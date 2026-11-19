import { Navigate, Outlet, useLocation } from "react-router-dom";
import { obtenerToken } from "../../services/authService";

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

  return <Outlet />;
}