import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../admin.css";

type ErrorScenario = "none" | "invalid_credentials" | "user_locked" | "empty_fields" | "session_expired";

export default function AdminLogin() {
  const navigate = useNavigate();

  // Estados del Formulario
  const [email, setEmail] = useState("gruiz@fitzone.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);

  // Estado del simulador de error visual
  const [errorScenario, setErrorScenario] = useState<ErrorScenario>("invalid_credentials");

  const handleScenarioChange = (scenario: ErrorScenario) => {
    setErrorScenario(scenario);
    if (scenario === "empty_fields") {
      setEmail("");
      setPassword("");
    } else if (scenario === "none") {
      setEmail("gruiz@fitzone.com");
      setPassword("Pass1234!");
    } else if (scenario === "invalid_credentials") {
      setEmail("admin_prueba@fitzone.com");
      setPassword("clave_erronea");
    } else if (scenario === "user_locked") {
      setEmail("lpereyra@fitzone.com");
      setPassword("bloqueado123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorScenario("empty_fields");
      return;
    }
    if (errorScenario === "none") {
      navigate("/admin");
    }
  };

  return (
    <div className="login-wrapper">
      {/* SIMULADOR DE ESTADOS DE ERROR VISUALES */}
      <div className="scenario-selector">
        <span className="scenario-label">Simular Estado:</span>
        <button
          type="button"
          className={`scenario-btn ${errorScenario === "invalid_credentials" ? "active" : ""}`}
          onClick={() => handleScenarioChange("invalid_credentials")}
        >
          Credenciales Incorrectas
        </button>
        <button
          type="button"
          className={`scenario-btn ${errorScenario === "user_locked" ? "active" : ""}`}
          onClick={() => handleScenarioChange("user_locked")}
        >
          Usuario Bloqueado
        </button>
        <button
          type="button"
          className={`scenario-btn ${errorScenario === "empty_fields" ? "active" : ""}`}
          onClick={() => handleScenarioChange("empty_fields")}
        >
          Campos Vacíos
        </button>
        <button
          type="button"
          className={`scenario-btn ${errorScenario === "session_expired" ? "active" : ""}`}
          onClick={() => handleScenarioChange("session_expired")}
        >
          Sesión Expirada
        </button>
        <button
          type="button"
          className={`scenario-btn ${errorScenario === "none" ? "active" : ""}`}
          style={{ borderColor: errorScenario === "none" ? "var(--accent-green)" : "", color: errorScenario === "none" ? "var(--accent-green)" : "" }}
          onClick={() => handleScenarioChange("none")}
        >
          Estado Normal (Válido)
        </button>
      </div>

      <div className="login-card">
        <header className="login-header">
          {/* Logo */}
          <div className="brand" style={{ justifyContent: "center", margin: 0 }}>
            <svg viewBox="0 0 24 24" fill="var(--accent-orange)" style={{ width: "32px" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <div className="brand-title" style={{ fontSize: "1.6rem" }}>
              FITZONE <span>PANEL</span>
            </div>
          </div>
          <p className="login-subtitle">Acceso exclusivo para personal administrativo y recepcionistas</p>
        </header>

        {/* BANNERS VISUALES DE ERROR */}
        {errorScenario === "invalid_credentials" && (
          <div className="login-alert-error" role="alert">
            <svg className="login-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div className="login-alert-content">
              <div className="login-alert-title">Credenciales Incorrectas</div>
              <div className="login-alert-msg">El correo electrónico o la contraseña ingresada no coinciden con nuestros registros. (Intento 2 de 3).</div>
            </div>
          </div>
        )}

        {errorScenario === "user_locked" && (
          <div className="login-alert-error" role="alert">
            <svg className="login-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div className="login-alert-content">
              <div className="login-alert-title">Cuenta Temporalmente Bloqueada</div>
              <div className="login-alert-msg">Se superó el límite de 3 intentos fallidos. Por seguridad, la cuenta permanecerá bloqueada por 15 minutos o contacte a gerencia.</div>
            </div>
          </div>
        )}

        {errorScenario === "session_expired" && (
          <div className="login-alert-error" style={{ borderColor: "rgba(255, 176, 32, 0.4)", backgroundColor: "rgba(255, 176, 32, 0.12)", color: "var(--accent-yellow)" }} role="alert">
            <svg className="login-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div className="login-alert-content">
              <div className="login-alert-title" style={{ color: "var(--accent-yellow)" }}>Sesión Administrativa Caducada</div>
              <div className="login-alert-msg">Tu sesión se cerró por 30 minutos de inactividad continuada. Ingresa nuevamente para reanudar operaciones.</div>
            </div>
          </div>
        )}

        {/* Formulario con Validación Visual */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="email">Usuario o Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errorScenario === "empty_fields" || errorScenario === "invalid_credentials" ? "is-invalid" : ""}`}
              placeholder="ej. gruiz@fitzone.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorScenario === "empty_fields" && !email && (
              <span className="invalid-feedback">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "12px", height: "12px" }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                El correo institucional es obligatorio.
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-control ${errorScenario === "empty_fields" || errorScenario === "invalid_credentials" ? "is-invalid" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errorScenario === "empty_fields" && !password && (
              <span className="invalid-feedback">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "12px", height: "12px" }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Debes ingresar tu contraseña de acceso.
              </span>
            )}
          </div>

          <Link to="#" className="forgot-password">¿Olvidaste tu contraseña?</Link>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "0.25rem", fontSize: "1rem", padding: "0.85rem", textAlign: "center", textDecoration: "none" }}
            onClick={() => {
              if (errorScenario === "none") {
                navigate("/admin");
              }
            }}
          >
            {errorScenario === "none" ? "Ingresar al Sistema" : "Intentar Acceso"}
          </button>
          
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            O continuar directo al <Link to="/admin" style={{ color: "var(--accent-orange)" }}>Dashboard de Administración →</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
