import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCanchaById, getReservas, saveCancha, type CanchaItem } from "../../data/clasesCanchasData";
import "./AdminFase4.css";
import "../../admin.css";

export default function AdminCanchaDetalle() {
  const { id } = useParams<{ id: string }>();
  const [cancha, setCancha] = useState<CanchaItem | undefined>(() => getCanchaById(id || "CAN-PAD-01"));
  const [activeTab, setActiveTab] = useState<"turnos" | "mantenimiento" | "reglas">("turnos");

  // Modal Mantenimiento
  const [showMantenimientoModal, setShowMantenimientoModal] = useState(false);
  const [motivoMantenimiento, setMotivoMantenimiento] = useState("Ajuste de tensores y paño de red");
  const [tecnicoMantenimiento, setTecnicoMantenimiento] = useState("Servicios Deportivos Del Litoral");

  if (!cancha) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
        <h2>Cancha no encontrada</h2>
        <p>El código de cancha solicitado no existe en la base de datos.</p>
        <Link to="/admin/canchas/listado" className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
          Volver al Inventario (CA-01)
        </Link>
      </div>
    );
  }

  // Reservas asociadas a esta cancha
  const reservasCancha = getReservas().filter((r) => r.canchaId === cancha.id);

  const handleToggleMantenimiento = (e: React.FormEvent) => {
    e.preventDefault();
    const newStatus = cancha.estado === "Mantenimiento" ? "Operativa" : "Mantenimiento";

    const updatedCancha: CanchaItem = {
      ...cancha,
      estado: newStatus,
      mantenimientoInfo:
        newStatus === "Mantenimiento"
          ? {
              motivo: motivoMantenimiento,
              tecnico: tecnicoMantenimiento,
              fechaInicio: new Date().toLocaleDateString("es-AR") + ", 08:00 hs",
              fechaEstimadaFin: "Mañana 18:00 hs",
              tipoBloqueo: "Total",
            }
          : undefined,
      historialMantenimiento:
        newStatus === "Mantenimiento"
          ? [
              {
                id: `MNT-${Date.now().toString().slice(-4)}`,
                fecha: new Date().toLocaleDateString("es-AR"),
                tipo: "Correctivo",
                descripcion: motivoMantenimiento,
                tecnico: tecnicoMantenimiento,
                costo: 65000,
                estado: "En Progreso",
              },
              ...cancha.historialMantenimiento,
            ]
          : cancha.historialMantenimiento.map((h, i) => (i === 0 ? { ...h, estado: "Completado" as const } : h)),
    };

    saveCancha(updatedCancha);
    setCancha(updatedCancha);
    setShowMantenimientoModal(false);
    alert(`Estado de la cancha cambiado a: ${newStatus.toUpperCase()}`);
  };

  const precioSocio = Math.round(cancha.tarifaBaseHora * (1 - cancha.descuentoSocioPorc / 100));
  const precioPico = Math.round(cancha.tarifaBaseHora * (1 + cancha.recargoHoraPicoPorc / 100));

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo CA-04
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Ficha Técnica Operativa</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.2rem" }}>
            <h1>{cancha.nombre}</h1>
            <span
              className={`sport-tag ${
                cancha.deporte === "Pádel"
                  ? "sport-tag-padel"
                  : cancha.deporte === "Fútbol 5"
                  ? "sport-tag-futbol"
                  : "sport-tag-tenis"
              }`}
            >
              {cancha.deporte}
            </span>
          </div>
          <p>
            {cancha.codigo} • {cancha.sedeNombre} • {cancha.superficie}
          </p>
        </div>

        {/* ACCIONES DE CABECERA */}
        <div className="header-controls" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            to="/admin/canchas/listado"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            ← Volver al Inventario (CA-01)
          </Link>

          <button
            type="button"
            className={cancha.estado === "Mantenimiento" ? "btn-primary" : "btn-outline-red"}
            onClick={() => setShowMantenimientoModal(true)}
          >
            {cancha.estado === "Mantenimiento" ? "🔧 Levantar Mantenimiento" : "🔧 Bloquear por Mantenimiento"}
          </button>

          <Link
            to={`/admin/canchas/${cancha.id}/editar`}
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            ✏️ Editar (CA-02)
          </Link>

          {cancha.estado === "Operativa" && (
            <Link
              to={`/admin/reservas/nueva?canchaId=${cancha.id}`}
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              ⚡ Crear Reserva (R-03)
            </Link>
          )}
        </div>
      </header>

      {/* CARD PRINCIPAL CON FOTO Y DETALLE GENERAL */}
      <div className="cancha-detail-header-card">
        <img src={cancha.imagenUrl} alt={cancha.nombre} className="cancha-detail-img-large" />

        <div className="cancha-detail-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="cancha-card-code">{cancha.codigo}</span>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-pure)", marginTop: "0.1rem" }}>
                {cancha.nombre}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                📍 {cancha.sedeNombre} ({cancha.techada ? "Cubierta / Techada" : "Al aire libre"})
              </div>
            </div>

            <span
              className={`status-pill ${
                cancha.estado === "Operativa" ? "status-pill-operativa" : "status-pill-mantenimiento"
              }`}
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }}
            >
              ● {cancha.estado}
            </span>
          </div>

          {/* Grilla de Especificaciones */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              padding: "1rem",
              background: "rgba(11, 15, 25, 0.7)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div>
              <span className="cancha-spec-label">Superficie:</span>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-pure)" }}>{cancha.superficie}</div>
            </div>
            <div>
              <span className="cancha-spec-label">Cerramiento:</span>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-pure)" }}>{cancha.cerramiento}</div>
            </div>
            <div>
              <span className="cancha-spec-label">Iluminación:</span>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-pure)" }}>{cancha.iluminacion}</div>
            </div>
            <div>
              <span className="cancha-spec-label">Dimensiones:</span>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-pure)" }}>{cancha.dimensiones}</div>
            </div>
            <div>
              <span className="cancha-spec-label">Duración Turno:</span>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-pure)" }}>{cancha.duracionTurnoMin} min (+{cancha.bufferEntreTurnosMin} min buffer)</div>
            </div>
            <div>
              <span className="cancha-spec-label">Capacidad Máxima:</span>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-pure)" }}>{cancha.capacidadJugadores} Jugadores</div>
            </div>
          </div>

          {/* Tarifas Vigentes */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 1rem",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Tarifa Base:</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-green)" }}>
                ${cancha.tarifaBaseHora.toLocaleString()}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Tarifa Socio (-15%):</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-pure)" }}>
                ${precioSocio.toLocaleString()}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Horario Pico (+20%):</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-yellow)" }}>
                ${precioPico.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Rango Pico:</span>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-pure)" }}>19:00 a 21:30 hs</div>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS DEL MES */}
      <div className="cancha-detail-stats-row">
        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Horas Reservadas (Mes)</span>
            <span>⏰</span>
          </div>
          <div className="fase4-metric-val">{cancha.statsMes.horasReservadas} h</div>
          <div className="fase4-metric-sub">Alta demanda en turnos nocturnos</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Ingresos Generados</span>
            <span>💰</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-green)" }}>
            ${cancha.statsMes.ingresosTotales.toLocaleString()}
          </div>
          <div className="fase4-metric-sub">Facturación neta acumulada</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Tasa de Ocupación</span>
            <span>📊</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-yellow)" }}>
            {cancha.statsMes.tasaOcupacion}%
          </div>
          <div className="fase4-metric-sub">Promedio sobre turnos habilitados</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Mantenimientos Realizados</span>
            <span>🛠️</span>
          </div>
          <div className="fase4-metric-val">{cancha.statsMes.mantenimientosRealizados}</div>
          <div className="fase4-metric-sub">Intervenciones técnicas en el período</div>
        </div>
      </div>

      {/* TABS DE DETALLE INFERIOR */}
      <div className="cancha-detail-tabs-bar">
        <button
          className={`cancha-detail-tab-btn ${activeTab === "turnos" ? "active" : ""}`}
          onClick={() => setActiveTab("turnos")}
        >
          Próximos Turnos & Reservas ({reservasCancha.length})
        </button>
        <button
          className={`cancha-detail-tab-btn ${activeTab === "mantenimiento" ? "active" : ""}`}
          onClick={() => setActiveTab("mantenimiento")}
        >
          Historial de Mantenimiento ({cancha.historialMantenimiento.length})
        </button>
        <button
          className={`cancha-detail-tab-btn ${activeTab === "reglas" ? "active" : ""}`}
          onClick={() => setActiveTab("reglas")}
        >
          Normativa y Operación
        </button>
      </div>

      {/* CONTENIDO DE PESTAÑAS */}
      {activeTab === "turnos" && (
        <div className="waitlist-table-container">
          {reservasCancha.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              No hay reservas programadas recientemente para esta pista.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <th style={{ padding: "1rem" }}>Código</th>
                  <th style={{ padding: "1rem" }}>Horario & Fecha</th>
                  <th style={{ padding: "1rem" }}>Titular de Reserva</th>
                  <th style={{ padding: "1rem" }}>Monto / Saldo</th>
                  <th style={{ padding: "1rem" }}>Estado Pago</th>
                  <th style={{ padding: "1rem" }}>Estado Turno</th>
                  <th style={{ padding: "1rem", textAlign: "right" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservasCancha.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "var(--accent-orange)" }}>
                      {r.codigo}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-pure)" }}>{r.horaInicio} - {r.horaFin} h</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.fecha} {r.esHorarioPico && "⚡ Pico"}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 600 }}>{r.titular.nombre}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {r.titular.esSocio ? "Socio Activo" : "Cliente Particular"}
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 700, color: "var(--accent-green)" }}>
                        ${r.totalCalculado.toLocaleString()}
                      </div>
                      {r.saldoPendiente > 0 && (
                        <div style={{ fontSize: "0.72rem", color: "var(--accent-red)" }}>
                          Resta: ${r.saldoPendiente.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        className={`status-pill ${
                          r.estadoPago === "Pagado"
                            ? "status-pill-pagado"
                            : r.estadoPago === "Seña 50%"
                            ? "status-pill-senia"
                            : "status-pill-pendiente"
                        }`}
                      >
                        {r.estadoPago}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span className="status-pill status-pill-operativa">{r.estadoTurno}</span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <Link
                        to={`/admin/reservas/${r.id}`}
                        className="btn-secondary"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", textDecoration: "none" }}
                      >
                        Ver Ficha (R-04)
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "mantenimiento" && (
        <div className="waitlist-table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                <th style={{ padding: "1rem" }}>ID</th>
                <th style={{ padding: "1rem" }}>Fecha</th>
                <th style={{ padding: "1rem" }}>Tipo</th>
                <th style={{ padding: "1rem" }}>Descripción de Trabajos</th>
                <th style={{ padding: "1rem" }}>Técnico / Proveedor</th>
                <th style={{ padding: "1rem" }}>Costo ($ ARS)</th>
                <th style={{ padding: "1rem" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {cancha.historialMantenimiento.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "var(--accent-orange)" }}>{m.id}</td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{m.fecha}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: m.tipo === "Preventivo" ? "rgba(0, 255, 135, 0.15)" : "rgba(255, 75, 114, 0.15)",
                        color: m.tipo === "Preventivo" ? "var(--accent-green)" : "var(--accent-red)",
                      }}
                    >
                      {m.tipo}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-pure)" }}>{m.descripcion}</td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{m.tecnico}</td>
                  <td style={{ padding: "1rem", fontWeight: 700 }}>${m.costo.toLocaleString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      className={`status-pill ${
                        m.estado === "Completado" ? "status-pill-operativa" : "status-pill-mantenimiento"
                      }`}
                    >
                      {m.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reglas" && (
        <div className="reserva-step-card" style={{ lineHeight: 1.6 }}>
          <h3 style={{ color: "var(--accent-orange)", marginBottom: "0.75rem" }}>
            Protocolo de Conservación y Normas de Uso de Pista
          </h3>
          <ul style={{ paddingLeft: "1.25rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>
              <strong>Calzado Reglamentario:</strong> Obligatorio suela omni o espiga para no dañar el césped sintético. Prohibido tapones de aluminio o botines de campo.
            </li>
            <li>
              <strong>Tolerancia de Inicio y Fin:</strong> Los jugadores deben desalojar la pista exactamente al cumplirse los 90 minutos para permitir los 10 minutos de buffer de barrido de arena y ventilación.
            </li>
            <li>
              <strong>Regulación de Iluminación:</strong> Los reflectores LED de 400 lux se activan automáticamente 5 minutos antes del turno asignado y se apagan 10 minutos tras la finalización.
            </li>
            <li>
              <strong>Cristales Templados:</strong> Inspección obligatoria de junturas de neopreno y silicona cada 15 días para prevenir vibraciones por golpes accidentales.
            </li>
          </ul>
        </div>
      )}

      {/* MODAL MANTENIMIENTO */}
      {showMantenimientoModal && (
        <div className="modal-backdrop" onClick={() => setShowMantenimientoModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Módulo de Mantenimiento Técnico — {cancha.codigo}</h2>
              <button className="modal-close-btn" onClick={() => setShowMantenimientoModal(false)}>✕</button>
            </div>
            <form onSubmit={handleToggleMantenimiento}>
              <div style={{ marginBottom: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Actualmente la cancha está: <strong>{cancha.estado.toUpperCase()}</strong>.
                {cancha.estado === "Operativa"
                  ? " Al confirmar, se bloquearán los turnos futuros hasta levantar la orden."
                  : " Al confirmar, la cancha volverá a quedar habilitada para la grilla de reservas."}
              </div>

              {cancha.estado === "Operativa" && (
                <>
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Motivo Técnico del Bloqueo *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={motivoMantenimiento}
                      onChange={(e) => setMotivoMantenimiento(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Técnico / Empresa Contratada</label>
                    <input
                      type="text"
                      className="form-control"
                      value={tecnicoMantenimiento}
                      onChange={(e) => setTecnicoMantenimiento(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowMantenimientoModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ backgroundColor: cancha.estado === "Operativa" ? "var(--accent-red)" : "var(--accent-green)" }}
                >
                  {cancha.estado === "Operativa" ? "Aplicar Bloqueo por Mantenimiento" : "Habilitar Cancha (Levantar Bloqueo)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
