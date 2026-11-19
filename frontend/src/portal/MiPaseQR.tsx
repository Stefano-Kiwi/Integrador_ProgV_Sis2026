import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { AlertMessage, Badge, Button, Card, Spinner } from "../components";
import { useAppStore } from "../store";
import { ApiError } from "../services/apiClient";
import {
  leerUltimoQrLocal,
  obtenerQrDinamico,
  type QrDinamicoRespuesta,
} from "../services/controlAccesoService";

const TIEMPO_ROTACION_SEGUNDOS = 60;

export default function MiPaseQR() {
  const { token, usuario, online } = useAppStore();

  const [qrData, setQrData] = useState<QrDinamicoRespuesta | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [segundosRestantes, setSegundosRestantes] = useState<number>(TIEMPO_ROTACION_SEGUNDOS);
  const [generando, setGenerando] = useState<boolean>(false);
  const [modoCacheOffline, setModoCacheOffline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const renderizarQr = useCallback(async (datos: QrDinamicoRespuesta) => {
    const dataUrl = await QRCode.toDataURL(datos.qr, {
      width: 260,
      margin: 2,
      color: { dark: "#0a0e17", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    setQrData(datos);
    setQrUrl(dataUrl);
    const restantes = Math.max(
      1,
      Math.min(
        TIEMPO_ROTACION_SEGUNDOS,
        Math.ceil((new Date(datos.expira_at).getTime() - Date.now()) / 1000)
      )
    );
    setSegundosRestantes(restantes);
  }, []);

  const renovarCodigo = useCallback(async () => {
    if (!token) return;
    setGenerando(true);
    setError(null);

    try {
      const datos = await obtenerQrDinamico();
      setModoCacheOffline(false);
      await renderizarQr(datos);
    } catch (err) {
      // Si es error de negocio (ej. 403 membresía en mora), mostrarlo directo
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        setError(err.message);
        setQrUrl("");
        setModoCacheOffline(false);
      } else {
        // Sin red o servidor caído: mostrar último QR cacheado con aviso
        const cache = leerUltimoQrLocal();
        if (cache) {
          setModoCacheOffline(true);
          await renderizarQr(cache);
        } else {
          setError("Sin conexión al servidor y no hay un código QR guardado localmente.");
        }
      }
    } finally {
      setGenerando(false);
    }
  }, [token, renderizarQr]);

  useEffect(() => {
    if (token) {
      void renovarCodigo();
    }
  }, [token, renovarCodigo]);

  // Cuenta regresiva de 60 segundos con rotación automática
  useEffect(() => {
    if (!token) return;

    const intervalId = window.setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          void renovarCodigo();
          return TIEMPO_ROTACION_SEGUNDOS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [token, renovarCodigo]);

  const porcentajeRestante = Math.round((segundosRestantes / TIEMPO_ROTACION_SEGUNDOS) * 100);

  if (!token) {
    return (
      <div className="profile-page-wrapper" style={{ padding: "2rem 1rem" }}>
        <main style={{ maxWidth: "460px", margin: "0 auto" }}>
          <Card title="Iniciá Sesión para tu Pase Digital">
            <p style={{ color: "var(--text-muted, #8b95a5)", marginBottom: "1rem" }}>
              Necesitás estar autenticado para generar tu credencial QR dinámica (rotación cada 60 s).
            </p>
            <Link to="/login">
              <Button fullWidth>Iniciar Sesión</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper" style={{ padding: "1.5rem 0.75rem" }}>
      <main style={{ maxWidth: "480px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <Badge variant={online && !modoCacheOffline ? "success" : "warning"}>
            {online && !modoCacheOffline ? "EN LÍNEA · ROTACIÓN 60s" : "SIN CONEXIÓN · ÚLTIMO QR"}
          </Badge>
          <h1 style={{ color: "#fff", fontSize: "1.65rem", fontWeight: 800, margin: "0.5rem 0 0.25rem" }}>
            Credencial <span style={{ color: "var(--accent-orange, #ff5e3a)" }}>QR Dinámico</span>
          </h1>
          <p style={{ color: "var(--text-muted, #8b95a5)", fontSize: "0.86rem", margin: 0 }}>
            Presentá este código en el terminal de cualquier sede de la cadena (RF-03 / RF-04).
          </p>
        </header>

        {modoCacheOffline && (
          <AlertMessage
            variant="warning"
            title="Sin conexión al servidor"
            message="Se muestra el último código QR emitido. Se renovará automáticamente al recuperar red."
          />
        )}

        {error && (
          <AlertMessage variant="error" title="No se pudo emitir el QR" message={error} />
        )}

        <Card
          title={usuario ? `${usuario.nombre} ${usuario.apellido}` : `Socio #${qrData?.userId ?? ""}`}
          subtitle={usuario?.email}
          headerAction={<Badge variant="success">ACTIVO</Badge>}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "#ffffff",
                padding: "0.9rem",
                borderRadius: "14px",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Código QR dinámico de acceso"
                  style={{
                    display: "block",
                    width: "240px",
                    height: "240px",
                    opacity: generando ? 0.45 : 1,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "240px",
                    height: "240px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spinner label="Generando QR..." />
                </div>
              )}
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.45rem",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: "var(--text-muted, #8b95a5)" }}>
                  Rotación automática en:
                </span>
                <strong
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1.05rem",
                    color:
                      segundosRestantes <= 15
                        ? "var(--accent-red, #ff4b72)"
                        : "var(--accent-green, #00ff87)",
                  }}
                >
                  00:{String(segundosRestantes).padStart(2, "0")}
                </strong>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${porcentajeRestante}%`,
                    height: "100%",
                    background:
                      segundosRestantes <= 15
                        ? "var(--accent-red, #ff4b72)"
                        : "var(--accent-green, #00ff87)",
                    transition: "width 1s linear",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="secondary" loading={generando} onClick={renovarCodigo}>
                Renovar ahora
              </Button>
              <Link to="/profile">
                <Button variant="ghost">Volver al perfil</Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
