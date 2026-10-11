import { useState } from "react";
import "./AdminSocio.css";

interface Socio {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  plan: string;
  estado: "Activo" | "Vencido" | "Suspendido";
  sede: string;
  fechaVencimiento: string;
}

const INITIAL_SOCIOS: Socio[] = [
  {
    id: "SOC-101",
    nombre: "Mateo Silva",
    dni: "34.981.203",
    email: "mateo.silva@fitmail.com",
    plan: "Anual Black",
    estado: "Activo",
    sede: "Sede Las Condes",
    fechaVencimiento: "15 Dic 2026",
  },
  {
    id: "SOC-102",
    nombre: "Constanza Rivas",
    dni: "29.430.129",
    email: "constanza.rivas@gmail.com",
    plan: "Trimestral Fit",
    estado: "Activo",
    sede: "Sede Vitacura",
    fechaVencimiento: "24 Nov 2026",
  },
  {
    id: "SOC-103",
    nombre: "Juan Pablo Bravo",
    dni: "31.849.502",
    email: "jp.bravo@outlook.com",
    plan: "Mensual Pase",
    estado: "Vencido",
    sede: "Sede Providencia",
    fechaVencimiento: "08 Oct 2026",
  },
  {
    id: "SOC-104",
    nombre: "Francisca Soto",
    dni: "35.109.832",
    email: "fran.soto@empresa.com",
    plan: "Anual Black",
    estado: "Suspendido",
    sede: "Sede Las Condes",
    fechaVencimiento: "12 Ene 2027",
  },
  {
    id: "SOC-105",
    nombre: "Andrés Medina",
    dni: "30.402.184",
    email: "amedina@tech.cl",
    plan: "Mensual Pase",
    estado: "Activo",
    sede: "Sede Providencia",
    fechaVencimiento: "05 Nov 2026",
  },
  {
    id: "SOC-106",
    nombre: "Isabel Fuentes",
    dni: "28.591.032",
    email: "isabel.fuentes@studio.com",
    plan: "Trimestral Fit",
    estado: "Activo",
    sede: "Sede Palermo",
    fechaVencimiento: "20 Nov 2026",
  },
  {
    id: "SOC-107",
    nombre: "Lucas San Martín",
    dni: "33.712.940",
    email: "lsanmartin@fitzone.com",
    plan: "Anual Black",
    estado: "Activo",
    sede: "Sede Belgrano",
    fechaVencimiento: "10 Mar 2027",
  },
  {
    id: "SOC-108",
    nombre: "Valentina Rossi",
    dni: "27.604.119",
    email: "valen.rossi@gmail.com",
    plan: "Mensual Pase",
    estado: "Vencido",
    sede: "Sede Palermo",
    fechaVencimiento: "01 Oct 2026",
  },
  {
    id: "SOC-109",
    nombre: "Diego Fernández",
    dni: "36.882.104",
    email: "dfernandez@corp.com",
    plan: "Trimestral Fit",
    estado: "Activo",
    sede: "Sede Vitacura",
    fechaVencimiento: "18 Dic 2026",
  },
  {
    id: "SOC-110",
    nombre: "Camila Herrera",
    dni: "32.140.781",
    email: "camila.h@inbox.com",
    plan: "Anual Black",
    estado: "Suspendido",
    sede: "Sede Belgrano",
    fechaVencimiento: "30 Nov 2026",
  },
];

export default function AdminSocio() {
  const [socios, setSocios] = useState<Socio[]>(INITIAL_SOCIOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterPlan, setFilterPlan] = useState("Todos");
  const [filterSede, setFilterSede] = useState("Todas");

  // Estado del simulador de error visual
  const [simulatedError, setSimulatedError] = useState(false);

  // Modales
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);

  // Formulario nuevo socio
  const [newNombre, setNewNombre] = useState("");
  const [newDni, setNewDni] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("Anual Black");
  const [newSede, setNewSede] = useState("Sede Las Condes");

  const filteredSocios = socios.filter((s) => {
    const matchSearch =
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dni.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchEstado = filterEstado === "Todos" || s.estado === filterEstado;
    const matchPlan = filterPlan === "Todos" || s.plan === filterPlan;
    const matchSede = filterSede === "Todas" || s.sede === filterSede;

    return matchSearch && matchEstado && matchPlan && matchSede;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterEstado("Todos");
    setFilterPlan("Todos");
    setFilterSede("Todas");
  };

  const handleCreateSocio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre || !newDni || !newEmail) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    const newEntry: Socio = {
      id: `SOC-${socios.length + 101}`,
      nombre: newNombre,
      dni: newDni,
      email: newEmail,
      plan: newPlan,
      estado: "Activo",
      sede: newSede,
      fechaVencimiento: "15 Oct 2027",
    };
    setSocios([newEntry, ...socios]);
    setShowNewModal(false);
    setNewNombre("");
    setNewDni("");
    setNewEmail("");
  };

  const handleDeleteSocio = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de socio?")) {
      setSocios(socios.filter((s) => s.id !== id));
    }
  };

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Gestión de Socios</h1>
          <p>Administra las membresías, estados de cuenta y sedes de la comunidad FitZone</p>
        </div>
        <div className="header-controls">
          {/* Botón para simular estado de error visual */}
          <button
            className={`btn-secondary ${simulatedError ? "btn-active-error" : ""}`}
            style={{
              borderColor: simulatedError ? "var(--accent-red)" : "var(--border-color)",
              color: simulatedError ? "var(--accent-red)" : "var(--text-pure)",
            }}
            onClick={() => setSimulatedError(!simulatedError)}
            title="Simular fallo de conexión al cargar la lista de socios"
          >
            {simulatedError ? "⚠️ Error Simulado Activo" : "🧪 Simular Error"}
          </button>
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "14px" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Todas las Sedes (25)
          </button>
        </div>
      </header>

      {/* ESTADO DE ERROR */}
      {simulatedError ? (
        <div className="error-state-card">
          <div className="error-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "36px", height: "36px" }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>Error al cargar el catálogo de socios (HTTP 503)</h3>
          <p>
            No fue posible conectar con el servidor central de membresías. Revisa tu conexión a la red de la sede o intenta nuevamente.
          </p>
          <button className="btn-primary" onClick={() => setSimulatedError(false)}>
            Reintentar Conexión
          </button>
        </div>
      ) : (
        <>
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
                  placeholder="Buscar socio por nombre, DNI o email..."
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
                <option value="Activo">Solo Activos</option>
                <option value="Vencido">Solo Vencidos</option>
                <option value="Suspendido">Solo Suspendidos</option>
              </select>

              {/* Filtro Plan */}
              <select
                className="filter-select"
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
              >
                <option value="Todos">Plan: Todos</option>
                <option value="Anual Black">Anual Black</option>
                <option value="Trimestral Fit">Trimestral Fit</option>
                <option value="Mensual Pase">Mensual Pase</option>
              </select>

              {/* Filtro Sede */}
              <select
                className="filter-select"
                value={filterSede}
                onChange={(e) => setFilterSede(e.target.value)}
              >
                <option value="Todas">Sede: Todas</option>
                <option value="Sede Las Condes">Sede Las Condes</option>
                <option value="Sede Vitacura">Sede Vitacura</option>
                <option value="Sede Providencia">Sede Providencia</option>
                <option value="Sede Palermo">Sede Palermo</option>
                <option value="Sede Belgrano">Sede Belgrano</option>
              </select>
            </div>

            <button
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              onClick={() => setShowNewModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px" }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Registrar Nuevo Socio
            </button>
          </div>

          {/* TABLA O ESTADO VACÍO */}
          {filteredSocios.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ width: "42px", height: "42px" }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
              <h3>No se encontraron socios</h3>
              <p>
                No hay ningún socio registrado que coincida con los criterios de búsqueda aplicados ("{searchTerm || filterEstado || filterPlan || filterSede}").
              </p>
              <button className="btn-secondary" onClick={handleResetFilters}>
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre / Email</th>
                    <th>DNI</th>
                    <th>Plan</th>
                    <th>Estado</th>
                    <th>Sede Principal</th>
                    <th>Fecha Vencimiento</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSocios.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="user-name">{s.nombre}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.email}</div>
                      </td>
                      <td>{s.dni}</td>
                      <td>{s.plan}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            s.estado === "Activo"
                              ? "status-active"
                              : s.estado === "Vencido"
                              ? "status-warning"
                              : "status-inactive"
                          }`}
                        >
                          {s.estado}
                        </span>
                      </td>
                      <td>{s.sede}</td>
                      <td className={s.estado === "Vencido" ? "date-warning" : ""}>
                        {s.fechaVencimiento}
                      </td>
                      <td>
                        <div className="action-icons" style={{ justifyContent: "flex-end" }}>
                          <button
                            className="action-icon-btn"
                            title="Ver Ficha Completa"
                            onClick={() => setSelectedSocio(s)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button
                            className="action-icon-btn"
                            title="Editar Datos"
                            onClick={() => alert(`Editar información de ${s.nombre}`)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button
                            className="action-icon-btn action-icon-delete"
                            title="Eliminar Registro"
                            onClick={() => handleDeleteSocio(s.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINACIÓN */}
          <div className="pagination-area">
            <span className="pagination-info">
              Mostrando {filteredSocios.length} de {socios.length} socios registrados
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
        </>
      )}

      {/* MODAL NUEVO SOCIO */}
      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Nuevo Socio</h2>
              <button className="modal-close-btn" onClick={() => setShowNewModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSocio}>
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. Agustín Morán"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>DNI / Documento *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. 33.456.789"
                  value={newDni}
                  onChange={(e) => setNewDni(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="ej. agustin@correo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Plan de Membresía</label>
                <select
                  className="form-control"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                >
                  <option value="Anual Black">Anual Black (Acceso total)</option>
                  <option value="Trimestral Fit">Trimestral Fit</option>
                  <option value="Mensual Pase">Mensual Pase</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sede Principal Asignada</label>
                <select
                  className="form-control"
                  value={newSede}
                  onChange={(e) => setNewSede(e.target.value)}
                >
                  <option value="Sede Las Condes">Sede Las Condes</option>
                  <option value="Sede Vitacura">Sede Vitacura</option>
                  <option value="Sede Providencia">Sede Providencia</option>
                  <option value="Sede Palermo">Sede Palermo</option>
                  <option value="Sede Belgrano">Sede Belgrano</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowNewModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Socio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE SOCIO */}
      {selectedSocio && (
        <div className="modal-backdrop" onClick={() => setSelectedSocio(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle del Socio ({selectedSocio.id})</h2>
              <button className="modal-close-btn" onClick={() => setSelectedSocio(null)}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Nombre:</span>
                <strong>{selectedSocio.nombre}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>DNI:</span>
                <strong>{selectedSocio.dni}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Correo:</span>
                <span>{selectedSocio.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Plan:</span>
                <span style={{ color: "var(--accent-orange)", fontWeight: 700 }}>{selectedSocio.plan}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Sede:</span>
                <strong>{selectedSocio.sede}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Estado:</span>
                <span
                  className={`status-badge ${
                    selectedSocio.estado === "Activo"
                      ? "status-active"
                      : selectedSocio.estado === "Vencido"
                      ? "status-warning"
                      : "status-inactive"
                  }`}
                >
                  {selectedSocio.estado}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Vencimiento:</span>
                <strong>{selectedSocio.fechaVencimiento}</strong>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
              <button className="btn-secondary" onClick={() => setSelectedSocio(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

