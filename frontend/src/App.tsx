import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/portal/Home";
import Login from "./pages/portal/Login";
import Profile from "./pages/portal/Profile";
import EditProfile from "./pages/portal/EditProfile";
import Pagos from "./pages/portal/Pagos";
import Clases from "./pages/portal/Clases";
import Canchas from "./pages/portal/Canchas";

// Vistas de Estados Globales
import Forbidden from "./pages/portal/errors/Forbidden";
import NotFound from "./pages/portal/errors/NotFound";
import GeneralError from "./pages/portal/errors/GeneralError";
import SessionExpired from "./pages/portal/errors/SessionExpired";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminSocio from "./pages/admin/AdminSocio";
import AdminClases from "./pages/admin/AdminClases";
import AdminCanchas from "./pages/admin/AdminCanchas";
import AdminControlAcceso from "./pages/admin/AdminControlAcceso";
import AdminPagos from "./pages/admin/AdminPagos";
import AdminPagoDetalle from "./pages/admin/AdminPagoDetalle";
import AdminSedes from "./pages/admin/AdminSedes";
import AdminSedeDetalle from "./pages/admin/AdminSedeDetalle";
import AdminSedeForm from "./pages/admin/AdminSedeForm";
import AdminInstructores from "./pages/admin/AdminInstructores";
import AdminTiposClase from "./pages/admin/AdminTiposClase";
import AdminTiposCancha from "./pages/admin/AdminTiposCancha";
import AdminPlanes from "./pages/admin/AdminPlanes";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPersonal from "./pages/admin/AdminPersonal";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm";
import AdminUsuarioDetalle from "./pages/admin/AdminUsuarioDetalle";
import AdminMembresias from "./pages/admin/AdminMembresias";
import AdminMembresiaDetalle from "./pages/admin/AdminMembresiaDetalle";
import AdminMembresiaForm from "./pages/admin/AdminMembresiaForm";
import AdminMembresiaCheckout from "./pages/admin/AdminMembresiaCheckout";


// Fase 4: Gestión de Clases y Canchas
import AdminClaseForm from "./pages/admin/AdminClaseForm";
import AdminListaEspera from "./pages/admin/AdminListaEspera";
import AdminCanchasListado from "./pages/admin/AdminCanchasListado";
import AdminCanchaForm from "./pages/admin/AdminCanchaForm";
import AdminCanchaDetalle from "./pages/admin/AdminCanchaDetalle";
import AdminReservasCancha from "./pages/admin/AdminReservasCancha";
import AdminReservaForm from "./pages/admin/AdminReservaForm";
import AdminReservaDetalle from "./pages/admin/AdminReservaDetalle";

// Fase 5: Configuración y Reportes
import AdminReportes from "./pages/admin/AdminReportes";
import AdminConfiguracion from "./pages/admin/AdminConfiguracion";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / User Routes */}
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/editar" element={<EditProfile />} />
          <Route path="/editar-perfil" element={<EditProfile />} />
          <Route path="/usuarios" element={<Navigate to="/profile" replace />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/canchas" element={<Canchas />} />

          {/* Rutas de Estados Globales de Error / Seguridad */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<GeneralError />} />
          <Route path="/expirada" element={<SessionExpired />} />

          {/* Fallback de ruta no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Login (No sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes with Sidebar */}
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="sedes" element={<AdminSedes />} />
          <Route path="sedes/nueva" element={<AdminSedeForm />} />
          <Route path="sedes/:id" element={<AdminSedeDetalle />} />
          <Route path="sedes/:id/editar" element={<AdminSedeForm />} />
          <Route path="personal" element={<AdminPersonal />} />
          <Route path="personal/nuevo" element={<AdminUsuarioForm />} />
          <Route path="personal/:id" element={<AdminUsuarioForm />} />
          <Route path="personal/:id" element={<AdminUsuarioDetalle />} />
          <Route path="usuarios" element={<Navigate to="/admin/personal" replace />} />
          <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
          <Route path="usuarios/:id" element={<AdminUsuarioDetalle />} />
          <Route path="usuarios/:id/editar" element={<AdminUsuarioForm />} />
          <Route path="instructores" element={<AdminInstructores />} />
          <Route path="tipos-clase" element={<AdminTiposClase />} />
          <Route path="tipos-cancha" element={<AdminTiposCancha />} />
          <Route path="planes" element={<AdminPlanes />} />
          <Route path="socios" element={<AdminSocio />} />
          <Route path="membresias" element={<AdminMembresias />} />
          <Route path="membresias/nueva" element={<AdminMembresiaForm />} />
          <Route path="membresias/checkout" element={<AdminMembresiaCheckout />} />
          <Route path="membresias/:id/renovar" element={<AdminMembresiaForm />} />
          <Route path="membresias/:id" element={<AdminMembresiaDetalle />} />

          {/* Fase 4: Clases */}
          <Route path="clases" element={<AdminClases />} />
          <Route path="clases/nueva" element={<AdminClaseForm />} />
          <Route path="clases/:id/editar" element={<AdminClaseForm />} />
          <Route path="clases/lista-espera" element={<AdminListaEspera />} />

          {/* Fase 4: Canchas */}
          <Route path="canchas" element={<AdminCanchas />} />
          <Route path="canchas/listado" element={<AdminCanchasListado />} />
          <Route path="canchas/inventario" element={<AdminCanchasListado />} />
          <Route path="canchas/nueva" element={<AdminCanchaForm />} />
          <Route path="canchas/:id" element={<AdminCanchaDetalle />} />
          <Route path="canchas/:id/editar" element={<AdminCanchaForm />} />

          {/* Fase 4: Reservas de Cancha */}
          <Route path="reservas" element={<AdminReservasCancha />} />
          <Route path="reservas/nueva" element={<AdminReservaForm />} />
          <Route path="reservas/:id" element={<AdminReservaDetalle />} />

          <Route path="controlacceso" element={<AdminControlAcceso />} />
          <Route path="pagos" element={<AdminPagos />} />
          <Route path="pagos/:id" element={<AdminPagoDetalle />} />

          {/* Fase 5: Configuración y Reportes */}
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="configuracion" element={<AdminConfiguracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
