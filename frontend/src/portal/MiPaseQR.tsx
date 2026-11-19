import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { obtenerUsuarioActual, obtenerToken } from "../services/authService";
import { generarPayloadQr } from "../services/controlAccesoService";

const TIEMPO_EXPIRACION_SEGUNDOS = 300; // 5 minutos

export default function MiPaseQR() {
  const token = obtenerToken();
  const usuario = obtenerUsuarioActual();

  const [qrUrl, setQrUrl] = useState<string>("");
  const [segundosRestantes, setSegundosRestantes] = useState<number>(TIEMPO_EXPIRACION_SEGUNDOS);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());
  const [generando, setGenerando] = useState<boolean>(false);

  // Sub extraído del JWT (puede ser número o string) o fallback de demo
  const rawSub = usuario?.sub ?? usuario?.id ?? usuario?.userId ?? (usuario?.email ? usuario.email.split("@")[0] : "SOC-101");
  const usuarioSub = String(rawSub);
  const usuarioEmail = usuario?.email || "socio@fitzone.com";

  // Función para regenerar el código QR dinámico
  const renovarCodigo = useCallback(async () => {
    setGenerando(true);
    try {
      const payloadString = generarPayloadQr(usuarioSub, usuarioEmail);
      const dataUrl = await QRCode.toDataURL(payloadString, {
        width: 280,
        margin: 2,
        color: {
          dark: "#0a0e17",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
      setQrUrl(dataUrl);
      setSegundosRestantes(TIEMPO_EXPIRACION_SEGUNDOS);
      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error("Error al generar código QR:", err);
    } finally {
      setGenerando(false);
    }
  }, [usuarioSub, usuarioEmail]);

  // Generación inicial
  useEffect(() => {
    if (token) {
      renovarCodigo();
    }
  }, [token, renovarCodigo]);

  // Temporizador de cuenta regresiva de 5 minutos
  useEffect(() => {
    if (!token) return;

    const intervalId = window.setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          renovarCodigo();
          return TIEMPO_EXPIRACION_SEGUNDOS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [token, renovarCodigo]);

  // Formato MM:SS
  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const textoTiempo = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  const porcentajeRestante = Math.round((segundosRestantes / TIEMPO_EXPIRACION_SEGUNDOS) * 100);

  // Si no está logueado
  if (!token) {
    return (
      <div className="profile-page-wrapper" style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "var(--bg-card, #151b2b)",
          border: "1px solid var(--border-color, #222b40)",
          borderRadius: "16px",
          padding: "2.5rem",
          maxWidth: "460px",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2 style={{ color: "#fff", marginBottom: "0.75rem", fontSize: "1.4rem" }}>Inicia Sesión para tu Pase Digital</h2>
          <p style={{ color: "var(--text-muted, #8b95a5)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
            Debes estar autenticado para generar tu credencial de acceso QR dinámica para los molinetes de la sede.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, var(--accent-orange, #ff5e3a), #ff8c42)",
              color: "#fff",
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper" style={{ padding: "2rem 1rem", minHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: "520px", width: "100%" }}>
        
        {/* Cabecera */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.85rem",
            background: "rgba(0, 255, 135, 0.1)",
            border: "1px solid rgba(0, 255, 135, 0.3)",
            borderRadius: "20px",
            color: "var(--accent-green, #00ff87)",
            fontSize: "0.78rem",
            fontWeight: "700",
            letterSpacing: "0.5px",
            marginBottom: "0.75rem"
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green, #00ff87)", display: "inline-block", animation: "pulse 2s infinite" }}></span>
            PASE DIGITAL DE ACCESO
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "800", letterSpacing: "-0.5px", margin: "0.2rem 0" }}>
            Credencial <span style={{ color: "var(--accent-orange, #ff5e3a)" }}>QR Dinámico</span>
          </h1>
          <p style={{ color: "var(--text-muted, #8b95a5)", fontSize: "0.88rem" }}>
            Muestra este código en el molinete de acceso o al recepcionista de la sede.
          </p>
        </div>

        {/* Tarjeta de la Credencial */}
        <div style={{
          background: "linear-gradient(180deg, #182033 0%, #111624 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "2rem 1.5rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 135, 0.05)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Cinta superior de datos del socio */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            paddingBottom: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted, #8b95a5)", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
                Identificador de Socio
              </span>
              <strong style={{ color: "#fff", fontSize: "1rem", fontFamily: "monospace" }}>
                ID: {usuarioSub}
              </strong>
            </div>
            <span style={{
              background: "rgba(0, 255, 135, 0.15)",
              color: "var(--accent-green, #00ff87)",
              padding: "0.3rem 0.7rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: "700"
            }}>
              ● ACTIVO
            </span>
          </div>

          {/* Contenedor del Código QR */}
          <div style={{
            background: "#ffffff",
            padding: "1rem",
            borderRadius: "16px",
            display: "inline-block",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            marginBottom: "1.25rem",
            position: "relative"
          }}>
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Código QR de Acceso"
                style={{
                  display: "block",
                  width: "240px",
                  height: "240px",
                  borderRadius: "8px",
                  opacity: generando ? 0.4 : 1,
                  transition: "opacity 0.2s ease"
                }}
              />
            ) : (
              <div style={{ width: "240px", height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
                Generando QR...
              </div>
            )}
          </div>

          {/* Temporizador y Protección Anti-Captura */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #8b95a5)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Se renueva automáticamente en:
              </span>
              <strong style={{
                color: segundosRestantes <= 30 ? "var(--accent-red, #ff4b72)" : "var(--accent-green, #00ff87)",
                fontSize: "1.1rem",
                fontFamily: "monospace",
                fontWeight: "700"
              }}>
                {textoTiempo}
              </strong>
            </div>

            {/* Barra de progreso de tiempo restante */}
            <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                width: `${porcentajeRestante}%`,
                height: "100%",
                background: segundosRestantes <= 30
                  ? "var(--accent-red, #ff4b72)"
                  : "linear-gradient(90deg, var(--accent-orange, #ff5e3a), var(--accent-green, #00ff87))",
                transition: "width 1s linear"
              }}></div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--text-muted, #8b95a5)" }}>
              <span>Emisión: {ultimaActualizacion.toLocaleTimeString()}</span>
              <button
                onClick={renovarCodigo}
                disabled={generando}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent-orange, #ff5e3a)",
                  cursor: "pointer",
                  fontWeight: "600",
                  textDecoration: "underline",
                  fontSize: "0.75rem"
                }}
              >
                {generando ? "Renovando..." : "Renovar código ahora"}
              </button>
            </div>
          </div>

          {/* Aviso de Seguridad */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            background: "rgba(255, 176, 32, 0.08)",
            border: "1px solid rgba(255, 176, 32, 0.2)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            textAlign: "left"
          }}>
            <svg style={{ width: "18px", height: "18px", flexShrink: 0, color: "var(--accent-yellow, #ffb020)", marginTop: "2px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div style={{ fontSize: "0.75rem", color: "#e2e8f0", lineHeight: "1.4" }}>
              <strong>Protección Anti-Captura:</strong> Este código QR es dinámico e intransferible. Cualquier captura de pantalla quedará invalidada automáticamente pasados los 5 minutos.
            </div>
          </div>
        </div>

        {/* Acceso a volver al perfil */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/profile" style={{ color: "var(--text-muted, #8b95a5)", textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            ← Volver a mi perfil
          </Link>
        </div>

      </div>
    </div>
  );
}
