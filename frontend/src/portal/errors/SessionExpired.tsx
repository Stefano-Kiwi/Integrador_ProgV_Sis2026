import { Link } from "react-router-dom";

export default function SessionExpired() {
  return (
    <div className="status-page-wrapper">
      <main className="status-card expired-theme" role="main" aria-labelledby="status-title">
        {/* Icono representativo de sesión expirada / candado con tiempo */}
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
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* Badge de Código de Estado */}
        <div className="status-code-badge">
          <span>Seguridad • Sesión Caducada</span>
        </div>

        {/* Título de Impacto */}
        <h1 id="status-title" className="status-title">
          SESIÓN <span className="highlight">EXPIRADA</span>
        </h1>

        {/* Mensaje Explicativo */}
        <p className="status-description">
          Tu sesión ha finalizado por motivos de seguridad debido a inactividad prolongada.
          Para continuar gestionando tus reservas, pagos y perfil de socio, por favor vuelve a ingresar.
        </p>

        {/* Botones de Navegación */}
        <div className="status-actions">
          <Link to="/login" className="status-btn-primary">
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Iniciar Sesión Nuevamente</span>
          </Link>

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
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
