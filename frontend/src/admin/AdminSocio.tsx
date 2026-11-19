
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerUsuarios,
  type UsuarioApi,
} from "../services/usuariosService";
import "../admin.css";

export default function AdminSocio() {
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [sede, setSede] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerUsuarios();

        if (!activo) return;

        setUsuarios(
          datos.filter(
            u => u.rol.clase_rol.toLowerCase() === "cliente"
          )
        );

        setError(null);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron consultar los socios."
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

  const sedes = Array.from(
    new Set(
      usuarios
        .map(u => u.sede_base?.nombre)
        .filter((nombre): nombre is string => Boolean(nombre))
    )
  ).sort();

  const filtrados = usuarios.filter(usuario => {
    const texto = [
      usuario.id,
      usuario.nombre,
      usuario.apellido,
      usuario.dni,
      usuario.email,
      usuario.sede_base?.nombre ?? "",
    ].join(" ").toLowerCase();

    return (
      texto.includes(busqueda.trim().toLowerCase()) &&
      (sede === "Todas" ||
        usuario.sede_base?.nombre === sede)
    );
  });

  const conSede = usuarios.filter(
    usuario => usuario.sede_base !== null
  ).length;

  const sinSede = usuarios.length - conSede;

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <span style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--accent-orange)",
          }}>
            Módulo M1 — Gestión de Socios
          </span>

          <h1>Administración de Socios</h1>

          <p>
            Clientes registrados en FitZone Sports,
            consultados directamente desde PostgreSQL.
          </p>
        </div>

        <div className="header-controls" style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}>
          <button
            className="btn-secondary"
            type="button"
            onClick={actualizar}
            disabled={cargando}
          >
            ↻ Actualizar
          </button>

          <Link
            to="/admin/personal/nuevo"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            + Registrar Usuario
          </Link>
        </div>
      </header>

      <div className="sedes-metrics-grid">
        {[
          ["Socios registrados", usuarios.length, "👥"],
          ["Con sede asignada", conSede, "🏢"],
          ["Sin sede asignada", sinSede, "📍"],
        ].map(([titulo, cantidad, icono]) => (
          <div key={String(titulo)} className="sede-metric-card">
            <div className="sede-metric-title">
              <span>{titulo}</span>
              <span>{icono}</span>
            </div>

            <div className="sede-metric-val">
              {cantidad}
            </div>

            <div className="sede-metric-sub">
              Información registrada en el backend
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
              placeholder="Buscar socio, DNI o correo..."
              aria-label="Buscar socios"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            aria-label="Filtrar por sede"
            value={sede}
            onChange={e => setSede(e.target.value)}
          >
            <option value="Todas">Todas las sedes</option>

            {sedes.map(nombre => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && (
        <div className="panel-card">
          Cargando socios desde PostgreSQL...
        </div>
      )}

      {!cargando && error && (
        <div className="panel-card" role="alert">
          <h2>No se pudieron cargar los socios</h2>
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

      {!cargando && !error && filtrados.length === 0 && (
        <div className="panel-card">
          <h3>No hay socios para mostrar</h3>
          <p>
            No se encontraron clientes registrados
            que coincidan con los filtros.
          </p>
        </div>
      )}

      {!cargando && !error && filtrados.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Socio</th>
                <th>Nombre completo</th>
                <th>DNI</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Sede Base</th>
                <th>Membresía</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map(usuario => (
                <tr key={usuario.id}>
                  <td className="transaction-id">
                    SOC-{String(usuario.id).padStart(4, "0")}
                  </td>

                  <td>
                    <div className="user-name">
                      {usuario.nombre} {usuario.apellido}
                    </div>
                  </td>

                  <td>{usuario.dni}</td>

                  <td>{usuario.email}</td>

                  <td>{usuario.telefono ?? "No registrado"}</td>

                  <td>
                    {usuario.sede_base?.nombre ??
                      "Sin sede asignada"}
                  </td>

                  <td>
                    <span className="status-badge status-warning">
                      Sin consulta disponible
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/admin/personal/${usuario.id}`}
                      className="btn-secondary"
                      style={{
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Ver usuario
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!cargando && !error && (
        <div className="pagination-area">
          <span className="pagination-info">
            Mostrando {filtrados.length} de {usuarios.length} socios
          </span>
        </div>
      )}

      <section
        className="panel-card"
        style={{ marginTop: "1.5rem" }}
      >
        <h3>Estado de las membresías</h3>

        <p style={{ color: "var(--text-muted)" }}>
          Los socios de esta pantalla son usuarios reales
          con rol Cliente.
        </p>

        <p style={{ color: "var(--text-muted)" }}>
          Para consultar sus planes contratados,
          vencimientos y estados, necesitamos
          integrar un endpoint de membresías.
          No se muestran membresías ficticias.
        </p>

        <Link
          to="/admin/planes"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          Consultar planes disponibles
        </Link>
      </section>
    </>
  );
}
