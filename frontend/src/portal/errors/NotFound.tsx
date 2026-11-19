import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="status-page-wrapper">
      <main className="status-card warning-theme" role="main" aria-labelledby="status-title">
        {/* Icono representativo de brújula / página extraviada */}
        <div className="status-icon-wrapper" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>

        {/* Badge de Código de Estado */}
        <div className="status-code-badge">
          <span>Error 404 • No Encontrado</span>
        </div>

        {/* Título de Impacto */}
        <h1 id="status-title" className="status-title">
          PÁGINA <span className="highlight" style={{ color: "var(--accent-orange)" }}>NO ENCONTRADA</span>
        </h1>

        {/* Mensaje Explicativo */}
        <p className="status-description">
          La ruta que estás buscando no existe, ha cambiado de lugar o fue dada de baja temporalmente.
          Revisa la dirección web o regresa a la página principal.
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

          <Link to="/clases" className="status-btn-secondary">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Explorar Clases</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
