
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  crearCancha,
  obtenerCanchas,
  type CanchaApi,
} from "../services/canchasService";
import {
  obtenerSedes,
  type SedeApi,
} from "../services/sedesService";
import { getPermisosUsuario } from "../services/permissions";
import { useAppStore } from "../store";
import "../admin.css";

export default function AdminCanchaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const esEdicion = id !== undefined;
  const { usuario } = useAppStore();
  const permisos = getPermisosUsuario(usuario);

  const [sedes, setSedes] = useState<SedeApi[]>([]);
  const [tipos, setTipos] = useState<
    CanchaApi["tipo_cancha"][]
  >([]);

  const [nombre, setNombre] = useState("");
  const [sedeId, setSedeId] = useState(
    permisos.esGerente && permisos.sedeAsignadaId
      ? String(permisos.sedeAsignadaId)
      : ""
  );
  const [tipoId, setTipoId] = useState("");
  const [costoHora, setCostoHora] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const [sedesApi, canchasApi] = await Promise.all([
          obtenerSedes(),
          obtenerCanchas(),
        ]);

        if (!activo) return;

        const tiposUnicos = Array.from(
          new Map(
            canchasApi.map(c => [
              c.tipo_cancha.id,
              c.tipo_cancha,
            ])
          ).values()
        );

        setSedes(sedesApi);
        setTipos(tiposUnicos);
        setSedeId(
          permisos.esGerente && permisos.sedeAsignadaId
            ? String(permisos.sedeAsignadaId)
            : String(sedesApi[0]?.id ?? "")
        );
        setTipoId(String(tiposUnicos[0]?.id ?? ""));
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los datos."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    if (!esEdicion) {
      void cargarDatos();
    } else {
      setCargando(false);
    }

    return () => {
      activo = false;
    };
  }, [esEdicion, permisos.esGerente, permisos.sedeAsignadaId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (guardando || esEdicion) return;

    setError(null);

    const costo = Number(costoHora);

    if (
      !nombre.trim() ||
      !sedeId ||
      !tipoId ||
      !Number.isFinite(costo) ||
      costo <= 0
    ) {
      setError("Revisá los datos ingresados.");
      return;
    }

    setGuardando(true);

    try {
      await crearCancha({
        nombre: nombre.trim(),
        sede_id: Number(sedeId),
        tipo_cancha_id: Number(tipoId),
        costo_hora: costo,
      });

      navigate("/admin/canchas/listado");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la cancha."
      );
    } finally {
      setGuardando(false);
    }
  }

  if (esEdicion) {
    return (
      <div className="reserva-step-card">
        <h2>Edición de canchas no disponible</h2>
        <p>
          El backend todavía no dispone de un endpoint
          para actualizar los datos de una cancha.
        </p>
        <Link
          to="/admin/canchas/listado"
          className="btn-secondary"
        >
          Volver al inventario
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      paddingBottom: "3rem",
    }}>
      <header
        className="topbar"
        style={{ marginBottom: "1.5rem" }}
      >
        <div className="header-titles">
          <span style={{
            color: "var(--accent-orange)",
            fontWeight: 700,
          }}>
            Módulo CA-02
          </span>
          <h1>Alta de Nueva Cancha</h1>
          <p>
            Registrá una nueva cancha deportiva en FitZone Sports.
          </p>
        </div>

        <Link
          to="/admin/canchas/listado"
          className="btn-secondary"
        >
          ← Volver al inventario
        </Link>
      </header>

      {cargando ? (
        <div className="reserva-step-card">
          Cargando datos...
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}>
          <form onSubmit={handleSubmit}>
            <div className="reserva-step-card">
              <h2 className="reserva-step-title">
                <span className="step-num-badge">1</span>
                Identificación y ubicación
              </h2>

              <div className="form-group">
                <label htmlFor="cancha-nombre">
                  Nombre de la cancha *
                </label>
                <input
                  id="cancha-nombre"
                  className="form-control"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej. Cancha Pádel 4"
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cancha-sede">
                  Sede *
                </label>
                <select
                  id="cancha-sede"
                  className="form-control"
                  value={sedeId}
                  onChange={e => setSedeId(e.target.value)}
                  disabled={!permisos.puedeCambiarDeSede}
                  required
                >
                  {sedes.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombre} — {s.localidad}
                    </option>
                  ))}
                </select>
                {permisos.esGerente && (
                  <small style={{ color: "var(--text-muted)", display: "block", marginTop: "0.35rem" }}>
                    La cancha se asignará automáticamente a tu sede.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cancha-tipo">
                  Tipo de cancha *
                </label>
                <select
                  id="cancha-tipo"
                  className="form-control"
                  value={tipoId}
                  onChange={e => setTipoId(e.target.value)}
                  required
                >
                  {tipos.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="reserva-step-card">
              <h2 className="reserva-step-title">
                <span className="step-num-badge">2</span>
                Configuración tarifaria
              </h2>

              <div className="form-group">
                <label htmlFor="cancha-costo">
                  Costo por hora (ARS) *
                </label>
                <input
                  id="cancha-costo"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="form-control"
                  value={costoHora}
                  onChange={e => setCostoHora(e.target.value)}
                  placeholder="Ej. 12000"
                  required
                />
              </div>

              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}>
                El backend registra las canchas nuevas
                con estado HABILITADA.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                style={{ color: "var(--accent-red)" }}
              >
                {error}
              </p>
            )}

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}>
              <Link
                to="/admin/canchas/listado"
                className="btn-secondary"
              >
                Cancelar
              </Link>

              <button
                className="btn-primary"
                type="submit"
                disabled={
                  guardando ||
                  !sedes.length ||
                  !tipos.length
                }
              >
                {guardando
                  ? "Guardando..."
                  : "Crear Cancha"}
              </button>
            </div>
          </form>

          <aside className="reserva-summary-sticky">
            <div className="reserva-step-card">
              <span style={{
                color: "var(--accent-orange)",
                fontWeight: 700,
              }}>
                VISTA PREVIA
              </span>

              <h2 style={{ marginTop: "1rem" }}>
                {nombre || "Nueva Cancha"}
              </h2>

              <p>
                {sedes.find(
                  s => String(s.id) === sedeId
                )?.nombre || "Sin sede"}
              </p>

              <p>
                {tipos.find(
                  t => String(t.id) === tipoId
                )?.nombre || "Sin deporte"}
              </p>

              <div className="cancha-pricing-box">
                <div className="cancha-price-main">
                  {Number(costoHora || 0).toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS",
                    }
                  )} / hora
                </div>
              </div>

              <span className="status-pill status-pill-operativa">
                HABILITADA
              </span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
