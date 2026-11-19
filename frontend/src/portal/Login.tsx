import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion, obtenerUsuarioActual } from "../services/authService";
import { useAppStore } from "../store";

export default function Login() {
  const navigate = useNavigate();
  const { refrescarSesion } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cargando) return;
    setError(null);

    if (!email.trim() || !password) {
      setError("Por favor completa tu correo y contraseña.");
      return;
    }

    setCargando(true);

    try {
      await iniciarSesion(email, password);
      await refrescarSesion();
      const usuario = obtenerUsuarioActual();
      const idRol = typeof usuario?.id_rol === "number" ? usuario.id_rol : null;
      const rolTexto = String(usuario?.clase_rol ?? usuario?.rol ?? usuario?.role ?? "").toLowerCase();
      const esAdminOGerente =
        idRol === 3 ||
        idRol === 4 ||
        rolTexto === "gerente" ||
        rolTexto === "admin" ||
        rolTexto === "administrador";
      if (esAdminOGerente) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "No se pudo conectar con el backend (localhost:3000). Asegúrate de que el servidor esté activo."
          : err instanceof Error
            ? err.message
            : "No se pudo iniciar sesión.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Tarjeta de Autenticación Centrada sobre la Imagen */}
      <main className="auth-card auth-card-wide">
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
            EL TREMENDO<span className="highlight"> GYM</span>
          </span>
        </div>

        {/* Encabezado del Formulario */}
        <header className="auth-header">
          <h1 className="auth-title">BIENVENIDO DE VUELTA</h1>
          <p className="auth-subtitle">
            Ingresa tus credenciales o utiliza el acceso rápido mediante código QR
          </p>
        </header>

        {/* Contenedor Dividido: Formulario Tradicional + Separador + Código QR */}
        <div className="auth-card-body-split">
          {/* Columna Izquierda: Formulario Tradicional de Inicio de Sesión */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
            autoComplete="on"
          >
            {/* Campo: Identificador o Correo Electrónico */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="username" className="input-label">
                  Correo Electrónico
                </label>
                <span className="hint-text">Ej: usuario@eltremendo.com</span>
              </div>

              <div className="input-container">
                <svg
                  className="field-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="nombre@correo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  enterKeyHint="next"
                  aria-describedby="email-validation-tip"
                />
                <span className="validation-badge" aria-hidden="true">
                  ✓
                </span>
              </div>
              <p id="email-validation-tip" className="field-feedback">
                Por favor introduce un correo válido.
              </p>
            </div>

            {/* Campo: Contraseña */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="current-password" className="input-label">
                  Contraseña
                </label>
                <Link to="#" className="forgot-link">
                  ¿Olvidaste tu clave?
                </Link>
              </div>

              <div className="input-container">
                <svg
                  className="field-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  id="current-password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  autoComplete="current-password"
                  enterKeyHint="done"
                  aria-describedby="password-hint"
                />
                <span className="validation-badge" aria-hidden="true">
                  ✓
                </span>
              </div>
              <p id="password-hint" className="field-feedback">
                Mínimo 6 caracteres para ingresar.
              </p>
            </div>

            {/* Opciones Extras: Recordar sesión */}
            <div className="form-extra-row">
              <label className="remember-toggle">
                <input
                  type="checkbox"
                  name="remember_me"
                  className="checkbox-input"
                  defaultChecked
                />
                <span className="custom-check" />
                <span className="toggle-text">Recordar este dispositivo</span>
              </label>
            </div>

            {/* Mensaje de Error si la autenticación falla */}
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

            {/* Botón de Envío Principal */}
            <button
              type="submit"
              className="submit-btn"
              id="submit-login"
              disabled={cargando}
              style={{ opacity: cargando ? 0.7 : 1, cursor: cargando ? "not-allowed" : "pointer" }}
            >
              <span className="btn-text">
                {cargando ? "CONECTANDO CON EL SERVIDOR..." : "INGRESAR AL GIMNASIO"}
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

          {/* Divisor Visual con la letra "O" */}
          <div className="auth-divider-col" aria-hidden="true">
            <div className="auth-divider-line" />
            <div className="auth-divider-badge">O</div>
            <div className="auth-divider-line" />
          </div>

          {/* Columna Derecha: Sección de Código QR Estático */}
          <section className="auth-qr-section" aria-label="Iniciar sesión con código QR">
            <div className="auth-qr-header">
              <h2 className="auth-qr-title">INICIAR SESIÓN CON QR</h2>
              <p className="auth-qr-subtitle">
                Escanea este código desde tu app móvil de El Tremendo Gym para acceder instantáneamente
              </p>
            </div>

            {/* Tarjeta de Exhibición del Código QR */}
            <div className="qr-code-display-card">
              <div className="qr-corner-marker tl" />
              <div className="qr-corner-marker tr" />
              <div className="qr-corner-marker bl" />
              <div className="qr-corner-marker br" />

              <svg
                className="qr-static-svg"
                viewBox="0 0 120 120"
                fill="none"
                role="img"
                aria-label="Código QR ilustrativo de inicio de sesión"
              >
                <rect width="120" height="120" fill="white" />
                {/* Esquina Superior Izquierda */}
                <rect x="12" y="12" width="28" height="28" fill="#090c10" />
                <rect x="16" y="16" width="20" height="20" fill="white" />
                <rect x="21" y="21" width="10" height="10" fill="#090c10" />

                {/* Esquina Superior Derecha */}
                <rect x="80" y="12" width="28" height="28" fill="#090c10" />
                <rect x="84" y="16" width="20" height="20" fill="white" />
                <rect x="89" y="21" width="10" height="10" fill="#090c10" />

                {/* Esquina Inferior Izquierda */}
                <rect x="12" y="80" width="28" height="28" fill="#090c10" />
                <rect x="16" y="84" width="20" height="20" fill="white" />
                <rect x="21" y="89" width="10" height="10" fill="#090c10" />

                {/* Patrones Internos de Datos (Estáticos Demostrativos) */}
                <rect x="48" y="14" width="8" height="8" fill="#090c10" />
                <rect x="62" y="14" width="8" height="8" fill="#090c10" />
                <rect x="48" y="28" width="8" height="8" fill="#090c10" />
                <rect x="62" y="34" width="8" height="12" fill="#090c10" />

                <rect x="14" y="48" width="8" height="8" fill="#090c10" />
                <rect x="28" y="54" width="8" height="8" fill="#090c10" />
                <rect x="14" y="66" width="8" height="6" fill="#090c10" />

                {/* Centro */}
                <rect x="46" y="46" width="12" height="12" fill="#090c10" />
                <rect x="64" y="52" width="10" height="8" fill="#090c10" />
                <rect x="46" y="64" width="8" height="10" fill="#090c10" />
                <rect x="60" y="66" width="14" height="8" fill="#090c10" />

                {/* Lado derecho e inferior */}
                <rect x="82" y="48" width="10" height="8" fill="#090c10" />
                <rect x="98" y="54" width="8" height="12" fill="#090c10" />
                <rect x="86" y="68" width="8" height="6" fill="#090c10" />

                <rect x="48" y="84" width="8" height="10" fill="#090c10" />
                <rect x="62" y="82" width="10" height="8" fill="#090c10" />
                <rect x="52" y="98" width="12" height="8" fill="#090c10" />

                <rect x="80" y="82" width="12" height="8" fill="#090c10" />
                <rect x="96" y="86" width="10" height="8" fill="#090c10" />
                <rect x="82" y="96" width="8" height="10" fill="#090c10" />
                <rect x="96" y="98" width="12" height="8" fill="#090c10" />
              </svg>
            </div>

            <div className="qr-instruction-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Acceso Rápido con Tu Teléfono</span>
            </div>

            <span className="qr-demo-tag">
              Código QR demostrativo • Autenticación rápida sin contraseña
            </span>
          </section>
        </div>

        {/* Pie de tarjeta: Enlace a Registro o Prueba Gratis */}
        <footer className="auth-card-footer">
          <p>
            ¿Todavía no eres miembro de El tremendo gym?{" "}
            <Link to="#" className="register-cta">
              Registrate ahora
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
