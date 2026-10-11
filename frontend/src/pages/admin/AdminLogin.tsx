import "./AdminLogin.css";
import { Link } from "react-router-dom";
import "../admin.css";

export default function AdminLogin() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <header className="login-header">
          {/* Logo */}
          <div className="brand" style={{ justifyContent: "center", margin: 0 }}>
            <svg viewBox="0 0 24 24" fill="var(--accent-orange)" style={{ width: "32px" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <div className="brand-title" style={{ fontSize: "1.6rem" }}>FITZONE <span>PANEL</span></div>
          </div>
          <p className="login-subtitle">Acceso exclusivo para personal administrativo y recepcionistas</p>
        </header>

        {/* Formulario apuntando al Dashboard para simular la navegación */}
        <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="email">Usuario o Correo Electrónico</label>
            <input type="email" id="email" className="form-control" placeholder="ej. gruiz@fitzone.com" required />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" className="form-control" placeholder="••••••••" required />
          </div>

          <Link to="#" className="forgot-password">¿Olvidaste tu contraseña?</Link>

          <Link to="/admin" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem", fontSize: "1rem", padding: "0.85rem", textAlign: "center", textDecoration: "none" }}>
            Ingresar al Sistema
          </Link>
        </form>

      </div>
    </div>
  );
}
