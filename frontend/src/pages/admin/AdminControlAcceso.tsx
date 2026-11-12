import { useState } from "react";
import "../../admin.css";

interface AccessLog {
  id: string;
  hora: string;
  nombre: string;
  dni: string;
  avatar: string;
  molinete: string;
  resultado: "Autorizado" | "Denegado (Mora)" | "Denegado (Sede)" | "Denegado (Aforo)";
  detalle: string;
}

const INITIAL_LOGS: AccessLog[] = [
  {
    id: "LOG-01",
    hora: "14:52:10",
    nombre: "Mateo Silva",
    dni: "34.981.203",
    avatar: "https://ui-avatars.com/api/?name=Mateo+Silva&background=151b2b&color=00ff87",
    molinete: "Molinete Principal 01",
    resultado: "Autorizado",
    detalle: "Socio Activo - Plan Anual Black",
  },
  {
    id: "LOG-02",
    hora: "14:50:44",
    nombre: "Constanza Rivas",
    dni: "29.430.129",
    avatar: "https://ui-avatars.com/api/?name=Constanza+Rivas&background=151b2b&color=00ff87",
    molinete: "Molinete Principal 02",
    resultado: "Autorizado",
    detalle: "Socio Activo - Plan Trimestral Fit",
  },
  {
    id: "LOG-03",
    hora: "14:45:12",
    nombre: "Juan Pablo Bravo",
    dni: "31.849.502",
    avatar: "https://ui-avatars.com/api/?name=Juan+Pablo+Bravo&background=151b2b&color=ff4b72",
    molinete: "Molinete Principal 01",
    resultado: "Denegado (Mora)",
    detalle: "Cuota Mensual Vencida el 08 Oct 2026",
  },
  {
    id: "LOG-04",
    hora: "14:38:05",
    nombre: "Andrés Medina",
    dni: "30.402.184",
    avatar: "https://ui-avatars.com/api/?name=Andres+Medina&background=151b2b&color=00ff87",
    molinete: "Molinete 03 (Piscina)",
    resultado: "Autorizado",
    detalle: "Socio Activo - Plan Mensual Pase",
  },
  {
    id: "LOG-05",
    hora: "14:31:22",
    nombre: "Francisca Soto",
    dni: "35.109.832",
    avatar: "https://ui-avatars.com/api/?name=Francisca+Soto&background=151b2b&color=ffb020",
    molinete: "Molinete Principal 01",
    resultado: "Denegado (Sede)",
    detalle: "Plan Single-Sede asignado a Providencia",
  },
  {
    id: "LOG-06",
    hora: "14:20:15",
    nombre: "Isabel Fuentes",
    dni: "28.591.032",
    avatar: "https://ui-avatars.com/api/?name=Isabel+Fuentes&background=151b2b&color=00ff87",
    molinete: "Molinete Principal 02",
    resultado: "Autorizado",
    detalle: "Socio Activo - Plan Trimestral Fit",
  },
  {
    id: "LOG-07",
    hora: "14:05:50",
    nombre: "Rodrigo Morales",
    dni: "36.210.994",
    avatar: "https://ui-avatars.com/api/?name=Rodrigo+Morales&background=151b2b&color=ff4b72",
    molinete: "Molinete 01",
    resultado: "Denegado (Aforo)",
    detalle: "Bloqueo por seguridad - Aforo al 100%",
  },
];

export default function AdminControlAcceso() {
  const [aforoActual, setAforoActual] = useState(195);
  const aforoMaximo = 250;

  // Filtros Historial
  const [searchQuery, setSearchQuery] = useState("");
  const [filterResultado, setFilterResultado] = useState("Todos");

  const aforoPorcentaje = Math.round((aforoActual / aforoMaximo) * 100);

  const filteredLogs = INITIAL_LOGS.filter((log) => {
    const matchSearch =
      log.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.dni.includes(searchQuery);
    const matchResultado =
      filterResultado === "Todos" ||
      (filterResultado === "Autorizado" && log.resultado === "Autorizado") ||
      (filterResultado === "Mora" && log.resultado.includes("Mora")) ||
      (filterResultado === "Sede" && log.resultado.includes("Sede")) ||
      (filterResultado === "Aforo" && log.resultado.includes("Aforo"));

    return matchSearch && matchResultado;
  });

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Molinete de Acceso & Aforo</h1>
          <p>Validación en tiempo real de molinetes, aforo de sede y registro de auditoría de ingresos</p>
        </div>
        <div className="header-controls">
          <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ width: "14px" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Sede Las Condes
          </button>
        </div>
      </header>

      {/* LAYOUT: Aforo (izq) e Historial/Auditoría (der) */}
      <div className="access-layout">
        {/* CONTROL DE AFORO */}
        <section className="scanner-section">
          {/* Aforo en Tiempo Real */}
          <div className="aforo-card">
            <div className="aforo-info">
              <h2>Aforo en Tiempo Real — Sede Las Condes</h2>
              <p>Capacidad máxima reglamentaria: {aforoMaximo} personas simultáneas</p>
              <div className="aforo-progress-bg">
                <div
                  className="aforo-progress-fill"
                  style={{
                    width: `${Math.min(aforoPorcentaje, 100)}%`,
                    backgroundColor:
                      aforoPorcentaje >= 95
                        ? "var(--accent-red)"
                        : aforoPorcentaje >= 80
                        ? "var(--accent-yellow)"
                        : "var(--accent-green)",
                  }}
                ></div>
              </div>
            </div>
            <div className="aforo-stats">
              <span className="aforo-numbers">
                {aforoActual} / {aforoMaximo}
              </span>
              <span
                className="badge-aforo"
                style={{
                  color:
                    aforoPorcentaje >= 95
                      ? "var(--accent-red)"
                      : aforoPorcentaje >= 80
                      ? "var(--accent-yellow)"
                      : "var(--accent-green)",
                  borderColor:
                    aforoPorcentaje >= 95
                      ? "rgba(255, 75, 114, 0.4)"
                      : aforoPorcentaje >= 80
                      ? "rgba(255, 176, 32, 0.4)"
                      : "rgba(0, 255, 135, 0.4)",
                }}
              >
                {aforoPorcentaje}% Aforo
              </span>
              <div className="aforo-controls">
                <button
                  className="btn-secondary"
                  title="Sumar 1 ingreso manual"
                  onClick={() => setAforoActual((prev) => Math.min(prev + 1, aforoMaximo))}
                >
                  +1 Ingreso
                </button>
                <button
                  className="btn-secondary"
                  title="Restar 1 egreso manual"
                  onClick={() => setAforoActual((prev) => Math.max(prev - 1, 0))}
                >
                  -1 Egreso
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* REGISTRO DE AUDITORÍA HISTÓRICA COMPLETA */}
        <aside className="history-section">
          <h2 className="history-title">Auditoría de Ingresos Recientes</h2>

          {/* Filtros del Historial */}
          <div className="history-filters">
            <input
              type="text"
              className="search-input"
              style={{ width: "100%", padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
              placeholder="Filtrar por socio o DNI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="filter-select"
              style={{ width: "100%", padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
              value={filterResultado}
              onChange={(e) => setFilterResultado(e.target.value)}
            >
              <option value="Todos">Todos los Resultados</option>
              <option value="Autorizado">Solo Autorizados</option>
              <option value="Mora">Denegados por Mora</option>
              <option value="Sede">Denegados por Sede</option>
              <option value="Aforo">Denegados por Aforo</option>
            </select>
          </div>

          <div className="history-list">
            {filteredLogs.map((log) => (
              <div key={log.id} className="history-item">
                <div className="history-avatar">
                  <img src={log.avatar} alt="Avatar" />
                </div>
                <div className="history-details">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="history-name">{log.nombre}</span>
                    <span className="history-time">{log.hora}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    DNI: {log.dni} • {log.molinete}
                  </div>
                  <span
                    className={`history-status ${
                      log.resultado === "Autorizado"
                        ? "status-ok"
                        : log.resultado.includes("Mora")
                        ? "status-fail"
                        : "status-warn"
                    }`}
                  >
                    ● {log.resultado}
                  </span>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{log.detalle}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

