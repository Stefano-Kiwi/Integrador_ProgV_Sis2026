import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../admin.css";
import { AlertMessage, Badge, Button, Card, FormField, Input, Spinner } from "../components";
import { useAppStore } from "../store";
import { ApiError } from "../services/apiClient";
import { obtenerSedes, type SedeApi } from "../services/sedesService";
import {
  descargarSnapshotSede,
  leerColaOffline,
  leerSnapshotLocal,
  obtenerAforoSede,
  registrarEgreso,
  sincronizarColaOffline,
  validarAccesoOffline,
  validarAccesoOnline,
  type AforoSedeRespuesta,
  type IngresoOfflineItem,
  type SincronizacionRespuesta,
} from "../services/controlAccesoService";

interface RegistroTerminal {
  id: string;
  hora: string;
  detalle: string;
  resultado: "AUTORIZADO" | "OFFLINE_ENCOLADO" | "DENEGADO" | "EGRESO";
}

export default function AdminControlAcceso() {
  const { online, sedeSeleccionadaId, seleccionarSede } = useAppStore();

  const [sedes, setSedes] = useState<SedeApi[]>([]);
  const [aforo, setAforo] = useState<AforoSedeRespuesta | null>(null);
  const [cargandoAforo, setCargandoAforo] = useState(false);
  const [snapshotInfo, setSnapshotInfo] = useState<string | null>(null);

  const [colaOffline, setColaOffline] = useState<IngresoOfflineItem[]>(() => leerColaOffline());
  const [sincronizando, setSincronizando] = useState(false);
  const [ultimoSync, setUltimoSync] = useState<SincronizacionRespuesta | null>(null);

  const [qrInput, setQrInput] = useState("");
  const [egresoUserId, setEgresoUserId] = useState("");
  const [validando, setValidando] = useState(false);
  const [camaraActiva, setCamaraActiva] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [registros, setRegistros] = useState<RegistroTerminal[]>([]);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const bloqueoLecturaRef = useRef(false);

  const sedeActualId = sedeSeleccionadaId ?? sedes[0]?.id ?? 1;

  // Cargar sedes reales
  useEffect(() => {
    obtenerSedes()
      .then((lista) => {
        setSedes(lista);
        if (sedeSeleccionadaId === null && lista[0]) {
          seleccionarSede(lista[0].id);
        }
      })
      .catch(() => {});
  }, [sedeSeleccionadaId, seleccionarSede]);

  // Cargar aforo real (RF-05) y snapshot offline (RNF-01)
  const refrescarSede = useCallback(async (idSede: number) => {
    setCargandoAforo(true);
    try {
      const [aforoData, snap] = await Promise.all([
        obtenerAforoSede(idSede),
        descargarSnapshotSede(idSede),
      ]);
      setAforo(aforoData);
      setSnapshotInfo(
        `${snap.total_socios_activos} socios activos cacheados (${new Date(snap.generado_at).toLocaleTimeString("es-AR")})`
      );
    } catch {
      const localSnap = leerSnapshotLocal(idSede);
      if (localSnap) {
        setSnapshotInfo(
          `Copia local: ${localSnap.total_socios_activos} socios (${new Date(localSnap.generado_at).toLocaleTimeString("es-AR")})`
        );
      }
    } finally {
      setCargandoAforo(false);
    }
  }, []);

  useEffect(() => {
    if (sedeActualId) {
      void refrescarSede(sedeActualId);
    }
  }, [sedeActualId, refrescarSede]);

  // Sincronización de la cola persistente (RNF-01)
  const ejecutarSincronizacion = useCallback(async () => {
    const pendientes = leerColaOffline();
    setColaOffline(pendientes);
    if (pendientes.length === 0) return;

    setSincronizando(true);
    setError(null);
    try {
      const res = await sincronizarColaOffline();
      setColaOffline(leerColaOffline());
      if (res) {
        setUltimoSync(res);
        setExito(
          `Sincronización completada: ${res.aceptados.length} aceptados, ${res.conflictos.length} conflictos.`
        );
        await refrescarSede(sedeActualId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo sincronizar la cola offline.");
    } finally {
      setSincronizando(false);
    }
  }, [refrescarSede, sedeActualId]);

  // Al recuperar conexión o periódicamente cada 30 s, sincronizar cola pendiente
  useEffect(() => {
    if (!online) return;
    if (leerColaOffline().length > 0) {
      void ejecutarSincronizacion();
    }
    const id = window.setInterval(() => {
      if (leerColaOffline().length > 0) {
        void ejecutarSincronizacion();
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, [online, ejecutarSincronizacion]);

  const agregarLog = (detalle: string, resultado: RegistroTerminal["resultado"]) => {
    setRegistros((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        hora: new Date().toLocaleTimeString("es-AR"),
        detalle,
        resultado,
      },
      ...prev,
    ]);
  };

  // Validar QR (online -> fallback offline con snapshot + cola persistente)
  const procesarQr = useCallback(
    async (textoQr: string) => {
      const limpio = textoQr.trim();
      if (!limpio) return;
      setValidando(true);
      setError(null);
      setExito(null);

      try {
        if (!online) {
          throw new TypeError("Modo offline activo");
        }
        const res = await validarAccesoOnline(limpio, sedeActualId);
        setExito(res.mensaje);
        agregarLog(`Socio #${res.usuario_id} ingresó a ${res.sede_nombre}`, "AUTORIZADO");
        await refrescarSede(sedeActualId);
      } catch (err) {
        // Error de negocio del backend (401 vencido/firma, 403 mora, 409 RN-01 doble sede)
        if (err instanceof ApiError) {
          setError(err.message);
          agregarLog(`Rechazado (${err.status}): ${err.message}`, "DENEGADO");
          return;
        }

        // Error de red / modo offline: validar contra snapshot local y encolar en localStorage
        const off = validarAccesoOffline(limpio, sedeActualId);
        setColaOffline(leerColaOffline());
        if (off.autorizado && off.socio) {
          setExito(
            `[OFFLINE] Ingreso autorizado para ${off.socio.nombre} ${off.socio.apellido} (DNI ${off.socio.dni}). Encolado para sincronizar.`
          );
          agregarLog(
            `[OFFLINE] ${off.socio.nombre} ${off.socio.apellido} (#${off.socio.userId}) — pendiente sync`,
            "OFFLINE_ENCOLADO"
          );
          setAforo((prev) =>
            prev
              ? {
                  ...prev,
                  aforo_actual: prev.aforo_actual + 1,
                  porcentaje_ocupacion: Math.round(
                    ((prev.aforo_actual + 1) / Math.max(1, prev.aforo_maximo)) * 100
                  ),
                }
              : prev
          );
        } else {
          setError(`[OFFLINE] ${off.motivo}`);
          agregarLog(`[OFFLINE] Rechazado: ${off.motivo}`, "DENEGADO");
        }
      } finally {
        setValidando(false);
      }
    },
    [online, sedeActualId, refrescarSede]
  );

  // Cámara QR en vivo
  useEffect(() => {
    let montado = true;
    let scanner: Html5Qrcode | null = null;

    if (camaraActiva) {
      bloqueoLecturaRef.current = false;
      scanner = new Html5Qrcode("lector-qr-container");
      scannerRef.current = scanner;
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            if (!montado || bloqueoLecturaRef.current) return;
            bloqueoLecturaRef.current = true;
            scanner
              ?.stop()
              .catch(() => {})
              .finally(() => {
                if (montado) {
                  setCamaraActiva(false);
                  void procesarQr(decodedText);
                }
              });
          },
          () => {}
        )
        .catch(() => {
          if (montado) {
            setCamaraActiva(false);
            setError("No se pudo iniciar la cámara. Podés pegar el token QR manualmente.");
          }
        });
    }

    return () => {
      montado = false;
      if (scanner?.isScanning) {
        scanner.stop().catch(() => {});
      }
    };
  }, [camaraActiva, procesarQr]);

  const manejarEnvioManual = (e: FormEvent) => {
    e.preventDefault();
    void procesarQr(qrInput);
    setQrInput("");
  };

  const manejarEgreso = async (e: FormEvent) => {
    e.preventDefault();
    const uid = Number(egresoUserId);
    if (!Number.isInteger(uid) || uid <= 0) {
      setError("Ingresá un ID de socio válido para registrar el egreso.");
      return;
    }
    setError(null);
    setExito(null);
    try {
      const res = await registrarEgreso(uid);
      setExito(`Egreso registrado para socio #${res.usuario_id}.`);
      agregarLog(`Socio #${res.usuario_id} egresó de sede #${res.sede_id}`, "EGRESO");
      setEgresoUserId("");
      await refrescarSede(sedeActualId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el egreso.");
    }
  };

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#fff" }}>Control de Acceso & Aforo (Terminal de Sede)</h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--text-muted, #8b95a5)", fontSize: "0.88rem" }}>
            Validación QR online/offline (RF-04, RN-01, RNF-01) y aforo en tiempo real (RF-05).
          </p>
        </div>

        {/* Indicador visible de estado de red y cola offline */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <Badge variant={online ? "success" : "danger"}>
            {online ? "En línea" : "Modo offline"}
          </Badge>
          <Badge variant={colaOffline.length > 0 ? "warning" : "neutral"}>
            {colaOffline.length} pendientes
          </Badge>
          {colaOffline.length > 0 && online && (
            <Button variant="secondary" loading={sincronizando} onClick={ejecutarSincronizacion}>
              Sincronizar ahora
            </Button>
          )}
        </div>
      </header>

      {error && <AlertMessage variant="error" message={error} onClose={() => setError(null)} />}
      {exito && <AlertMessage variant="success" message={exito} onClose={() => setExito(null)} />}

      {/* Selector de sede y Aforo real (RF-05) */}
      <Card
        title="Sede y Aforo en Tiempo Real (RF-05)"
        subtitle={snapshotInfo ?? "Descargando snapshot offline..."}
        headerAction={
          <Button variant="secondary" onClick={() => refrescarSede(sedeActualId)}>
            Actualizar aforo / snapshot
          </Button>
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <FormField label="Sede del terminal" htmlFor="terminal-sede">
            <select
              id="terminal-sede"
              value={sedeActualId}
              onChange={(e) => seleccionarSede(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "0.65rem",
                borderRadius: "8px",
                background: "#0f1524",
                color: "#fff",
                border: "1px solid var(--border-color, #222b40)",
              }}
            >
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.localidad})
                </option>
              ))}
            </select>
          </FormField>

          {cargandoAforo ? (
            <Spinner label="Consultando aforo..." />
          ) : aforo ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "0.35rem",
                }}
              >
                <strong style={{ fontSize: "1.4rem", color: "#fff" }}>
                  {aforo.aforo_actual} / {aforo.aforo_maximo}
                </strong>
                <Badge
                  variant={
                    aforo.porcentaje_ocupacion >= 90
                      ? "danger"
                      : aforo.porcentaje_ocupacion >= 75
                        ? "warning"
                        : "success"
                  }
                >
                  {aforo.porcentaje_ocupacion}% ocupación
                </Badge>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, aforo.porcentaje_ocupacion)}%`,
                    height: "100%",
                    background: "var(--accent-green, #00ff87)",
                  }}
                />
              </div>
            </div>
          ) : (
            <span style={{ color: "var(--text-muted, #8b95a5)" }}>
              Aforo no disponible sin conexión.
            </span>
          )}
        </div>
      </Card>

      {/* Validación de QR y Egreso */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <Card
          title="Validar Ingreso por QR (RF-04)"
          headerAction={
            <Button
              variant={camaraActiva ? "danger" : "secondary"}
              onClick={() => setCamaraActiva((v) => !v)}
            >
              {camaraActiva ? "Detener cámara" : "Usar cámara"}
            </Button>
          }
        >
          {camaraActiva && (
            <div
              id="lector-qr-container"
              style={{ width: "100%", minHeight: "240px", marginBottom: "1rem" }}
            />
          )}

          <form onSubmit={manejarEnvioManual} style={{ display: "grid", gap: "0.75rem" }}>
            <FormField label="Token QR escaneado o pegado" htmlFor="qr-manual">
              <Input
                id="qr-manual"
                placeholder="Pegá aquí el token QR del socio..."
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
              />
            </FormField>
            <Button type="submit" loading={validando} fullWidth>
              Validar ingreso
            </Button>
          </form>
        </Card>

        <Card title="Registrar Egreso (Salida)">
          <form onSubmit={manejarEgreso} style={{ display: "grid", gap: "0.75rem" }}>
            <FormField label="ID de Socio" htmlFor="egreso-uid">
              <Input
                id="egreso-uid"
                type="number"
                min={1}
                placeholder="Ej: 3"
                value={egresoUserId}
                onChange={(e) => setEgresoUserId(e.target.value)}
              />
            </FormField>
            <Button type="submit" variant="secondary" fullWidth>
              Registrar egreso
            </Button>
          </form>
        </Card>
      </div>

      {/* Conflictos de última sincronización offline */}
      {ultimoSync && ultimoSync.conflictos.length > 0 && (
        <Card title="Conflictos detectados en la última sincronización">
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {ultimoSync.conflictos.map((c, idx) => (
              <AlertMessage
                key={`${c.userId}-${c.timestamp}-${idx}`}
                variant="warning"
                title={`Socio #${c.userId} (Sede #${c.sedeId})`}
                message={`${c.motivo} · ${new Date(c.timestamp).toLocaleString("es-AR")}`}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Actividad reciente del terminal */}
      {registros.length > 0 && (
        <Card title="Actividad reciente del terminal">
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {registros.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.03)",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: "#e2e8f0" }}>
                  <strong>{r.hora}</strong> — {r.detalle}
                </span>
                <Badge
                  variant={
                    r.resultado === "AUTORIZADO"
                      ? "success"
                      : r.resultado === "OFFLINE_ENCOLADO"
                        ? "warning"
                        : r.resultado === "EGRESO"
                          ? "info"
                          : "danger"
                  }
                >
                  {r.resultado}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
