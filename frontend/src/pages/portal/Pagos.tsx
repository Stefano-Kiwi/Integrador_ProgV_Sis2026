export default function Pagos() {
  return (
    <div className="profile-page-wrapper">
      <main className="profile-container">
        {/* Encabezado de la Sección */}
        <header className="profile-page-header">
          <h1 className="profile-page-title">PAGOS</h1>
          <p className="profile-page-subtitle">Listado de pagos y comprobantes</p>
        </header>

        {/* 1. Sección de Filtros de Búsqueda */}
        <section
          className="payments-filters-card"
          aria-labelledby="filtros-title"
        >
          <div className="card-title-group">
            <div className="card-title-left">
              <svg
                className="card-title-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <h2 id="filtros-title">FILTROS DE BÚSQUEDA</h2>
            </div>
            <span className="card-title-badge">Criterios</span>
          </div>

          {/* Grilla de Campos de Filtros */}
          <div className="payments-filter-grid">
            {/* Buscar socio */}
            <div className="filter-field-group">
              <label className="data-label" htmlFor="filter-socio">
                Buscar socio
              </label>
              <input
                type="text"
                id="filter-socio"
                className="filter-input-styled"
                placeholder="Nombre o apellido..."
              />
            </div>

            {/* DNI */}
            <div className="filter-field-group">
              <label className="data-label" htmlFor="filter-dni">
                DNI
              </label>
              <input
                type="text"
                id="filter-dni"
                className="filter-input-styled"
                placeholder="Ej: 32456789"
              />
            </div>

            {/* Estado */}
            <div className="filter-field-group">
              <label className="data-label" htmlFor="filter-estado">
                Estado
              </label>
              <select id="filter-estado" className="filter-select-styled">
                <option value="">Todos</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="anulado">Anulado</option>
              </select>
            </div>

            {/* Método de pago */}
            <div className="filter-field-group">
              <label className="data-label" htmlFor="filter-metodo">
                Método de pago
              </label>
              <select id="filter-metodo" className="filter-select-styled">
                <option value="">Todos</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
            </div>

            {/* Desde */}
            <div className="filter-field-group">
              <label className="data-label" htmlFor="filter-desde">
                Desde
              </label>
              <input
                type="date"
                id="filter-desde"
                className="filter-input-styled"
              />
            </div>

            {/* Hasta */}
            <div className="filter-field-group">
              <label className="data-label" htmlFor="filter-hasta">
                Hasta
              </label>
              <input
                type="date"
                id="filter-hasta"
                className="filter-input-styled"
              />
            </div>
          </div>

          {/* Fila de Botones Visuales */}
          <div className="filter-actions-row">
            <button type="button" className="btn-filter-clear">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="16"
                height="16"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Limpiar</span>
            </button>
            <button type="button" className="btn-filter-search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                width="16"
                height="16"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Buscar</span>
            </button>
          </div>
        </section>

        {/* 2. Sección de Listado de Pagos (Tabla) */}
        <section
          className="payments-table-card"
          aria-labelledby="listado-pagos-title"
        >
          <div className="card-title-group">
            <div className="card-title-left">
              <svg
                className="card-title-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <h2 id="listado-pagos-title">HISTORIAL DE TRANSACCIONES</h2>
            </div>
            <span className="card-title-badge">6 Registros</span>
          </div>

          {/* Contenedor Responsive de la Tabla */}
          <div className="table-responsive-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>N° Pago</th>
                  <th>Socio</th>
                  <th>DNI</th>
                  <th>Concepto</th>
                  <th className="text-right">Importe</th>
                  <th>Método de pago</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {/* Fila 1 */}
                <tr>
                  <td className="pay-date">25/09/2026</td>
                  <td>
                    <span className="pay-id">#000125</span>
                  </td>
                  <td className="pay-member">Juan Pérez</td>
                  <td className="pay-dni">32.456.789</td>
                  <td className="pay-concept">Cuota mensual</td>
                  <td className="pay-amount text-right">$25.000</td>
                  <td>
                    <span className="pay-method">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="17 1 21 5 17 9" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <polyline points="7 23 3 19 7 15" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                      </svg>
                      Transferencia
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge-status paid">Pagado</span>
                  </td>
                  <td className="text-center">
                    <div
                      className="receipt-actions-group"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        type="button"
                        className="btn-receipt-view"
                        title="Ver comprobante de Juan Pérez"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ver comprobante</span>
                      </button>
                      <button
                        type="button"
                        className="btn-receipt-generate"
                        title="Generar comprobante nuevo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Generar comprobante</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila 2 */}
                <tr>
                  <td className="pay-date">24/09/2026</td>
                  <td>
                    <span className="pay-id">#000124</span>
                  </td>
                  <td className="pay-member">María González</td>
                  <td className="pay-dni">28.654.321</td>
                  <td className="pay-concept">Cuota mensual</td>
                  <td className="pay-amount text-right">$25.000</td>
                  <td>
                    <span className="pay-method">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                      Efectivo
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge-status paid">Pagado</span>
                  </td>
                  <td className="text-center">
                    <div
                      className="receipt-actions-group"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        type="button"
                        className="btn-receipt-view"
                        title="Ver comprobante de María González"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ver comprobante</span>
                      </button>
                      <button
                        type="button"
                        className="btn-receipt-generate"
                        title="Generar comprobante nuevo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Generar comprobante</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila 3 */}
                <tr>
                  <td className="pay-date">23/09/2026</td>
                  <td>
                    <span className="pay-id">#000123</span>
                  </td>
                  <td className="pay-member">Lucas Rodríguez</td>
                  <td className="pay-dni">35.123.456</td>
                  <td className="pay-concept">Inscripción</td>
                  <td className="pay-amount text-right">$18.000</td>
                  <td>
                    <span className="pay-method">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      Tarjeta
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge-status pending">Pendiente</span>
                  </td>
                  <td className="text-center">
                    <div
                      className="receipt-actions-group"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        type="button"
                        className="btn-receipt-view"
                        title="Ver comprobante de Lucas Rodríguez"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ver comprobante</span>
                      </button>
                      <button
                        type="button"
                        className="btn-receipt-generate"
                        title="Generar comprobante nuevo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Generar comprobante</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila 4 */}
                <tr>
                  <td className="pay-date">22/09/2026</td>
                  <td>
                    <span className="pay-id">#000122</span>
                  </td>
                  <td className="pay-member">Sofía Martínez</td>
                  <td className="pay-dni">38.765.432</td>
                  <td className="pay-concept">Turno Cancha Pádel</td>
                  <td className="pay-amount text-right">$18.500</td>
                  <td>
                    <span className="pay-method">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      Mercado Pago
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge-status cancelled">Anulado</span>
                  </td>
                  <td className="text-center">
                    <div
                      className="receipt-actions-group"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        type="button"
                        className="btn-receipt-view"
                        title="Ver comprobante de Sofía Martínez"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ver comprobante</span>
                      </button>
                      <button
                        type="button"
                        className="btn-receipt-generate"
                        title="Generar comprobante nuevo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Generar comprobante</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila 5 */}
                <tr>
                  <td className="pay-date">21/09/2026</td>
                  <td>
                    <span className="pay-id">#000121</span>
                  </td>
                  <td className="pay-member">Carlos Gómez</td>
                  <td className="pay-dni">30.112.334</td>
                  <td className="pay-concept">Cuota mensual</td>
                  <td className="pay-amount text-right">$25.000</td>
                  <td>
                    <span className="pay-method">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                      Efectivo
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge-status paid">Pagado</span>
                  </td>
                  <td className="text-center">
                    <div
                      className="receipt-actions-group"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        type="button"
                        className="btn-receipt-view"
                        title="Ver comprobante de Carlos Gómez"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ver comprobante</span>
                      </button>
                      <button
                        type="button"
                        className="btn-receipt-generate"
                        title="Generar comprobante nuevo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Generar comprobante</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila 6 */}
                <tr>
                  <td className="pay-date">20/09/2026</td>
                  <td>
                    <span className="pay-id">#000120</span>
                  </td>
                  <td className="pay-member">Valentina Díaz</td>
                  <td className="pay-dni">41.223.556</td>
                  <td className="pay-concept">Pase Libre Clases</td>
                  <td className="pay-amount text-right">$22.000</td>
                  <td>
                    <span className="pay-method">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      Mercado Pago
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge-status paid">Pagado</span>
                  </td>
                  <td className="text-center">
                    <div
                      className="receipt-actions-group"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        type="button"
                        className="btn-receipt-view"
                        title="Ver comprobante de Valentina Díaz"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ver comprobante</span>
                      </button>
                      <button
                        type="button"
                        className="btn-receipt-generate"
                        title="Generar comprobante nuevo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="14"
                          height="14"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Generar comprobante</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Sección de Maqueta Visual de Comprobante de Pago */}
        <section
          className="receipt-section-wrapper"
          aria-labelledby="comprobante-heading"
        >
          <article className="receipt-preview-card">
            {/* Encabezado del Comprobante */}
            <div className="receipt-header">
              <div className="receipt-brand-box">
                <div className="receipt-brand-title">
                  <svg
                    className="brand-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
                  </svg>
                  <span>
                    EL TREMENDO <span className="highlight">GYM</span>
                  </span>
                </div>
                <span className="receipt-brand-sub">
                  Sistema de Gestión y Cobranzas
                </span>
              </div>

              <div className="receipt-title-box">
                <h2 className="receipt-doc-title" id="comprobante-heading">
                  COMPROBANTE DE PAGO
                </h2>
                <div className="receipt-doc-num">N° COMPROBANTE: #000125</div>
              </div>
            </div>

            {/* Datos Principales del Comprobante */}
            <div className="receipt-grid-details">
              {/* Fecha */}
              <div className="receipt-detail-item">
                <span className="receipt-detail-label">Fecha</span>
                <div className="receipt-detail-val">25/09/2026 — 18:42 hs</div>
              </div>

              {/* Estado */}
              <div className="receipt-detail-item">
                <span className="receipt-detail-label">Estado</span>
                <div className="receipt-detail-val">
                  <span className="badge-status paid">● PAGADO</span>
                </div>
              </div>

              {/* Socio */}
              <div className="receipt-detail-item">
                <span className="receipt-detail-label">Socio</span>
                <div className="receipt-detail-val">Juan Pérez</div>
              </div>

              {/* DNI */}
              <div className="receipt-detail-item">
                <span className="receipt-detail-label">DNI</span>
                <div
                  className="receipt-detail-val"
                  style={{ fontFamily: "monospace" }}
                >
                  32.456.789
                </div>
              </div>

              {/* Concepto */}
              <div className="receipt-detail-item">
                <span className="receipt-detail-label">Concepto</span>
                <div className="receipt-detail-val">
                  Cuota mensual (Plan Full Musculación & Clases)
                </div>
              </div>

              {/* Método de pago */}
              <div className="receipt-detail-item">
                <span className="receipt-detail-label">Método de pago</span>
                <div className="receipt-detail-val">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="16"
                    height="16"
                    style={{ color: "var(--accent-neon)" }}
                  >
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  Transferencia Bancaria
                </div>
              </div>
            </div>

            {/* Destacado de Importe */}
            <div className="receipt-highlight-box">
              <span className="receipt-total-label">Importe Total Abonado</span>
              <span className="receipt-total-val">$25.000</span>
            </div>

            {/* Pie de Acciones del Comprobante */}
            <div className="receipt-actions-footer">
              <button type="button" className="btn-receipt-close">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>Cerrar</span>
              </button>
              <button type="button" className="btn-receipt-print">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Imprimir comprobante</span>
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
