import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="login-wrapper">
      {/* Tarjeta de Autenticación Centrada sobre la Imagen */}
      <main className="auth-card">
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
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </header>

        {/* Formulario Semántico de Inicio de Sesión */}
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

          {/* Botón de Envío Principal */}
          <button type="submit" className="submit-btn" id="submit-login">
            <span className="btn-text">INGRESAR AL GIMNASIO</span>
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
