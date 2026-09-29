import "./Dashboard.css";

export default function Dashboard() {
  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Dashboard Overview</h1>
          <p>Panel de administración global para todas las sedes FitZone Sports</p>
        </div>
        <div className="header-controls">
          <button className="btn-secondary">◎ Todas las Sedes (25)</button>
          <button className="btn-secondary">🔔</button>
          <button className="btn-secondary">📅 Hoy, 14 de Octubre</button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* KPIs */}
        <div className="panel-card">
          <div className="kpi-header">Socios Activos <span>👥</span></div>
          <div className="kpi-value">14,204</div>
          <div className="kpi-trend trend-up">↗ +8.4% <span className="trend-text">este mes</span></div>
        </div>
        <div className="panel-card">
          <div className="kpi-header">Ingresos Mensuales <span>💳</span></div>
          <div className="kpi-value">$162,450 USD</div>
          <div className="kpi-trend trend-up">↗ +12.1% <span className="trend-text">este mes</span></div>
        </div>
        <div className="panel-card">
          <div className="kpi-header">Ocupación Promedio <span>📊</span></div>
          <div className="kpi-value">78.2%</div>
          <div className="kpi-trend trend-up">↗ +3.4% <span className="trend-text">este mes</span></div>
        </div>
        <div className="panel-card">
          <div className="kpi-header">Clases de Hoy <span>📅</span></div>
          <div className="kpi-value">148</div>
          <div className="kpi-trend trend-down">↘ -1.2% <span className="trend-text">este mes</span></div>
        </div>

        {/* Columna Izquierda: Gráficos */}
        <div className="charts-area">
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Tendencia de Crecimiento de Socios</div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Últimos 6 meses</span>
            </div>
            <div className="bar-chart-mock">
              <div className="bar-col"><div className="bar-fill-area"><div className="bar" style={{ height: "40%" }}><span className="bar-val">10.2k</span></div></div><span className="bar-label">Mayo</span></div>
              <div className="bar-col"><div className="bar-fill-area"><div className="bar" style={{ height: "50%" }}><span className="bar-val">11.1k</span></div></div><span className="bar-label">Junio</span></div>
              <div className="bar-col"><div className="bar-fill-area"><div className="bar" style={{ height: "55%" }}><span className="bar-val">11.8k</span></div></div><span className="bar-label">Julio</span></div>
              <div className="bar-col"><div className="bar-fill-area"><div className="bar" style={{ height: "65%" }}><span className="bar-val">12.4k</span></div></div><span className="bar-label">Agosto</span></div>
              <div className="bar-col"><div className="bar-fill-area"><div className="bar" style={{ height: "75%" }}><span className="bar-val">13.2k</span></div></div><span className="bar-label">Sept</span></div>
              <div className="bar-col"><div className="bar-fill-area"><div className="bar active" style={{ height: "90%" }}><span className="bar-val">14.2k</span></div></div><span className="bar-label">Oct</span></div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Ingresos por Sede Principal (Top 4)</div>
              <a href="#ranking" style={{ color: "var(--accent-orange)", fontSize: "0.85rem", textDecoration: "none" }}>Ver ranking</a>
            </div>
            <div className="ranking-list">
              <div className="ranking-item">
                <div className="ranking-info"><span>Sede Las Condes</span><strong>$45,200</strong></div>
                <div className="ranking-bar-bg"><div className="ranking-bar-fill" style={{ width: "85%", background: "var(--accent-orange)" }}></div></div>
              </div>
              <div className="ranking-item">
                <div className="ranking-info"><span>Sede Vitacura</span><strong>$38,400</strong></div>
                <div className="ranking-bar-bg"><div className="ranking-bar-fill" style={{ width: "70%", background: "var(--accent-green)" }}></div></div>
              </div>
              <div className="ranking-item">
                <div className="ranking-info"><span>Sede Providencia</span><strong>$31,900</strong></div>
                <div className="ranking-bar-bg"><div className="ranking-bar-fill" style={{ width: "60%", background: "var(--accent-yellow)" }}></div></div>
              </div>
              <div className="ranking-item">
                <div className="ranking-info"><span>Sede Lo Barnechea</span><strong>$24,150</strong></div>
                <div className="ranking-bar-bg"><div className="ranking-bar-fill" style={{ width: "45%", background: "var(--text-muted)" }}></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Alertas */}
        <div className="alerts-area">
          <div className="panel-title" style={{ marginBottom: "0.5rem" }}>Alertas de Operaciones</div>

          <div className="alert-card" style={{ borderColor: "rgba(255, 75, 114, 0.4)", backgroundColor: "rgba(255, 75, 114, 0.05)" }}>
            <div className="alert-title"><span style={{ color: "var(--accent-red)" }}>⚠️</span> Saturación de Capacidad</div>
            <div className="alert-desc">Las Condes se encuentra al 94% de su límite máximo permitido.</div>
          </div>

          <div className="alert-card" style={{ borderColor: "rgba(255, 176, 32, 0.4)", backgroundColor: "rgba(255, 176, 32, 0.05)" }}>
            <div className="alert-title"><span style={{ color: "var(--accent-yellow)" }}>🔧</span> Mantenimiento Cancha 2</div>
            <div className="alert-desc">Sede Vitacura reporta daño en el vidrio perimetral de Pádel.</div>
          </div>

          <div className="alert-card">
            <div className="alert-title">📄 Suscripciones por Vencer</div>
            <div className="alert-desc">42 socios activos ingresan al periodo de renovación esta semana.</div>
          </div>

          <button className="btn-primary" style={{ marginTop: "auto" }}>Atender Incidencias</button>
        </div>
      </div>
    </>
  );
}
