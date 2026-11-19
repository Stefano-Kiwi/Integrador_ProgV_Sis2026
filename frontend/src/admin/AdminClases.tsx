import AdminInscripcionClase from "../components/organisms/AdminInscripcionClase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  eliminarClase,
  obtenerClases,
  type ClaseApi,
} from "../services/clasesService";
import { useAppStore } from "../store";
import { getPermisosUsuario } from "../services/permissions";
import "../admin.css";

const fechaCompleta = (fecha: string) =>
  new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(fecha));

const horaLocal = (fecha: string) =>
  new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(fecha));

const diaClave = (fecha: string) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(fecha));

const colores: Record<string, string> = {
  Spinning: "border-orange",
  Yoga: "border-green",
  CrossFit: "border-yellow",
  Pilates: "border-red",
};

export default function AdminClases() {
  const { usuario } = useAppStore();
  const permisos = getPermisosUsuario(usuario);
  const [clases, setClases] = useState<ClaseApi[]>([]);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [seleccionadaId, setSeleccionadaId] = useState<number | null>(null);
  const [disciplina, setDisciplina] = useState("Todas");
  const [instructor, setInstructor] = useState("Todos");
  const [cupos, setCupos] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerClases();
        if (!activo) return;

        setClases(datos);
        setSeleccionadaId(datos[0]?.id ?? null);
        setError(null);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las clases."
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
  }, [intento]);

  const nombreInstructor = (c: ClaseApi) =>
    `${c.instructor.usuario.nombre} ${c.instructor.usuario.apellido}`;

  const disciplinas = Array.from(
    new Set(clases.map(c => c.tipo_clase.nombre))
  );

  const instructores = Array.from(
    new Set(clases.map(nombreInstructor))
  );

  const filtradas = clases.filter(c => {
    const disponible = c.cupo_disponible > 0;

    return (
      (disciplina === "Todas" ||
        c.tipo_clase.nombre === disciplina) &&
      (instructor === "Todos" ||
        nombreInstructor(c) === instructor) &&
      (cupos === "Todos" ||
        (cupos === "Disponibles" && disponible) ||
        (cupos === "Completas" && !disponible))
    );
  });

  const seleccionada =
    filtradas.find(c => c.id === seleccionadaId) ??
    filtradas[0] ??
    null;

  const dias = Array.from(
    new Set(filtradas.map(c => diaClave(c.inicio_at)))
  ).sort();

  const totalCupos = clases.reduce(
    (suma, c) => suma + c.capacidad_maxima, 0
  );

  const cuposLibres = clases.reduce(
    (suma, c) => suma + c.cupo_disponible, 0
  );

  const finalizada = (c: ClaseApi) =>
    new Date(c.fin_at).getTime() <= Date.now();

  return (
    <div>
      <header className="topbar">
        <div className="header-titles">
          <span style={{
            color: "var(--accent-orange)",
            fontWeight: 700,
          }}>
            Módulos C-01 & C-03
          </span>

          <h1>Planificación de Clases y Asistencia</h1>
          <p>
            Agenda de actividades grupales registrada en FitZone Sports.
          </p>
        </div>

        <div className="header-controls">
          <Link
            to="/admin/clases/nueva"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            + Programar Clase
          </Link>
        </div>
      </header>

      <div className="fase4-metrics-grid">
        {[
          ["Clases registradas", clases.length],
          ["Capacidad total", totalCupos],
          ["Cupos disponibles", cuposLibres],
          ["Clases completas", clases.filter(
            c => c.cupo_disponible === 0
          ).length],
        ].map(([titulo, valor]) => (
          <div className="fase4-metric-card" key={String(titulo)}>
            <div className="fase4-metric-title">
              <span>{titulo}</span>
            </div>
            <div className="fase4-metric-val">{valor}</div>
            <div className="fase4-metric-sub">
              Información del backend
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="reserva-step-card" role="alert">
          <p>{error}</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setCargando(true);
              setError(null);
              setIntento(v => v + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="classes-filter-bar">
        <div className="filter-group">
          <label className="filter-label">Disciplina:</label>
          <select
            className="filter-select"
            value={disciplina}
            onChange={e => setDisciplina(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {disciplinas.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Instructor:</label>
          <select
            className="filter-select"
            value={instructor}
            onChange={e => setInstructor(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {instructores.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Cupos:</label>
          <select
            className="filter-select"
            value={cupos}
            onChange={e => setCupos(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Disponibles">Con cupos</option>
            <option value="Completas">Completas</option>
          </select>
        </div>
      </div>

      {cargando && <p>Cargando clases...</p>}

      {!cargando && !error && filtradas.length === 0 && (
        <div className="reserva-step-card">
          No hay clases que coincidan con los filtros.
        </div>
      )}

      {!cargando && !error && filtradas.length > 0 && (
        <div className="classes-layout">
          <section className="calendar-section">
            <div
              className="week-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.max(
                  1,
                  Math.min(dias.length, 5)
                )}, minmax(180px, 1fr))`,
                overflowX: "auto",
              }}
            >
              {dias.map(dia => {
                const clasesDia = filtradas.filter(
                  c => diaClave(c.inicio_at) === dia
                );

                return (
                  <div key={dia} className="day-column">
                    <div className="day-header">
                      {fechaCompleta(clasesDia[0].inicio_at)}
                    </div>

                    {clasesDia.map(c => {
                      const esSeleccionada =
                        seleccionada?.id === c.id;

                      return (
                        <button
                          type="button"
                          key={c.id}
                          className={`class-card ${
                            colores[c.tipo_clase.nombre] ??
                            "border-orange"
                          } ${
                            esSeleccionada
                              ? "selected-class"
                              : ""
                          }`}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                          onClick={() => setSeleccionadaId(c.id)}
                        >
                          <div className="class-name">
                            {c.tipo_clase.nombre}
                          </div>

                          <div className="class-instructor">
                            {nombreInstructor(c)}
                          </div>

                          <div className="class-meta">
                            <span className="class-time">
                              {horaLocal(c.inicio_at)}
                            </span>

                            <span className="class-capacity">
                              {c.capacidad_maxima -
                                c.cupo_disponible}
                              /{c.capacidad_maxima}
                            </span>
                          </div>

                          <div style={{
                            fontSize: "0.75rem",
                            marginTop: "0.5rem",
                            color: "var(--text-muted)",
                          }}>
                            {finalizada(c)
                              ? "Finalizada"
                              : c.cupo_disponible === 0
                                ? "Sin cupos"
                                : `${c.cupo_disponible} cupos libres`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="details-section">
            {seleccionada && (
              <>
                <div className="details-header">
                  <h2>{seleccionada.tipo_clase.nombre}</h2>
                  <p>
                    {fechaCompleta(seleccionada.inicio_at)}
                    {" • "}
                    {horaLocal(seleccionada.inicio_at)}
                    {" - "}
                    {horaLocal(seleccionada.fin_at)}
                  </p>
                </div>

                <div className="reserva-step-card">
                  <h3>Información de la clase</h3>

                  <p>
                    <strong>Instructor:</strong>{" "}
                    {nombreInstructor(seleccionada)}
                  </p>

                  <p>
                    <strong>Sede:</strong>{" "}
                    {seleccionada.sede.nombre}
                  </p>

                  <p>
                    <strong>Capacidad máxima:</strong>{" "}
                    {seleccionada.capacidad_maxima}
                  </p>

                  <p>
                    <strong>Inscriptos:</strong>{" "}
                    {seleccionada.capacidad_maxima -
                      seleccionada.cupo_disponible}
                  </p>

                  <p>
                    <strong>Cupos disponibles:</strong>{" "}
                    {seleccionada.cupo_disponible}
                  </p>

                  <p>
                    <strong>Estado:</strong>{" "}
                    {finalizada(seleccionada)
                      ? "Finalizada"
                      : "Programada"}
                  </p>
                </div>
                <AdminInscripcionClase
  key={seleccionada.id}
  claseId={seleccionada.id}
  finalizada={finalizada(seleccionada)}
  onInscripcionExitosa={() => setIntento(v => v + 1)}
/>
                {permisos.puedeEliminarClases && (
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={eliminandoId === seleccionada.id}
                    style={{
                      marginTop: "0.85rem",
                      width: "100%",
                      borderColor: "var(--accent-red, #ff4b72)",
                      color: "var(--accent-red, #ff4b72)",
                    }}
                    onClick={async () => {
                      if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) return;
                      setEliminandoId(seleccionada.id);
                      setError(null);
                      try {
                        await eliminarClase(seleccionada.id);
                        setIntento((v) => v + 1);
                      } catch (err) {
                        setError(
                          err instanceof Error ? err.message : "No se pudo eliminar la clase."
                        );
                      } finally {
                        setEliminandoId(null);
                      }
                    }}
                  >
                    {eliminandoId === seleccionada.id ? "Eliminando..." : "Eliminar clase"}
                  </button>
                )}
                <p style={{
                  marginTop: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}>
                  Los datos provienen de PostgreSQL.
                  El listado de asistentes y la lista de
                  espera requieren consultas adicionales
                  al backend.
                </p>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
