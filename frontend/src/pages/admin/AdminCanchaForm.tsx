import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCanchaById, saveCancha, type CanchaItem } from "../../data/clasesCanchasData";
import { getSedes } from "../../data/sedesData";
import "./AdminFase4.css";
import "../../admin.css";

const PRESET_CANCHA_IMAGES = [
  { label: "Pádel Cristal Panorámico Azul", url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80" },
  { label: "Pádel Césped Verde Indoor", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80" },
  { label: "Fútbol 5 Estadio FIFA Pro", url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80" },
  { label: "Fútbol 5 Cancha Auxiliar", url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80" },
  { label: "Tenis Polvo de Ladrillo", url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80" },
  { label: "Pádel Muro Exterior", url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80" },
];

export default function AdminCanchaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const sedes = getSedes();

  const [codigo, setCodigo] = useState("PAD-04");
  const [nombre, setNombre] = useState("");
  const [deporte, setDeporte] = useState<CanchaItem["deporte"]>("Pádel");
  const [sedeId, setSedeId] = useState(sedes[0]?.id || "parana-centro");
  const [superficie, setSuperficie] = useState("Césped Sintético Texturado Azul con arena de sílice");
  const [techada, setTechada] = useState(true);
  const [iluminacion, setIluminacion] = useState<CanchaItem["iluminacion"]>("LED Profesional 400 Lux");
  const [cerramiento, setCerramiento] = useState<CanchaItem["cerramiento"]>("Cristal Templado 12mm Panorámico");
  const [dimensiones, setDimensiones] = useState("20.00m x 10.00m (Reglamentaria)");
  const [capacidadJugadores, setCapacidadJugadores] = useState(4);
  const [tarifaBaseHora, setTarifaBaseHora] = useState(12000);
  const [duracionTurnoMin, setDuracionTurnoMin] = useState(90);
  const [bufferEntreTurnosMin, setBufferEntreTurnosMin] = useState(10);
  const [descuentoSocioPorc, setDescuentoSocioPorc] = useState(15);
  const [recargoHoraPicoPorc, setRecargoHoraPicoPorc] = useState(20);
  const [estado, setEstado] = useState<CanchaItem["estado"]>("Operativa");
  const [imagenUrl, setImagenUrl] = useState(PRESET_CANCHA_IMAGES[0].url);

  // Cargar datos en edición
  useEffect(() => {
    if (isEditing && id) {
      const cancha = getCanchaById(id);
      if (cancha) {
        setCodigo(cancha.codigo);
        setNombre(cancha.nombre);
        setDeporte(cancha.deporte);
        setSedeId(cancha.sedeId);
        setSuperficie(cancha.superficie);
        setTechada(cancha.techada);
        setIluminacion(cancha.iluminacion);
        setCerramiento(cancha.cerramiento);
        setDimensiones(cancha.dimensiones);
        setCapacidadJugadores(cancha.capacidadJugadores);
        setTarifaBaseHora(cancha.tarifaBaseHora);
        setDuracionTurnoMin(cancha.duracionTurnoMin);
        setBufferEntreTurnosMin(cancha.bufferEntreTurnosMin);
        setDescuentoSocioPorc(cancha.descuentoSocioPorc);
        setRecargoHoraPicoPorc(cancha.recargoHoraPicoPorc);
        setEstado(cancha.estado);
        setImagenUrl(cancha.imagenUrl);
      }
    }
  }, [isEditing, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !codigo.trim()) {
      alert("Por favor completa el código y el nombre de la cancha.");
      return;
    }

    const sedeObj = sedes.find((s) => s.id === sedeId);

    const savedCancha: CanchaItem = {
      id: isEditing && id ? id : `CAN-${codigo.replace(/\s+/g, "").toUpperCase()}`,
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      deporte,
      sedeId,
      sedeNombre: sedeObj ? sedeObj.nombre : "Sede Central",
      tipoCanchaId: deporte === "Pádel" ? "TCAN-01" : deporte === "Fútbol 5" ? "TCAN-03" : "TCAN-04",
      superficie,
      techada,
      iluminacion,
      cerramiento,
      dimensiones,
      capacidadJugadores: Number(capacidadJugadores),
      tarifaBaseHora: Number(tarifaBaseHora),
      duracionTurnoMin: Number(duracionTurnoMin),
      bufferEntreTurnosMin: Number(bufferEntreTurnosMin),
      descuentoSocioPorc: Number(descuentoSocioPorc),
      recargoHoraPicoPorc: Number(recargoHoraPicoPorc),
      estado,
      imagenUrl,
      fotos: [imagenUrl],
      statsMes: {
        horasReservadas: 120,
        ingresosTotales: Number(tarifaBaseHora) * 120,
        tasaOcupacion: 75,
        mantenimientosRealizados: 0,
      },
      historialMantenimiento: [],
    };

    saveCancha(savedCancha);
    alert(isEditing ? "¡Cancha actualizada correctamente!" : "¡Cancha registrada con éxito en el inventario!");
    navigate("/admin/canchas/listado");
  };

  const precioSocioCalculado = Math.round(tarifaBaseHora * (1 - descuentoSocioPorc / 100));
  const precioPicoCalculado = Math.round(tarifaBaseHora * (1 + recargoHoraPicoPorc / 100));

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo CA-02
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {isEditing ? `Modificando cancha #${id}` : "Nueva Cancha Deportiva"}
            </span>
          </div>
          <h1>{isEditing ? `Editar Cancha: ${nombre || codigo}` : "Alta de Nueva Cancha en Inventario"}</h1>
          <p>Configura las especificaciones técnicas, superficie, tarifas horarias y reglas de reserva</p>
        </div>
        <div className="header-controls">
          <Link to="/admin/canchas/listado" className="btn-secondary" style={{ textDecoration: "none" }}>
            ← Volver al Inventario
          </Link>
        </div>
      </header>

      {/* FORMULARIO Y PREVIEW GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.75rem", alignItems: "start" }}>
        <form onSubmit={handleSubmit}>
          {/* SECCIÓN 1: IDENTIFICACIÓN GENERAL */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">1</span> Identificación y Ubicación
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Código Interno *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. PAD-04"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Nombre de la Cancha *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ej. Cancha Pádel 4 — Cristal Panorámico WPT"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Sede Perteneciente *</label>
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
                <label>Deporte *</label>
                <select
                  className="form-control"
                  value={deporte}
                  onChange={(e) => {
                    const dep = e.target.value as CanchaItem["deporte"];
                    setDeporte(dep);
                    if (dep === "Pádel") {
                      setSuperficie("Césped Sintético Texturado Azul con arena de sílice");
                      setDimensiones("20.00m x 10.00m (Reglamentaria FIP)");
                      setCapacidadJugadores(4);
                      setTarifaBaseHora(12000);
                      setDuracionTurnoMin(90);
                    } else if (dep === "Fútbol 5") {
                      setSuperficie("Césped Sintético Monofilamento 50mm con caucho SBR");
                      setDimensiones("30.00m x 18.00m");
                      setCapacidadJugadores(10);
                      setTarifaBaseHora(22000);
                      setDuracionTurnoMin(60);
                    } else {
                      setSuperficie("Tierra Batida Roja / Polvo de Ladrillo");
                      setDimensiones("23.77m x 10.97m (Oficial ITF)");
                      setCapacidadJugadores(4);
                      setTarifaBaseHora(15000);
                      setDuracionTurnoMin(90);
                    }
                  }}
                >
                  <option value="Pádel">Pádel</option>
                  <option value="Fútbol 5">Fútbol 5</option>
                  <option value="Tenis">Tenis</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tipo de Superficie y Piso *</label>
              <input
                type="text"
                className="form-control"
                required
                value={superficie}
                onChange={(e) => setSuperficie(e.target.value)}
                placeholder="ej. Césped Sintético Texturado Azul con arena de sílice"
              />
            </div>
          </div>

          {/* SECCIÓN 2: INFRAESTRUCTURA TÉCNICA */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">2</span> Infraestructura y Equipamiento
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Cerramiento Perimetral</label>
                <select
                  className="form-control"
                  value={cerramiento}
                  onChange={(e) => setCerramiento(e.target.value as any)}
                >
                  <option value="Cristal Templado 12mm Panorámico">Cristal Templado 12mm Panorámico</option>
                  <option value="Muro de Cemento">Muro de Cemento</option>
                  <option value="Alambrado Olímpico 4m">Alambrado Olímpico 4m</option>
                </select>
              </div>

              <div className="form-group">
                <label>Iluminación</label>
                <select
                  className="form-control"
                  value={iluminacion}
                  onChange={(e) => setIluminacion(e.target.value as any)}
                >
                  <option value="LED Profesional 400 Lux">LED Profesional 400 Lux</option>
                  <option value="LED Estándar">LED Estándar</option>
                  <option value="Halógena">Halógena</option>
                  <option value="Luz Natural">Luz Natural (Sin luz artificial)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Dimensiones</label>
                <input
                  type="text"
                  className="form-control"
                  value={dimensiones}
                  onChange={(e) => setDimensiones(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Capacidad Jugadores</label>
                <input
                  type="number"
                  min={2}
                  max={22}
                  className="form-control"
                  value={capacidadJugadores}
                  onChange={(e) => setCapacidadJugadores(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Cubierta / Techo</label>
                <select
                  className="form-control"
                  value={techada ? "si" : "no"}
                  onChange={(e) => setTechada(e.target.value === "si")}
                >
                  <option value="si">Techada (Indoor)</option>
                  <option value="no">Al aire libre (Outdoor)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Estado Operativo</label>
              <select
                className="form-control"
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
              >
                <option value="Operativa">Operativa (Habilitada para reservas)</option>
                <option value="Mantenimiento">En Mantenimiento (Bloqueada)</option>
                <option value="Fuera de Servicio">Fuera de Servicio</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN 3: ESQUEMA TARIFARIO Y TIEMPOS */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">3</span> Tarifas y Tiempos de Turno
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Tarifa Base ($ ARS) *</label>
                <input
                  type="number"
                  step={500}
                  className="form-control"
                  required
                  value={tarifaBaseHora}
                  onChange={(e) => setTarifaBaseHora(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Duración Turno (min) *</label>
                <select
                  className="form-control"
                  value={duracionTurnoMin}
                  onChange={(e) => setDuracionTurnoMin(Number(e.target.value))}
                >
                  <option value={60}>60 minutos (1 hora)</option>
                  <option value={90}>90 minutos (1.5 horas)</option>
                  <option value={120}>120 minutos (2 horas)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Buffer Limpieza (min)</label>
                <input
                  type="number"
                  step={5}
                  className="form-control"
                  value={bufferEntreTurnosMin}
                  onChange={(e) => setBufferEntreTurnosMin(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Descuento Socio Activo (%)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  className="form-control"
                  value={descuentoSocioPorc}
                  onChange={(e) => setDescuentoSocioPorc(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--accent-green)" }}>
                  Tarifa resultante para socios: ${precioSocioCalculado.toLocaleString()}
                </span>
              </div>

              <div className="form-group">
                <label>Recargo Horario Pico (%)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  className="form-control"
                  value={recargoHoraPicoPorc}
                  onChange={(e) => setRecargoHoraPicoPorc(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--accent-yellow)" }}>
                  Tarifa en horario pico: ${precioPicoCalculado.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: FOTOGRAFÍA */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">4</span> Fotografía de la Cancha
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
              {PRESET_CANCHA_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setImagenUrl(preset.url)}
                  style={{
                    border: imagenUrl === preset.url ? "2px solid var(--accent-orange)" : "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <img src={preset.url} alt={preset.label} style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                  <div style={{ fontSize: "0.68rem", padding: "0.3rem", color: "var(--text-muted)", textAlign: "center" }}>
                    {preset.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>URL de Imagen Directa (Opcional):</label>
              <input
                type="text"
                className="form-control"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* BOTONES */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Link to="/admin/canchas/listado" className="btn-secondary" style={{ textDecoration: "none" }}>
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
              {isEditing ? "Guardar Modificaciones (CA-02)" : "Confirmar y Crear Cancha (CA-02)"}
            </button>
          </div>
        </form>

        {/* PREVIEW EN TIEMPO REAL */}
        <aside className="reserva-summary-sticky">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase" }}>
              Ficha Previa de Cancha
            </span>
            <span className={`status-pill ${estado === "Operativa" ? "status-pill-operativa" : "status-pill-mantenimiento"}`}>
              {estado}
            </span>
          </div>

          <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <img src={imagenUrl} alt="Preview" style={{ width: "100%", height: "140px", objectFit: "cover" }} />
            <div style={{ padding: "1rem", backgroundColor: "rgba(11, 15, 25, 0.9)" }}>
              <span className="cancha-card-code">{codigo || "PAD-XX"}</span>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-pure)", marginTop: "0.2rem" }}>
                {nombre || "Nombre de la Cancha"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                📍 {sedes.find((s) => s.id === sedeId)?.nombre || "Sede"}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                <div>Deporte: <strong style={{ color: "var(--text-pure)" }}>{deporte}</strong></div>
                <div>Cubierta: <strong style={{ color: "var(--text-pure)" }}>{techada ? "Techada" : "Abierta"}</strong></div>
                <div>Turno: <strong style={{ color: "var(--text-pure)" }}>{duracionTurnoMin} min</strong></div>
                <div>Capacidad: <strong style={{ color: "var(--text-pure)" }}>{capacidadJugadores} jug.</strong></div>
              </div>

              <div
                style={{
                  marginTop: "0.75rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-green)" }}>
                    ${tarifaBaseHora.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Socio: ${precioSocioCalculado.toLocaleString()}
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                  Pico: ${precioPicoCalculado.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
