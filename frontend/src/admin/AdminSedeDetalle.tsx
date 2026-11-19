import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerSedePorId } from "../services/sedesService";
import type { SedeApi } from "../services/sedesService";
import "../admin.css";

export default function AdminSedeDetalle() {
  const { id } = useParams<{ id: string }>();

  const [sede, setSede] = useState<SedeApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarSede() {
      setCargando(true);
      setError(null);
      setSede(null);

      const sedeId = Number(id);

      if (!Number.isSafeInteger(sedeId) || sedeId <= 0) {
        setError("El identificador de la sede no es válido.");
        setCargando(false);
        return;
      }

      try {
        const datos = await obtenerSedePorId(sedeId);

        if (activo) {
          setSede(datos);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo consultar la sede."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarSede();

    return () => {
      activo = false;
    };
  }, [id, intento]);

  return (
    <>
      <header className="topbar">
        <div className="header-titles">
          <h1>Detalle de sede</h1>
          <p>Información registrada en FitZone.</p>
        </div>

        <Link
          to="/admin/sedes"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          Volver a sedes
        </Link>
      </header>

      {cargando ? (
        <section
          className="table-container"
          role="status"
          style={{ padding: "1.5rem" }}
        >
          Cargando sede...
        </section>
      ) : error ? (
        <section
          className="table-container"
          style={{ padding: "1.5rem" }}
        >
          <p role="alert">{error}</p>

          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={() => setIntento((actual) => actual + 1)}
          >
            Reintentar
          </button>
        </section>
      ) : sede ? (
        <section
          className="table-container"
          style={{ padding: "1.5rem" }}
        >
          <h2>{sede.nombre}</h2>

          <dl
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "1.5rem",
              marginTop: "1.5rem",
            }}
          >
            {[
              { etiqueta: "Identificador", valor: sede.id },
              { etiqueta: "Dirección", valor: sede.direccion },
              { etiqueta: "Localidad", valor: sede.localidad },
              {
                etiqueta: "Capacidad máxima",
                valor: `${sede.aforo_maximo} personas`,
              },
              {
                etiqueta: "Fecha de registro",
                valor: new Date(sede.creada_at).toLocaleString("es-AR"),
              },
            ].map((dato) => (
              <div key={dato.etiqueta}>
                <dt
                  style={{
                    color: "var(--text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {dato.etiqueta}
                </dt>

                <dd style={{ margin: 0, fontWeight: 600 }}>
                  {dato.valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </>
  );
}