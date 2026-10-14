import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSedeById, saveSede, type SedeItem } from "../../data/sedesData";

const PRESET_IMAGES = [
  { label: "Gimnasio Moderno", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80" },
  { label: "Área CrossFit & Pesas", url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80" },
  { label: "Centro Wellness & Pileta", url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80" },
  { label: "Complejo Canchas & Cardio", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80" },
  { label: "Sala en Renovación", url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80" },
];

const SERVICIOS_DISPONIBLES = [
  "Paddle Cristal Panorámico",
  "Paddle Muro Tradicional",
  "Fútbol 5 Césped Sintético",
  "Spinning Pro",
  "CrossFit Box",
  "Power Yoga & Pilates",
  "Piscina Climatizada",
  "Sauna & Recuperación",
  "Musculación & Cardio",
];

export default function AdminSedeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("Paraná");
  const [provincia, setProvincia] = useState("Entre Ríos");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [horario, setHorario] = useState("Lun-Vie: 06:00 a 23:00 • Sáb: 08:00 a 20:00");
  const [gerente, setGerente] = useState("");
  const [capacidadMax, setCapacidadMax] = useState(250);
  const [estado, setEstado] = useState<"Operativa" | "Mantenimiento" | "Próxima Apertura">("Operativa");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([
    "Paddle Cristal Panorámico",
    "Fútbol 5 Césped Sintético",
    "Musculación & Cardio",
  ]);
  const [imagenUrl, setImagenUrl] = useState(PRESET_IMAGES[0].url);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditing && id) {
      const sede = getSedeById(id);
      if (sede) {
        setNombre(sede.nombre);
        setCiudad(sede.ciudad);
        setProvincia(sede.provincia);
        setDireccion(sede.direccion);
        setTelefono(sede.telefono);
        setEmail(sede.email);
        setHorario(sede.horario);
        setGerente(sede.gerente);
        setCapacidadMax(sede.capacidadMax);
        setEstado(sede.estado);
        setServiciosSeleccionados(sede.servicios);
        setImagenUrl(sede.imagenUrl);
      }
    }
  }, [isEditing, id]);

  const toggleServicio = (srv: string) => {
    if (serviciosSeleccionados.includes(srv)) {
      setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s !== srv));
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, srv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !direccion.trim()) {
      alert("Por favor completa los campos obligatorios (Nombre y Dirección).");
      return;
    }

    const sedeData: SedeItem = {
      id: isEditing && id ? id : `sede-${Date.now()}`,
      nombre,
      ciudad,
      provincia,
      direccion,
      telefono: telefono || "+54 343 400-0000",
      email: email || `${ciudad.toLowerCase().replace(/\s+/g, "")}@fitzone.com.ar`,
      horario,
      gerente: gerente || "A designar",
      capacidadMax: Number(capacidadMax) || 200,
      aforoActual: isEditing && id ? getSedeById(id)?.aforoActual || 0 : 0,
      canchasCount: serviciosSeleccionados.filter((s) => s.includes("Paddle") || s.includes("Fútbol")).length * 2,
      salasCount: 3,
      sociosAsignados: isEditing && id ? getSedeById(id)?.sociosAsignados || 0 : 0,
      estado,
      servicios: serviciosSeleccionados,
      imagenUrl,
      canchas: isEditing && id ? getSedeById(id)?.canchas || [] : [
        { id: `c-${Date.now()}-1`, nombre: "Cancha Paddle 1 (Cristal)", tipo: "Paddle Cristal", estado: "Disponible", precioHora: 11000 },
        { id: `c-${Date.now()}-2`, nombre: "Cancha Fútbol 5 Sintético", tipo: "Fútbol 5 Césped", estado: "Disponible", precioHora: 19000 },
      ],
      clasesHoy: isEditing && id ? getSedeById(id)?.clasesHoy || [] : [],
      staff: isEditing && id ? getSedeById(id)?.staff || [] : [
        { id: `st-${Date.now()}-1`, nombre: gerente || "Gerente Asignado", rol: "Gerente de Sede", turno: "Mañana (06:00 - 14:00)", telefono: "+54 343 500-1122" },
      ],
    };

    saveSede(sedeData);
    alert(isEditing ? `¡Sede "${nombre}" actualizada exitosamente!` : `¡Sede "${nombre}" creada con éxito!`);
    navigate("/admin/sedes");
  };

  return (
    <>
      {/* NAVEGACION BREADCRUMB */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
        <Link to="/admin/sedes" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          ← Volver a Sedes (S-01)
        </Link>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>
          {isEditing ? "Editar Sede (S-02)" : "Crear Nueva Sede (S-02)"}
        </span>
      </div>

      <header className="topbar">
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo S-02
            </span>
          </div>
          <h1>{isEditing ? `Editar Sede: ${nombre || id}` : "Alta de Nueva Sede FitZone"}</h1>
          <p>
            {isEditing
              ? "Modifica los datos operativos, instalaciones y responsable de la sucursal"
              : "Registra una nueva sucursal deportiva en la provincia de Entre Ríos (Escalabilidad RNF-04)"}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ maxWidth: "900px", marginBottom: "3rem" }}>
        <div className="table-container" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--accent-orange)" }}>
              1. Identificación y Localización
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Información oficial de la sucursal para la red multi-sede.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  placeholder="Ej. Sede Villaguay Centro"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Ciudad / Localidad *
                </label>
                <select
                  className="filter-select"
                  style={{ width: "100%" }}
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                >
                  <option value="Paraná">Paraná</option>
                  <option value="Concordia">Concordia</option>
                  <option value="Gualeguaychú">Gualeguaychú</option>
                  <option value="Concepción del Uruguay">Concepción del Uruguay</option>
                  <option value="Colón">Colón</option>
                  <option value="Villaguay">Villaguay</option>
                  <option value="Gualeguay">Gualeguay</option>
                  <option value="Victoria">Victoria</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  placeholder="Calle, Número y Barrio"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Provincia
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem", opacity: 0.8 }}
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* SECCIÓN 2: CONTACTO Y RESPONSABLES */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--accent-orange)" }}>
              2. Contacto y Gestión Operativa
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Asignación del Gerente de Sede (Actor A4) y canales de comunicación.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Gerente de Sede Responsable
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  placeholder="Nombre y apellido"
                  value={gerente}
                  onChange={(e) => setGerente(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  placeholder="+54 343 400-0000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Email de Sucursal
                </label>
                <input
                  type="email"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  placeholder="sede@fitzone.com.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Horario de Funcionamiento
              </label>
              <input
                type="text"
                className="search-input"
                style={{ width: "100%", paddingLeft: "1rem" }}
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* SECCIÓN 3: CAPACIDAD Y ESTADO */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--accent-orange)" }}>
              3. Capacidad de Aforo y Estado
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Parámetros para el control de acceso en molinetes (RF-05).
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Capacidad Máxima Permitida (Aforo) *
                </label>
                <input
                  type="number"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  min="50"
                  max="1200"
                  value={capacidadMax}
                  onChange={(e) => setCapacidadMax(Number(e.target.value))}
                  required
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem", display: "block" }}>
                  El lector de torniquetes bloqueará el ingreso al llegar al 100%.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Estado Operativo de la Sede
                </label>
                <select
                  className="filter-select"
                  style={{ width: "100%" }}
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as any)}
                >
                  <option value="Operativa">Operativa (Abierta al público)</option>
                  <option value="Mantenimiento">En Mantenimiento / Reformas</option>
                  <option value="Próxima Apertura">Próxima Apertura</option>
                </select>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* SECCIÓN 4: INSTALACIONES Y SERVICIOS */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--accent-orange)" }}>
              4. Servicios e Instalaciones Disponibles
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Selecciona las comodidades disponibles en esta sucursal:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
              {SERVICIOS_DISPONIBLES.map((srv) => {
                const checked = serviciosSeleccionados.includes(srv);
                return (
                  <label
                    key={srv}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.6rem 0.9rem",
                      borderRadius: "var(--radius-md)",
                      background: checked ? "rgba(255, 94, 58, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${checked ? "var(--accent-orange)" : "var(--border-color)"}`,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleServicio(srv)}
                      style={{ accentColor: "var(--accent-orange)" }}
                    />
                    <span>{srv}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* SECCIÓN 5: IMAGEN DE PORTADA */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--accent-orange)" }}>
              5. Imagen Representativa de la Sede
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Elige una fotografía para el banner y portal de socios:
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImagenUrl(preset.url)}
                  style={{
                    background: imagenUrl === preset.url ? "var(--accent-orange)" : "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    color: "#fff",
                    padding: "0.5rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div
              style={{
                height: "140px",
                borderRadius: "var(--radius-md)",
                backgroundImage: `url('${imagenUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid var(--border-color)",
              }}
            ></div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin/sedes")}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
              {isEditing ? "Guardar Cambios" : "Dar de Alta Sede"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
