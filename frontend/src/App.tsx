import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/portal/Home";
import Login from "./pages/portal/Login";
import Profile from "./pages/portal/Profile";
import Pagos from "./pages/portal/Pagos";
import Clases from "./pages/portal/Clases";
import Canchas from "./pages/portal/Canchas";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminSocio from "./pages/admin/AdminSocio";
import AdminClases from "./pages/admin/AdminClases";
import AdminCanchas from "./pages/admin/AdminCanchas";
import AdminControlAcceso from "./pages/admin/AdminControlAcceso";
import AdminPagos from "./pages/admin/AdminPagos";
import AdminLogin from "./pages/admin/AdminLogin";

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
            <Route path="/usuarios" element={<Navigate to="/profile" replace />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/clases" element={<Clases />} />
            <Route path="/canchas" element={<Canchas />} />
          </Route>

        {/* Admin Login (No sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes with Sidebar */}
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="socios" element={<AdminSocio />} />
          <Route path="clases" element={<AdminClases />} />
          <Route path="canchas" element={<AdminCanchas />} />
          <Route path="controlacceso" element={<AdminControlAcceso />} />
          <Route path="pagos" element={<AdminPagos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
