
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerCanchas,
  type CanchaApi,
} from "../../services/canchasService";
import "../../admin.css";

export default function AdminCanchasListado() {
  const [canchas, setCanchas] = useState<CanchaApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [sede, setSede] = useState("Todas");
  const [deporte, setDeporte] = useState("Todos");
  const [estado, setEstado] = useState("Todos");
  const [vista, setVista] = useState<"cards" | "table">("cards");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerCanchas();
        if (activo) {
          setCanchas(datos);
          setError(null);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al consultar las canchas."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargar();
    return () => { activo = false; };
  }, [intento]);

  const sedes = Array.from(
    new Map(canchas.map(c => [c.sede.id, c.sede])).values()
  );

  const deportes = Array.from(
    new Set(canchas.map(c => c.tipo_cancha.nombre))
  );

  const filtradas = canchas.filter(c => {
    const texto = busqueda.toLowerCase();

    return (
      (
        c.nombre.toLowerCase().includes(texto) ||
        c.tipo_cancha.nombre.toLowerCase().includes(texto) ||
        String(c.id).includes(texto)
      ) &&
      (sede === "Todas" || String(c.sede_id) === sede) &&
      (deporte === "Todos" || c.tipo_cancha.nombre === deporte) &&
      (estado === "Todos" || c.estado === estado)
    );
  });

  const operativas = canchas.filter(
    c => c.estado === "HABILITADA"
  ).length;

  const mantenimiento = canchas.filter(
    c => c.estado === "EN_MANTENIMIENTO"
  ).length;

  const precio = (valor: string) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(Number(valor));

  const nombreEstado = (valor: string) =>
    valor === "HABILITADA" ? "Operativa" : "Mantenimiento";

  return (
    <div style={{
      maxWidth: "1280px",
      margin: "0 auto",
      paddingBottom: "3rem"
    }}>
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <span style={{
            color: "var(--accent-orange)",
            fontWeight: 700
          }}>
            Módulo CA-01
          </span>
          <h1>Listado e Inventario de Canchas</h1>
          <p>
            Gestión de canchas deportivas registradas en FitZone Sports
          </p>
        </div>

        <div className="header-controls">
          <Link to="/admin/canchas/nueva" className="btn-primary">
            + Nueva Cancha
          </Link>
        </div>
      </header>

      <div className="fase4-metrics-grid">
        {[
          ["Total Canchas", canchas.length, "🏟️"],
          ["Operativas", operativas, "✓"],
          ["En Mantenimiento", mantenimiento, "🔧"],
          ["Sedes con Canchas", sedes.length, "📍"],
        ].map(([titulo, valor, icono]) => (
          <div className="fase4-metric-card" key={String(titulo)}>
            <div className="fase4-metric-title">
              <span>{titulo}</span>
              <span>{icono}</span>
            </div>
            <div className="fase4-metric-val">{valor}</div>
            <div className="fase4-metric-sub">
              Datos registrados en PostgreSQL
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="fase4-metric-card">
          <p>{error}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setCargando(true);
              setIntento(v => v + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="classes-filter-bar"
        style={{ marginBottom: "1.5rem" }}>
        <div className="filter-group" style={{ flexGrow: 1 }}>
          <label className="filter-label">Buscar cancha</label>
          <input
            className="form-control"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Nombre, deporte o ID..."
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Sede</label>
          <select className="filter-select" value={sede}
            onChange={e => setSede(e.target.value)}>
            <option value="Todas">Todas</option>
            {sedes.map(s => (
              <option key={s.id} value={String(s.id)}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Deporte</label>
          <select className="filter-select" value={deporte}
            onChange={e => setDeporte(e.target.value)}>
            <option value="Todos">Todos</option>
            {deportes.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select className="filter-select" value={estado}
            onChange={e => setEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="HABILITADA">Operativa</option>
            <option value="EN_MANTENIMIENTO">
              Mantenimiento
            </option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button type="button"
            className={`tab-btn ${vista === "cards" ? "active" : ""}`}
            onClick={() => setVista("cards")}>
            Tarjetas
          </button>
          <button type="button"
            className={`tab-btn ${vista === "table" ? "active" : ""}`}
            onClick={() => setVista("table")}>
            Tabla
          </button>
        </div>
      </div>

      {cargando && <p>Cargando inventario...</p>}

      {!cargando && !error && filtradas.length === 0 && (
        <p>No se encontraron canchas.</p>
      )}

      {!cargando && !error && vista === "cards" && (
        <div className="canchas-grid">
          {filtradas.map(c => (
            <div key={c.id} className="cancha-card">
              <div className="cancha-card-body">
                <div className="cancha-card-header">
                  <span className="cancha-card-code">
                    CAN-{String(c.id).padStart(3, "0")}
                  </span>
                  <h3 className="cancha-card-name">{c.nombre}</h3>
                  <div className="cancha-card-sede">
                    📍 {c.sede.nombre} — {c.sede.localidad}
                  </div>
                </div>

                <div className="cancha-specs-list">
                  <div className="cancha-spec-item">
                    <span className="cancha-spec-label">Deporte</span>
                    <span className="cancha-spec-val">
                      {c.tipo_cancha.nombre}
                    </span>
                  </div>
                  <div className="cancha-spec-item">
                    <span className="cancha-spec-label">Estado</span>
                    <span className={`status-pill ${
                      c.estado === "HABILITADA"
                        ? "status-pill-operativa"
                        : "status-pill-mantenimiento"
                    }`}>
                      {nombreEstado(c.estado)}
                    </span>
                  </div>
                </div>

                <div className="cancha-pricing-box">
                  <div>
                    <div className="cancha-price-main">
                      {precio(c.costo_hora)} / hora
                    </div>
                    <div className="cancha-price-socio">
                      Tarifa base registrada
                    </div>
                  </div>
                </div>

                <div className="cancha-card-actions">
                  <Link
                    to={`/admin/canchas/${c.id}`}
                    className="btn-secondary"
                    style={{ textDecoration: "none" }}
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && !error && vista === "table" && (
        <div className="waitlist-table-container">
          <table style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cancha</th>
                <th>Deporte</th>
                <th>Sede</th>
                <th>Precio/hora</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.tipo_cancha.nombre}</td>
                  <td>{c.sede.nombre}</td>
                  <td>{precio(c.costo_hora)}</td>
                  <td>{nombreEstado(c.estado)}</td>
                  <td>
                    <Link to={`/admin/canchas/${c.id}`}>
                      Detalle
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
