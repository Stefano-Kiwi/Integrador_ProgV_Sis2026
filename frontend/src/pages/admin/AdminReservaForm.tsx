import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  getCanchas,
  saveReserva,
  type CanchaItem,
  type ReservaItem,
} from "../../data/clasesCanchasData";
import { getSedes } from "../../data/sedesData";
import "./AdminFase4.css";
import "../../admin.css";

const PRESET_SOCIOS = [
  { nombre: "Mateo Silva", dni: "38.102.994", tel: "+54 343 512-8877", email: "msilva@gmail.com", nro: "SOC-0042", cat: "Socio Activo Pleno" },
  { nombre: "Constanza Rivas", dni: "36.800.419", tel: "+54 343 514-9922", email: "crivas@fibertel.com.ar", nro: "SOC-0078", cat: "Socio Activo" },
  { nombre: "Lucas San Martín", dni: "39.400.912", tel: "+54 343 456-1122", email: "lsanmartin@gmail.com", nro: "SOC-0104", cat: "Socio Activo" },
  { nombre: "Valentina Rossi", dni: "35.901.442", tel: "+54 343 420-5544", email: "vrossi@outlook.com", nro: "SOC-0089", cat: "Socio Premium" },
  { nombre: "Isabel Fuentes", dni: "34.120.339", tel: "+54 3446 41-8899", email: "ifuentes@gmail.com", nro: "SOC-0056", cat: "Socio Activo" },
];

export default function AdminReservaForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCanchaId = searchParams.get("canchaId");

  const canchas = getCanchas();
  const sedes = getSedes();

  // Estados de Formulario
  const [sedeId, setSedeId] = useState(sedes[0]?.id || "parana-centro");
  const [deporte, setDeporte] = useState<CanchaItem["deporte"]>("Pádel");
  const [canchaId, setCanchaId] = useState(initialCanchaId || canchas[0]?.id || "CAN-PAD-01");
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("19:00");

  // Titular
  const [esSocio, setEsSocio] = useState(true);
  const [selectedSocioPreset, setSelectedSocioPreset] = useState(PRESET_SOCIOS[0].dni);
  const [nombreTitular, setNombreTitular] = useState(PRESET_SOCIOS[0].nombre);
  const [dniTitular, setDniTitular] = useState(PRESET_SOCIOS[0].dni);
  const [telefonoTitular, setTelefonoTitular] = useState(PRESET_SOCIOS[0].tel);
  const [emailTitular, setEmailTitular] = useState(PRESET_SOCIOS[0].email);

  // Jugadores adicionales
  const [jugador2, setJugador2] = useState("Rodrigo Morales");
  const [jugador3, setJugador3] = useState("Lucas San Martín");
  const [jugador4, setJugador4] = useState("Esteban Rojas");

  // Extras
  const [alquilerPaletas, setAlquilerPaletas] = useState(false);
  const [tuboPelotas, setTuboPelotas] = useState(false);
  const [luzNocturna, setLuzNocturna] = useState(false);

  // Pago
  const [modalidadPago, setModalidadPago] = useState<"total" | "senia" | "mostrador">("total");
  const [medioPago, setMedioPago] = useState<ReservaItem["medioPago"]>("Mercado Pago");
  const [notas, setNotas] = useState("Reserva generada desde panel de administración.");

  // Si cambia el socio preset seleccionado
  const handleSelectSocioPreset = (dni: string) => {
    setSelectedSocioPreset(dni);
    const socio = PRESET_SOCIOS.find((s) => s.dni === dni);
    if (socio) {
      setNombreTitular(socio.nombre);
      setDniTitular(socio.dni);
      setTelefonoTitular(socio.tel);
      setEmailTitular(socio.email);
    }
  };

  // Cancha activa seleccionada
  const activeCancha = canchas.find((c) => c.id === canchaId) || canchas[0];

  // Si initialCanchaId estaba presente, inicializar deporte y sede acordes
  useEffect(() => {
    if (initialCanchaId) {
      const match = canchas.find((c) => c.id === initialCanchaId);
      if (match) {
        setCanchaId(match.id);
        setDeporte(match.deporte);
        setSedeId(match.sedeId);
      }
    }
  }, [initialCanchaId, canchas]);

  // Turnos preconfigurados
  const SLOTS_PADEL = [
    { hora: "16:00", fin: "17:30", esPico: false, ocupado: false },
    { hora: "17:30", fin: "19:00", esPico: false, ocupado: true, ocupante: "Mateo Silva" },
    { hora: "19:00", fin: "20:30", esPico: true, ocupado: false },
    { hora: "20:30", fin: "22:00", esPico: true, ocupado: false },
    { hora: "22:00", fin: "23:30", esPico: false, ocupado: false },
  ];

  const SLOTS_FUTBOL = [
    { hora: "17:00", fin: "18:00", esPico: false, ocupado: false },
    { hora: "18:00", fin: "19:00", esPico: false, ocupado: false },
    { hora: "19:00", fin: "20:00", esPico: true, ocupado: true, ocupante: "Equipo Galácticos" },
    { hora: "20:00", fin: "21:00", esPico: true, ocupado: false },
    { hora: "21:00", fin: "22:00", esPico: true, ocupado: false },
  ];

  const currentSlots = deporte === "Fútbol 5" ? SLOTS_FUTBOL : SLOTS_PADEL;
  const currentSlotObj = currentSlots.find((s) => s.hora === horaSeleccionada) || currentSlots[0];
  const esHorarioPico = currentSlotObj.esPico;

  // CÁLCULO FINANCIERO DINÁMICO
  const tarifaBase = activeCancha ? activeCancha.tarifaBaseHora : 12000;
  const recargoPico = esHorarioPico ? Math.round(tarifaBase * (activeCancha.recargoHoraPicoPorc / 100)) : 0;
  const subtotalConPico = tarifaBase + recargoPico;
  const descuentoSocio = esSocio ? Math.round(tarifaBase * (activeCancha.descuentoSocioPorc / 100)) : 0;

  const extrasArr: { concepto: string; precio: number }[] = [];
  if (alquilerPaletas) extrasArr.push({ concepto: "Alquiler 2 Paletas Pro", precio: 5000 });
  if (tuboPelotas) extrasArr.push({ concepto: "Tubo Pelotas Oficiales", precio: 3500 });
  if (luzNocturna) extrasArr.push({ concepto: "Ficha Adicional Luz Nocturna LED", precio: 1000 });

  const totalExtras = extrasArr.reduce((acc, curr) => acc + curr.precio, 0);
  const totalCalculado = subtotalConPico - descuentoSocio + totalExtras;

  const montoAbonado =
    modalidadPago === "total"
      ? totalCalculado
      : modalidadPago === "senia"
      ? Math.round(totalCalculado * 0.5)
      : 0;
  const saldoPendiente = totalCalculado - montoAbonado;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreTitular.trim() || !dniTitular.trim() || !telefonoTitular.trim()) {
      alert("Por favor completa los datos de contacto del titular de la reserva.");
      return;
    }

    const nroRandom = Math.floor(100 + Math.random() * 900);
    const newReserva: ReservaItem = {
      id: `RSV-2026-${nroRandom}`,
      codigo: `#RSV-${nroRandom}`,
      canchaId: activeCancha.id,
      canchaNombre: activeCancha.nombre,
      deporte: activeCancha.deporte,
      sedeId: activeCancha.sedeId,
      sedeNombre: activeCancha.sedeNombre,
      fecha,
      horaInicio: currentSlotObj.hora,
      horaFin: currentSlotObj.fin,
      duracionMin: activeCancha.duracionTurnoMin,
      esHorarioPico,
      titular: {
        nombre: nombreTitular.trim(),
        dni: dniTitular.trim(),
        telefono: telefonoTitular.trim(),
        email: emailTitular.trim(),
        esSocio,
        nroSocio: esSocio ? "SOC-0099" : undefined,
        categoriaSocio: esSocio ? "Socio Activo FitZone" : undefined,
      },
      jugadoresAcompaniantes: [
        { nombre: `${nombreTitular} (Titular)`, dni: dniTitular, esSocio, checkIn: true },
        ...(jugador2.trim() ? [{ nombre: jugador2.trim(), checkIn: false }] : []),
        ...(jugador3.trim() ? [{ nombre: jugador3.trim(), checkIn: false }] : []),
        ...(jugador4.trim() ? [{ nombre: jugador4.trim(), checkIn: false }] : []),
      ],
      tarifaBase,
      recargoPico,
      descuentoSocio,
      extras: extrasArr,
      totalCalculado,
      montoAbonado,
      saldoPendiente,
      estadoPago: modalidadPago === "total" ? "Pagado" : modalidadPago === "senia" ? "Seña 50%" : "Pendiente",
      medioPago,
      nroComprobante: `B-0004-000${Math.floor(10000 + Math.random() * 90000)}`,
      estadoTurno: "Confirmado",
      notas,
      fechaCreacion: new Date().toLocaleDateString("es-AR") + ", " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) + " hs",
      historialAuditoria: [
        {
          fecha: new Date().toLocaleDateString("es-AR") + ", " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) + " hs",
          accion: `Reserva creada en panel administrativo (${modalidadPago === "total" ? "Pago 100%" : modalidadPago === "senia" ? "Seña 50%" : "Abono en Mostrador"})`,
          usuario: "Operador de Recepción",
        },
      ],
    };

    saveReserva(newReserva);
    alert(`✓ ¡Reserva ${newReserva.codigo} generada exitosamente para ${nombreTitular}! Redirigiendo a la ficha de reserva...`);
    navigate(`/admin/reservas/${newReserva.id}`);
  };

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* TOPBAR */}
      <header className="topbar" style={{ marginBottom: "1.5rem" }}>
        <div className="header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 700, textTransform: "uppercase" }}>
              Módulo R-03
            </span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Asignación de Turno en Pista</span>
          </div>
          <h1>Crear Nueva Reserva de Cancha Deportiva</h1>
          <p>Selecciona la pista, fecha, bloque horario con cálculo tarifario automático y registro de seña</p>
        </div>
        <div className="header-controls">
          <Link to="/admin/reservas" className="btn-secondary" style={{ textDecoration: "none" }}>
            ← Volver al Listado
          </Link>
        </div>
      </header>

      {/* WIZARD CONTAINER */}
      <div className="reserva-flow-container">
        {/* COLUMNA FORMULARIO */}
        <form onSubmit={handleSubmit}>
          {/* PASO 1: CANCHA Y FECHA */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">1</span> Selección de Sede, Pista y Fecha
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Sede Operativa *</label>
                <select
                  className="form-control"
                  value={sedeId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setSedeId(sid);
                    const match = canchas.find((c) => c.sedeId === sid && c.deporte === deporte);
                    if (match) setCanchaId(match.id);
                  }}
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
                    const match = canchas.find((c) => c.deporte === dep);
                    if (match) setCanchaId(match.id);
                  }}
                >
                  <option value="Pádel">Pádel (4 Jugadores)</option>
                  <option value="Fútbol 5">Fútbol 5 (10 Jugadores)</option>
                  <option value="Tenis">Tenis (Singles o Dobles)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Cancha Específica *</label>
                <select
                  className="form-control"
                  value={canchaId}
                  onChange={(e) => setCanchaId(e.target.value)}
                >
                  {canchas
                    .filter((c) => c.deporte === deporte)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.superficie}) — {c.estado}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fecha de Reserva *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PASO 2: HORARIO INTERACTIVO */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">2</span> Bloque Horario Disponible
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Haz clic sobre el turno que deseas reservar. Los horarios de 19:00 a 21:30 aplican recargo de Hora Pico (+20%).
            </p>

            <div className="time-slot-grid-selectable">
              {currentSlots.map((slot) => {
                const isSelected = horaSeleccionada === slot.hora;
                return (
                  <button
                    key={slot.hora}
                    type="button"
                    disabled={slot.ocupado}
                    onClick={() => setHoraSeleccionada(slot.hora)}
                    className={`selectable-slot-btn ${isSelected ? "selected" : ""}`}
                  >
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>{slot.hora} h</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>hasta {slot.fin}</span>
                    {slot.ocupado ? (
                      <span style={{ fontSize: "0.7rem", color: "var(--accent-red)", fontWeight: 700 }}>
                        Ocupado ({slot.ocupante?.split(" ")[0]})
                      </span>
                    ) : slot.esPico ? (
                      <span style={{ fontSize: "0.7rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                        ⚡ Horario Pico
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.7rem", color: "var(--accent-green)" }}>Disponible</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 3: TITULAR Y JUGADORES */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">3</span> Titular de Reserva y Jugadores
            </h2>

            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.2rem", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 700 }}>
                <input
                  type="radio"
                  name="tipoCliente"
                  checked={esSocio}
                  onChange={() => setEsSocio(true)}
                />
                <span style={{ color: "var(--accent-green)" }}>Socio Activo FitZone (-15% Descuento)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 700 }}>
                <input
                  type="radio"
                  name="tipoCliente"
                  checked={!esSocio}
                  onChange={() => setEsSocio(false)}
                />
                <span>Cliente Externo / Particular</span>
              </label>
            </div>

            {esSocio && (
              <div className="form-group" style={{ marginBottom: "1.2rem" }}>
                <label>Seleccionar Socio Registrado (Búsqueda Rápida):</label>
                <select
                  className="form-control"
                  value={selectedSocioPreset}
                  onChange={(e) => handleSelectSocioPreset(e.target.value)}
                >
                  {PRESET_SOCIOS.map((socio) => (
                    <option key={socio.dni} value={socio.dni}>
                      {socio.nombre} — DNI {socio.dni} ({socio.cat})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Nombre y Apellido del Titular *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={nombreTitular}
                  onChange={(e) => setNombreTitular(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>DNI / Documento *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={dniTitular}
                  onChange={(e) => setDniTitular(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="form-group">
                <label>Teléfono de Contacto *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={telefonoTitular}
                  onChange={(e) => setTelefonoTitular(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email de Notificación</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailTitular}
                  onChange={(e) => setEmailTitular(e.target.value)}
                />
              </div>
            </div>

            {/* Jugadores Acompañantes */}
            <div className="form-group">
              <label>Jugadores Acompañantes (Opcional):</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Jugador 2"
                  value={jugador2}
                  onChange={(e) => setJugador2(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Jugador 3"
                  value={jugador3}
                  onChange={(e) => setJugador3(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Jugador 4"
                  value={jugador4}
                  onChange={(e) => setJugador4(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PASO 4: ADICIONALES Y ALQUILERES */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">4</span> Materiales Adicionales
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={alquilerPaletas}
                  onChange={(e) => setAlquilerPaletas(e.target.checked)}
                />
                <div>
                  <strong>Alquiler de 2 Paletas Bullpadel Pro</strong>
                  <span style={{ color: "var(--accent-orange)", marginLeft: "0.5rem", fontWeight: 700 }}>
                    + $5.000
                  </span>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={tuboPelotas}
                  onChange={(e) => setTuboPelotas(e.target.checked)}
                />
                <div>
                  <strong>Tubo de 3 Pelotas Nuevas Head Padel Pro S</strong>
                  <span style={{ color: "var(--accent-orange)", marginLeft: "0.5rem", fontWeight: 700 }}>
                    + $3.500
                  </span>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={luzNocturna}
                  onChange={(e) => setLuzNocturna(e.target.checked)}
                />
                <div>
                  <strong>Ficha Adicional Luz Nocturna LED Alta Potencia</strong>
                  <span style={{ color: "var(--accent-orange)", marginLeft: "0.5rem", fontWeight: 700 }}>
                    + $1.000
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* PASO 5: FORMA DE PAGO */}
          <div className="reserva-step-card">
            <h2 className="reserva-step-title">
              <span className="step-num-badge">5</span> Modalidad de Pago y Confirmación
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <label
                style={{
                  border: modalidadPago === "total" ? "1px solid var(--accent-green)" : "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  cursor: "pointer",
                  backgroundColor: modalidadPago === "total" ? "rgba(0, 255, 135, 0.08)" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <input
                    type="radio"
                    name="modalidad"
                    checked={modalidadPago === "total"}
                    onChange={() => setModalidadPago("total")}
                  />
                  <strong style={{ color: "var(--accent-green)" }}>Pago Total (100%)</strong>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Cancela el total ahora (${totalCalculado.toLocaleString()})
                </span>
              </label>

              <label
                style={{
                  border: modalidadPago === "senia" ? "1px solid var(--accent-yellow)" : "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  cursor: "pointer",
                  backgroundColor: modalidadPago === "senia" ? "rgba(255, 176, 32, 0.08)" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <input
                    type="radio"
                    name="modalidad"
                    checked={modalidadPago === "senia"}
                    onChange={() => setModalidadPago("senia")}
                  />
                  <strong style={{ color: "var(--accent-yellow)" }}>Seña 50%</strong>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Abona ${Math.round(totalCalculado * 0.5).toLocaleString()} y liquida resto en sede
                </span>
              </label>

              <label
                style={{
                  border: modalidadPago === "mostrador" ? "1px solid var(--accent-orange)" : "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  cursor: "pointer",
                  backgroundColor: modalidadPago === "mostrador" ? "rgba(255, 94, 58, 0.08)" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <input
                    type="radio"
                    name="modalidad"
                    checked={modalidadPago === "mostrador"}
                    onChange={() => setModalidadPago("mostrador")}
                  />
                  <strong style={{ color: "var(--accent-orange)" }}>Pagar en Sede</strong>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Pendiente de cobro al ingreso
                </span>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Medio de Cobro Empleado:</label>
                <select
                  className="form-control"
                  value={medioPago}
                  onChange={(e) => setMedioPago(e.target.value as any)}
                >
                  <option value="Mercado Pago">Mercado Pago / Tarjeta</option>
                  <option value="Tarjeta de Débito/Crédito">Tarjeta Débito/Crédito (POS)</option>
                  <option value="Efectivo">Efectivo Mostrador</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notas de la Reserva:</label>
                <input
                  type="text"
                  className="form-control"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Link to="/admin/reservas" className="btn-secondary" style={{ textDecoration: "none" }}>
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "0.85rem 2.5rem", fontSize: "1rem", backgroundColor: "var(--accent-orange)" }}
            >
              ⚡ Confirmar y Generar Reserva (R-03)
            </button>
          </div>
        </form>

        {/* COLUMNA LATERAL: RESUMEN DE COBRO EN TIEMPO REAL */}
        <aside className="reserva-summary-sticky">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-orange)", fontWeight: 800, textTransform: "uppercase" }}>
              Resumen de Reserva
            </span>
            <span className="status-pill status-pill-operativa">Turno Disponible</span>
          </div>

          <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-pure)" }}>
              {activeCancha.nombre}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              📍 {activeCancha.sedeNombre}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--accent-orange)", fontWeight: 700, marginTop: "0.4rem" }}>
              🗓️ {fecha} • {horaSeleccionada} a {currentSlotObj.fin} h ({activeCancha.duracionTurnoMin} min)
            </div>
          </div>

          {/* Desglose Tarifario */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="reserva-breakdown-row">
              <span style={{ color: "var(--text-muted)" }}>Tarifa Base:</span>
              <span>${tarifaBase.toLocaleString()}</span>
            </div>

            {esHorarioPico && (
              <div className="reserva-breakdown-row">
                <span style={{ color: "var(--accent-yellow)" }}>⚡ Recargo Pico (+20%):</span>
                <span style={{ color: "var(--accent-yellow)", fontWeight: 700 }}>+ ${recargoPico.toLocaleString()}</span>
              </div>
            )}

            {esSocio && (
              <div className="reserva-breakdown-row">
                <span style={{ color: "var(--accent-green)" }}>Descuento Socio (-15%):</span>
                <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>- ${descuentoSocio.toLocaleString()}</span>
              </div>
            )}

            {extrasArr.map((ext, idx) => (
              <div key={idx} className="reserva-breakdown-row">
                <span style={{ color: "var(--text-muted)" }}>+ {ext.concepto}:</span>
                <span>+ ${ext.precio.toLocaleString()}</span>
              </div>
            ))}

            <div className="reserva-total-row">
              <span>Total a Pagar:</span>
              <span style={{ color: "var(--accent-green)" }}>${totalCalculado.toLocaleString()}</span>
            </div>
          </div>

          {/* Modalidad de Liquidación */}
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(11, 15, 25, 0.7)",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              fontSize: "0.82rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Monto a Cobrar Hoy:</span>
              <strong style={{ color: "var(--accent-green)" }}>${montoAbonado.toLocaleString()}</strong>
            </div>
            {saldoPendiente > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Saldo en Recepción:</span>
                <strong style={{ color: "var(--accent-yellow)" }}>${saldoPendiente.toLocaleString()}</strong>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Medio:</span>
              <span>{medioPago}</span>
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            💡 Al confirmar la reserva se enviará un SMS con el código digital y se actualizará automáticamente la grilla R-01 en tiempo real.
          </div>
        </aside>
      </div>
    </div>
  );
}
