import { useState } from "react";
import "./AdminPagos.css";

interface Transaction {
  id: string;
  socio: string;
  dni: string;
  concepto: string;
  fecha: string;
  monto: number;
  medioPago: "Tarjeta de Crédito" | "Débito" | "MercadoPago" | "Transferencia" | "Efectivo";
  estado: "Aprobado" | "Pendiente" | "Rechazado";
  comprobanteNro: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "#TRX-8924",
    socio: "Mateo Silva",
    dni: "34.981.203",
    concepto: "Membresía Anual Black",
    fecha: "14 Oct, 09:15",
    monto: 180000,
    medioPago: "Tarjeta de Crédito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018924",
  },
  {
    id: "#TRX-8923",
    socio: "Isabel Fuentes",
    dni: "28.591.032",
    concepto: "Reserva Pádel (Desc. Socio)",
    fecha: "13 Oct, 18:30",
    monto: 10200,
    medioPago: "MercadoPago",
    estado: "Aprobado",
    comprobanteNro: "0004-00018923",
  },
  {
    id: "#TRX-8922",
    socio: "Juan Pablo Bravo",
    dni: "31.849.502",
    concepto: "Renovación Mensual Pase",
    fecha: "13 Oct, 10:05",
    monto: 28500,
    medioPago: "Transferencia",
    estado: "Pendiente",
    comprobanteNro: "0004-00018922",
  },
  {
    id: "#TRX-8921",
    socio: "Roberto Gómez (Externo)",
    dni: "38.291.402",
    concepto: "Reserva Fútbol 5 (Hora Pico)",
    fecha: "12 Oct, 19:00",
    monto: 25000,
    medioPago: "Débito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018921",
  },
  {
    id: "#TRX-8920",
    socio: "Francisca Soto",
    dni: "35.109.832",
    concepto: "Membresía Anual Black",
    fecha: "12 Oct, 08:45",
    monto: 180000,
    medioPago: "Tarjeta de Crédito",
    estado: "Rechazado",
    comprobanteNro: "0004-00018920",
  },
  {
    id: "#TRX-8919",
    socio: "Constanza Rivas",
    dni: "29.430.129",
    concepto: "Membresía Trimestral Fit",
    fecha: "11 Oct, 16:20",
    monto: 75000,
    medioPago: "MercadoPago",
    estado: "Aprobado",
    comprobanteNro: "0004-00018919",
  },
  {
    id: "#TRX-8918",
    socio: "Andrés Medina",
    dni: "30.402.184",
    concepto: "Alquiler Cancha Pádel 3",
    fecha: "11 Oct, 11:00",
    monto: 12000,
    medioPago: "Efectivo",
    estado: "Aprobado",
    comprobanteNro: "0004-00018918",
  },
  {
    id: "#TRX-8917",
    socio: "Diego Fernández",
    dni: "36.882.104",
    concepto: "Pase Diario Entrenamiento",
    fecha: "10 Oct, 14:15",
    monto: 6500,
    medioPago: "Débito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018917",
  },
  {
    id: "#TRX-8916",
    socio: "Valentina Rossi",
    dni: "27.604.119",
    concepto: "Renovación Mensual Pase",
    fecha: "10 Oct, 09:30",
    monto: 28500,
    medioPago: "Transferencia",
    estado: "Rechazado",
    comprobanteNro: "0004-00018916",
  },
  {
    id: "#TRX-8915",
    socio: "Lucas San Martín",
    dni: "33.712.940",
    concepto: "Membresía Anual Black",
    fecha: "09 Oct, 17:40",
    monto: 180000,
    medioPago: "Tarjeta de Crédito",
    estado: "Aprobado",
    comprobanteNro: "0004-00018915",
  },
];

export default function AdminPagos() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterConcepto, setFilterConcepto] = useState("Todos");
  const [filterMedio, setFilterMedio] = useState("Todos");

  // Modal Comprobante Fiscal
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);

  // Modal Pago Manual
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualSocio, setManualSocio] = useState("");
  const [manualDni, setManualDni] = useState("");
  const [manualConcepto, setManualConcepto] = useState("Renovación Membresía Mensual");
  const [manualMonto, setManualMonto] = useState("28500");
  const [manualMedio, setManualMedio] = useState<Transaction["medioPago"]>("Efectivo");

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.socio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dni.includes(searchTerm);

    const matchEstado = filterEstado === "Todos" || t.estado === filterEstado;
    const matchConcepto =
      filterConcepto === "Todos"
        ? true
        : filterConcepto === "Membresía"
        ? t.concepto.includes("Membresía") || t.concepto.includes("Mensual")
        : filterConcepto === "Cancha"
        ? t.concepto.includes("Pádel") || t.concepto.includes("Fútbol")
        : t.concepto.includes("Pase");

    const matchMedio = filterMedio === "Todos" || t.medioPago === filterMedio;

    return matchSearch && matchEstado && matchConcepto && matchMedio;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSocio || !manualDni) return;

    const newTx: Transaction = {
      id: `#TRX-${transactions.length + 8925}`,
      socio: manualSocio,
      dni: manualDni,
      concepto: manualConcepto,
      fecha: "Hoy, recién",
      monto: Number(manualMonto) || 0,
      medioPago: manualMedio,
      estado: "Aprobado",
      comprobanteNro: `0004-000${transactions.length + 18925}`,
    };

    setTransactions([newTx, ...transactions]);
    setShowManualModal(false);
    setManualSocio("");
    setManualDni("");
  };

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Listado de Pagos & Comprobantes</h1>
          <p>Historial de transacciones, caja en mostrador y emisión fiscal electrónica AFIP</p>
        </div>
        <div className="header-controls">
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "14px" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Sede Las Condes
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
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por socio, DNI o TRX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro Estado */}
          <select
            className="filter-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="Todos">Estado: Todos</option>
            <option value="Aprobado">Solo Aprobados</option>
            <option value="Pendiente">Solo Pendientes</option>
            <option value="Rechazado">Solo Rechazados</option>
          </select>

          {/* Filtro Concepto */}
          <select
            className="filter-select"
            value={filterConcepto}
            onChange={(e) => setFilterConcepto(e.target.value)}
          >
            <option value="Todos">Concepto: Todos</option>
            <option value="Membresía">Membresías</option>
            <option value="Cancha">Alquiler de Canchas</option>
            <option value="Pase">Pases Diarios</option>
          </select>

          {/* Filtro Medio de Pago */}
          <select
            className="filter-select"
            value={filterMedio}
            onChange={(e) => setFilterMedio(e.target.value)}
          >
            <option value="Todos">Medio: Todos</option>
            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            <option value="Débito">Débito</option>
            <option value="MercadoPago">MercadoPago</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>

        {/* Botón Cobro Manual */}
        <button
          className="btn-primary btn-pago-manual"
          onClick={() => setShowManualModal(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px", height: "16px" }}>
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
              <th>Medio de Pago</th>
              <th>Monto</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Comprobante Fiscal</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="transaction-id">{tx.id}</td>
                <td>
                  <div className="user-name">{tx.socio}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>DNI: {tx.dni}</div>
                </td>
                <td className="concept-text">{tx.concepto}</td>
                <td>{tx.fecha}</td>
                <td style={{ fontSize: "0.85rem" }}>{tx.medioPago}</td>
                <td className="amount-val">${tx.monto.toLocaleString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      tx.estado === "Aprobado"
                        ? "status-active"
                        : tx.estado === "Pendiente"
                        ? "status-warning"
                        : "status-inactive"
                    }`}
                  >
                    {tx.estado}
                  </span>
                </td>
                <td>
                  <div className="action-icons">
                    <button
                      className="action-icon-btn"
                      title="Ver Factura Electrónica B"
                      onClick={() => setSelectedInvoice(tx)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span style={{ fontSize: "0.75rem", marginLeft: "0.3rem" }}>Ver Factura</span>
                    </button>
                    <button
                      className="action-icon-btn"
                      title="Descargar PDF"
                      onClick={() => alert(`Descargando comprobante fiscal ${tx.comprobanteNro} en formato PDF...`)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="pagination-area">
        <span className="pagination-info">
          Mostrando {filteredTransactions.length} de {transactions.length} transacciones
        </span>
        <div className="pagination-controls">
          <button className="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px" }}>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* MODAL COMPROBANTE FISCAL ELECTRÓNICO */}
      {selectedInvoice && (
        <div className="modal-backdrop" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-card fiscal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="fiscal-letter-badge">B</span>
                <div>
                  <h2 style={{ fontSize: "1.1rem" }}>FACTURA ELECTRÓNICA</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    N° {selectedInvoice.comprobanteNro}
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedInvoice(null)}>✕</button>
            </div>

            {/* Encabezado Fiscal */}
            <div className="fiscal-meta-grid">
              <div>
                <strong>FITZONE SPORTS S.A.</strong>
                <p>CUIT: 30-71649281-9</p>
                <p>Ingresos Brutos: 901-209841-2</p>
                <p>Domicilio: Av. Las Condes 12400</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p><strong>Fecha Emisión:</strong> {selectedInvoice.fecha}</p>
                <p><strong>Punto de Venta:</strong> 0004</p>
                <p><strong>Condición IVA:</strong> Resp. Inscripto</p>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="fiscal-client-box">
              <div><span>Cliente:</span> <strong>{selectedInvoice.socio}</strong></div>
              <div><span>DNI / CUIT:</span> <strong>{selectedInvoice.dni}</strong></div>
              <div><span>Condición:</span> Consumidor Final</div>
              <div><span>Medio de Pago:</span> {selectedInvoice.medioPago}</div>
            </div>

            {/* Tabla de Conceptos */}
            <table className="fiscal-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th style={{ textAlign: "center" }}>Cant</th>
                  <th style={{ textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedInvoice.concepto}</td>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td style={{ textAlign: "right" }}>${selectedInvoice.monto.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Totales */}
            <div className="fiscal-totals-box">
              <div className="fiscal-total-row">
                <span>Subtotal Gravado (Neto):</span>
                <span>${Math.round(selectedInvoice.monto / 1.21).toLocaleString()}</span>
              </div>
              <div className="fiscal-total-row">
                <span>IVA 21.00%:</span>
                <span>${Math.round(selectedInvoice.monto - selectedInvoice.monto / 1.21).toLocaleString()}</span>
              </div>
              <div className="fiscal-total-row grand-total">
                <strong>TOTAL FACTURADO:</strong>
                <strong>${selectedInvoice.monto.toLocaleString()}</strong>
              </div>
            </div>

            {/* Bloque CAE & QR Fiscal */}
            <div className="cae-footer">
              <div className="cae-info">
                <div><strong>CAE N°:</strong> 74102938475612</div>
                <div><strong>Fecha Vto. CAE:</strong> 24/10/2026</div>
                <div style={{ fontSize: "0.7rem", color: "var(--accent-green)", marginTop: "0.25rem" }}>
                  ✓ Comprobante Autorizado por AFIP
                </div>
              </div>
              <div className="cae-qr">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=AFIP-CAE-74102938475612"
                  alt="QR Fiscal"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Cerrar
              </button>
              <button
                className="btn-primary"
                onClick={() => alert(`Imprimiendo comprobante fiscal ${selectedInvoice.comprobanteNro}...`)}
              >
                Imprimir / Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COBRO MANUAL */}
      {showManualModal && (
        <div className="modal-backdrop" onClick={() => setShowManualModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Pago Manual en Mostrador</h2>
              <button className="modal-close-btn" onClick={() => setShowManualModal(false)}>✕</button>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="form-group">
                <label>Nombre del Socio / Cliente *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. Agustín Morán"
                  value={manualSocio}
                  onChange={(e) => setManualSocio(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>DNI del Titular *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. 33.456.789"
                  value={manualDni}
                  onChange={(e) => setManualDni(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Concepto a Cobrar</label>
                <select
                  className="form-control"
                  value={manualConcepto}
                  onChange={(e) => setManualConcepto(e.target.value)}
                >
                  <option value="Renovación Membresía Mensual">Renovación Membresía Mensual ($28,500)</option>
                  <option value="Pago Membresía Anual Black">Pago Membresía Anual Black ($180,000)</option>
                  <option value="Alquiler Cancha Pádel 1">Alquiler Cancha Pádel 1 ($12,000)</option>
                  <option value="Pase Diario Fitness">Pase Diario Fitness ($6,500)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monto a Percibir ($ CLP/ARS) *</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={manualMonto}
                  onChange={(e) => setManualMonto(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Medio de Cobro</label>
                <select
                  className="form-control"
                  value={manualMedio}
                  onChange={(e) => setManualMedio(e.target.value as any)}
                >
                  <option value="Efectivo">Efectivo en Caja</option>
                  <option value="Tarjeta de Crédito">Terminal POS (Crédito)</option>
                  <option value="Débito">Terminal POS (Débito)</option>
                  <option value="MercadoPago">QR MercadoPago</option>
                  <option value="Transferencia">Transferencia Verificada</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowManualModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Procesar Cobro y Emitir Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

