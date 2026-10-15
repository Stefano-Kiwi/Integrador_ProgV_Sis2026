import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getReservas,
  cancelReserva,
  registrarCobroSaldo,
  type ReservaItem,
} from "../../data/clasesCanchasData";
import { getSedes } from "../../data/sedesData";
import "./AdminFase4.css";
import "../../admin.css";

export default function AdminReservasCancha() {
  const [reservas, setReservas] = useState<ReservaItem[]>(() => getReservas());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSede, setFilterSede] = useState("Todas");
  const [filterDeporte, setFilterDeporte] = useState("Todos");
  const [filterEstadoPago, setFilterEstadoPago] = useState("Todos");
  const [filterEstadoTurno, setFilterEstadoTurno] = useState("Todos");

  // Modal Cancelación
  const [cancelTarget, setCancelTarget] = useState<ReservaItem | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState("Cancelación solicitada por el cliente con previo aviso");

  // Modal Cobro Rápido
  const [cobroTarget, setCobroTarget] = useState<ReservaItem | null>(null);

  const sedes = getSedes();

  // Filtrado
  const filteredReservas = reservas.filter((r) => {
    const matchSearch =
      r.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titular.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titular.dni.includes(searchQuery) ||
      r.canchaNombre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSede = filterSede === "Todas" || r.sedeId === filterSede;
    const matchDeporte = filterDeporte === "Todos" || r.deporte === filterDeporte;
    const matchPago = filterEstadoPago === "Todos" || r.estadoPago === filterEstadoPago;
    const matchTurno = filterEstadoTurno === "Todos" || r.estadoTurno === filterEstadoTurno;

    return matchSearch && matchSede && matchDeporte && matchPago && matchTurno;
  });

  // Métricas
  const totalReservas = reservas.length;
  const recaudacionTotal = reservas.reduce((acc, curr) => acc + curr.montoAbonado, 0);
  const saldoPorCobrar = reservas.reduce((acc, curr) => acc + curr.saldoPendiente, 0);
  const confirmadasHoy = reservas.filter((r) => r.estadoTurno === "Confirmado" || r.estadoTurno === "En Juego").length;

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelTarget) return;

    cancelReserva(cancelTarget.id, cancelMotivo);
    setReservas([...getReservas()]);
    setCancelTarget(null);
    alert(`Reserva ${cancelTarget.codigo} cancelada correctamente. Se actualizó el estado a Cancelado y Reembolsado.`);
  };

  const handleConfirmCobro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cobroTarget) return;

    registrarCobroSaldo(cobroTarget.id);
    setReservas([...getReservas()]);
    setCobroTarget(null);
    alert(`Cobro de saldo registrado con éxito para ${cobroTarget.codigo}. Comprobante emitido.`);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo R-02
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Libro Maestro de Turnos</span>
          </div>
          <h1>Listado General de Reservas de Cancha</h1>
          <p>Control de turnos agendados, saldos pendientes, jugadores registrados y estado de ocupación</p>
        </div>
        <div className="header-controls" style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            to="/admin/canchas"
            className="btn-secondary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>📅</span> Grilla de Turnos (R-01)
          </Link>
          <Link
            to="/admin/reservas/nueva"
            className="btn-primary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>+</span> Nueva Reserva (R-03)
          </Link>
        </div>
      </header>

      {/* KPI METRIC CARDS */}
      <div className="fase4-metrics-grid">
        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Total Reservas</span>
            <span>📑</span>
          </div>
          <div className="fase4-metric-val">{totalReservas}</div>
          <div className="fase4-metric-sub">Históricas y programadas</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Turnos Activos Hoy</span>
            <span>⚡</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-orange)" }}>
            {confirmadasHoy}
          </div>
          <div className="fase4-metric-sub">Confirmados y en juego</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Recaudado Total</span>
            <span>💵</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-green)" }}>
            ${recaudacionTotal.toLocaleString()}
          </div>
          <div className="fase4-metric-sub">Cobrado vía Mercado Pago y mostrador</div>
        </div>

        <div className="fase4-metric-card">
          <div className="fase4-metric-title">
            <span>Saldos por Cobrar</span>
            <span>⏳</span>
          </div>
          <div className="fase4-metric-val" style={{ color: "var(--accent-yellow)" }}>
            ${saldoPorCobrar.toLocaleString()}
          </div>
          <div className="fase4-metric-sub">Señas del 50% a liquidar en sede</div>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="classes-filter-bar" style={{ marginBottom: "1.5rem" }}>
        <div className="filter-group" style={{ flexGrow: 1, minWidth: "220px" }}>
          <label className="filter-label">Buscar Titular / DNI / Reserva:</label>
          <input
            type="text"
            className="form-control"
            placeholder="ej. Mateo Silva, #RSV-081, 38.102..."
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
          <label className="filter-label">Deporte:</label>
          <select
            className="filter-select"
            value={filterDeporte}
            onChange={(e) => setFilterDeporte(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Pádel">Pádel</option>
            <option value="Fútbol 5">Fútbol 5</option>
            <option value="Tenis">Tenis</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado Pago:</label>
          <select
            className="filter-select"
            value={filterEstadoPago}
            onChange={(e) => setFilterEstadoPago(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Pagado">Pagado Total</option>
            <option value="Seña 50%">Seña 50%</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Reembolsado">Reembolsado</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado Turno:</label>
          <select
            className="filter-select"
            value={filterEstadoTurno}
            onChange={(e) => setFilterEstadoTurno(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Confirmado">Confirmado</option>
            <option value="En Juego">En Juego</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* TABLA DE RESERVAS */}
      <div className="waitlist-table-container">
        {filteredReservas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📅</div>
            <h3>No se encontraron reservas con los filtros aplicados</h3>
            <p>Intenta restablecer los filtros para ver todos los turnos agendados.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                <th style={{ padding: "1rem" }}>Código</th>
                <th style={{ padding: "1rem" }}>Horario & Fecha</th>
                <th style={{ padding: "1rem" }}>Cancha & Sede</th>
                <th style={{ padding: "1rem" }}>Titular de Reserva</th>
                <th style={{ padding: "1rem" }}>Total Facturado</th>
                <th style={{ padding: "1rem" }}>Estado Pago</th>
                <th style={{ padding: "1rem" }}>Estado Turno</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  {/* Código */}
                  <td style={{ padding: "1rem" }}>
                    <Link
                      to={`/admin/reservas/${r.id}`}
                      style={{ fontWeight: 800, color: "var(--accent-orange)", textDecoration: "none" }}
                      title="Ver Ficha Detalle R-04"
                    >
                      {r.codigo}
                    </Link>
                  </td>

                  {/* Horario y Fecha */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-pure)" }}>
                      {r.horaInicio} - {r.horaFin} h
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      {r.fecha} {r.esHorarioPico && <span style={{ color: "var(--accent-yellow)", fontWeight: 700 }}>⚡ Pico (+20%)</span>}
                    </div>
                  </td>

                  {/* Cancha y Sede */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-pure)" }}>{r.canchaNombre}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {r.sedeNombre}
                    </div>
                    <span
                      className={`sport-tag ${
                        r.deporte === "Pádel"
                          ? "sport-tag-padel"
                          : r.deporte === "Fútbol 5"
                          ? "sport-tag-futbol"
                          : "sport-tag-tenis"
                      }`}
                      style={{ marginTop: "0.25rem", fontSize: "0.68rem" }}
                    >
                      {r.deporte}
                    </span>
                  </td>

                  {/* Titular */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-pure)" }}>{r.titular.nombre}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      DNI: {r.titular.dni} • {r.titular.telefono}
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: r.titular.esSocio ? "var(--accent-green)" : "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      {r.titular.esSocio ? `✓ Socio Activo (-15%)` : "Cliente Particular"}
                    </span>
                  </td>

                  {/* Total y Saldos */}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 800, color: "var(--accent-green)", fontSize: "0.95rem" }}>
                      ${r.totalCalculado.toLocaleString()}
                    </div>
                    {r.saldoPendiente > 0 ? (
                      <div style={{ fontSize: "0.75rem", color: "var(--accent-yellow)", fontWeight: 600 }}>
                        Resta cobrar: ${r.saldoPendiente.toLocaleString()}
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Abonado 100%</div>
                    )}
                  </td>

                  {/* Estado Pago */}
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
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {r.medioPago}
                    </div>
                  </td>

                  {/* Estado Turno */}
                  <td style={{ padding: "1rem" }}>
                    <span
                      className={`status-pill ${
                        r.estadoTurno === "En Juego"
                          ? "status-pill-pico"
                          : r.estadoTurno === "Confirmado"
                          ? "status-pill-operativa"
                          : r.estadoTurno === "Cancelado"
                          ? "status-pill-pendiente"
                          : "status-pill-senia"
                      }`}
                    >
                      {r.estadoTurno}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem", flexWrap: "wrap" }}>
                      <Link
                        to={`/admin/reservas/${r.id}`}
                        className="btn-secondary"
                        style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", textDecoration: "none" }}
                        title="Ver detalle completo"
                      >
                        Ficha (R-04)
                      </Link>

                      {r.saldoPendiente > 0 && r.estadoTurno !== "Cancelado" && (
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", backgroundColor: "var(--accent-green)" }}
                          title="Cobrar saldo pendiente de la seña"
                          onClick={() => setCobroTarget(r)}
                        >
                          Cobrar Saldo
                        </button>
                      )}

                      {r.estadoTurno !== "Cancelado" && r.estadoTurno !== "Finalizado" && (
                        <button
                          type="button"
                          className="btn-outline-red"
                          style={{ padding: "0.35rem 0.55rem", fontSize: "0.75rem" }}
                          title="Cancelar turno"
                          onClick={() => {
                            setCancelTarget(r);
                            setCancelMotivo("Solicitud de cancelación por parte del usuario");
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL COBRO DE SALDO */}
      {cobroTarget && (
        <div className="modal-backdrop" onClick={() => setCobroTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Cobro de Saldo — {cobroTarget.codigo}</h2>
              <button className="modal-close-btn" onClick={() => setCobroTarget(null)}>✕</button>
            </div>
            <form onSubmit={handleConfirmCobro}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1rem 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Titular:</span>
                  <strong>{cobroTarget.titular.nombre}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Cancha y Turno:</span>
                  <span>{cobroTarget.canchaNombre} ({cobroTarget.horaInicio} h)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Seña Ya Abonada:</span>
                  <span>${cobroTarget.montoAbonado.toLocaleString()}</span>
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
                  <strong style={{ color: "var(--accent-green)" }}>Saldo a Liquidar Ahora:</strong>
                  <strong style={{ color: "var(--accent-green)", fontSize: "1.2rem" }}>
                    ${cobroTarget.saldoPendiente.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Medio de Pago del Saldo:</label>
                <select className="form-control">
                  <option>Efectivo en Mostrador</option>
                  <option>Tarjeta de Débito / Crédito (POS)</option>
                  <option>Transferencia Bancaria Inmediata</option>
                  <option>QR Mercado Pago</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setCobroTarget(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: "var(--accent-green)" }}>
                  Confirmar Cobro y Emitir Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CANCELAR RESERVA */}
      {cancelTarget && (
        <div className="modal-backdrop" onClick={() => setCancelTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancelar Reserva {cancelTarget.codigo}</h2>
              <button className="modal-close-btn" onClick={() => setCancelTarget(null)}>✕</button>
            </div>
            <form onSubmit={handleConfirmCancel}>
              <div style={{ margin: "1rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Estás a punto de cancelar la reserva de <strong>{cancelTarget.titular.nombre}</strong> para el turno{" "}
                <strong>{cancelTarget.horaInicio} h</strong> en <strong>{cancelTarget.canchaNombre}</strong>.
              </div>

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

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label>Política de Reembolso de Seña ($ {cancelTarget.montoAbonado.toLocaleString()}):</label>
                <select className="form-control">
                  <option>Crédito a favor en cuenta corriente del socio (Recomendado)</option>
                  <option>Reembolso directo por el mismo medio de pago</option>
                  <option>Sin reembolso (Cancelación fuera de término / Menos de 4 horas)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setCancelTarget(null)}>
                  Volver
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: "var(--accent-red)" }}>
                  Confirmar Cancelación de Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
