import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertMessage, Badge, Button, Card, FormField, Spinner } from "../components";
import { useAppStore } from "../store";
import {
  contratarMembresia,
  obtenerMiEstadoMembresia,
  renovarMembresia,
  type EstadoMembresiaRespuesta,
} from "../services/membresiasService";
import { obtenerPlanes, type PlanApi } from "../services/planesService";

function badgePorEstado(estado?: string): "success" | "warning" | "danger" | "neutral" {
  if (estado === "ACTIVO") return "success";
  if (estado === "PENDIENTE_PAGO") return "warning";
  if (estado === "VENCIDO" || estado === "SUSPENDIDO") return "danger";
  return "neutral";
}

export default function Profile() {
  const { usuario, token, cargandoSesion } = useAppStore();

  const [estadoMem, setEstadoMem] = useState<EstadoMembresiaRespuesta | null>(null);
  const [planes, setPlanes] = useState<PlanApi[]>([]);
  const [planSelId, setPlanSelId] = useState<number | "">("");
  const [renovacionAuto, setRenovacionAuto] = useState(true);

  const [cargandoMem, setCargandoMem] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const cargarMembresiaYPlanes = useCallback(async () => {
    if (!token) return;
    setCargandoMem(true);
    setError(null);
    try {
      const [est, listaPlanes] = await Promise.all([
        obtenerMiEstadoMembresia(),
        obtenerPlanes(),
      ]);
      setEstadoMem(est);
      setPlanes(listaPlanes);
      if (listaPlanes.length > 0) {
        setPlanSelId((prev) => (prev === "" ? listaPlanes[0].id : prev));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo consultar tu membresía.");
    } finally {
      setCargandoMem(false);
    }
  }, [token]);

  useEffect(() => {
    void cargarMembresiaYPlanes();
  }, [cargarMembresiaYPlanes]);

  const manejarContratar = async () => {
    if (!planSelId) return;
    setEnviando(true);
    setError(null);
    setExito(null);
    try {
      const nueva = await contratarMembresia(Number(planSelId), renovacionAuto);
      setExito(
        `Membresía #${nueva.id} creada en estado PENDIENTE_PAGO. Completá el pago para activarla.`
      );
      await cargarMembresiaYPlanes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo contratar el plan.");
    } finally {
      setEnviando(false);
    }
  };

  const manejarRenovar = async () => {
    if (!estadoMem?.membresia) return;
    setEnviando(true);
    setError(null);
    setExito(null);
    try {
      const renovada = await renovarMembresia(estadoMem.membresia.id, {
        ...(planSelId ? { plan_id: Number(planSelId) } : {}),
        renovacion_automatica: renovacionAuto,
      });
      setExito(
        `Membresía renovada en estado ${renovada.estado}. Vigente hasta ${new Date(renovada.fecha_fin).toLocaleDateString("es-AR")}.`
      );
      await cargarMembresiaYPlanes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo renovar la membresía.");
    } finally {
      setEnviando(false);
    }
  };

  if (!token) {
    return (
      <div className="profile-page-wrapper" style={{ padding: "2rem 1rem" }}>
        <main style={{ maxWidth: "460px", margin: "0 auto" }}>
          <Card title="Iniciá Sesión">
            <p style={{ color: "var(--text-muted, #8b95a5)", marginBottom: "1rem" }}>
              Ingresá con tus credenciales para ver tu perfil, membresía y pase QR.
            </p>
            <Link to="/login">
              <Button fullWidth>Ir al Login</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const enMora = estadoMem?.estado === "VENCIDO" || estadoMem?.estado === "SUSPENDIDO";
  const planActual = estadoMem?.membresia?.plan_membresia;

  return (
    <div className="profile-page-wrapper" style={{ padding: "1.25rem 0.75rem" }}>
      <main className="profile-container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        <header className="profile-page-header" style={{ marginBottom: "1.25rem" }}>
          <h1 className="profile-page-title">
            MI <span className="highlight">PERFIL</span>
          </h1>
          <p className="profile-page-subtitle">Datos personales, membresía y accesos rápidos.</p>
        </header>

        {error && <AlertMessage variant="error" message={error} onClose={() => setError(null)} />}
        {exito && <AlertMessage variant="success" message={exito} onClose={() => setExito(null)} />}

        {enMora && (
          <AlertMessage
            variant="warning"
            title="Membresía en mora (RN-03)"
            message="Tu cuota está vencida o suspendida: no podés reservar clases grupales y en canchas se te aplica tarifa de cliente externo (sin 15% de descuento). Renová tu membresía debajo para recuperar los beneficios."
          />
        )}

        <div style={{ display: "grid", gap: "1.25rem" }}>
          <Card
            title={usuario ? `${usuario.nombre} ${usuario.apellido}` : "Mi Cuenta"}
            subtitle={usuario?.email}
            headerAction={
              estadoMem && (
                <Badge variant={estadoMem.tipo_usuario === "SOCIO" ? "info" : "neutral"}>
                  {estadoMem.tipo_usuario}
                </Badge>
              )
            }
          >
            {cargandoSesion ? (
              <Spinner label="Cargando perfil..." />
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                <Link to="/mi-pase-qr">
                  <Button variant="primary">Mi Pase QR</Button>
                </Link>
                <Link to="/canchas">
                  <Button variant="secondary">Reservar Cancha</Button>
                </Link>
                <Link to="/clases">
                  <Button variant="secondary">Clases Grupales</Button>
                </Link>
                <Link to="/pagos">
                  <Button variant="secondary">Pagos / PDF</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card
            title="Mi Membresía (RF-02)"
            subtitle="Planes Mensual, Trimestral y Anual con acceso multi-sede"
            headerAction={
              estadoMem && (
                <Badge variant={badgePorEstado(estadoMem.estado)}>{estadoMem.estado}</Badge>
              )
            }
          >
            {cargandoMem ? (
              <Spinner label="Consultando estado de membresía..." />
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {estadoMem?.membresia ? (
                  <div
                    style={{
                      padding: "0.9rem",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-color, #222b40)",
                      fontSize: "0.9rem",
                      color: "#e2e8f0",
                    }}
                  >
                    <div>
                      <strong>Plan actual:</strong> {planActual?.nombre ?? `Plan #${estadoMem.membresia.plan_id}`}
                    </div>
                    <div style={{ marginTop: "0.25rem", color: "#94a3b8" }}>
                      Vigencia:{" "}
                      {new Date(estadoMem.membresia.fecha_inicio).toLocaleDateString("es-AR")} al{" "}
                      {new Date(estadoMem.membresia.fecha_fin).toLocaleDateString("es-AR")} ·
                      Renovación automática:{" "}
                      {estadoMem.membresia.renovacion_automatica ? "Activada" : "Manual"}
                    </div>
                    {estadoMem.estado === "PENDIENTE_PAGO" && planActual && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <Link
                          to={`/pagos?tipo=membresia&id=${estadoMem.membresia.id}&monto=${Number(planActual.precio)}`}
                        >
                          <Button variant="primary">Pagar para activar membresía</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted, #94a3b8)", margin: 0 }}>
                    Actualmente sos <strong>Cliente Externo</strong> (sin membresía). Contratá un plan para acceder a clases y al 15% de descuento en canchas.
                  </p>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "0.75rem",
                    alignItems: "end",
                  }}
                >
                  <FormField label="Elegir plan" htmlFor="plan-select">
                    <select
                      id="plan-select"
                      value={planSelId}
                      onChange={(e) => setPlanSelId(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "0.65rem",
                        borderRadius: "8px",
                        background: "#0f1524",
                        color: "#fff",
                        border: "1px solid var(--border-color, #222b40)",
                      }}
                    >
                      {planes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({p.duracion_meses} mes/es) — $
                          {Number(p.precio).toLocaleString("es-AR")}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#cbd5e1",
                      fontSize: "0.86rem",
                      marginBottom: "1.1rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={renovacionAuto}
                      onChange={(e) => setRenovacionAuto(e.target.checked)}
                    />
                    Renovación automática (simulada)
                  </label>
                </div>

                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                  {estadoMem?.membresia ? (
                    <Button loading={enviando} onClick={manejarRenovar}>
                      Renovar / Reactivar Membresía
                    </Button>
                  ) : (
                    <Button loading={enviando} onClick={manejarContratar}>
                      Contratar Plan
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
