
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerReservasAdmin,
  type ReservaCanchaApi,
} from "../../services/reservasAdminService";
import "../../admin.css";

function dinero(valor: string | number) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  });
}

function fechaArgentina(valor: string) {
  const fecha = valor.slice(0, 10);
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

function estadoLegible(estado: ReservaCanchaApi["estado"]) {
  switch (estado) {
    case "PENDIENTE_PAGO":
      return "Pendiente de pago";
    case "CONFIRMADA":
      return "Confirmada";
    case "CANCELADA":
      return "Cancelada";
  }
}

export default function AdminReservasCancha() {
  const [reservas, setReservas] =
    useState<ReservaCanchaApi[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerReservasAdmin();

        if (!activo) return;

        setReservas(datos);
        setError(null);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las reservas."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargar();

    return () => {
      activo = false;
    };
  }, [recarga]);

  function actualizar() {
    setCargando(true);
    setError(null);
    setRecarga(v => v + 1);
  }

  const deportes = Array.from(
    new Set(
      reservas.map(r => r.cancha.tipo_cancha.nombre)
    )
  );

  const reservasFiltradas = reservas.filter(r => {
    const texto = [
      String(r.id),
      r.usuario.nombre,
      r.usuario.apellido,
      r.usuario.dni,
      r.usuario.email,
      r.cancha.nombre,
      r.cancha.sede.nombre,
    ].join(" ").toLowerCase();

    return (
      texto.includes(busqueda.trim().toLowerCase()) &&
      (filtroEstado === "Todos" ||
        r.estado === filtroEstado) &&
      (filtroDeporte === "Todos" ||
        r.cancha.tipo_cancha.nombre === filtroDeporte)
    );
  });

  const pendientes = reservas.filter(
    r => r.estado === "PENDIENTE_PAGO"
  ).length;

  const confirmadas = reservas.filter(
    r => r.estado === "CONFIRMADA"
  ).length;

  const canceladas = reservas.filter(
    r => r.estado === "CANCELADA"
  ).length;

  const montoPendiente = reservas
    .filter(r => r.estado === "PENDIENTE_PAGO")
    .reduce((total, r) => total + Number(r.monto_total), 0);

  return (
    <div style={{
      maxWidth: "1400px",
      margin: "0 auto",
      paddingBottom: "3rem",
    }}>
      <header className="topbar">
        <div className="header-titles">
          <span style={{
            color: "var(--accent-orange)",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}>
            Módulos R-02 & R-04
          </span>

          <h1>Gestión de Reservas Deportivas</h1>

          <p>
            Reservas registradas en PostgreSQL,
            con sus socios y estados reales.
          </p>
        </div>

        <div
          className="header-controls"
          style={{
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            disabled={cargando}
            onClick={actualizar}
          >
            ↻ Actualizar
          </button>

          <Link
            to="/admin/reservas/nueva"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            + Nueva Reserva
          </Link>
        </div>
      </header>

      <div className="fase4-metrics-grid">
        {[
          ["Total reservas", reservas.length],
          ["Pendientes de pago", pendientes],
          ["Confirmadas", confirmadas],
          ["Canceladas", canceladas],
        ].map(([titulo, valor]) => (
          <div
            key={String(titulo)}
            className="fase4-metric-card"
          >
            <div className="fase4-metric-title">
              <span>{titulo}</span>
            </div>

            <div className="fase4-metric-val">
              {valor}
            </div>

            <div className="fase4-metric-sub">
              Datos del backend
            </div>
          </div>
        ))}
      </div>

      <div className="reserva-step-card">
        <p style={{
          color: "var(--text-muted)",
          margin: 0,
        }}>
          Importe total de reservas pendientes:
        </p>

        <h2 style={{
          marginTop: "0.5rem",
          color: "var(--accent-orange)",
        }}>
          {dinero(montoPendiente)}
        </h2>

        <p style={{
          color: "var(--text-muted)",
          fontSize: "0.8rem",
        }}>
          Este importe todavía no es dinero cobrado.
        </p>
      </div>

      <div className="classes-filter-bar">
        <div className="filter-group">
          <label
            className="filter-label"
            htmlFor="buscar-reservas"
          >
            Buscar:
          </label>

          <input
            id="buscar-reservas"
            className="form-control"
            placeholder="Socio, cancha, DNI o ID..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label
            className="filter-label"
            htmlFor="estado-reservas"
          >
            Estado:
          </label>

          <select
            id="estado-reservas"
            className="filter-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="PENDIENTE_PAGO">
              Pendientes de pago
            </option>
            <option value="CONFIRMADA">
              Confirmadas
            </option>
            <option value="CANCELADA">
              Canceladas
            </option>
          </select>
        </div>

        <div className="filter-group">
          <label
            className="filter-label"
            htmlFor="deporte-reservas"
          >
            Deporte:
          </label>

          <select
            id="deporte-reservas"
            className="filter-select"
            value={filtroDeporte}
            onChange={e => setFiltroDeporte(e.target.value)}
          >
            <option value="Todos">Todos</option>

            {deportes.map(deporte => (
              <option
                key={deporte}
                value={deporte}
              >
                {deporte}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && (
        <div className="reserva-step-card">
          Cargando reservas desde PostgreSQL...
        </div>
      )}

      {!cargando && error && (
        <div className="reserva-step-card" role="alert">
          <h3>No se pudieron cargar las reservas</h3>
          <p>{error}</p>

          <button
            type="button"
            className="btn-secondary"
            onClick={actualizar}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && reservasFiltradas.length === 0 && (
        <div className="reserva-step-card">
          <h3>No hay reservas para mostrar</h3>
          <p>
            Todavía no existen reservas registradas
            o ninguna coincide con los filtros.
          </p>
        </div>
      )}

      {!cargando && !error && reservasFiltradas.length > 0 && (
        <div
          className="reserva-step-card"
          style={{ overflowX: "auto" }}
        >
          <h2 style={{ marginBottom: "1.25rem" }}>
            Reservas registradas ({reservasFiltradas.length})
          </h2>

          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            minWidth: "850px",
          }}>
            <thead>
              <tr style={{
                borderBottom: "1px solid var(--border-color)",
              }}>
                {[
                  "ID",
                  "Socio",
                  "Cancha / Sede",
                  "Fecha",
                  "Hora",
                  "Importe",
                  "Estado",
                  "Cancha",
                ].map(c => (
                  <th
                    key={c}
                    scope="col"
                    style={{
                      padding: "0.85rem 0.6rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map(reserva => (
                <tr
                  key={reserva.id}
                  style={{
                    borderBottom:
                      "1px solid var(--border-color)",
                  }}
                >
                  <td style={{ padding: "1rem 0.6rem" }}>
                    <strong>
                      RSV-{String(reserva.id).padStart(4, "0")}
                    </strong>
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    <strong>
                      {reserva.usuario.nombre}{" "}
                      {reserva.usuario.apellido}
                    </strong>

                    <div style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}>
                      DNI: {reserva.usuario.dni}
                    </div>
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    <strong>{reserva.cancha.nombre}</strong>

                    <div style={{
                      color: "var(--text-muted)",
                      fontSize: "0.75rem",
                    }}>
                      {reserva.cancha.tipo_cancha.nombre}
                      {" • "}
                      {reserva.cancha.sede.nombre}
                    </div>
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    {fechaArgentina(reserva.fecha)}
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    {String(reserva.hora_inicio).padStart(2, "0")}
                    :00
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    {dinero(reserva.monto_total)}
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    <span className={`status-pill ${
                      reserva.estado === "CONFIRMADA"
                        ? "status-pill-operativa"
                        : "status-pill-mantenimiento"
                    }`}>
                      {estadoLegible(reserva.estado)}
                    </span>
                  </td>

                  <td style={{ padding: "1rem 0.6rem" }}>
                    <Link
                      to={`/admin/canchas/${reserva.cancha.id}`}
                      className="btn-secondary"
                      style={{
                        textDecoration: "none",
                        fontSize: "0.8rem",
                      }}
                    >
                      Ver cancha
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
