import "./Socio.css";

export default function AdminSocio() {
  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Gestión de Socios</h1>
          <p>Administra las membresías, estados de cuenta y sedes de la comunidad FitZone</p>
        </div>
        <div className="header-controls">
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "14px" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Todas las Sedes (25)
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

      {/* BARRA DE ACCIONES Y FILTROS */}
      <div className="action-bar">
        <div className="action-group-left">
          {/* Buscador */}
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" className="search-input" placeholder="Buscar socio por nombre o DNI..." />
          </div>
          {/* Filtros */}
          <select className="filter-select">
            <option>Estado: Todos</option>
            <option>Activos</option>
            <option>Vencidos</option>
            <option>Suspendidos</option>
          </select>
          <select className="filter-select">
            <option>Plan: Anual</option>
            <option>Plan: Mensual</option>
            <option>Plan: Trimestral</option>
          </select>
        </div>

        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Nuevo Socio
        </button>
      </div>

      {/* TABLA DE SOCIOS */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Plan</th>
              <th>Estado</th>
              <th>Sede Principal</th>
              <th>Fecha Vencimiento</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="user-name">Mateo Silva</td>
              <td>34.981.203</td>
              <td>Anual Black</td>
              <td><span className="status-badge status-active">Activo</span></td>
              <td>Sede Las Condes</td>
              <td>15 Dic 2026</td>
              <td>
                <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button className="action-icon-btn action-icon-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="user-name">Constanza Rivas</td>
              <td>29.430.129</td>
              <td>Trimestral</td>
              <td><span className="status-badge status-active">Activo</span></td>
              <td>Sede Vitacura</td>
              <td>24 Nov 2026</td>
              <td>
                <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button className="action-icon-btn action-icon-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="user-name">Juan Pablo Bravo</td>
              <td>31.849.502</td>
              <td>Mensual Pase</td>
              <td><span className="status-badge status-warning">Vencido</span></td>
              <td>Sede Providencia</td>
              <td className="date-warning">08 Oct 2026</td>
              <td>
                <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button className="action-icon-btn action-icon-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="user-name">Francisca Soto</td>
              <td>35.109.832</td>
              <td>Anual Black</td>
              <td><span className="status-badge status-inactive">Suspendido</span></td>
              <td>Sede Las Condes</td>
              <td>12 Ene 2027</td>
              <td>
                <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button className="action-icon-btn action-icon-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="user-name">Andrés Medina</td>
              <td>30.402.184</td>
              <td>Mensual Pase</td>
              <td><span className="status-badge status-active">Activo</span></td>
              <td>Sede Lo Barnechea</td>
              <td>05 Nov 2026</td>
              <td>
                <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button className="action-icon-btn action-icon-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="user-name">Isabel Fuentes</td>
              <td>28.591.032</td>
              <td>Trimestral</td>
              <td><span className="status-badge status-active">Activo</span></td>
              <td>Sede Providencia</td>
              <td>20 Nov 2026</td>
              <td>
                <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  <button className="action-icon-btn action-icon-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="pagination-area">
        <span className="pagination-info">Mostrando 1-6 de 1,280 socios registrados</span>
        <div className="pagination-controls">
          <button className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}><polyline points="9 18 15 12 9 6"></polyline></svg></button>
        </div>
      </div>
    </>
  );
}
