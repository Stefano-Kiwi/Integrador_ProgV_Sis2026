import "./AdminCanchas.css";

export default function AdminCanchas() {
  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Control de Canchas</h1>
          <p>Administración de reservas, tarifas dinámicas e inventario deportivo</p>
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

      {/* LAYOUT: Grilla y Configuración */}
      <div className="courts-layout">
        
        {/* GRILLA DE TURNOS */}
        <section className="grid-section">
          
          <div className="grid-header">
            <h2 className="config-title" style={{ margin: 0 }}>Grilla de Turnos por Cancha</h2>
            <div className="tabs-group">
              <button className="tab-btn active">Pádel</button>
              <button className="tab-btn">Fútbol 5</button>
            </div>
            <span className="grid-date">Miércoles, 14 de Octubre</span>
          </div>

          <div className="courts-list">
            
            {/* Cancha 1 */}
            <div className="court-row">
              <div className="court-header">
                <span className="court-title">Cancha Pádel 1 (Vidrio)</span>
                <span className="status-badge status-active" style={{ background: "transparent" }}>Libre</span>
              </div>
              <div className="time-slots">
                <div className="time-slot available">16:00 - Disponible</div>
                <div className="time-slot reserved">17:30 - Reservado</div>
                <div className="time-slot reserved">19:00 - Reservado</div>
              </div>
            </div>

            {/* Cancha 2 (Mantenimiento) */}
            <div className="court-row">
              <div className="court-header">
                <span className="court-title">Cancha Pádel 2 (Vidrio)</span>
                <span className="status-badge status-inactive" style={{ background: "transparent" }}>Mantenimiento</span>
              </div>
              <p className="maintenance-msg">Fuera de servicio por reparación de red</p>
            </div>

            {/* Cancha 3 */}
            <div className="court-row">
              <div className="court-header">
                <span className="court-title">Cancha Pádel 3 (Muro)</span>
                <span className="status-badge status-active" style={{ background: "transparent" }}>Libre</span>
              </div>
              <div className="time-slots">
                <div className="time-slot reserved">16:00 - Reservado</div>
                <div className="time-slot available">17:30 - Disponible</div>
                <div className="time-slot available">19:00 - Disponible</div>
              </div>
            </div>

          </div>

        </section>

        {/* PANEL DE CONFIGURACIÓN */}
        <aside className="config-section">
          
          <h2 className="config-title" style={{ margin: 0 }}>Configuración de Canchas</h2>

          {/* Esquema Tarifario */}
          <div className="pricing-card">
            <div className="pricing-header">Esquema Tarifario Activo</div>
            
            <div className="pricing-row">
              <span className="pricing-label">Tarifa Base (Pádel)</span>
              <span className="pricing-val">$12,000 / h</span>
            </div>
            
            <div className="pricing-row">
              <span className="pricing-label">Descuento Socio (RF-11)</span>
              <span className="pricing-val val-green">- 15%</span>
            </div>
            
            <div className="pricing-row">
              <span className="pricing-label">Recargo Hora Pico (RF-12)</span>
              <span className="pricing-val val-yellow">+ 20% (19:00 - 21:00)</span>
            </div>
          </div>

          {/* Mantenimiento */}
          <div className="maintenance-block">
            <div className="maintenance-header">Mantenimiento Preventivo (RF-09)</div>
            <p className="maintenance-desc">Utiliza este módulo para bloquear temporalmente turnos de juego por reparaciones.</p>
            <button className="btn-outline-red">Habilitar Bloqueo de Cancha</button>
          </div>

        </aside>

      </div>
    </>
  );
}
