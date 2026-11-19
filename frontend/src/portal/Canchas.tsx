import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertMessage,
  Badge,
  Button,
  Card,
  FormField,
  GrillaHoraria,
  Input,
  Spinner,
  type FranjaHorariaItem,
} from "../components";
import { useAppStore } from "../store";
import { ApiError } from "../services/apiClient";
import {
  cancelarReservaCancha,
  obtenerCanchas,
  obtenerDisponibilidadCancha,
  obtenerMisReservasCancha,
  reservarCancha,
  type CanchaApi,
  type DisponibilidadCanchaApi,
  type MiReservaCanchaApi,
} from "../services/canchasService";
import {
  obtenerMiEstadoMembresia,
  type EstadoMembresiaRespuesta,
} from "../services/membresiasService";
import { siteConfig } from "../config/siteConfig";

function fechaMananaIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function Canchas() {
  const { usuario, token } = useAppStore();

  const [canchas, setCanchas] = useState<CanchaApi[]>([]);
  const [canchaId, setCanchaId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(fechaMananaIso());
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadCanchaApi | null>(null);
  const [franjaSel, setFranjaSel] = useState<FranjaHorariaItem | null>(null);
  const [estadoMembresia, setEstadoMembresia] = useState<EstadoMembresiaRespuesta | null>(null);

  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [cargandoGrilla, setCargandoGrilla] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [reservasPropias, setReservasPropias] = useState<MiReservaCanchaApi[]>([]);

  const cargarReservasUsuario = useCallback(async () => {
    if (!token) return;
    try {
      const datos = await obtenerMisReservasCancha();
      setReservasPropias(datos);
    } catch {
      // ignore
    }
  }, [token]);

  // Cargar canchas y estado de membresía
  useEffect(() => {
    let activo = true;
    async function cargar() {
      setCargandoInicial(true);
      setError(null);
      try {
        const listaCanchas = await obtenerCanchas();
        if (!activo) return;
        setCanchas(listaCanchas);

        if (token) {
          obtenerMiEstadoMembresia()
            .then((est) => activo && setEstadoMembresia(est))
            .catch(() => { });
          void cargarReservasUsuario();
        }
      } catch (err) {
        if (activo) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar las canchas.");
        }
      } finally {
        if (activo) setCargandoInicial(false);
      }
    }
    void cargar();
    return () => {
      activo = false;
    };
  }, [token, cargarReservasUsuario]);

  const canchasDeSede = canchas.filter((c) => c.sede_id === siteConfig.sedeId);

  const canchaActual =
    canchasDeSede.find((c) => c.id === canchaId) ?? canchasDeSede[0] ?? null;

  const cargarGrilla = useCallback(async (idCancha: number, fechaConsulta: string) => {
    if (!token) return;
    setCargandoGrilla(true);
    setFranjaSel(null);
    try {
      const disp = await obtenerDisponibilidadCancha(idCancha, fechaConsulta);
      setDisponibilidad(disp);
    } catch (err) {
      setDisponibilidad(null);
      setError(err instanceof Error ? err.message : "No se pudo consultar la disponibilidad.");
    } finally {
      setCargandoGrilla(false);
    }
  }, [token]);

  useEffect(() => {
    if (canchaActual && token) {
      void cargarGrilla(canchaActual.id, fecha);
    }
  }, [canchaActual?.id, fecha, token, cargarGrilla]);

  const manejarReservar = async () => {
    if (!canchaActual || !franjaSel) return;
    setEnviando(true);
    setError(null);
    setExito(null);

    try {
      const res = await reservarCancha(
        canchaActual.id,
        fecha,
        franjaSel.hora_inicio,
        usuario?.id
      );
      const monto = Number(res.monto_total);
      setExito(
        `Reserva #${res.reserva_id} creada ($${monto.toLocaleString("es-AR")}). Podés pagarla para confirmarla.`
      );
      await Promise.all([cargarGrilla(canchaActual.id, fecha), cargarReservasUsuario()]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Ese horario ya fue reservado");
        await cargarGrilla(canchaActual.id, fecha);
      } else {
        setError(err instanceof Error ? err.message : "No se pudo completar la reserva.");
      }
    } finally {
      setEnviando(false);
    }
  };

  const manejarCancelar = async (reservaId: number) => {
    setError(null);
    setExito(null);
    try {
      const res = await cancelarReservaCancha(reservaId);
      setExito(
        `${res.mensaje}${res.con_penalidad ? ` Penalidad: $${res.penalidad}.` : ""}`
      );
      await Promise.all([
        canchaActual ? cargarGrilla(canchaActual.id, fecha) : Promise.resolve(),
        cargarReservasUsuario(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cancelar la reserva.");
    }
  };

  const enMora =
    estadoMembresia?.estado === "VENCIDO" || estadoMembresia?.estado === "SUSPENDIDO";

  return (
    <div className="profile-page-wrapper" style={{ padding: "1.25rem 0.75rem" }}>
      <main className="profile-container" style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <header className="profile-page-header" style={{ marginBottom: "1.25rem" }}>
          <h1 className="profile-page-title">
            CANCHAS <span className="highlight">DEPORTIVAS</span>
          </h1>
          <p className="profile-page-subtitle">
            Consultá la disponibilidad en tiempo real con tarifas dinámicas (RF-10 y RF-11).
          </p>
        </header>

        {enMora && (
          <AlertMessage
            variant="warning"
            title="Membresía en mora (RN-03)"
            message="Tu membresía está vencida o suspendida. Podés reservar canchas abonando tarifa de cliente externo (sin 15% de descuento)."
          />
        )}

        {error && <AlertMessage variant="error" message={error} onClose={() => setError(null)} />}
        {exito && <AlertMessage variant="success" message={exito} onClose={() => setExito(null)} />}

        {!token ? (
          <Card title="Iniciá sesión para reservar">
            <p style={{ color: "var(--text-muted, #94a3b8)", marginBottom: "1rem" }}>
              Necesitás estar autenticado para ver tu tarifa personalizada y reservar turnos.
            </p>
            <Link to="/login">
              <Button>Ir al Login</Button>
            </Link>
          </Card>
        ) : cargandoInicial ? (
          <Card>
            <Spinner label="Cargando sedes y canchas..." />
          </Card>
        ) : (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <Card title="Seleccioná sede, cancha y fecha">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                <FormField label="Sede">
                  <p style={{ color: "var(--text-muted, #8b95a5)", margin: "0.5rem 0" }}>
                    Mostrando canchas disponibles en:{" "}
                    <strong style={{ color: "#fff" }}>{siteConfig.sedeNombre}</strong>
                  </p>
                </FormField>

                <FormField label="Cancha" htmlFor="sel-cancha">
                  <select
                    id="sel-cancha"
                    value={canchaActual?.id ?? ""}
                    onChange={(e) => setCanchaId(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.65rem",
                      borderRadius: "8px",
                      background: "#0f1524",
                      color: "#fff",
                      border: "1px solid var(--border-color, #222b40)",
                    }}
                  >
                    {canchasDeSede.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} — {c.tipo_cancha.nombre} ($
                        {Number(c.costo_hora).toLocaleString("es-AR")}/h)
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Fecha" htmlFor="sel-fecha">
                  <Input
                    id="sel-fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </FormField>
              </div>
            </Card>

            {canchaActual && (
              <Card
                title={`${canchaActual.nombre} (${canchaActual.tipo_cancha.nombre})`}
                subtitle={`Base: $${Number(canchaActual.costo_hora).toLocaleString("es-AR")}/h · Horario pico 19:00 a 21:00 (+20%) · Socios activos -15%`}
                headerAction={
                  <Badge variant={canchaActual.estado === "HABILITADA" ? "success" : "warning"}>
                    {canchaActual.estado}
                  </Badge>
                }
              >
                {cargandoGrilla ? (
                  <Spinner label="Consultando disponibilidad..." />
                ) : disponibilidad ? (
                  <>
                    <GrillaHoraria
                      franjas={disponibilidad.franjas}
                      horaSeleccionada={franjaSel?.hora_inicio ?? null}
                      onSelectHora={(f) => setFranjaSel(f)}
                    />

                    {franjaSel && (
                      <div
                        style={{
                          marginTop: "1.25rem",
                          padding: "1rem",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ fontSize: "0.88rem", color: "#e2e8f0" }}>
                          <strong>
                            Turno {String(franjaSel.hora_inicio).padStart(2, "0")}:00 -{" "}
                            {String(franjaSel.hora_fin).padStart(2, "0")}:00 ({fecha})
                          </strong>
                          <div style={{ marginTop: "0.3rem", color: "#94a3b8" }}>
                            Base: ${franjaSel.precio.precio_base.toLocaleString("es-AR")}
                            {franjaSel.precio.descuento > 0 &&
                              ` · Descuento socio: -$${franjaSel.precio.descuento.toLocaleString("es-AR")}`}
                            {franjaSel.precio.recargo > 0 &&
                              ` · Recargo pico: +$${franjaSel.precio.recargo.toLocaleString("es-AR")}`}
                          </div>
                          <div
                            style={{
                              marginTop: "0.25rem",
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "var(--accent-green, #00ff87)",
                            }}
                          >
                            Total: ${franjaSel.precio.monto_total.toLocaleString("es-AR")}
                          </div>
                        </div>

                        <Button loading={enviando} onClick={manejarReservar}>
                          Confirmar Reserva
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: "var(--text-muted, #8b95a5)" }}>
                    Seleccioná una cancha y fecha para ver los horarios.
                  </p>
                )}
              </Card>
            )}

            {reservasPropias.length > 0 && (
              <Card title="Tus reservas de canchas">
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {reservasPropias.map((r) => {
                    const monto = typeof r.monto_total === "number" ? r.monto_total : Number(r.monto_total);
                    const fechaTexto = new Date(r.fecha).toISOString().slice(0, 10);
                    return (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.85rem",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--border-color, #222b40)",
                        }}
                      >
                        <div>
                          <strong style={{ color: "#fff" }}>
                            #{r.id} · {r.cancha.nombre} ({r.cancha.tipo_cancha.nombre})
                          </strong>
                          <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                            {fechaTexto} · {String(r.hora_inicio).padStart(2, "0")}:00 hs · $
                            {monto.toLocaleString("es-AR")}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                          <Badge variant={r.estado === "CANCELADA" ? "danger" : r.estado === "CONFIRMADA" ? "success" : "warning"}>
                            {r.estado}
                          </Badge>
                          {r.estado !== "CANCELADA" && r.estado !== "CUMPLIDA" && (
                            <>
                              {r.estado === "PENDIENTE_PAGO" && (
                                <Link
                                  to={`/pagos?tipo=cancha&id=${r.id}&monto=${monto}`}
                                >
                                  <Button variant="primary">Pagar</Button>
                                </Link>
                              )}
                              <Button
                                variant="danger"
                                onClick={() => manejarCancelar(r.id)}
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
