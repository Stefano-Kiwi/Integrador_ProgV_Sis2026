import "./AdminControlAcceso.css";

export default function AdminControlAcceso() {
  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Molinete de Acceso</h1>
          <p>Validación en tiempo real y estadísticas de aforo de la sede</p>
        </div>
        <div className="header-controls">
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "14px" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Todas las Sedes (25) ⌄
          </button>
          <button className="btn-secondary" style={{ padding: "0.75rem 1rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "14px" }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Hoy, 14 de Octubre
          </button>
        </div>
      </header>

      {/* LAYOUT: Escáner y Registro */}
      <div className="access-layout">
        
        {/* ESCÁNER Y AFORO */}
        <section className="scanner-section">
          
          {/* Aforo en Tiempo Real */}
          <div className="aforo-card">
            <div className="aforo-info">
              <h2>Aforo en Tiempo Real (Las Condes)</h2>
              <p>Capacidad máxima autorizada: 250 personas</p>
            </div>
            <div className="aforo-stats">
              <span className="aforo-numbers">195 / 250</span>
              <span className="badge-aforo">78% Aforo</span>
            </div>
          </div>

          {/* Simulación Escaneo QR */}
          <div className="qr-card">
            <div className="qr-title">Simulación de Escaneo QR (RF-04)</div>
            
            <div className="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.youtube.com/watch?v=dQw4w9WgXcQ" alt="QR Escáner Simulado" />
            </div>

            <div className="success-banner">
              <div className="banner-title">● MOLINETE LIBERADO — ACCESO AUTORIZADO</div>
              <div className="banner-subtitle">Mateo Silva (Socio Activo) - DNI 34.981.203</div>
            </div>
          </div>

        </section>

        {/* REGISTRO RECIENTE (DERECHA) */}
        <aside className="history-section">
          
          <h2 className="history-title">Registro Reciente de Ingresos</h2>

          <div className="history-list">
            {/* Registro 1 */}
            <div className="history-item">
              <div className="history-avatar">
                <img src="https://ui-avatars.com/api/?name=Mateo+Silva&background=151b2b&color=fff" alt="Avatar" />
              </div>
              <div className="history-details">
                <span className="history-name">Mateo Silva</span>
                <span className="history-status status-ok">Autorizado</span>
              </div>
              <span className="history-time">Hace 10 seg</span>
            </div>

            {/* Registro 2 */}
            <div className="history-item">
              <div className="history-avatar">
                <img src="https://ui-avatars.com/api/?name=Constanza+Rivas&background=151b2b&color=fff" alt="Avatar" />
              </div>
              <div className="history-details">
                <span className="history-name">Constanza Rivas</span>
                <span className="history-status status-ok">Autorizado</span>
              </div>
              <span className="history-time">Hace 2 min</span>
            </div>

            {/* Registro 3 */}
            <div className="history-item">
              <div className="history-avatar">
                <img src="https://ui-avatars.com/api/?name=Andrés+Medina&background=151b2b&color=fff" alt="Avatar" />
              </div>
              <div className="history-details">
                <span className="history-name">Andrés Medina</span>
                <span className="history-status status-ok">Autorizado</span>
              </div>
              <span className="history-time">Hace 5 min</span>
            </div>

            {/* Registro 4 (Denegado) */}
            <div className="history-item">
              <div className="history-avatar">
                <img src="https://ui-avatars.com/api/?name=Juan+Pablo+Bravo&background=151b2b&color=fff" alt="Avatar" />
              </div>
              <div className="history-details">
                <span className="history-name">Juan Pablo Bravo</span>
                <span className="history-status status-fail">Denegado (Vencido)</span>
              </div>
              <span className="history-time">Hace 12 min</span>
            </div>
          </div>

        </aside>

      </div>
    </>
  );
}
