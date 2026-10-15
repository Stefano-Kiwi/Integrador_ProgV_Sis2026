import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getReservaById,
  checkInJugador,
  cancelReserva,
  registrarCobroSaldo,
  saveReserva,
  type ReservaItem,
} from "../../data/clasesCanchasData";
import "./AdminFase4.css";
import "../../admin.css";

export default function AdminReservaDetalle() {
  const { id } = useParams<{ id: string }>();
  const [reserva, setReserva] = useState<ReservaItem | undefined>(() => getReservaById(id || "RSV-2026-081"));

  // Modales
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState("Cancelación por fuerza mayor o lluvia");

  const [showCobroModal, setShowCobroModal] = useState(false);

  const [showReprogramarModal, setShowReprogramarModal] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("2026-10-15");
  const [nuevoHorario, setNuevoHorario] = useState("19:00");

  if (!reserva) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
        <h2>Reserva no encontrada</h2>
        <p>No se encontró ninguna reserva de cancha con el identificador #{id}.</p>
        <Link to="/admin/reservas" className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
          Volver al Listado de Reservas (R-02)
        </Link>
      </div>
    );
  }

  // Toggle Check-In de jugador
  const handleToggleCheckIn = (idx: number) => {
    checkInJugador(reserva.id, idx);
    setReserva(getReservaById(reserva.id));
  };

  // Cobrar saldo
  const handleConfirmCobro = (e: React.FormEvent) => {
    e.preventDefault();
    registrarCobroSaldo(reserva.id);
    setReserva(getReservaById(reserva.id));
    setShowCobroModal(false);
    alert(`Cobro de saldo registrado exitosamente.`);
  };

  // Cancelar reserva
  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    cancelReserva(reserva.id, cancelMotivo);
    setReserva(getReservaById(reserva.id));
    setShowCancelModal(false);
    alert(`Reserva cancelada correctamente.`);
  };

  // Reprogramar
  const handleReprogramar = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ReservaItem = {
      ...reserva,
      fecha: nuevaFecha,
      horaInicio: nuevoHorario,
      horaFin: nuevoHorario === "19:00" ? "20:30" : "22:00",
      historialAuditoria: [
        ...reserva.historialAuditoria,
        {
          fecha: new Date().toLocaleDateString("es-AR") + ", " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) + " hs",
          accion: `Turno reprogramado para ${nuevaFecha} a las ${nuevoHorario} h`,
          usuario: "Operador de Mesa",
        },
      ],
    };
    saveReserva(updated);
    setReserva(updated);
    setShowReprogramarModal(false);
    alert(`Turno reprogramado con éxito.`);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo R-04
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Ficha de Turno & Comprobante</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.2rem" }}>
            <h1>Reserva {reserva.codigo}</h1>
            <span
              className={`status-pill ${
                reserva.estadoTurno === "En Juego"
                  ? "status-pill-pico"
                  : reserva.estadoTurno === "Confirmado"
                  ? "status-pill-operativa"
                  : reserva.estadoTurno === "Cancelado"
                  ? "status-pill-pendiente"
                  : "status-pill-senia"
              }`}
            >
              ● {reserva.estadoTurno}
            </span>
            <span
              className={`status-pill ${
                reserva.estadoPago === "Pagado"
                  ? "status-pill-pagado"
                  : reserva.estadoPago === "Seña 50%"
                  ? "status-pill-senia"
                  : "status-pill-pendiente"
              }`}
            >
              {reserva.estadoPago}
            </span>
          </div>
          <p>
            {reserva.canchaNombre} • {reserva.fecha} ({reserva.horaInicio} - {reserva.horaFin} h)
          </p>
        </div>

        {/* ACCIONES DE CABECERA */}
        <div className="header-controls" style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link
            to="/admin/reservas"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            ← Volver a Reservas (R-02)
          </Link>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.print()}
            title="Imprimir Comprobante Fiscal P-03"
          >
            🖨️ Imprimir Ticket (P-03)
          </button>

          {reserva.saldoPendiente > 0 && reserva.estadoTurno !== "Cancelado" && (
            <button
              type="button"
              className="btn-primary"
              style={{ backgroundColor: "var(--accent-green)" }}
              onClick={() => setShowCobroModal(true)}
            >
              💵 Cobrar Saldo (${reserva.saldoPendiente.toLocaleString()})
            </button>
          )}

          {reserva.estadoTurno !== "Cancelado" && reserva.estadoTurno !== "Finalizado" && (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowReprogramarModal(true)}
              >
                🔄 Reprogramar
              </button>
              <button
                type="button"
                className="btn-outline-red"
                onClick={() => setShowCancelModal(true)}
              >
                ✕ Cancelar Turno
              </button>
            </>
          )}
        </div>
      </header>

      {/* GRID DE DETALLE */}
      <div className="reserva-detail-grid">
        {/* COLUMNA IZQUIERDA: DATOS DE PISTA, TITULAR, JUGADORES Y TIMELINE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* CARD PISTA Y TURNO */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">1</span> Detalles del Turno y Cancha
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <span className="cancha-spec-label">Pista Asignada:</span>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-pure)" }}>
                  {reserva.canchaNombre}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  📍 {reserva.sedeNombre}
                </div>
              </div>

              <div>
                <span className="cancha-spec-label">Bloque Horario:</span>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--accent-orange)" }}>
                  {reserva.horaInicio} - {reserva.horaFin} h ({reserva.duracionMin} min)
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Fecha: <strong>{reserva.fecha}</strong> {reserva.esHorarioPico && <span style={{ color: "var(--accent-yellow)" }}>⚡ Horario Pico</span>}
                </div>
              </div>
            </div>
          </div>

          {/* CARD TITULAR Y JUGADORES */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">2</span> Titular y Lista de Jugadores
            </h2>

            {/* Datos Titular */}
            <div
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(11, 15, 25, 0.7)",
                border: "1px solid var(--border-color)",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Titular Responsable:</span>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-pure)" }}>{reserva.titular.nombre}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                  DNI: {reserva.titular.dni} • Tel: {reserva.titular.telefono} • {reserva.titular.email}
                </div>
              </div>
              <span
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  backgroundColor: reserva.titular.esSocio ? "rgba(0, 255, 135, 0.15)" : "rgba(255, 255, 255, 0.08)",
                  color: reserva.titular.esSocio ? "var(--accent-green)" : "var(--text-muted)",
                }}
              >
                {reserva.titular.esSocio ? `✓ Socio (${reserva.titular.nroSocio || "Activo"})` : "Particular"}
              </span>
            </div>

            {/* Acompañantes / Check-in */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-pure)" }}>
                  Jugadores en Pista ({reserva.jugadoresAcompaniantes.length} de 4):
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Haz clic para alternar Check-in de ingreso
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {reserva.jugadoresAcompaniantes.map((jug, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 0.9rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: jug.checkIn ? "rgba(0, 255, 135, 0.08)" : "rgba(255, 255, 255, 0.02)",
                      border: jug.checkIn ? "1px solid rgba(0, 255, 135, 0.3)" : "1px solid var(--border-color)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-pure)", fontSize: "0.88rem" }}>
                        Jugador #{idx + 1}: {jug.nombre}
                      </div>
                      {jug.dni && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>DNI: {jug.dni}</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCheckIn(idx)}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        backgroundColor: jug.checkIn ? "var(--accent-green)" : "rgba(255, 255, 255, 0.1)",
                        color: jug.checkIn ? "#0b0f19" : "var(--text-muted)",
                      }}
                    >
                      {jug.checkIn ? "✓ Presente en Pista" : "○ Marcar Ingreso"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            {reserva.notas && (
              <div style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                💬 Observaciones: "{reserva.notas}"
              </div>
            )}
          </div>

          {/* TIMELINE DE AUDITORÍA */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">3</span> Historial de Eventos y Trazabilidad
            </h2>

            <div className="timeline-list">
              {reserva.historialAuditoria.map((ev, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-pure)" }}>{ev.accion}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {ev.fecha} • Registrado por: <strong>{ev.usuario}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: COMPROBANTE FISCAL DIGITAL */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="receipt-card">
            <div style={{ textAlign: "center", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "1rem" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "1px", color: "var(--accent-orange)" }}>
                FITZONE SPORTS S.A.
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                CUIT: 30-71829301-4 • IVA Responsable Inscripto
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                San Martín 850, Paraná, Entre Ríos
              </div>
              <div style={{ marginTop: "0.75rem", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-pure)" }}>
                COMPROBANTE ELECTRÓNICO
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                {reserva.nroComprobante || "B-0004-00092101"}
              </div>
            </div>

            <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Fecha de Emisión:</span>
                <span>{reserva.fechaCreacion}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Turno Cancha:</span>
                <span>{reserva.canchaNombre.split("—")[0]}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Medio de Pago:</span>
                <span>{reserva.medioPago}</span>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.5rem 0" }}></div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Tarifa Base Turno:</span>
                <span>${reserva.tarifaBase.toLocaleString()}</span>
              </div>

              {reserva.recargoPico > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--accent-yellow)" }}>⚡ Recargo Pico (+20%):</span>
                  <span style={{ color: "var(--accent-yellow)" }}>+ ${reserva.recargoPico.toLocaleString()}</span>
                </div>
              )}

              {reserva.descuentoSocio > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--accent-green)" }}>Descuento Socio (-15%):</span>
                  <span style={{ color: "var(--accent-green)" }}>- ${reserva.descuentoSocio.toLocaleString()}</span>
                </div>
              )}

              {reserva.extras.map((ext, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>+ {ext.concepto}:</span>
                  <span>+ ${ext.precio.toLocaleString()}</span>
                </div>
              ))}

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  paddingTop: "0.75rem",
                  marginTop: "0.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                }}
              >
                <span>TOTAL:</span>
                <span style={{ color: "var(--accent-green)" }}>${reserva.totalCalculado.toLocaleString()}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span>Monto Abonado:</span>
                <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>${reserva.montoAbonado.toLocaleString()}</span>
              </div>

              {reserva.saldoPendiente > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                  <span>Saldo a Liquidar:</span>
                  <span>${reserva.saldoPendiente.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* QR de Acceso */}
            <div style={{ textAlign: "center", borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: "1rem" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "0 auto",
                  backgroundColor: "#fff",
                  padding: "6px",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* SVG QR Simulado */}
                <svg viewBox="0 0 24 24" fill="#000" style={{ width: "100%", height: "100%" }}>
                  <path d="M2 2h8v8H2zm2 2v4h4V4zm-4 8h8v8H2zm2 2v4h4v-4zm10-12h8v8h-8zm2 2v4h4V4zm4 10h2v2h-2zm-4 4h2v2h-2zm2-2h2v2h-2zm2 2h2v2h-2zm-2-4h2v2h-2zm-4 0h2v2h-2z" />
                </svg>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Código Digital de Acceso Molinete: <strong>{reserva.codigo}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL COBRO SALDO */}
      {showCobroModal && (
        <div className="modal-backdrop" onClick={() => setShowCobroModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Cobro de Saldo — {reserva.codigo}</h2>
              <button className="modal-close-btn" onClick={() => setShowCobroModal(false)}>✕</button>
            </div>
            <form onSubmit={handleConfirmCobro}>
              <div style={{ margin: "1rem 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Titular:</span>
                  <strong>{reserva.titular.nombre}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    background: "rgba(0, 255, 135, 0.1)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(0, 255, 135, 0.3)",
                  }}
                >
                  <strong style={{ color: "var(--accent-green)" }}>Monto a Cobrar:</strong>
                  <strong style={{ color: "var(--accent-green)", fontSize: "1.2rem" }}>
                    ${reserva.saldoPendiente.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Medio de Pago:</label>
                <select className="form-control">
                  <option>Efectivo en Mostrador</option>
                  <option>Tarjeta de Débito (POS)</option>
                  <option>QR Mercado Pago</option>
                  <option>Transferencia Bancaria</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCobroModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: "var(--accent-green)" }}>
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REPROGRAMAR */}
      {showReprogramarModal && (
        <div className="modal-backdrop" onClick={() => setShowReprogramarModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reprogramar Turno — {reserva.codigo}</h2>
              <button className="modal-close-btn" onClick={() => setShowReprogramarModal(false)}>✕</button>
            </div>
            <form onSubmit={handleReprogramar}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Nueva Fecha:</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Nuevo Horario:</label>
                <select
                  className="form-control"
                  value={nuevoHorario}
                  onChange={(e) => setNuevoHorario(e.target.value)}
                >
                  <option value="16:00">16:00 - 17:30 h</option>
                  <option value="17:30">17:30 - 19:00 h</option>
                  <option value="19:00">19:00 - 20:30 h (Horario Pico)</option>
                  <option value="20:30">20:30 - 22:00 h (Horario Pico)</option>
                  <option value="22:00">22:00 - 23:30 h</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowReprogramarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Aplicar Reprogramación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CANCELAR */}
      {showCancelModal && (
        <div className="modal-backdrop" onClick={() => setShowCancelModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancelar Reserva {reserva.codigo}</h2>
              <button className="modal-close-btn" onClick={() => setShowCancelModal(false)}>✕</button>
            </div>
            <form onSubmit={handleConfirmCancel}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Motivo de la Cancelación *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={cancelMotivo}
                  onChange={(e) => setCancelMotivo(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCancelModal(false)}>
                  Volver
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: "var(--accent-red)" }}>
                  Confirmar Cancelación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
