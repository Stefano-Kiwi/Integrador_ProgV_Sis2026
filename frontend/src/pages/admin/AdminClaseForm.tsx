import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getClaseById, saveClase, type ClaseItem } from "../../data/clasesCanchasData";
import { INITIAL_INSTRUCTORES, INITIAL_TIPOS_CLASE } from "../../data/catalogosData";
import { getSedes } from "../../data/sedesData";
import "../../admin.css";

const PRESET_EQUIPAMIENTOS = [
  "Bicicletas magnéticas",
  "Barras olímpicas",
  "Discos bumpers",
  "Kettlebells (Pesas rusas)",
  "Mats de yoga",
  "Bloques y correas",
  "Camillas Reformer",
  "Guantines de boxeo",
  "Bolsas de entrenamiento",
  "Cajones pliométricos",
  "Toalla obligatoria",
  "Botella de hidratación personal",
];

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

export default function AdminClaseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const sedes = getSedes();
  const instructores = INITIAL_INSTRUCTORES;
  const tiposClase = INITIAL_TIPOS_CLASE;

  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState(tiposClase[0]?.nombre || "Spinning Pro (Indoor Cycling)");
  const [instructor, setInstructor] = useState(instructores[0]?.nombre || "María José Ramos");
  const [sedeId, setSedeId] = useState(sedes[0]?.id || "parana-centro");
  const [sala, setSala] = useState("Sala Ciclo Climatizada");
  const [diasSeleccionados, setDiasSeleccionados] = useState<ClaseItem["dias"]>(["Lunes", "Miércoles", "Viernes"]);
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [horarioFin, setHorarioFin] = useState("08:50");
  const [cupoMax, setCupoMax] = useState(20);
  const [cupoActual, setCupoActual] = useState(0);
  const [listaEsperaMax, setListaEsperaMax] = useState(6);
  const [nivel, setNivel] = useState<ClaseItem["nivel"]>("Intermedio");
  const [intensidad, setIntensidad] = useState<ClaseItem["intensidad"]>("Alta");
  const [estado, setEstado] = useState<ClaseItem["estado"]>("Activa");
  const [equipamiento, setEquipamiento] = useState<string[]>([
    "Bicicletas magnéticas",
    "Toalla obligatoria",
  ]);
  const [descripcion, setDescripcion] = useState(
    "Sesión de alta intensidad cardiovascular con música guiada y simulación de terrenos."
  );
  const [observaciones, setObservaciones] = useState(
    "Llegar 10 minutos antes para ajuste de sillín. Se penaliza con suspensión si cancela menos de 2 horas antes."
  );

  // Cargar datos para edición si existe ID
  useEffect(() => {
    if (isEditing && id) {
      const cls = getClaseById(id);
      if (cls) {
        setNombre(cls.nombre);
        setDisciplina(cls.disciplina);
        setInstructor(cls.instructor);
        setSedeId(cls.sedeId);
        setSala(cls.sala);
        setDiasSeleccionados(cls.dias);
        setHorarioInicio(cls.horarioInicio);
        setHorarioFin(cls.horarioFin);
        setCupoMax(cls.cupoMax);
        setCupoActual(cls.cupoActual);
        setListaEsperaMax(cls.listaEsperaMax);
        setNivel(cls.nivel);
        setIntensidad(cls.intensidad);
        setEstado(cls.estado);
        setEquipamiento(cls.equipamiento);
        setDescripcion(cls.descripcion);
        setObservaciones(cls.observaciones);
      }
    }
  }, [isEditing, id]);

  const toggleDia = (dia: typeof DIAS_SEMANA[number]) => {
    if (diasSeleccionados.includes(dia)) {
      if (diasSeleccionados.length > 1) {
        setDiasSeleccionados(diasSeleccionados.filter((d) => d !== dia));
      }
    } else {
      setDiasSeleccionados([...diasSeleccionados, dia]);
    }
  };

  const toggleEquipamiento = (item: string) => {
    if (equipamiento.includes(item)) {
      setEquipamiento(equipamiento.filter((e) => e !== item));
    } else {
      setEquipamiento([...equipamiento, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("Por favor ingresa el nombre de la clase.");
      return;
    }

    const sedeObj = sedes.find((s) => s.id === sedeId);

    const savedItem: ClaseItem = {
      id: isEditing && id ? id : `CLS-${Date.now().toString().slice(-4)}`,
      nombre: nombre.trim(),
      disciplina,
      instructor,
      sedeId,
      sedeNombre: sedeObj ? sedeObj.nombre : "Sede Central",
      sala,
      dias: diasSeleccionados,
      horarioInicio,
      horarioFin,
      cupoMax: Number(cupoMax),
      cupoActual: isEditing ? cupoActual : 0,
      listaEsperaMax: Number(listaEsperaMax),
      nivel,
      intensidad,
      estado,
      equipamiento,
      descripcion,
      observaciones,
      colorBorder:
        intensidad === "Extrema"
          ? "border-red"
          : intensidad === "Alta"
          ? "border-orange"
          : intensidad === "Media"
          ? "border-yellow"
          : "border-green",
    };

    saveClase(savedItem);
    alert(isEditing ? "¡Clase actualizada correctamente!" : "¡Clase programada y creada con éxito!");
    navigate("/admin/clases");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo C-02
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {isEditing ? `Modificando clase #${id}` : "Nueva Programación de Clase"}
            </span>
          </div>
          <h1>{isEditing ? `Editar Clase: ${nombre || id}` : "Crear / Programar Nueva Clase Grupal"}</h1>
          <p>Configura los parámetros operativos, instructor, sala, cupos máximos y lista de espera</p>
        </div>
        <div className="header-controls">
          <Link to="/admin/clases" className="btn-secondary" style={{ textDecoration: "none" }}>
            ← Volver a Agenda
          </Link>
        </div>
      </header>

      {/* FORMULARIO Y PREVIEW GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.75rem", alignItems: "start" }}>
        {/* COLUMNA FORMULARIO */}
        <form onSubmit={handleSubmit}>
          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">1</span> Información Básica y Disciplina
            </h2>

            <div className="form-group" style={{ marginBottom: "1.2rem" }}>
              <label>Nombre de la Clase *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="ej. Spinning Pro Interval 50min"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Tipo de Clase / Disciplina *</label>
                <select
                  className="form-control"
                  value={disciplina}
                  onChange={(e) => setDisciplina(e.target.value)}
                >
                  {tiposClase.map((tc) => (
                    <option key={tc.id} value={tc.nombre}>
                      {tc.nombre} ({tc.intensidad})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Instructor Asignado *</label>
                <select
                  className="form-control"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                >
                  {instructores.map((inst) => (
                    <option key={inst.id} value={inst.nombre}>
                      {inst.nombre} — {inst.especialidades[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Sede Operativa *</label>
                <select
                  className="form-control"
                  value={sedeId}
                  onChange={(e) => setSedeId(e.target.value)}
                >
                  {sedes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre} ({s.ciudad})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sala o Espacio Físico *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. Sala Ciclo 1 Climatizada"
                  value={sala}
                  onChange={(e) => setSala(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción de la Sesión</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Breve reseña del entrenamiento y enfoque técnico..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          {/* SECCIÓN 2: HORARIOS Y RECURRENCIA */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">2</span> Días de Dictado y Horario
            </h2>

            <div className="form-group" style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Días de la Semana con Dictado Recurrente:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {DIAS_SEMANA.map((dia) => {
                  const isChecked = diasSeleccionados.includes(dia);
                  return (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: isChecked ? "1px solid var(--accent-orange)" : "1px solid var(--border-color)",
                        backgroundColor: isChecked ? "rgba(255, 94, 58, 0.2)" : "var(--bg-body)",
                        color: isChecked ? "var(--accent-orange)" : "var(--text-muted)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      {isChecked ? `✓ ${dia}` : dia}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Hora Inicio *</label>
                <input
                  type="time"
                  className="form-control"
                  required
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Hora Fin *</label>
                <input
                  type="time"
                  className="form-control"
                  required
                  value={horarioFin}
                  onChange={(e) => setHorarioFin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Estado de la Clase</label>
                <select
                  className="form-control"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as any)}
                >
                  <option value="Activa">Activa / En Cartelera</option>
                  <option value="Pausada">Pausada Temporalmente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: CAPACIDAD Y LISTA DE ESPERA */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">3</span> Aforo, Lista de Espera y Nivel
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Cupo Máximo Titulares *</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  className="form-control"
                  required
                  value={cupoMax}
                  onChange={(e) => setCupoMax(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Lugares disponibles en sala</span>
              </div>

              <div className="form-group">
                <label>Límite Lista de Espera *</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  className="form-control"
                  required
                  value={listaEsperaMax}
                  onChange={(e) => setListaEsperaMax(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Cola de prelación (C-06)</span>
              </div>

              <div className="form-group">
                <label>Intensidad de Trabajo</label>
                <select
                  className="form-control"
                  value={intensidad}
                  onChange={(e) => setIntensidad(e.target.value as any)}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Extrema">Extrema</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Nivel Técnico Recomendado</label>
                <select
                  className="form-control"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as any)}
                >
                  <option value="Todos los niveles">Todos los niveles (Adaptable)</option>
                  <option value="Principiante">Principiante / Iniciación</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado / Competitivo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Políticas y Tolerancia</label>
                <input
                  type="text"
                  className="form-control"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="ej. 10 min de tolerancia de llegada"
                />
              </div>
            </div>

            {/* Tags Equipamiento */}
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Equipamiento Requerido para la Sesión:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {PRESET_EQUIPAMIENTOS.map((eq) => {
                  const isChecked = equipamiento.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => toggleEquipamiento(eq)}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "999px",
                        border: isChecked ? "1px solid var(--accent-green)" : "1px solid var(--border-color)",
                        backgroundColor: isChecked ? "rgba(0, 255, 135, 0.15)" : "var(--bg-body)",
                        color: isChecked ? "var(--accent-green)" : "var(--text-muted)",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      {isChecked ? `✓ ${eq}` : `+ ${eq}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTONES DE ENVÍO */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Link to="/admin/clases" className="btn-secondary" style={{ textDecoration: "none" }}>
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
              {isEditing ? "Guardar Modificaciones (C-02)" : "Confirmar y Programar Clase (C-02)"}
            </button>
          </div>
        </form>

        {/* COLUMNA LATERAL: PREVIEW EN TIEMPO REAL */}
        <aside className="reserva-summary-sticky">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase" }}>
              Vista Previa en Vivo
            </span>
            <span className={`status-pill ${estado === "Activa" ? "status-pill-operativa" : "status-pill-mantenimiento"}`}>
              {estado}
            </span>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(11, 15, 25, 0.8)",
              border: `2px solid ${
                intensidad === "Extrema"
                  ? "var(--accent-red)"
                  : intensidad === "Alta"
                  ? "var(--accent-orange)"
                  : "var(--accent-green)"
              }`,
            }}
          >
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-pure)" }}>
              {nombre || "Nombre de la Clase"}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--accent-orange)", marginTop: "0.2rem" }}>
              {disciplina}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              👨‍🏫 Instructor: <strong>{instructor}</strong>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              📍 {sala} • {sedes.find((s) => s.id === sedeId)?.ciudad || "Sede"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              ⏰ {horarioInicio} - {horarioFin} h ({diasSeleccionados.join(", ")})
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border-color)",
                fontSize: "0.78rem",
              }}
            >
              <span>Capacidad: <strong>0/{cupoMax}</strong></span>
              <span>Espera máx: <strong>{listaEsperaMax}</strong></span>
            </div>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            💡 Al guardar, esta clase se integrará inmediatamente a la agenda semanal de socios y administradores, permitiendo apertura de inscripciones y gestión de lista de espera consolidada.
          </div>
        </aside>
      </div>
    </div>
  );
}
