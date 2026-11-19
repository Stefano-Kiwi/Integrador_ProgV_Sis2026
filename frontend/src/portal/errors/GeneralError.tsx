import { Link } from "react-router-dom";

export default function GeneralError() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="status-page-wrapper">
      <main className="status-card danger-theme" role="main" aria-labelledby="status-title">
        {/* Icono representativo de alerta de servidor / fallo inesperado */}
        <div className="status-icon-wrapper" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Badge de Código de Estado */}
        <div className="status-code-badge">
          <span>Error 500 • Inesperado</span>
        </div>

        {/* Título de Impacto */}
        <h1 id="status-title" className="status-title">
          ALGO <span className="highlight" style={{ color: "var(--color-error)" }}>SALIÓ MAL</span>
        </h1>

        {/* Mensaje Explicativo */}
        <p className="status-description">
          Ocurrió un error inesperado al procesar tu solicitud en el sistema.
          El incidente fue reportado internamente. Por favor, reintenta la acción en unos momentos.
        </p>

        {/* Botones de Navegación */}
        <div className="status-actions">
          <button
            type="button"
            className="status-btn-primary"
            onClick={handleReload}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Reintentar</span>
          </button>

          <Link to="/" className="status-btn-secondary">
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
        </div>
      </main>
    </div>
  );
}
