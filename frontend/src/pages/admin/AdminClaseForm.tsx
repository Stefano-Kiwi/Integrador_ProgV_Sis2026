
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  obtenerClases,
  crearClase,
  type ClaseApi,
} from "../../services/clasesService";
import {
  obtenerSedes,
  type SedeApi,
} from "../../services/sedesService";
import "../../admin.css";

export default function AdminClaseForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const esEdicion = id !== undefined;

  const [sedes, setSedes] = useState<SedeApi[]>([]);
  const [tipos, setTipos] = useState<ClaseApi["tipo_clase"][]>([]);
  const [instructores, setInstructores] = useState<ClaseApi["instructor"][]>([]);

  const [sedeId, setSedeId] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [capacidad, setCapacidad] = useState(20);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (esEdicion) {
      return;
    }

    let activo = true;

    async function cargarDatos() {
      try {
        const [sedesApi, clasesApi] = await Promise.all([
          obtenerSedes(),
          obtenerClases(),
        ]);

        if (!activo) return;

        const tiposUnicos = Array.from(
          new Map(
            clasesApi.map(c => [c.tipo_clase.id, c.tipo_clase])
          ).values()
        );

        const instructoresUnicos = Array.from(
          new Map(
            clasesApi.map(c => [c.instructor.id, c.instructor])
          ).values()
        );

        setSedes(sedesApi);
        setTipos(tiposUnicos);
        setInstructores(instructoresUnicos);

        setSedeId(String(sedesApi[0]?.id ?? ""));
        setTipoId(String(tiposUnicos[0]?.id ?? ""));
        setInstructorId(String(instructoresUnicos[0]?.id ?? ""));
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

    void cargarDatos();
    return () => {
      activo = false;
    };
  }, [esEdicion]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (guardando || esEdicion) return;

    setError(null);

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (
      !sedeId ||
      !tipoId ||
      !instructorId ||
      !inicio ||
      !fin ||
      Number.isNaN(fechaInicio.getTime()) ||
      Number.isNaN(fechaFin.getTime()) ||
      fechaInicio <= new Date() ||
      fechaFin <= fechaInicio ||
      !Number.isInteger(capacidad) ||
      capacidad <= 0
    ) {
      setError(
        "Revisá los datos. La clase debe comenzar en el futuro, " +
        "finalizar después de su inicio y tener capacidad positiva."
      );
      return;
    }

    setGuardando(true);

    try {
      await crearClase({
        sede_id: Number(sedeId),
        tipo_clase_id: Number(tipoId),
        instructor_id: Number(instructorId),
        inicio_at: fechaInicio.toISOString(),
        fin_at: fechaFin.toISOString(),
        capacidad_maxima: capacidad,
      });

      navigate("/admin/clases");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la clase."
      );
    } finally {
      setGuardando(false);
    }
  }

  if (esEdicion) {
    return (
      <div className="reserva-step-card">
        <h2>Edición de clases no disponible</h2>
        <p>
          El backend todavía no ofrece un endpoint para
          modificar una clase existente.
        </p>
        <Link to="/admin/clases" className="btn-secondary">
          Volver a la agenda
        </Link>
      </div>
    );
  }

  const tipoSeleccionado = tipos.find(
    t => String(t.id) === tipoId
  );

  const instructorSeleccionado = instructores.find(
    i => String(i.id) === instructorId
  );

  const sedeSeleccionada = sedes.find(
    s => String(s.id) === sedeId
  );

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      paddingBottom: "3rem",
    }}>
      <header className="topbar">
        <div className="header-titles">
          <span style={{
            color: "var(--accent-orange)",
            fontWeight: 700,
          }}>
            Módulo C-02
          </span>
          <h1>Programar Nueva Clase Grupal</h1>
          <p>
            Registrá una actividad en la agenda de FitZone Sports.
          </p>
        </div>

        <Link
          to="/admin/clases"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          ← Volver a la agenda
        </Link>
      </header>

      {cargando ? (
        <div className="reserva-step-card">
          Cargando información...
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}>
          <form onSubmit={handleSubmit}>
            <div className="reserva-step-card">
              <h2 className="reserva-step-title">
                <span className="step-num-badge">1</span>
                Información de la clase
              </h2>

              <div className="form-group">
                <label htmlFor="clase-tipo">
                  Disciplina *
                </label>
                <select
                  id="clase-tipo"
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

              <div className="form-group">
                <label htmlFor="clase-instructor">
                  Instructor *
                </label>
                <select
                  id="clase-instructor"
                  className="form-control"
                  value={instructorId}
                  onChange={e => setInstructorId(e.target.value)}
                  required
                >
                  {instructores.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.usuario.nombre} {i.usuario.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="clase-sede">
                  Sede *
                </label>
                <select
                  id="clase-sede"
                  className="form-control"
                  value={sedeId}
                  onChange={e => setSedeId(e.target.value)}
                  required
                >
                  {sedes.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombre} — {s.localidad}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="reserva-step-card">
              <h2 className="reserva-step-title">
                <span className="step-num-badge">2</span>
                Fecha y horario
              </h2>

              <div className="form-group">
                <label htmlFor="clase-inicio">
                  Fecha y hora de inicio *
                </label>
                <input
                  id="clase-inicio"
                  type="datetime-local"
                  className="form-control"
                  value={inicio}
                  onChange={e => setInicio(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="clase-fin">
                  Fecha y hora de finalización *
                </label>
                <input
                  id="clase-fin"
                  type="datetime-local"
                  className="form-control"
                  value={fin}
                  onChange={e => setFin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="reserva-step-card">
              <h2 className="reserva-step-title">
                <span className="step-num-badge">3</span>
                Capacidad de la clase
              </h2>

              <div className="form-group">
                <label htmlFor="clase-capacidad">
                  Capacidad máxima *
                </label>
                <input
                  id="clase-capacidad"
                  type="number"
                  min={1}
                  step={1}
                  className="form-control"
                  value={capacidad}
                  onChange={e =>
                    setCapacidad(Number(e.target.value))
                  }
                  required
                />
              </div>

              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}>
                La clase nueva comenzará con todos sus
                cupos disponibles.
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
            }}>
              <Link
                to="/admin/clases"
                className="btn-secondary"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="btn-primary"
                disabled={
                  guardando ||
                  !sedes.length ||
                  !tipos.length ||
                  !instructores.length
                }
              >
                {guardando
                  ? "Guardando..."
                  : "Confirmar y Programar Clase"}
              </button>
            </div>
          </form>

          <aside className="reserva-summary-sticky">
            <div className="reserva-step-card">
              <span style={{
                color: "var(--accent-orange)",
                fontWeight: 800,
              }}>
                VISTA PREVIA
              </span>

              <h2 style={{ marginTop: "1rem" }}>
                {tipoSeleccionado?.nombre || "Nueva clase"}
              </h2>

              <p>
                Instructor:{" "}
                {instructorSeleccionado
                  ? `${instructorSeleccionado.usuario.nombre} ${instructorSeleccionado.usuario.apellido}`
                  : "Sin instructor"}
              </p>

              <p>
                Sede: {sedeSeleccionada?.nombre || "Sin sede"}
              </p>

              <p>
                Inicio: {inicio
                  ? new Date(inicio).toLocaleString("es-AR")
                  : "Sin definir"}
              </p>

              <p>
                Fin: {fin
                  ? new Date(fin).toLocaleString("es-AR")
                  : "Sin definir"}
              </p>

              <div className="cancha-pricing-box">
                <strong>Capacidad: {capacidad} personas</strong>
              </div>

              <span className="status-pill status-pill-operativa">
                NUEVA PROGRAMACIÓN
              </span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
