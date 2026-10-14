import { useState } from "react";
import { INITIAL_INSTRUCTORES, type InstructorItem } from "../../data/catalogosData";
import "./AdminCatalogos.css";

export default function AdminInstructores() {
  const [instructores, setInstructores] = useState<InstructorItem[]>(INITIAL_INSTRUCTORES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSede, setFilterSede] = useState("Todas");
  const [filterEstado, setFilterEstado] = useState("Todos");

  // Modal para alta de instructor (estático)
  const [showModal, setShowModal] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newDni, setNewDni] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTelefono, setNewTelefono] = useState("");
  const [newEspecialidad, setNewEspecialidad] = useState("Spinning Pro");
  const [newSede, setNewSede] = useState("Paraná Centro");

  // Modal detalle
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorItem | null>(null);

  const filtered = instructores.filter((inst) => {
    const matchQuery =
      inst.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.dni.includes(searchQuery) ||
      inst.especialidades.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchSede = filterSede === "Todas" || inst.sedesAsignadas.includes(filterSede);
    const matchEstado = filterEstado === "Todos" || inst.estado === filterEstado;

    return matchQuery && matchSede && matchEstado;
  });

  const handleCreateInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim() || !newDni.trim()) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const nuevo: InstructorItem = {
      id: `INST-${instructores.length + 10}`,
      nombre: newNombre,
      dni: newDni,
      email: newEmail || `${newNombre.toLowerCase().replace(/\s+/g, "")}@fitzone.com.ar`,
      telefono: newTelefono || "+54 343 500-0000",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      especialidades: [newEspecialidad],
      sedesAsignadas: [newSede],
      estado: "Activo",
      clasesSemanales: 10,
      calificacion: 5.0,
    };

    setInstructores([nuevo, ...instructores]);
    setShowModal(false);
    setNewNombre("");
    setNewDni("");
    setNewEmail("");
    setNewTelefono("");
  };

  const handleToggleEstado = (id: string) => {
    setInstructores(
      instructores.map((inst) => {
        if (inst.id === id) {
          const next = inst.estado === "Activo" ? "Vacaciones" : "Activo";
          return { ...inst, estado: next };
        }
        return inst;
      })
    );
  };

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo C-04
            </span>
          </div>
          <h1>Catálogo de Instructores & Profesores</h1>
          <p>Gestión del staff deportivo y entrenadores asignados a las sedes de Entre Ríos</p>
        </div>
        <div className="header-controls">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Nuevo Instructor
          </button>
        </div>
      </header>

      {/* METRICAS DE STAFF */}
      <div className="sedes-metrics-grid">
        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Staff Activo</span>
            <span>🏋️</span>
          </div>
          <div className="sede-metric-val">{instructores.filter((i) => i.estado === "Activo").length}</div>
          <div className="sede-metric-sub">
            <span>{instructores.length} Profesores registrados</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Clases Semanales</span>
            <span>📅</span>
          </div>
          <div className="sede-metric-val">
            {instructores.reduce((acc, i) => acc + i.clasesSemanales, 0)}
          </div>
          <div className="sede-metric-sub">
            <span>Distribuidas en 25+ sedes</span>
          </div>
        </div>

        <div className="sede-metric-card">
          <div className="sede-metric-title">
            <span>Calificación Promedio</span>
            <span>⭐</span>
          </div>
          <div className="sede-metric-val">4.8 / 5.0</div>
          <div className="sede-metric-sub">
            <span>Opinión de socios en App móvil</span>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="action-bar">
        <div className="action-group-left">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar profesor por nombre, DNI o disciplina..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select className="filter-select" value={filterSede} onChange={(e) => setFilterSede(e.target.value)}>
            <option value="Todas">Todas las Sedes</option>
            <option value="Paraná Centro">Paraná Centro</option>
            <option value="Concordia Costanera">Concordia Costanera</option>
            <option value="Gualeguaychú Parque">Gualeguaychú Parque</option>
            <option value="Concepción del Uruguay">Concepción del Uruguay</option>
            <option value="Colón Río">Colón Río</option>
          </select>

          <select className="filter-select" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Vacaciones">Vacaciones</option>
            <option value="Licencia">Licencia</option>
          </select>
        </div>
      </div>

      {/* GRILLA DE INSTRUCTORES */}
      <div className="catalog-grid">
        {filtered.map((inst) => {
          const badgeClass =
            inst.estado === "Activo"
              ? "badge-active"
              : inst.estado === "Vacaciones"
              ? "badge-warning"
              : "badge-suspended";

          return (
            <div key={inst.id} className="catalog-card">
              <div>
                <div className="catalog-card-header">
                  <div className="instructor-header-box">
                    <img src={inst.avatar} alt={inst.nombre} className="instructor-avatar-img" />
                    <div>
                      <h3 className="catalog-title">{inst.nombre}</h3>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>DNI: {inst.dni}</div>
                    </div>
                  </div>
                  <span className={`badge ${badgeClass}`}>{inst.estado}</span>
                </div>

                <div style={{ margin: "1rem 0" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Especialidades & Disciplinas:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {inst.especialidades.map((esp, idx) => (
                      <span key={idx} className="sede-service-chip" style={{ color: "var(--accent-orange)" }}>
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                  <strong>Sedes:</strong> {inst.sedesAsignadas.join(" • ")}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>
                    📅 {inst.clasesSemanales} clases / sem.
                  </span>
                  <span className="rating-badge">★ {inst.calificacion.toFixed(1)}</span>
                </div>
              </div>

              <div className="catalog-card-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: "0.8rem" }}
                  onClick={() => setSelectedInstructor(inst)}
                >
                  Ver Ficha
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => handleToggleEstado(inst.id)}
                  title="Cambiar estado"
                >
                  {inst.estado === "Activo" ? "Pausar" : "Activar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALLE DE INSTRUCTOR */}
      {selectedInstructor && (
        <div className="sede-modal-overlay" onClick={() => setSelectedInstructor(null)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Ficha del Instructor: {selectedInstructor.nombre}</h3>
              <button className="sede-modal-close" onClick={() => setSelectedInstructor(null)}>
                ✕
              </button>
            </div>
            <div className="sede-modal-body">
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img
                  src={selectedInstructor.avatar}
                  alt={selectedInstructor.nombre}
                  style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{selectedInstructor.nombre}</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    DNI: {selectedInstructor.dni} • Estado: {selectedInstructor.estado}
                  </p>
                  <p style={{ color: "var(--accent-orange)", fontSize: "0.85rem", fontWeight: 600 }}>
                    Calificación promedio: ★ {selectedInstructor.calificacion} / 5.0
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email</span>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{selectedInstructor.email}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Teléfono</span>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{selectedInstructor.telefono}</p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Sedes donde dicta clases:
                </span>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{selectedInstructor.sedesAsignadas.join(", ")}</p>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Carga horaria semanal:
                </span>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {selectedInstructor.clasesSemanales} clases grupales programadas (aprox. {selectedInstructor.clasesSemanales * 1.5} horas de dictado)
                </p>
              </div>
            </div>
            <div className="sede-modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedInstructor(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO INSTRUCTOR */}
      {showModal && (
        <div className="sede-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sede-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sede-modal-header">
              <h3 className="sede-modal-title">Registrar Nuevo Instructor (C-04)</h3>
              <button className="sede-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateInstructor}>
              <div className="sede-modal-body">
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: "100%", paddingLeft: "1rem" }}
                    placeholder="Ej. Lucas Alarcón"
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      DNI *
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      placeholder="32.145.890"
                      value={newDni}
                      onChange={(e) => setNewDni(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: "100%", paddingLeft: "1rem" }}
                      placeholder="+54 343 411-2233"
                      value={newTelefono}
                      onChange={(e) => setNewTelefono(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Especialidad Principal
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: "100%" }}
                      value={newEspecialidad}
                      onChange={(e) => setNewEspecialidad(e.target.value)}
                    >
                      <option value="Spinning Pro">Spinning Pro</option>
                      <option value="CrossFit Box">CrossFit Box</option>
                      <option value="Power Yoga">Power Yoga</option>
                      <option value="Pilates Reformer">Pilates Reformer</option>
                      <option value="Box Fit">Box Fit</option>
                      <option value="Funcional Circuit">Funcional Circuit</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Sede de Asignación Inicial
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: "100%" }}
                      value={newSede}
                      onChange={(e) => setNewSede(e.target.value)}
                    >
                      <option value="Paraná Centro">Paraná Centro</option>
                      <option value="Concordia Costanera">Concordia Costanera</option>
                      <option value="Gualeguaychú Parque">Gualeguaychú Parque</option>
                      <option value="Concepción del Uruguay">Concepción del Uruguay</option>
                      <option value="Colón Río">Colón Río</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sede-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
