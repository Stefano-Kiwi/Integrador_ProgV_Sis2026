import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./portal/Home";
import Login from "./portal/Login";
import Register from "./portal/Register";
import Profile from "./portal/Profile";
import EditProfile from "./portal/EditProfile";
import Pagos from "./portal/Pagos";
import Clases from "./portal/Clases";
import Canchas from "./portal/Canchas";
import MiPaseQR from "./portal/MiPaseQR";
import RequireAuth from "./components/organisms/RequireAuth";

// Vistas de Estados Globales
import Forbidden from "./portal/errors/Forbidden";
import NotFound from "./portal/errors/NotFound";
import GeneralError from "./portal/errors/GeneralError";
import SessionExpired from "./portal/errors/SessionExpired";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AdminSocio from "./admin/AdminSocio";
import AdminClases from "./admin/AdminClases";
import AdminCanchas from "./admin/AdminCanchas";
import AdminControlAcceso from "./admin/AdminControlAcceso";
import AdminPagos from "./admin/AdminPagos";
import AdminPagoDetalle from "./admin/AdminPagoDetalle";
import AdminSedes from "./admin/AdminSedes";
import AdminSedeDetalle from "./admin/AdminSedeDetalle";
import AdminSedeForm from "./admin/AdminSedeForm";
import AdminInstructores from "./admin/AdminInstructores";
import AdminTiposClase from "./admin/AdminTiposClase";
import AdminTiposCancha from "./admin/AdminTiposCancha";
import AdminPlanes from "./admin/AdminPlanes";
import AdminLogin from "./admin/AdminLogin";
import AdminPersonal from "./admin/AdminPersonal";
import AdminUsuarioForm from "./admin/AdminUsuarioForm";
import AdminUsuarioDetalle from "./admin/AdminUsuarioDetalle";
import AdminMembresias from "./admin/AdminMembresias";
import AdminMembresiaDetalle from "./admin/AdminMembresiaDetalle";
import AdminMembresiaForm from "./admin/AdminMembresiaForm";
import AdminMembresiaCheckout from "./admin/AdminMembresiaCheckout";


// Fase 4: Gestión de Clases y Canchas
import AdminClaseForm from "./admin/AdminClaseForm";
import AdminListaEspera from "./admin/AdminListaEspera";
import AdminCanchasListado from "./admin/AdminCanchasListado";
import AdminCanchaForm from "./admin/AdminCanchaForm";
import AdminCanchaDetalle from "./admin/AdminCanchaDetalle";
import AdminReservasCancha from "./admin/AdminReservasCancha";
import AdminReservaForm from "./admin/AdminReservaForm";
import AdminReservaDetalle from "./admin/AdminReservaDetalle";

// Fase 5: Configuración y Reportes
import AdminReportes from "./admin/AdminReportes";
import AdminConfiguracion from "./admin/AdminConfiguracion";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / User Routes */}
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/editar" element={<EditProfile />} />
          <Route path="/editar-perfil" element={<EditProfile />} />
          <Route path="/usuarios" element={<Navigate to="/profile" replace />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/canchas" element={<Canchas />} />
          <Route path="/mi-pase-qr" element={<MiPaseQR />} />
          <Route path="/pase-qr" element={<MiPaseQR />} />

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
        <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="sedes" element={<AdminSedes />} />
          <Route path="sedes/nueva" element={<AdminSedeForm />} />
          <Route path="sedes/:id" element={<AdminSedeDetalle />} />
          <Route path="sedes/:id/editar" element={<AdminSedeForm />} />
          <Route path="personal" element={<AdminPersonal />} />
          <Route path="personal/nuevo" element={<AdminUsuarioForm />} />
          <Route path="personal/:id" element={<AdminUsuarioDetalle />} />
          <Route path="personal/:id/editar" element={<AdminUsuarioForm />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
