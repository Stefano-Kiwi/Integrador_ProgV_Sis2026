import { useState } from "react";
import { Link } from "react-router-dom";
import "../../admin.css";

interface Attendee {
  id: string;
  nombre: string;
  tipo: "Socio Activo" | "Cliente Externo";
  asistencia: "presente" | "ausente" | "pendiente";
}

interface WaitlistMember {
  id: string;
  nombre: string;
  posicion: number;
}

interface ClassItem {
  id: string;
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado";
  diaFecha: string;
  nombre: string;
  disciplina: "Spinning" | "CrossFit" | "Yoga" | "Pilates" | "Box Fit";
  instructor: string;
  horario: string;
  sala: string;
  inscritos: number;
  capacidad: number;
  colorBorder: string;
  asistentes: Attendee[];
  listaEspera: WaitlistMember[];
}

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "CLS-1",
    dia: "Lunes",
    diaFecha: "Lunes 12",
    nombre: "Spinning Pro",
    disciplina: "Spinning",
    instructor: "M. José Ramos",
    horario: "08:00 h",
    sala: "Sala Ciclo 1",
    inscritos: 18,
    capacidad: 20,
    colorBorder: "border-orange",
    asistentes: [
      { id: "A1", nombre: "Mateo Silva", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A2", nombre: "Constanza Rivas", tipo: "Socio Activo", asistencia: "pendiente" },
      { id: "A3", nombre: "Rodrigo Morales", tipo: "Cliente Externo", asistencia: "pendiente" },
    ],
    listaEspera: [
      { id: "W1", nombre: "Ignacio Pérez", posicion: 1 },
      { id: "W2", nombre: "Clara Varas", posicion: 2 },
    ],
  },
  {
    id: "CLS-2",
    dia: "Lunes",
    diaFecha: "Lunes 12",
    nombre: "Power Yoga",
    disciplina: "Yoga",
    instructor: "S. Vergara",
    horario: "18:00 h",
    sala: "Estudio Zen",
    inscritos: 12,
    capacidad: 15,
    colorBorder: "border-green",
    asistentes: [
      { id: "A4", nombre: "Isabel Fuentes", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A5", nombre: "Valentina Rossi", tipo: "Socio Activo", asistencia: "presente" },
    ],
    listaEspera: [],
  },
  {
    id: "CLS-3",
    dia: "Martes",
    diaFecha: "Martes 13",
    nombre: "CrossFit Elite",
    disciplina: "CrossFit",
    instructor: "Diego Arana",
    horario: "09:30 h",
    sala: "Box Central",
    inscritos: 20,
    capacidad: 20,
    colorBorder: "border-yellow",
    asistentes: [
      { id: "A6", nombre: "Mateo Silva", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A7", nombre: "Francisca Soto", tipo: "Socio Activo", asistencia: "ausente" },
      { id: "A8", nombre: "Roberto Gómez", tipo: "Cliente Externo", asistencia: "presente" },
      { id: "A9", nombre: "Lucas San Martín", tipo: "Socio Activo", asistencia: "pendiente" },
    ],
    listaEspera: [
      { id: "W3", nombre: "Ignacio Pérez", posicion: 1 },
      { id: "W4", nombre: "Clara Varas", posicion: 2 },
      { id: "W5", nombre: "Esteban Rojas", posicion: 3 },
    ],
  },
  {
    id: "CLS-4",
    dia: "Martes",
    diaFecha: "Martes 13",
    nombre: "Box Fit Knockout",
    disciplina: "Box Fit",
    instructor: "Martín Palermo",
    horario: "19:00 h",
    sala: "Ring & Training",
    inscritos: 14,
    capacidad: 16,
    colorBorder: "border-red",
    asistentes: [
      { id: "A10", nombre: "Andrés Medina", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A11", nombre: "Diego Fernández", tipo: "Socio Activo", asistencia: "pendiente" },
    ],
    listaEspera: [],
  },
  {
    id: "CLS-5",
    dia: "Miércoles",
    diaFecha: "Miércoles 14",
    nombre: "Spinning Pro",
    disciplina: "Spinning",
    instructor: "M. José Ramos",
    horario: "08:00 h",
    sala: "Sala Ciclo 1",
    inscritos: 18,
    capacidad: 20,
    colorBorder: "border-orange",
    asistentes: [
      { id: "A12", nombre: "Mateo Silva", tipo: "Socio Activo", asistencia: "pendiente" },
      { id: "A13", nombre: "Camila Herrera", tipo: "Socio Activo", asistencia: "pendiente" },
    ],
    listaEspera: [],
  },
  {
    id: "CLS-6",
    dia: "Miércoles",
    diaFecha: "Miércoles 14",
    nombre: "Pilates Reformer",
    disciplina: "Pilates",
    instructor: "C. Edwards",
    horario: "19:30 h",
    sala: "Studio Reformer",
    inscritos: 8,
    capacidad: 10,
    colorBorder: "border-red",
    asistentes: [
      { id: "A14", nombre: "Constanza Rivas", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A15", nombre: "Isabel Fuentes", tipo: "Socio Activo", asistencia: "presente" },
    ],
    listaEspera: [],
  },
  {
    id: "CLS-7",
    dia: "Jueves",
    diaFecha: "Jueves 15",
    nombre: "CrossFit Elite",
    disciplina: "CrossFit",
    instructor: "Diego Arana",
    horario: "09:30 h",
    sala: "Box Central",
    inscritos: 15,
    capacidad: 20,
    colorBorder: "border-yellow",
    asistentes: [
      { id: "A16", nombre: "Roberto Gómez", tipo: "Cliente Externo", asistencia: "presente" },
      { id: "A17", nombre: "Diego Fernández", tipo: "Socio Activo", asistencia: "pendiente" },
    ],
    listaEspera: [],
  },
  {
    id: "CLS-8",
    dia: "Jueves",
    diaFecha: "Jueves 15",
    nombre: "Power Yoga",
    disciplina: "Yoga",
    instructor: "S. Vergara",
    horario: "17:30 h",
    sala: "Estudio Zen",
    inscritos: 15,
    capacidad: 15,
    colorBorder: "border-green",
    asistentes: [
      { id: "A18", nombre: "Valentina Rossi", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A19", nombre: "Francisca Soto", tipo: "Socio Activo", asistencia: "presente" },
    ],
    listaEspera: [{ id: "W6", nombre: "Carolina Mora", posicion: 1 }],
  },
  {
    id: "CLS-9",
    dia: "Viernes",
    diaFecha: "Viernes 16",
    nombre: "Power Yoga Flow",
    disciplina: "Yoga",
    instructor: "S. Vergara",
    horario: "18:00 h",
    sala: "Estudio Zen",
    inscritos: 12,
    capacidad: 15,
    colorBorder: "border-green",
    asistentes: [
      { id: "A20", nombre: "Isabel Fuentes", tipo: "Socio Activo", asistencia: "presente" },
    ],
    listaEspera: [],
  },
  {
    id: "CLS-10",
    dia: "Viernes",
    diaFecha: "Viernes 16",
    nombre: "Spinning Night",
    disciplina: "Spinning",
    instructor: "M. José Ramos",
    horario: "19:00 h",
    sala: "Sala Ciclo 1",
    inscritos: 20,
    capacidad: 20,
    colorBorder: "border-orange",
    asistentes: [
      { id: "A21", nombre: "Mateo Silva", tipo: "Socio Activo", asistencia: "presente" },
      { id: "A22", nombre: "Lucas San Martín", tipo: "Socio Activo", asistencia: "presente" },
    ],
    listaEspera: [{ id: "W7", nombre: "Tomás Bravo", posicion: 1 }],
  },
];

const DAYS = [
  { key: "Lunes", label: "Lunes 12" },
  { key: "Martes", label: "Martes 13" },
  { key: "Miércoles", label: "Miércoles 14" },
  { key: "Jueves", label: "Jueves 15" },
  { key: "Viernes", label: "Viernes 16" },
];

export default function AdminClases() {
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>("CLS-3");
  const [filterDisciplina, setFilterDisciplina] = useState("Todas");
  const [filterInstructor, setFilterInstructor] = useState("Todos");
  const [filterCupos, setFilterCupos] = useState("Todos");

  // Modal Programar Clase
  const [showProgramarModal, setShowProgramarModal] = useState(false);
  const [nuevaClaseNombre, setNuevaClaseNombre] = useState("");
  const [nuevaClaseDisciplina, setNuevaClaseDisciplina] = useState<ClassItem["disciplina"]>("Spinning");
  const [nuevaClaseInstructor, setNuevaClaseInstructor] = useState("M. José Ramos");
  const [nuevaClaseDia, setNuevaClaseDia] = useState<ClassItem["dia"]>("Lunes");
  const [nuevaClaseHorario, setNuevaClaseHorario] = useState("10:00 h");

  // Filtrado de Clases
  const filteredClasses = classes.filter((c) => {
    const matchDiscipline = filterDisciplina === "Todas" || c.disciplina === filterDisciplina;
    const matchInstructor = filterInstructor === "Todos" || c.instructor === filterInstructor;
    const matchCupos =
      filterCupos === "Todos"
        ? true
        : filterCupos === "Disponibles"
        ? c.inscritos < c.capacidad
        : c.inscritos >= c.capacidad;

    return matchDiscipline && matchInstructor && matchCupos;
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Alternar Asistencia (Presente -> Ausente -> Pendiente)
  const toggleAttendance = (attendeeId: string) => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== selectedClass.id) return cls;
        return {
          ...cls,
          asistentes: cls.asistentes.map((att) => {
            if (att.id !== attendeeId) return att;
            const nextStatus =
              att.asistencia === "pendiente"
                ? "presente"
                : att.asistencia === "presente"
                ? "ausente"
                : "pendiente";
            return { ...att, asistencia: nextStatus };
          }),
        };
      })
    );
  };

  const handleProgramarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaClaseNombre) return;

    const newClass: ClassItem = {
      id: `CLS-${classes.length + 1}`,
      dia: nuevaClaseDia,
      diaFecha: `${nuevaClaseDia} ${nuevaClaseDia === "Lunes" ? "12" : nuevaClaseDia === "Martes" ? "13" : "14"}`,
      nombre: nuevaClaseNombre,
      disciplina: nuevaClaseDisciplina,
      instructor: nuevaClaseInstructor,
      horario: nuevaClaseHorario,
      sala: "Estudio Principal",
      inscritos: 1,
      capacidad: 20,
      colorBorder:
        nuevaClaseDisciplina === "Spinning"
          ? "border-orange"
          : nuevaClaseDisciplina === "Yoga"
          ? "border-green"
          : nuevaClaseDisciplina === "CrossFit"
          ? "border-yellow"
          : "border-red",
      asistentes: [{ id: `A-${Date.now()}`, nombre: "Usuario Demo", tipo: "Socio Activo", asistencia: "pendiente" }],
      listaEspera: [],
    };

    setClasses([...classes, newClass]);
    setSelectedClassId(newClass.id);
    setShowProgramarModal(false);
    setNuevaClaseNombre("");
  };

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulos C-01 & C-03
            </span>
          </div>
          <h1>Planificación de Clases y Asistencia</h1>
          <p>Agenda semanal de disciplinas, listas de espera y toma de asistencia en tiempo real</p>
        </div>
        <div className="header-controls" style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            to="/admin/clases/lista-espera"
            className="btn-secondary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
          >
            <span>⏳</span> Lista de Espera (C-06)
          </Link>
          <Link
            to="/admin/clases/nueva"
            className="btn-primary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
          >
            <span>+</span> Programar Clase (C-02)
          </Link>
        </div>
      </header>

      {/* BARRA DE FILTROS */}
      <div className="classes-filter-bar">
        <div className="filter-group">
          <label className="filter-label">Disciplina:</label>
          <select
            className="filter-select"
            value={filterDisciplina}
            onChange={(e) => setFilterDisciplina(e.target.value)}
          >
            <option value="Todas">Todas las Disciplinas</option>
            <option value="Spinning">Spinning</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Yoga">Power Yoga</option>
            <option value="Pilates">Pilates</option>
            <option value="Box Fit">Box Fit</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Instructor:</label>
          <select
            className="filter-select"
            value={filterInstructor}
            onChange={(e) => setFilterInstructor(e.target.value)}
          >
            <option value="Todos">Todos los Instructores</option>
            <option value="M. José Ramos">M. José Ramos</option>
            <option value="Diego Arana">Diego Arana</option>
            <option value="S. Vergara">S. Vergara</option>
            <option value="C. Edwards">C. Edwards</option>
            <option value="Martín Palermo">Martín Palermo</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Cupos:</label>
          <select
            className="filter-select"
            value={filterCupos}
            onChange={(e) => setFilterCupos(e.target.value)}
          >
            <option value="Todos">Todos los Horarios</option>
            <option value="Disponibles">Con Cupos Disponibles</option>
            <option value="Completas">Completas / Lista de Espera</option>
          </select>
        </div>
      </div>

      {/* LAYOUT: Calendario Semanal y Detalles de Clase */}
      <div className="classes-layout">
        {/* CALENDARIO SEMANAL */}
        <section className="calendar-section">
          <div className="week-grid">
            {DAYS.map((day) => {
              const dayClasses = filteredClasses.filter((c) => c.dia === day.key);
              return (
                <div key={day.key} className="day-column">
                  <div className="day-header">{day.label}</div>
                  {dayClasses.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2rem" }}>
                      Sin clases que coincidan
                    </div>
                  ) : (
                    dayClasses.map((item) => {
                      const isSelected = selectedClass?.id === item.id;
                      const isFull = item.inscritos >= item.capacidad;
                      return (
                        <div
                          key={item.id}
                          className={`class-card ${item.colorBorder} ${isSelected ? "selected-class" : ""}`}
                          onClick={() => setSelectedClassId(item.id)}
                        >
                          <div className="class-name">{item.nombre}</div>
                          <div className="class-instructor">{item.instructor}</div>
                          <div className="class-meta">
                            <span className="class-time">{item.horario}</span>
                            <span
                              className="class-capacity"
                              style={{ color: isFull ? "var(--accent-red)" : "var(--text-muted)" }}
                            >
                              {item.inscritos}/{item.capacidad} {isFull && "(Lleno)"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* DETALLES DE CLASE SELECCIONADA */}
        <aside className="details-section">
          {selectedClass ? (
            <>
              <div className="details-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2>{selectedClass.nombre}</h2>
                    <p style={{ marginTop: "0.25rem" }}>
                      {selectedClass.dia} • {selectedClass.horario} • {selectedClass.sala}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                    <span className="status-badge status-active">{selectedClass.disciplina}</span>
                    <Link
                      to={`/admin/clases/${selectedClass.id}/editar`}
                      className="btn-secondary"
                      style={{ fontSize: "0.72rem", padding: "0.25rem 0.55rem", textDecoration: "none" }}
                    >
                      ✏️ Editar Clase (C-02)
                    </Link>
                  </div>
                </div>
                <div style={{ marginTop: "0.85rem", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                  <span>Instructor: <strong>{selectedClass.instructor}</strong></span>
                  <span>Ocupación: <strong style={{ color: selectedClass.inscritos >= selectedClass.capacidad ? "var(--accent-red)" : "var(--accent-green)" }}>{selectedClass.inscritos}/{selectedClass.capacidad}</strong></span>
                </div>
              </div>

              {/* Roster de Inscritos */}
              <div className="roster-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="roster-title-orange">
                    Lista Principal ({selectedClass.asistentes.length})
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Clic para alternar estado</span>
                </div>

                {selectedClass.asistentes.map((att) => (
                  <div key={att.id} className="roster-item">
                    <div>
                      <div className="roster-name">{att.nombre}</div>
                      <div className="roster-status">{att.tipo}</div>
                    </div>
                    <button
                      type="button"
                      className={`attendance-toggle-btn att-${att.asistencia}`}
                      onClick={() => toggleAttendance(att.id)}
                      title="Alternar: Presente / Ausente / Pendiente"
                    >
                      {att.asistencia === "presente" ? "✓ Presente" : att.asistencia === "ausente" ? "✗ Ausente" : "○ Pendiente"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Lista de Espera */}
              <div className="roster-group" style={{ marginTop: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="roster-title-yellow">
                    Lista de Espera ({selectedClass.listaEspera.length})
                  </span>
                  <Link
                    to="/admin/clases/lista-espera"
                    style={{ fontSize: "0.72rem", color: "var(--accent-orange)", textDecoration: "none", fontWeight: 700 }}
                  >
                    Ver Cola Global (C-06) →
                  </Link>
                </div>
                {selectedClass.listaEspera.length === 0 ? (
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    No hay socios en espera para este turno.
                  </div>
                ) : (
                  selectedClass.listaEspera.map((wait) => (
                    <div key={wait.id} className="roster-item">
                      <span className="roster-name">{wait.nombre}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="roster-pos">Pos #{wait.posicion}</span>
                        <button
                          className="btn-secondary"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
                          onClick={() => alert(`Socio ${wait.nombre} promovido a la lista titular.`)}
                        >
                          Promover
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Botón de Acción */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button
                  className="btn-primary"
                  onClick={() => alert(`Asistencia registrada con éxito para ${selectedClass.nombre}.`)}
                >
                  Guardar Planilla de Asistencia
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => alert(`Notificación enviada a los ${selectedClass.inscritos} inscritos.`)}
                >
                  Enviar Aviso a Inscriptos
                </button>
              </div>
            </>
          ) : (
            <div>Selecciona una clase para ver sus detalles</div>
          )}
        </aside>
      </div>

      {/* MODAL PROGRAMAR CLASE */}
      {showProgramarModal && (
        <div className="modal-backdrop" onClick={() => setShowProgramarModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Programar Nueva Clase</h2>
              <button className="modal-close-btn" onClick={() => setShowProgramarModal(false)}>✕</button>
            </div>
            <form onSubmit={handleProgramarSubmit}>
              <div className="form-group">
                <label>Nombre de la Clase *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. HIIT Extreme"
                  value={nuevaClaseNombre}
                  onChange={(e) => setNuevaClaseNombre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Disciplina</label>
                <select
                  className="form-control"
                  value={nuevaClaseDisciplina}
                  onChange={(e) => setNuevaClaseDisciplina(e.target.value as any)}
                >
                  <option value="Spinning">Spinning</option>
                  <option value="CrossFit">CrossFit</option>
                  <option value="Yoga">Power Yoga</option>
                  <option value="Pilates">Pilates</option>
                  <option value="Box Fit">Box Fit</option>
                </select>
              </div>
              <div className="form-group">
                <label>Instructor</label>
                <select
                  className="form-control"
                  value={nuevaClaseInstructor}
                  onChange={(e) => setNuevaClaseInstructor(e.target.value)}
                >
                  <option value="M. José Ramos">M. José Ramos</option>
                  <option value="Diego Arana">Diego Arana</option>
                  <option value="S. Vergara">S. Vergara</option>
                  <option value="C. Edwards">C. Edwards</option>
                  <option value="Martín Palermo">Martín Palermo</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Día</label>
                  <select
                    className="form-control"
                    value={nuevaClaseDia}
                    onChange={(e) => setNuevaClaseDia(e.target.value as any)}
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Horario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevaClaseHorario}
                    onChange={(e) => setNuevaClaseHorario(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowProgramarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

