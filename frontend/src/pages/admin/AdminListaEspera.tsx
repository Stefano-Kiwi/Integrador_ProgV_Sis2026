import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getWaitlist,
  promoteWaitlistMember,
  notifyWaitlistMember,
  cancelWaitlistMember,
  type WaitlistEntry,
} from "../../data/clasesCanchasData";
import { getSedes } from "../../data/sedesData";
import "./AdminFase4.css";
import "../../admin.css";

export default function AdminListaEspera() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => getWaitlist());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSede, setFilterSede] = useState("Todas");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterDisciplina, setFilterDisciplina] = useState("Todas");

  // Modal de notificación WhatsApp / Notificación Push
  const [selectedNotification, setSelectedNotification] = useState<WaitlistEntry | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  const sedes = getSedes();

  // Filtrado
  const filteredWaitlist = waitlist.filter((w) => {
    const matchSearch =
      w.socioNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.socioDni.includes(searchQuery) ||
      w.claseNombre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSede = filterSede === "Todas" || w.sedeId === filterSede;
    const matchEstado = filterEstado === "Todos" || w.estado === filterEstado;
    const matchDiscipline =
      filterDisciplina === "Todas" || w.disciplina.toLowerCase().includes(filterDisciplina.toLowerCase());

    return matchSearch && matchSede && matchEstado && matchDiscipline;
  });

  // Métricas
  const totalEnEspera = waitlist.filter((w) => w.estado === "En Espera").length;
  const totalPromovidos = waitlist.filter((w) => w.estado === "Promovido").length;
  const clasesConEspera = new Set(waitlist.filter((w) => w.estado === "En Espera").map((w) => w.claseId)).size;
  const promedioEspera = Math.round(
    waitlist.reduce((acc, curr) => acc + curr.tiempoEsperaMinutos, 0) / (waitlist.length || 1)
  );

  const handlePromote = (entry: WaitlistEntry) => {
    promoteWaitlistMember(entry.id);
    setWaitlist([...getWaitlist()]);
    alert(`✓ ¡Éxito! Socio ${entry.socioNombre} promovido como TITULAR a la clase "${entry.claseNombre}". Se ha emitido confirmación a su App móvil.`);
  };

  const handleOpenNotify = (entry: WaitlistEntry) => {
    setSelectedNotification(entry);
    setCustomMsg(
      `¡Hola ${entry.socioNombre}! 👋 Se liberó una vacante para tu clase de "${entry.claseNombre}" en FitZone (${entry.sedeNombre}) para este ${entry.dia} a las ${entry.horario}. Responde este mensaje en los próximos 15 minutos para confirmar tu cupo.`
    );
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotification) return;

    notifyWaitlistMember(selectedNotification.id);
    setWaitlist([...getWaitlist()]);
    alert(`Aviso enviado con éxito a ${selectedNotification.socioNombre} (${selectedNotification.socioTelefono}). Estado actualizado a "Notificado".`);
    setSelectedNotification(null);
  };

  const handleCancelWait = (entry: WaitlistEntry) => {
    if (confirm(`¿Dar de baja a ${entry.socioNombre} de la lista de espera para ${entry.claseNombre}?`)) {
      cancelWaitlistMember(entry.id);
      setWaitlist([...getWaitlist()]);
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo C-06
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Gestión Global de Demanda</span>
          </div>
          <h1>Lista de Espera Consolidada de Clases</h1>
          <p>Supervisa los socios en cola, orden de prelación y promueve cupos liberados en tiempo real</p>
        </div>
        <div className="header-controls" style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/admin/clases" className="btn-secondary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            ← Volver a Agenda (C-01)
          </Link>
          <Link to="/admin/clases/nueva" className="btn-primary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>+</span> Programar Clase (C-02)
          </Link>
        </div>
      </header>

      {/* MÉTRICAS KPI */}
      <div className="fase4-metrics-grid">
        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>En Espera Activa</span>
            <span>⏳</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-orange)" }}>
            {totalEnEspera}
          </div>
          <div className="fase4-metric-sub">Socios aguardando vacantes titulares</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Promovidos Hoy</span>
            <span>✓</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-green)" }}>
            {totalPromovidos}
          </div>
          <div className="fase4-metric-sub">Ingresados con éxito a sala</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Clases Sobredemandadas</span>
            <span>🔥</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-red)" }}>
            {clasesConEspera}
          </div>
          <div className="fase4-metric-sub">Clases con aforo al 100%</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Tiempo Promedio Espera</span>
            <span>⏱️</span>
          </div>
          <div className="fase4-metric-val">
            {promedioEspera} <span style={{ fontSize: "1rem", fontWeight: 500 }}>min</span>
          </div>
          <div className="fase4-metric-sub">Tiempo de respuesta promedio</div>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="classes-filter-bar" style={{ marginBottom: "1.5rem" }}>
        <div className="filter-group" style={{ flexGrow: 1, minWidth: "220px" }}>
          <label className="filter-label">Buscar Socio / DNI / Clase:</label>
          <input
            type="text"
            className="form-control"
            placeholder="ej. Ignacio Pérez, 35.882.910 o Spinning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Sede:</label>
          <select
            className="filter-select"
            value={filterSede}
            onChange={(e) => setFilterSede(e.target.value)}
          >
            <option value="Todas">Todas las Sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Disciplina:</label>
          <select
            className="filter-select"
            value={filterDisciplina}
            onChange={(e) => setFilterDisciplina(e.target.value)}
          >
            <option value="Todas">Todas las Disciplinas</option>
            <option value="Spinning">Spinning</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Pilates">Pilates</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado:</label>
          <select
            className="filter-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="En Espera">En Espera</option>
            <option value="Promovido">Promovido a Titular</option>
            <option value="Notificado">Notificado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* TABLA CONSOLIDADA */}
      <div className="waitlist-table-container">
        {filteredWaitlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📋</div>
            <h3>No se encontraron registros en la lista de espera</h3>
            <p>Intenta cambiar los filtros seleccionados o buscar con otro criterio.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                <th style={{ padding: "1rem" }}>Posición</th>
                <th style={{ padding: "1rem" }}>Socio Solicitante</th>
                <th style={{ padding: "1rem" }}>Clase & Horario</th>
                <th style={{ padding: "1rem" }}>Sede & Instructor</th>
                <th style={{ padding: "1rem" }}>Ocupación Clase</th>
                <th style={{ padding: "1rem" }}>Inscripción</th>
                <th style={{ padding: "1rem" }}>Estado</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {filteredWaitlist.map((entry) => (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    backgroundColor: entry.estado === "Promovido" ? "rgba(0, 255, 135, 0.04)" : "transparent",
                  }}
                >
                  {/* Posición */}
                  <td style={{ padding: "1rem" }}>
                    <span
                      className={`waitlist-pos-badge ${
                        entry.posicion === 1 ? "waitlist-pos-1" : "waitlist-pos-other"
                      }`}
                    >
                      #{entry.posicion}
                    </span>
                  </td>

                  {/* Socio */}
                  <td style={{ padding: "1rem" }}>
                    <div className="socio-user-cell">
                      <img src={entry.socioAvatar} alt={entry.socioNombre} className="socio-avatar-sm" />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-pure)" }}>{entry.socioNombre}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          DNI: {entry.socioDni} • {entry.socioTelefono}
                        </div>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: entry.socioTipo === "Socio Premium" ? "var(--accent-yellow)" : "var(--accent-orange)",
                            fontWeight: 600,
                          }}
                        >
                          {entry.socioTipo}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Clase y Horario */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-pure)" }}>{entry.claseNombre}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent-orange)" }}>{entry.disciplina}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {entry.dia} • {entry.horario}
                    </div>
                  </td>

                  {/* Sede e Instructor */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ color: "var(--text-pure)" }}>{entry.sedeNombre}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Prof. {entry.instructor}
                    </div>
                  </td>

                  {/* Ocupación */}
                  <td style={{ padding: "1rem" }}>
                    <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>
                      {entry.cuposOcupados}/{entry.cuposMaximos}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.3rem" }}>
                      (Lleno)
                    </span>
                  </td>

                  {/* Fecha Inscripción */}
                  <td style={{ padding: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <div>{entry.fechaInscripcion}</div>
                    <div style={{ color: "var(--accent-yellow)" }}>Hace {entry.tiempoEsperaMinutos} min</div>
                  </td>

                  {/* Estado Badge */}
                  <td style={{ padding: "1rem" }}>
                    <span
                      className={`status-pill ${
                        entry.estado === "Promovido"
                          ? "status-pill-operativa"
                          : entry.estado === "Notificado"
                          ? "status-pill-pico"
                          : entry.estado === "Cancelado"
                          ? "status-pill-pendiente"
                          : "status-pill-senia"
                      }`}
                    >
                      {entry.estado}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
                      {entry.estado === "En Espera" && (
                        <>
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                            title="Promover inmediatamente a cupo titular"
                            onClick={() => handlePromote(entry)}
                          >
                            ✓ Promover
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                            title="Notificar por WhatsApp / Push"
                            onClick={() => handleOpenNotify(entry)}
                          >
                            💬 Avisar
                          </button>
                          <button
                            type="button"
                            className="btn-outline-red"
                            style={{ padding: "0.35rem 0.5rem", fontSize: "0.75rem" }}
                            title="Dar de baja de la cola"
                            onClick={() => handleCancelWait(entry)}
                          >
                            ✕
                          </button>
                        </>
                      )}

                      {entry.estado === "Notificado" && (
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                          onClick={() => handlePromote(entry)}
                        >
                          Confirmar Ingreso
                        </button>
                      )}

                      {entry.estado === "Promovido" && (
                        <span style={{ fontSize: "0.75rem", color: "var(--accent-green)", fontWeight: 700 }}>
                          ✓ Titular Asignado
                        </span>
                      )}

                      {entry.estado === "Cancelado" && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Baja registrada
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DE NOTIFICACIÓN WHATSAPP / PUSH */}
      {selectedNotification && (
        <div className="modal-backdrop" onClick={() => setSelectedNotification(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <div className="modal-header">
              <h2>Aviso de Vacante Disponible (WhatsApp / SMS)</h2>
              <button className="modal-close-btn" onClick={() => setSelectedNotification(null)}>✕</button>
            </div>
            <form onSubmit={handleSendNotification}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-md)" }}>
                <img src={selectedNotification.socioAvatar} alt="" style={{ width: "42px", height: "42px", borderRadius: "50%" }} />
                <div>
                  <div style={{ fontWeight: 700 }}>{selectedNotification.socioNombre}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Teléfono: {selectedNotification.socioTelefono} • Posición #{selectedNotification.posicion}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Mensaje Automatizado de Convocatoria:</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  El socio recibirá un botón interactivo de 1 solo clic para aceptar o ceder su turno.
                </span>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedNotification(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: "#25D366" }}>
                  Enviar Mensaje WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
