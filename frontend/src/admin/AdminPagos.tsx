
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerPagosAdmin,
  type PagoApi,
} from "../services/pagosAdminService";
import "../admin.css";

const dinero = (valor: string | number) =>
  Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

const fecha = (valor: string) =>
  new Date(valor).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });

const concepto = (pago: PagoApi) =>
  pago.reserva_cancha_id != null
    ? `Reserva de cancha #${pago.reserva_cancha_id}`
    : pago.membresia_id != null
      ? `Membresía #${pago.membresia_id}`
      : "Sin concepto asociado";

export default function AdminPagos() {
  const [pagos, setPagos] = useState<PagoApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerPagosAdmin();

        if (!activo) return;

        setPagos(datos);
        setError(null);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron consultar los pagos."
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

  const filtrados = pagos.filter(pago => {
    const socioId =
      pago.reserva_cancha?.usuario_id ??
      pago.membresia?.usuario_id;

    const texto = [
      pago.id,
      concepto(pago),
      socioId != null ? `Socio ${socioId}` : "",
    ].join(" ").toLowerCase();

    const coincideEstado =
      estado === "Todos" || pago.estado === estado;

    const coincideTipo =
      tipo === "Todos" ||
      (tipo === "Cancha" && pago.reserva_cancha_id != null) ||
      (tipo === "Membresía" && pago.membresia_id != null);

    return (
      texto.includes(busqueda.toLowerCase().trim()) &&
      coincideEstado &&
      coincideTipo
    );
  });

  const aprobados = pagos.filter(
    pago => pago.estado === "APROBADO"
  );

  const pendientes = pagos.filter(
    pago => pago.estado === "PENDIENTE"
  );

  const montoAprobado = aprobados.reduce(
    (suma, pago) => suma + Number(pago.monto),
    0
  );

  function actualizar() {
    setCargando(true);
    setError(null);
    setRecarga(n => n + 1);
  }

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Listado de Pagos y Comprobantes</h1>
          <p>
            Transacciones registradas en PostgreSQL.
            Los pagos de prueba son simulados.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={actualizar}
          disabled={cargando}
        >
          ↻ Actualizar
        </button>
      </header>

      <div className="fase4-metrics-grid">
        {[
          ["Pagos registrados", pagos.length],
          ["Aprobados", aprobados.length],
          ["Pendientes", pendientes.length],
          ["Importe aprobado", dinero(montoAprobado)],
        ].map(([titulo, valor]) => (
          <div
            key={String(titulo)}
            className="fase4-metric-card"
          >
            <div className="fase4-metric-title">
              {titulo}
            </div>
            <div className="fase4-metric-val">
              {valor}
            </div>
            <div className="fase4-metric-sub">
              Según los registros del backend
            </div>
          </div>
        ))}
      </div>

      <div className="action-bar">
        <div className="action-group-left">
          <div className="search-box">
            <input
              type="search"
              className="search-input"
              placeholder="Buscar ID, concepto o socio..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={estado}
            onChange={e => setEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="APROBADO">Aprobados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="RECHAZADO">Rechazados</option>
          </select>

          <select
            className="filter-select"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            aria-label="Filtrar por concepto"
          >
            <option value="Todos">Todos los conceptos</option>
            <option value="Cancha">Reservas de cancha</option>
            <option value="Membresía">Membresías</option>
          </select>
        </div>
      </div>

      {cargando && (
        <div className="panel-card">
          Cargando pagos reales...
        </div>
      )}

      {!cargando && error && (
        <div className="panel-card" role="alert">
          <h2>No se pudieron cargar los pagos</h2>
          <p>{error}</p>
          <button
            className="btn-secondary"
            type="button"
            onClick={actualizar}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="panel-card">
          No hay pagos que coincidan con los filtros.
        </div>
      )}

      {!cargando && !error && filtrados.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Concepto</th>
                <th>Socio</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map(pago => {
                const usuarioId =
                  pago.reserva_cancha?.usuario_id ??
                  pago.membresia?.usuario_id;

                return (
                  <tr key={pago.id}>
                    <td className="transaction-id">
                      PAG-{String(pago.id).padStart(4, "0")}
                    </td>

                    <td className="concept-text">
                      {concepto(pago)}
                    </td>

                    <td>
                      {usuarioId != null
                        ? `Socio #${usuarioId}`
                        : "No disponible"}
                    </td>

                    <td>{fecha(pago.creado_at)}</td>

                    <td className="amount-val">
                      {dinero(pago.monto)}
                    </td>

                    <td>
                      <span className={`status-badge ${
                        pago.estado === "APROBADO"
                          ? "status-active"
                          : pago.estado === "PENDIENTE"
                            ? "status-warning"
                            : "status-inactive"
                      }`}>
                        {pago.estado}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/admin/pagos/${pago.id}`}
                        className="btn-secondary"
                        style={{ textDecoration: "none" }}
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!cargando && !error && (
        <div className="pagination-area">
          <span className="pagination-info">
            Mostrando {filtrados.length} de {pagos.length} pagos
          </span>
        </div>
      )}
    </>
  );
}
