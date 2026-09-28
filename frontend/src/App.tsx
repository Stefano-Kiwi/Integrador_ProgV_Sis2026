import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Pagos from "./pages/Pagos";
import Clases from "./pages/Clases";
import Canchas from "./pages/Canchas";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/usuarios" element={<Navigate to="/profile" replace />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/canchas" element={<Canchas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
