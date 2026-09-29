import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Pagos from "./pages/Pagos";
import Clases from "./pages/Clases";
import Canchas from "./pages/Canchas";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminSocio from "./pages/AdminSocio";
import AdminClases from "./pages/AdminClases";
import AdminCanchas from "./pages/AdminCanchas";
import AdminControlAcceso from "./pages/AdminControlAcceso";
import AdminPagos from "./pages/AdminPagos";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / User Routes */}
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
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
