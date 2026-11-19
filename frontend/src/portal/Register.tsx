import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/usuariosService";
import { iniciarSesion } from "../services/authService";
import { useAppStore } from "../store";
import { siteConfig } from "../config/siteConfig";

export default function Register() {
  const navigate = useNavigate();
  const { refrescarSesion } = useAppStore();

  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cargando) return;
    setError(null);

    // Validaciones básicas de cliente
    if (!dni.trim() || !nombre.trim() || !apellido.trim() || !email.trim() || !password) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      // 1. Registrar usuario en la base de datos con rol 1 (Cliente)
      await registrarUsuario({
        dni: dni.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim() || undefined,
        password,
        sede_base_id: siteConfig.sedeId,
        id_rol: 1, // Siempre tipo Cliente
      });

      setExito(true);

      // 2. Iniciar sesión automáticamente
      try {
        await iniciarSesion(email.trim().toLowerCase(), password);
        await refrescarSesion();
        setTimeout(() => {
          navigate("/profile", { replace: true });
        }, 1200);
      } catch {
        // Si el auto-login falla, redirigir a /login
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución."
          : err instanceof Error
            ? err.message
            : "No se pudo registrar el usuario.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <main className="auth-card" style={{ maxWidth: "620px" }}>
        {/* Logotipo de la Marca */}
        <div className="card-brand">
          <svg
            className="brand-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
          </svg>
          <span className="brand-text">
            {siteConfig.clubName.toUpperCase()}{" "}
            <span className="highlight">{siteConfig.sedeNombre.toUpperCase()}</span>
          </span>
        </div>

        {/* Encabezado */}
        <header className="auth-header">
          <h1 className="auth-title">CREAR CUENTA</h1>
          <p className="auth-subtitle">
            Regístrate como nuevo socio/cliente para reservar clases, canchas y gestionar tus pases
          </p>
        </header>

        {exito ? (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid #22c55e",
              borderRadius: "8px",
              padding: "1.5rem",
              margin: "1.5rem 0",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#22c55e", marginBottom: "0.5rem" }}>¡Cuenta creada exitosamente!</h3>
            <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
              Iniciando tu sesión y redirigiéndote al portal...
            </p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} autoComplete="on">
            {/* Mensaje de Error */}
            {error && (
              <div
                style={{
                  background: "rgba(255, 75, 114, 0.15)",
                  border: "1px solid var(--accent-red, #ff4b72)",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                  color: "#fff",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Campo: Nombre */}
              <div className="form-group">
                <label htmlFor="reg-nombre" className="input-label">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="reg-nombre"
                  name="nombre"
                  className="form-input"
                  placeholder="Ej: Juan"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {/* Campo: Apellido */}
              <div className="form-group">
                <label htmlFor="reg-apellido" className="input-label">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="reg-apellido"
                  name="apellido"
                  className="form-input"
                  placeholder="Ej: Pérez"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Campo: DNI */}
              <div className="form-group">
                <label htmlFor="reg-dni" className="input-label">
                  DNI / Documento *
                </label>
                <input
                  type="text"
                  id="reg-dni"
                  name="dni"
                  className="form-input"
                  placeholder="Ej: 38450123"
                  required
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </div>

              {/* Campo: Teléfono */}
              <div className="form-group">
                <label htmlFor="reg-tel" className="input-label">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  id="reg-tel"
                  name="telefono"
                  className="form-input"
                  placeholder="Ej: 3454123456"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>

            {/* Campo: Correo Electrónico */}
            <div className="form-group">
              <label htmlFor="reg-email" className="input-label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="reg-email"
                name="email"
                className="form-input"
                placeholder="nombre@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Campo: Contraseña */}
              <div className="form-group">
                <label htmlFor="reg-password" className="input-label">
                  Contraseña *
                </label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  className="form-input"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {/* Campo: Confirmar Contraseña */}
              <div className="form-group">
                <label htmlFor="reg-confirm-password" className="input-label">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  id="reg-confirm-password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Repetir contraseña"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Sede Asignada Automáticamente */}
            <div
              style={{
                fontSize: "0.8rem",
                color: "#888",
                padding: "0.5rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>📍 Sede base:</span>
              <strong style={{ color: "var(--accent-neon, #ccff00)" }}>
                {siteConfig.sedeNombre}
              </strong>
              <span>(Rol asignado: Cliente)</span>
            </div>

            {/* Botón de Registro */}
            <button
              type="submit"
              className="submit-btn"
              disabled={cargando}
              style={{
                opacity: cargando ? 0.7 : 1,
                cursor: cargando ? "not-allowed" : "pointer",
                marginTop: "1rem",
              }}
            >
              <span className="btn-text">
                {cargando ? "REGISTRANDO CUENTA..." : "CREAR MI CUENTA"}
              </span>
              <svg
                className="btn-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        )}

        {/* Pie de tarjeta: Volver al Login */}
        <footer className="auth-card-footer" style={{ marginTop: "1.5rem" }}>
          <p>
            ¿Ya tienes una cuenta registrada?{" "}
            <Link to="/login" className="register-cta">
              Inicia sesión aquí
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
