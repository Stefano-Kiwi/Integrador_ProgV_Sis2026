import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarios } from "../../services/usuariosService";
import type { UsuarioApi } from "../../services/usuariosService";
import { obtenerToken } from "../../services/authService";
import { Link } from "react-router-dom";
import "../../admin.css";

const ROLES_PERSONAL = [
  "Administrador",
  "Gerente",
  "Instructor",
  "Recepcionista",
];

const POR_PAGINA = 6;

export default function AdminPersonal() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState<UsuarioApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarPersonal() {
      setCargando(true);
      setError(null);

      try {
        const usuarios = await obtenerUsuarios();

        if (activo) {
          setPersonal(
            usuarios.filter((usuario) =>
              ROLES_PERSONAL.includes(usuario.rol.clase_rol),
            ),
          );
          setPagina(1);
        }
      } catch (err) {
        if (!activo) return;

        if (!obtenerToken()) {
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(
          err instanceof TypeError
            ? "No se pudo conectar con el servidor."
            : err instanceof Error
              ? err.message
              : "No se pudo cargar el personal.",
        );
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarPersonal();

    return () => {
      activo = false;
    };
  }, [navigate, intento]);

  const consulta = busqueda.trim().toLocaleLowerCase("es-AR");

  const filtrados = personal.filter((usuario) => {
    const coincideBusqueda = [
      `${usuario.nombre} ${usuario.apellido}`,
      usuario.email,
      usuario.dni,
      String(usuario.id),
      usuario.sede_base?.nombre ?? "",
    ].some((texto) =>
      texto.toLocaleLowerCase("es-AR").includes(consulta),
    );

    return (
      coincideBusqueda &&
      (rol === "Todos" || usuario.rol.clase_rol === rol)
    );
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / POR_PAGINA),
  );

  const paginaActual = Math.min(pagina, totalPaginas);

  const registros = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  function limpiarFiltros() {
    setBusqueda("");
    setRol("Todos");
    setPagina(1);
  }

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Gestión de Personal</h1>
          <p>Consulta del personal registrado en FitZone.</p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          disabled={cargando}
          onClick={() => setIntento((actual) => actual + 1)}
        >
          {cargando ? "Cargando..." : error ? "Reintentar" : "Actualizar"}
        </button>
      </header>

      {cargando ? (
        <section className="panel-card" role="status">
          Cargando personal...
        </section>
      ) : error ? (
        <section className="panel-card" role="alert">
          {error}
        </section>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "1rem",
            }}
          >
            <section className="panel-card">
              <h2>Total de personal</h2>
              <p className="kpi-value">{personal.length}</p>
            </section>

            {ROLES_PERSONAL.map((nombreRol) => (
              <section key={nombreRol} className="panel-card">
                <h2 style={{ fontSize: "1rem" }}>{nombreRol}</h2>
                <p className="kpi-value">
                  {
                    personal.filter(
                      (usuario) => usuario.rol.clase_rol === nombreRol,
                    ).length
                  }
                </p>
              </section>
            ))}
          </div>

          <div
            className="action-bar"
            style={{ flexWrap: "wrap", gap: "1rem" }}
          >
            <input
              type="search"
              className="form-control"
              aria-label="Buscar personal"
              placeholder="Nombre, correo, DNI, ID o sede..."
              value={busqueda}
              onChange={(event) => {
                setBusqueda(event.target.value);
                setPagina(1);
              }}
              style={{ maxWidth: "360px", width: "100%" }}
            />

            <select
              className="form-control"
              aria-label="Filtrar por rol"
              value={rol}
              onChange={(event) => {
                setRol(event.target.value);
                setPagina(1);
              }}
              style={{ width: "auto" }}
            >
              <option value="Todos">Todos los roles</option>
              {ROLES_PERSONAL.map((nombreRol) => (
                <option key={nombreRol} value={nombreRol}>
                  {nombreRol}
                </option>
              ))}
            </select>

            {(busqueda !== "" || rol !== "Todos") && (
              <button
                type="button"
                className="btn-secondary"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {personal.length === 0 ? (
            <section className="panel-card" role="status">
              No hay personal registrado.
            </section>
          ) : filtrados.length === 0 ? (
            <section className="panel-card" role="status">
              No hay registros que coincidan con los filtros.
            </section>
          ) : (
            <section className="panel-card" style={{ padding: 0 }}>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre y apellido</th>
                      <th>Correo</th>
                      <th>DNI</th>
                      <th>Teléfono</th>
                      <th>Rol</th>
                      <th>Sede base</th>
                      <th>Fecha de alta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registros.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>
                          {usuario.nombre} {usuario.apellido}
                        </td>
                        <td>{usuario.email}</td>
                        <td>{usuario.dni}</td>
                        <td>{usuario.telefono || "Sin teléfono"}</td>
                        <td>{usuario.rol.clase_rol}</td>
                        <td>
                          {usuario.sede_base?.nombre || "Sin sede asignada"}
                        </td>
                        <td>
                          {new Date(usuario.creado_at).toLocaleDateString(
                            "es-AR",
                          )}
                        </td>
                        <td>
                        <Link
                          to={`/admin/personal/${usuario.id}`}
                          className="btn-secondary"
                          style={{
                            display: "inline-block",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Ver detalle
                        </Link>
</td>
                      </tr>
                      
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  padding: "1rem",
                }}
              >
                <span>
                  Página {paginaActual} de {totalPaginas}
                  {" · "}{filtrados.length} registros
                </span>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={paginaActual === 1}
                    onClick={() => setPagina(paginaActual - 1)}
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPagina(paginaActual + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}