import "./AdminClases.css";

export default function AdminClases() {
  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Planificación de Clases</h1>
          <p>Gestiona instructores, horarios y reservas de las disciplinas FitZone</p>
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

      {/* LAYOUT: Calendario y Detalles */}
      <div className="classes-layout">
        
        {/* CALENDARIO */}
        <section className="calendar-section">
          
          <div className="calendar-header">
            <h2 className="calendar-title">Calendario Semanal — Sede Las Condes</h2>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px" }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Programar Clase
            </button>
          </div>

          <div className="week-grid">
            {/* Lunes */}
            <div className="day-column">
              <div className="day-header">Lunes 12</div>
              <div className="class-card border-orange">
                <div className="class-name">Spinning Pro</div>
                <div className="class-instructor">M. José Ramos</div>
                <div className="class-meta">
                  <span className="class-time">08:00 h</span>
                  <span className="class-capacity">18/20</span>
                </div>
              </div>
              <div className="class-card border-green">
                <div className="class-name">Power Yoga</div>
                <div className="class-instructor">S. Vergara</div>
                <div className="class-meta">
                  <span className="class-time">18:00 h</span>
                  <span className="class-capacity">12/15</span>
                </div>
              </div>
            </div>

            {/* Martes */}
            <div className="day-column">
              <div className="day-header">Martes 13</div>
              <div className="class-card border-yellow">
                <div className="class-name">CrossFit Elite</div>
                <div className="class-instructor">Diego Arana</div>
                <div className="class-meta">
                  <span className="class-time">09:30 h</span>
                  <span className="class-capacity">20/20</span>
                </div>
              </div>
            </div>

            {/* Miércoles */}
            <div className="day-column">
              <div className="day-header">Miércoles 14</div>
              <div className="class-card border-orange">
                <div className="class-name">Spinning Pro</div>
                <div className="class-instructor">M. José Ramos</div>
                <div className="class-meta">
                  <span className="class-time">08:00 h</span>
                  <span className="class-capacity">18/20</span>
                </div>
              </div>
              <div className="class-card border-red">
                <div className="class-name">Pilates Reformer</div>
                <div className="class-instructor">C. Edwards</div>
                <div className="class-meta">
                  <span className="class-time">19:30 h</span>
                  <span className="class-capacity">8/10</span>
                </div>
              </div>
            </div>

            {/* Jueves */}
            <div className="day-column">
              <div className="day-header">Jueves 15</div>
              <div className="class-card border-yellow">
                <div className="class-name">CrossFit Elite</div>
                <div className="class-instructor">Diego Arana</div>
                <div className="class-meta">
                  <span className="class-time">09:30 h</span>
                  <span className="class-capacity">15/20</span>
                </div>
              </div>
            </div>

            {/* Viernes */}
            <div className="day-column">
              <div className="day-header">Viernes 16</div>
              <div className="class-card border-green">
                <div className="class-name">Power Yoga</div>
                <div className="class-instructor">S. Vergara</div>
                <div className="class-meta">
                  <span className="class-time">18:00 h</span>
                  <span className="class-capacity">12/15</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* DETALLES DE INSCRITOS */}
        <aside className="details-section">
          
          <div className="details-header">
            <h2>Detalle de Inscritos</h2>
            <p>CrossFit Elite — 09:30 h</p>
          </div>

          {/* Lista Principal */}
          <div className="roster-group">
            <span className="roster-title-orange">Lista Principal (20)</span>
            <div className="roster-item">
              <span className="roster-name">Mateo Silva</span>
              <span className="roster-status">Socio Activo</span>
            </div>
            <div className="roster-item">
              <span className="roster-name">Francisca Soto</span>
              <span className="roster-status">Socio Activo</span>
            </div>
            <div className="roster-item">
              <span className="roster-name">Roberto Gómez</span>
              <span className="roster-status">Cliente Externo</span>
            </div>
          </div>

          {/* Lista de Espera */}
          <div className="roster-group" style={{ marginTop: "1rem" }}>
            <span className="roster-title-yellow">Lista de Espera (RF-08) (4)</span>
            <div className="roster-item">
              <span className="roster-name">Ignacio Pérez</span>
              <span className="roster-pos">Pos #1</span>
            </div>
            <div className="roster-item">
              <span className="roster-name">Clara Varas</span>
              <span className="roster-pos">Pos #2</span>
            </div>
          </div>

        </aside>

      </div>
    </>
  );
}
