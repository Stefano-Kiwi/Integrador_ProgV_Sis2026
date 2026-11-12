import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerSedes } from "../../services/sedesService";
import type { SedeApi } from "../../services/sedesService";
import "../../admin.css";

export default function AdminSedes() {
  const [sedesApi, setSedesApi] = useState<SedeApi[]>([]);
  const [cargandoApi, setCargandoApi] = useState(true);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarSedes() {
      if (activo) {
        setCargandoApi(true);
        setErrorApi(null);
      }

      try {
        const datos = await obtenerSedes();

        if (activo) {
          setSedesApi(datos);
        }
      } catch (error) {
        if (activo) {
          setErrorApi(
            error instanceof Error
              ? error.message
              : "No se pudieron consultar las sedes."
          );
        }
      } finally {
        if (activo) {
          setCargandoApi(false);
        }
      }
    }

    void cargarSedes();

    return () => {
      activo = false;
    };
  }, [intento]);

  const textoBusqueda = busqueda.trim().toLocaleLowerCase("es-AR");

  const sedesFiltradas = sedesApi.filter((sede) =>
    [sede.nombre, sede.direccion, sede.localidad].some((valor) =>
      valor.toLocaleLowerCase("es-AR").includes(textoBusqueda)
    )
  );

  return (
    <>
      <Link
        to="/admin/sedes/nueva"
        className="btn-primary"
        style={{ textDecoration: "none" }}
      >
        + Nueva sede
      </Link>

      <header className="topbar">
        <div className="header-titles">
          <h1>Gestión de Sedes</h1>
          <p>Consulta las sucursales registradas en FitZone.</p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          disabled={cargandoApi}
          onClick={() => setIntento((actual) => actual + 1)}
        >
          {cargandoApi ? "Cargando..." : errorApi ? "Reintentar" : "Actualizar"}
        </button>
      </header>

      <section
        className="table-container"
        style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
      >
        <h2>Sedes registradas</h2>

        <div style={{ margin: "1rem 0" }}>
          <input
            type="search"
            className="search-input"
            aria-label="Buscar sedes"
            placeholder="Buscar por nombre, dirección o localidad..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            style={{ width: "100%", paddingLeft: "1rem" }}
          />
        </div>

        {cargandoApi ? (
          <p role="status">Cargando sedes...</p>
        ) : errorApi ? (
          <p role="alert">{errorApi}</p>
        ) : sedesApi.length === 0 ? (
          <p>No hay sedes registradas.</p>
        ) : sedesFiltradas.length === 0 ? (
          <p role="status">No hay sedes que coincidan con la búsqueda.</p>
        ) : (
          <div
            className="sedes-cards-grid"
            style={{ marginTop: "1.5rem" }}
          >
            {sedesFiltradas.map((sede) => (
              <article key={sede.id} className="sede-card">
                <div className="sede-card-body">
                  <h3 className="sede-card-title">
                    {sede.nombre}
                    <Link
                      to={`/admin/sedes/${sede.id}`}
                      className="btn-secondary"
                      style={{
                        display: "inline-block",
                        textDecoration: "none",
                        marginTop: "0.75rem",
                      }}
                    >
                      Ver detalle
                    </Link>
                  </h3>

                  <p className="sede-card-address">{sede.direccion}</p>

                  <div className="sede-specs-list">
                    <div className="sede-spec-item">
                      <span className="sede-spec-label">Localidad</span>
                      <span className="sede-spec-val">{sede.localidad}</span>
                    </div>

                    <div className="sede-spec-item">
                      <span className="sede-spec-label">
                        Capacidad máxima
                      </span>
                      <span className="sede-spec-val">
                        {sede.aforo_maximo} personas
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}