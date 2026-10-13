import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="status-page-wrapper">
      <main className="status-card danger-theme" role="main" aria-labelledby="status-title">
        {/* Icono representativo de acceso restringido */}
        <div className="status-icon-wrapper" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Badge de Código de Estado */}
        <div className="status-code-badge">
          <span>Error 403 • Restringido</span>
        </div>

        {/* Título de Impacto */}
        <h1 id="status-title" className="status-title">
          ACCESO <span className="highlight" style={{ color: "var(--color-error)" }}>DENEGADO</span>
        </h1>

        {/* Mensaje Explicativo */}
        <p className="status-description">
          No cuentas con los permisos o privilegios necesarios para acceder a este recurso.
          Esta área puede requerir un plan de membresía superior o credenciales de administración.
        </p>

        {/* Botones de Navegación */}
        <div className="status-actions">
          <Link to="/" className="status-btn-primary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Volver al Inicio</span>
          </Link>

          <Link to="/perfil" className="status-btn-secondary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Ver Mi Perfil</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
