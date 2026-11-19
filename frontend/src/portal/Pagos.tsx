import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertMessage, Badge, Button, Card, FormField, Input } from "../components";
import { useAppStore } from "../store";
import {
  descargarComprobantePdf,
  simularPago,
  type PagoRespuestaApi,
} from "../services/pagosService";

export default function Pagos() {
  const { token } = useAppStore();
  const [searchParams] = useSearchParams();

  const tipoInicial = searchParams.get("tipo") === "membresia" ? "membresia" : "cancha";
  const [origenTipo, setOrigenTipo] = useState<"cancha" | "membresia">(tipoInicial);
  const [origenId, setOrigenId] = useState<string>(searchParams.get("id") ?? "");
  const [monto, setMonto] = useState<string>(searchParams.get("monto") ?? "");

  const [procesando, setProcesando] = useState(false);
  const [descargandoId, setDescargandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagosRealizados, setPagosRealizados] = useState<PagoRespuestaApi[]>([]);

  const manejarPago = async (e: FormEvent) => {
    e.preventDefault();
    const idNum = Number(origenId);
    const montoNum = Number(monto);
    if (!Number.isInteger(idNum) || idNum <= 0 || Number.isNaN(montoNum) || montoNum <= 0) {
      setError("Ingresá un ID y un monto válidos mayores a 0.");
      return;
    }

    setProcesando(true);
    setError(null);
    try {
      const res = await simularPago(origenTipo, idNum, montoNum);
      setPagosRealizados((prev) => [res, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el pago.");
    } finally {
      setProcesando(false);
    }
  };

  const manejarDescarga = async (pagoId: number) => {
    setDescargandoId(pagoId);
    setError(null);
    try {
      await descargarComprobantePdf(pagoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el comprobante PDF.");
    } finally {
      setDescargandoId(null);
    }
  };

  return (
    <div className="profile-page-wrapper" style={{ padding: "1.25rem 0.75rem" }}>
      <main className="profile-container" style={{ maxWidth: "820px", margin: "0 auto" }}>
        <header className="profile-page-header" style={{ marginBottom: "1.25rem" }}>
          <h1 className="profile-page-title">
            PAGOS Y <span className="highlight">COMPROBANTES</span>
          </h1>
          <p className="profile-page-subtitle">
            Pasarela simulada (MercadoPago / Modo) con emisión de comprobante PDF (RF-13, RF-14, RNF-02).
          </p>
        </header>

        {error && <AlertMessage variant="error" message={error} onClose={() => setError(null)} />}

        {!token ? (
          <Card title="Iniciá sesión para abonar">
            <p style={{ color: "var(--text-muted, #94a3b8)", marginBottom: "1rem" }}>
              Necesitás estar autenticado para confirmar pagos y descargar comprobantes PDF.
            </p>
            <Link to="/login">
              <Button>Ir al Login</Button>
            </Link>
          </Card>
        ) : (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <Card
              title="Confirmar pago en pasarela simulada"
              subtitle="Seguridad RNF-02: nunca se guardan datos de tarjeta; solo el token devuelto por la pasarela."
            >
              <form onSubmit={manejarPago}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  <FormField label="Concepto" htmlFor="pago-tipo" required>
                    <select
                      id="pago-tipo"
                      value={origenTipo}
                      onChange={(e) =>
                        setOrigenTipo(e.target.value === "membresia" ? "membresia" : "cancha")
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem",
                        borderRadius: "8px",
                        background: "#0f1524",
                        color: "#fff",
                        border: "1px solid var(--border-color, #222b40)",
                      }}
                    >
                      <option value="cancha">Reserva de Cancha</option>
                      <option value="membresia">Membresía</option>
                    </select>
                  </FormField>

                  <FormField
                    label={origenTipo === "cancha" ? "ID de Reserva" : "ID de Membresía"}
                    htmlFor="pago-origen-id"
                    required
                  >
                    <Input
                      id="pago-origen-id"
                      type="number"
                      min={1}
                      placeholder="Ej: 1"
                      value={origenId}
                      onChange={(e) => setOrigenId(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Monto ($)" htmlFor="pago-monto" required>
                    <Input
                      id="pago-monto"
                      type="number"
                      min={1}
                      step="0.01"
                      placeholder="Ej: 8000"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <Button type="submit" loading={procesando} fullWidth>
                  Pagar ahora (Simulación MercadoPago / Modo)
                </Button>
              </form>
            </Card>

            {pagosRealizados.length > 0 && (
              <Card title="Comprobantes emitidos">
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {pagosRealizados.map((p) => (
                    <div
                      key={p.pago_id}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.9rem",
                        borderRadius: "10px",
                        background: "rgba(0, 255, 135, 0.05)",
                        border: "1px solid rgba(0, 255, 135, 0.25)",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#fff" }}>Pago #{p.pago_id}</strong>{" "}
                        <Badge variant="success">{p.estado}</Badge>
                        <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                          Token pasarela: <code>{p.token_pasarela}</code> · Emitido:{" "}
                          {new Date(p.comprobante.emitido_at).toLocaleString("es-AR")}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        loading={descargandoId === p.pago_id}
                        onClick={() => manejarDescarga(p.pago_id)}
                      >
                        Descargar PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
