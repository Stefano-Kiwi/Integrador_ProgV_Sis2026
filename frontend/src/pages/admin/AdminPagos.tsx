import "./AdminPagos.css";

export default function AdminPagos() {
  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Listado de Pagos</h1>
          <p>Historial de transacciones, cobros de membresías y emisión de comprobantes</p>
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
            Octubre 2026
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
            <input type="text" className="search-input" placeholder="Buscar por socio o N° comprobante..." />
          </div>
          {/* Filtros */}
          <select className="filter-select">
            <option>Estado: Todos</option>
            <option>Aprobado</option>
            <option>Pendiente</option>
            <option>Rechazado</option>
          </select>
          <select className="filter-select">
            <option>Concepto: Todos</option>
            <option>Membresía</option>
            <option>Alquiler Cancha</option>
          </select>
        </div>
        
        {/* Simulador de Pasarela Manual */}
        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Pago Manual
        </button>
      </div>

      {/* TABLA DE PAGOS */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Transacción</th>
              <th>Socio / Cliente</th>
              <th>Concepto</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila 1 */}
            <tr>
              <td className="transaction-id">#TRX-8924</td>
              <td className="user-name">Mateo Silva</td>
              <td className="concept-text">Membresía Anual Black</td>
              <td>14 Oct, 09:15</td>
              <td className="amount-val">$180,000</td>
              <td><span className="status-badge status-active">Aprobado</span></td>
              <td>
                <div className="action-icons">
                  <button className="action-icon-btn" title="Ver Detalle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn" title="Descargar Factura PDF"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                </div>
              </td>
            </tr>
            {/* Fila 2 */}
            <tr>
              <td className="transaction-id">#TRX-8923</td>
              <td className="user-name">Isabel Fuentes</td>
              <td className="concept-text">Reserva Pádel (Desc. Socio)</td>
              <td>13 Oct, 18:30</td>
              <td className="amount-val">$10,200</td>
              <td><span className="status-badge status-active">Aprobado</span></td>
              <td>
                <div className="action-icons">
                  <button className="action-icon-btn" title="Ver Detalle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn" title="Descargar Factura PDF"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                </div>
              </td>
            </tr>
            {/* Fila 3 */}
            <tr>
              <td className="transaction-id">#TRX-8922</td>
              <td className="user-name">Juan Pablo Bravo</td>
              <td className="concept-text">Renovación Mensual Pase</td>
              <td>13 Oct, 10:05</td>
              <td className="amount-val">$28,500</td>
              <td><span className="status-badge status-warning">Pendiente</span></td>
              <td>
                <div className="action-icons">
                  <button className="action-icon-btn" title="Ver Detalle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn" style={{ opacity: 0.3, cursor: "not-allowed" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                </div>
              </td>
            </tr>
            {/* Fila 4 */}
            <tr>
              <td className="transaction-id">#TRX-8921</td>
              <td className="user-name">Roberto Gómez <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "var(--text-muted)" }}>(Externo)</span></td>
              <td className="concept-text">Reserva Fútbol 5 (Hora Pico)</td>
              <td>12 Oct, 19:00</td>
              <td className="amount-val">$25,000</td>
              <td><span className="status-badge status-active">Aprobado</span></td>
              <td>
                <div className="action-icons">
                  <button className="action-icon-btn" title="Ver Detalle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn" title="Descargar Factura PDF"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                </div>
              </td>
            </tr>
            {/* Fila 5 */}
            <tr>
              <td className="transaction-id">#TRX-8920</td>
              <td className="user-name">Francisca Soto</td>
              <td className="concept-text">Membresía Anual Black</td>
              <td>12 Oct, 08:45</td>
              <td className="amount-val">$180,000</td>
              <td><span className="status-badge status-inactive">Rechazado</span></td>
              <td>
                <div className="action-icons">
                  <button className="action-icon-btn" title="Ver Detalle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                  <button className="action-icon-btn" style={{ opacity: 0.3, cursor: "not-allowed" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="pagination-area">
        <span className="pagination-info">Mostrando 1-5 de 842 transacciones</span>
        <div className="pagination-controls">
          <button className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">...</button>
          <button className="page-btn">169</button>
          <button className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}><polyline points="9 18 15 12 9 6"></polyline></svg></button>
        </div>
      </div>
    </>
  );
}
