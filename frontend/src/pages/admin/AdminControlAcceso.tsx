import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../../admin.css";
import {
  verificarQr,
  consultarSocioPorSub,
  type DatosSocioValidacion,
} from "../../services/controlAccesoService";

interface AccessLog {
  id: string;
  hora: string;
  nombre: string;
  dni: string;
  avatar: string;
  molinete: string;
  resultado: "Autorizado" | "Denegado (Mora)" | "Denegado (Sede)" | "Denegado (Aforo)" | "Denegado (QR Expirado)";
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

  // Lista de logs dinámica
  const [logs, setLogs] = useState<AccessLog[]>(INITIAL_LOGS);

  // Filtros Historial
  const [searchQuery, setSearchQuery] = useState("");
  const [filterResultado, setFilterResultado] = useState("Todos");

  // Estados del Escáner QR
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [iniciandoCamara, setIniciandoCamara] = useState(false);
  const [cargandoValidacion, setCargandoValidacion] = useState(false);
  const [socioEscaneado, setSocioEscaneado] = useState<DatosSocioValidacion | null>(null);
  const [errorQr, setErrorQr] = useState<string | null>(null);
  const [inputManual, setInputManual] = useState("");
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputCameraRef = useRef<HTMLInputElement | null>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement | null>(null);
  const bloqueoLecturaRef = useRef(false);

  // Alternar cámara en vivo
  const toggleCamara = async () => {
    if (camaraActiva) {
      detenerCamaraSegura();
      setCamaraActiva(false);
      setIniciandoCamara(false);
      bloqueoLecturaRef.current = false;
    } else {
      setErrorQr(null);
      setMensajeExito(null);
      bloqueoLecturaRef.current = false;

      // Verificar si el navegador permite la API de cámara
      if (!navigator?.mediaDevices?.getUserMedia) {
        setErrorQr(
          "El navegador bloquea la cámara en vivo por estar en una conexión HTTP no segura (192.168.x.x). Para usar la cámara desde el celular, usa el botón '📸 Tomar Foto al QR' o ingresa por localhost.",
        );
        return;
      }

      setIniciandoCamara(true);
      setCamaraActiva(true);
    }
  };

  const detenerCamaraSegura = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {}).finally(() => {
            try { scannerRef.current?.clear(); } catch {}
            scannerRef.current = null;
          });
        } else {
          try { scannerRef.current.clear(); } catch {}
          scannerRef.current = null;
        }
      } catch {
        scannerRef.current = null;
      }
    }
  };

  // Efecto que controla la cámara en vivo de forma segura
  useEffect(() => {
    let montado = true;
    let qrScanner: Html5Qrcode | null = null;

    if (camaraActiva) {
      try {
        qrScanner = new Html5Qrcode("lector-qr-container");
        scannerRef.current = qrScanner;

        qrScanner
          .start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
            },
            (decodedText) => {
              // Si ya se está procesando una lectura, ignorar frames posteriores
              if (!montado || bloqueoLecturaRef.current) return;
              bloqueoLecturaRef.current = true;

              // Detener inmediatamente el escaneo continuo para evitar llamadas repetidas y re-renders infinitos
              if (qrScanner && qrScanner.isScanning) {
                qrScanner.stop().catch(() => {}).finally(() => {
                  try { qrScanner?.clear(); } catch {}
                  if (montado) {
                    setCamaraActiva(false);
                    procesarLectura(decodedText);
                  }
                });
              } else {
                if (montado) {
                  setCamaraActiva(false);
                  procesarLectura(decodedText);
                }
              }
            },
            () => {
              // Frame sin QR, no es error
            },
          )
          .then(() => {
            if (montado) {
              setIniciandoCamara(false);
            }
          })
          .catch((err) => {
            console.error("Error al iniciar cámara:", err);
            if (montado) {
              setIniciandoCamara(false);
              setCamaraActiva(false);
              setErrorQr(
                "No se pudo acceder a la cámara en vivo (permiso denegado o no disponible). Usa '📸 Tomar Foto al QR' o ingresa el ID manual.",
              );
            }
          });
      } catch (err) {
        console.error("Error de inicialización de Html5Qrcode:", err);
        if (montado) {
          setIniciandoCamara(false);
          setCamaraActiva(false);
          setErrorQr("Error al inicializar el módulo de escáner.");
        }
      }
    }

    return () => {
      montado = false;
      if (qrScanner) {
        try {
          if (qrScanner.isScanning) {
            qrScanner.stop().catch(() => {}).finally(() => {
              try { qrScanner?.clear(); } catch {}
            });
          } else {
            try { qrScanner.clear(); } catch {}
          }
        } catch {}
      }
      scannerRef.current = null;
    };
  }, [camaraActiva]);

  // Redimensiona imágenes pesadas de celulares (48MP) para evitar colapsar la memoria del navegador
  const optimizarImagenParaQr = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/") || file.size < 400 * 1024) {
        return resolve(file);
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 1000;
        let { width, height } = img;
        if (width <= maxDim && height <= maxDim) {
          return resolve(file);
        }
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return resolve(file);
          resolve(new File([blob], "qr_opt.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.85);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  };

  // Escanear código QR tomando una foto desde el celular o subiendo imagen
  const manejarFotoQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivoOriginal = e.target.files?.[0];
    if (!archivoOriginal) return;

    setErrorQr(null);
    setMensajeExito(null);
    setCargandoValidacion(true);

    try {
      const archivo = await optimizarImagenParaQr(archivoOriginal);
      const scannerFoto = new Html5Qrcode("lector-qr-foto-oculto");
      const textoDecodificado = await scannerFoto.scanFile(archivo, false);
      try { scannerFoto.clear(); } catch {}

      await procesarLectura(textoDecodificado);
    } catch (err) {
      console.error("Error al leer archivo QR:", err);
      setErrorQr("No se pudo detectar un código QR claro en la foto. Asegúrate de enfocar bien el código en pantalla.");
    } finally {
      setCargandoValidacion(false);
      if (fileInputCameraRef.current) fileInputCameraRef.current.value = "";
      if (fileInputGalleryRef.current) fileInputGalleryRef.current.value = "";
    }
  };

  // Procesar texto escaneado
  const procesarLectura = async (texto: string) => {
    setErrorQr(null);
    setMensajeExito(null);
    setCargandoValidacion(true);

    try {
      // 1. Validar el formato y si expiró (ventana de 5 minutos)
      const resultadoVerificacion = verificarQr(texto);

      if (!resultadoVerificacion.valido) {
        setErrorQr(resultadoVerificacion.error || "Código QR no válido.");
        setSocioEscaneado(null);

        // Si expiró, registrar intento denegado
        if (resultadoVerificacion.expirado && resultadoVerificacion.sub) {
          const logDenegado: AccessLog = {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            hora: new Date().toLocaleTimeString(),
            nombre: `Socio (${resultadoVerificacion.sub})`,
            dni: "S/D",
            avatar: "https://ui-avatars.com/api/?name=Alerta&background=151b2b&color=ff4b72",
            molinete: "Molinete Principal 01",
            resultado: "Denegado (QR Expirado)",
            detalle: "Intento con código QR expirado (más de 5 minutos)",
          };
          setLogs((prev) => [logDenegado, ...prev]);
        }
        return;
      }

      // 2. Consultar datos del socio al backend mediante el `sub`
      const sub = resultadoVerificacion.sub!;
      const datosSocio = await consultarSocioPorSub(sub);
      setSocioEscaneado(datosSocio);
    } catch (err) {
      console.error("Error al procesar QR:", err);
      setErrorQr("Ocurrió un error al procesar el pase digital.");
    } finally {
      setCargandoValidacion(false);
    }
  };

  // Procesar ID / QR ingresado manualmente
  const manejarEnvioManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputManual.trim()) return;

    if (inputManual.includes("{")) {
      procesarLectura(inputManual.trim());
    } else {
      consultarDirectoPorId(inputManual.trim());
    }
    setInputManual("");
  };

  const consultarDirectoPorId = async (idSocio: string) => {
    setCargandoValidacion(true);
    setErrorQr(null);
    setMensajeExito(null);
    try {
      const socio = await consultarSocioPorSub(idSocio);
      setSocioEscaneado(socio);
    } catch {
      setErrorQr("No se encontraron registros para ese identificador.");
    } finally {
      setCargandoValidacion(false);
    }
  };

  // Registrar el ingreso y sumar al aforo
  const registrarAccesoMolinete = (socio: DatosSocioValidacion) => {
    const nuevoLog: AccessLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      hora: new Date().toLocaleTimeString(),
      nombre: `${socio.nombre} ${socio.apellido}`.trim(),
      dni: socio.dni,
      avatar: socio.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(socio.nombre)}&background=151b2b&color=00ff87`,
      molinete: "Molinete Principal 01",
      resultado: socio.autorizado ? "Autorizado" : "Denegado (Mora)",
      detalle: `${socio.planNombre} - Membresía ${socio.estadoMembresia}`,
    };

    setLogs((prev) => [nuevoLog, ...prev]);

    if (socio.autorizado) {
      setAforoActual((prev) => Math.min(prev + 1, aforoMaximo));
      setMensajeExito(`¡Ingreso registrado para ${socio.nombre} ${socio.apellido}! Molinete abierto.`);
    } else {
      setMensajeExito(`Ingreso denegado registrado para ${socio.nombre}.`);
    }

    setSocioEscaneado(null);
  };

  const aforoPorcentaje = Math.round((aforoActual / aforoMaximo) * 100);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.dni.includes(searchQuery);
    const matchResultado =
      filterResultado === "Todos" ||
      (filterResultado === "Autorizado" && log.resultado === "Autorizado") ||
      (filterResultado === "Mora" && log.resultado.includes("Mora")) ||
      (filterResultado === "Sede" && log.resultado.includes("Sede")) ||
      (filterResultado === "Aforo" && log.resultado.includes("Aforo")) ||
      (filterResultado === "QR Expirado" && log.resultado.includes("QR Expirado"));

    return matchSearch && matchResultado;
  });

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="header-titles">
          <h1>Molinete de Acceso & Aforo</h1>
          <p>Validación de códigos QR en tiempo real, aforo de sede y registro de auditoría</p>
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

      {/* LAYOUT: Aforo y Escáner (izq) e Historial/Auditoría (der) */}
      <div className="access-layout">
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

          {/* MÓDULO DE ESCÁNER QR */}
          <div style={{
            background: "var(--bg-card, #151b2b)",
            border: "1px solid var(--border-color, #222b40)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginTop: "1.25rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <rect x="7" y="7" width="3" height="3"></rect>
                    <rect x="14" y="7" width="3" height="3"></rect>
                    <rect x="7" y="14" width="3" height="3"></rect>
                  </svg>
                  Escáner de Código QR de Acceso
                </h3>
                <p style={{ color: "var(--text-muted, #8b95a5)", fontSize: "0.8rem", marginTop: "2px" }}>
                  Verificación de códigos QR dinámicos (vigencia 5 min)
                </p>
              </div>

              {/* Botones de Escaneo */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {/* Input para cámara directa de foto */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputCameraRef}
                  style={{ display: "none" }}
                  onChange={manejarFotoQr}
                />
                {/* Input para galería / archivo existente */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputGalleryRef}
                  style={{ display: "none" }}
                  onChange={manejarFotoQr}
                />
                <div id="lector-qr-foto-oculto" style={{ width: "1px", height: "1px", opacity: 0, position: "absolute", pointerEvents: "none" }}></div>

                <button
                  type="button"
                  onClick={() => fileInputCameraRef.current?.click()}
                  style={{
                    background: "rgba(0, 255, 135, 0.15)",
                    color: "var(--accent-green)",
                    border: "1px solid rgba(0, 255, 135, 0.4)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                  title="Abre la cámara del celular para tomar una foto del código QR"
                >
                  📸 Tomar Foto al QR
                </button>

                <button
                  type="button"
                  onClick={() => fileInputGalleryRef.current?.click()}
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                  title="Seleccionar foto del QR desde la galería"
                >
                  📁 Galería
                </button>

                {/* Botón de cámara de video en vivo */}
                <button
                  type="button"
                  onClick={toggleCamara}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.82rem",
                    padding: "0.5rem 0.85rem",
                    background: camaraActiva ? "rgba(255, 75, 114, 0.2)" : "var(--accent-green)",
                    color: camaraActiva ? "var(--accent-red)" : "#0b0f19",
                    border: camaraActiva ? "1px solid var(--accent-red)" : "none",
                    fontWeight: "700",
                    cursor: "pointer",
                    borderRadius: "8px"
                  }}
                >
                  {camaraActiva ? "⏹️ Detener Cámara" : "🎥 Video en Vivo"}
                </button>
              </div>
            </div>

            {/* Visor de la Cámara Web en Vivo */}
            {camaraActiva && (
              <div style={{
                background: "#0a0e17",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid var(--accent-green)",
                marginBottom: "1.25rem",
                maxWidth: "360px",
                margin: "0 auto 1.25rem auto",
                position: "relative",
                minHeight: "260px"
              }}>
                {iniciandoCamara && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(10, 14, 23, 0.95)",
                    zIndex: 2,
                    color: "#fff",
                    gap: "0.75rem",
                    padding: "1rem",
                    textAlign: "center"
                  }}>
                    <span style={{ fontSize: "1.8rem" }}>⏳</span>
                    <strong style={{ fontSize: "0.9rem" }}>Iniciando cámara...</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Asegúrate de permitir los permisos de cámara en tu navegador.
                    </span>
                  </div>
                )}
                <div id="lector-qr-container" style={{ width: "100%", minHeight: "240px" }}></div>
                <div style={{ textAlign: "center", padding: "0.5rem", background: "rgba(0,0,0,0.85)", fontSize: "0.75rem", color: "var(--accent-green)" }}>
                  Apunta la cámara al pase QR del socio
                </div>
              </div>
            )}

            {/* Entrada Manual de QR / ID */}
            <form onSubmit={manejarEnvioManual} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Pegar código QR o ingresar ID de socio (ej: SOC-101)..."
                value={inputManual}
                onChange={(e) => setInputManual(e.target.value)}
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-color, #222b40)",
                  borderRadius: "8px",
                  padding: "0.6rem 0.9rem",
                  color: "#fff",
                  fontSize: "0.85rem"
                }}
              />
              <button
                type="submit"
                disabled={cargandoValidacion}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                {cargandoValidacion ? "Consultando..." : "Validar"}
              </button>
            </form>

            {/* Feedback: Error o Alerta de Expiración */}
            {errorQr && (
              <div style={{
                background: "rgba(255, 75, 114, 0.12)",
                border: "1px solid var(--accent-red)",
                borderRadius: "10px",
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#fff"
              }}>
                <span style={{ fontSize: "1.4rem" }}>❌</span>
                <div>
                  <strong style={{ color: "var(--accent-red)", display: "block", fontSize: "0.9rem" }}>ACCESO DENEGADO / ERROR</strong>
                  <span style={{ fontSize: "0.82rem", color: "#fca5a5", lineHeight: "1.4", display: "block" }}>{errorQr}</span>
                </div>
              </div>
            )}

            {/* Feedback: Mensaje de Éxito / Molinete Abierto */}
            {mensajeExito && (
              <div style={{
                background: "rgba(0, 255, 135, 0.12)",
                border: "1px solid var(--accent-green)",
                borderRadius: "10px",
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#fff"
              }}>
                <span style={{ fontSize: "1.4rem" }}>✅</span>
                <span style={{ fontSize: "0.85rem", color: "var(--accent-green)" }}>{mensajeExito}</span>
              </div>
            )}

            {/* FICHA RESULTADO DEL SOCIO ESCANEADO */}
            {socioEscaneado && (
              <div style={{
                background: socioEscaneado.autorizado ? "rgba(0, 255, 135, 0.05)" : "rgba(255, 75, 114, 0.05)",
                border: `2px solid ${socioEscaneado.autorizado ? "var(--accent-green)" : "var(--accent-red)"}`,
                borderRadius: "14px",
                padding: "1.25rem",
                marginTop: "0.5rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <img
                      src={socioEscaneado.avatar}
                      alt="Avatar"
                      style={{ width: "54px", height: "54px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.1)" }}
                    />
                    <div>
                      <h4 style={{ color: "#fff", fontSize: "1.15rem", margin: 0, fontWeight: "800" }}>
                        {socioEscaneado.nombre} {socioEscaneado.apellido}
                      </h4>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginTop: "2px" }}>
                        DNI: <strong style={{ color: "#fff" }}>{socioEscaneado.dni}</strong> • ID: {socioEscaneado.id}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "0.85rem",
                    background: socioEscaneado.autorizado ? "var(--accent-green)" : "var(--accent-red)",
                    color: "#0b0f19"
                  }}>
                    {socioEscaneado.autorizado ? "PASE AUTORIZADO" : "ACCESO RECHAZADO"}
                  </span>
                </div>

                {/* Grilla de Datos de la Membresía */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "0.75rem",
                  background: "rgba(0,0,0,0.25)",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>TIPO USUARIO</span>
                    <strong style={{ color: "#fff", fontSize: "0.85rem" }}>{socioEscaneado.tipo}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>PLAN CONTRATADO</span>
                    <strong style={{ color: "var(--accent-orange, #ff5e3a)", fontSize: "0.85rem" }}>{socioEscaneado.planNombre}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>ESTADO MEMBRESÍA</span>
                    <span style={{
                      color: socioEscaneado.estadoMembresia === "Activa" ? "var(--accent-green)" : "var(--accent-red)",
                      fontWeight: "700",
                      fontSize: "0.85rem"
                    }}>
                      ● {socioEscaneado.estadoMembresia}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>VENCE</span>
                    <strong style={{ color: "#fff", fontSize: "0.85rem" }}>{socioEscaneado.vencimientoMembresia || "Al día"}</strong>
                  </div>
                </div>

                {/* Botón de acción */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => registrarAccesoMolinete(socioEscaneado)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: socioEscaneado.autorizado ? "var(--accent-green)" : "var(--accent-red)",
                      color: "#0b0f19",
                      fontWeight: "800",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {socioEscaneado.autorizado ? "🟢 Abrir Molinete & Registrar Ingreso" : "🔴 Registrar Denegación en Auditoría"}
                  </button>
                  <button
                    onClick={() => setSocioEscaneado(null)}
                    style={{
                      padding: "0.75rem 1rem",
                      background: "transparent",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-muted)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* REGISTRO DE AUDITORÍA HISTÓRICA */}
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
              <option value="QR Expirado">Denegados por QR Expirado</option>
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
                        : log.resultado.includes("Mora") || log.resultado.includes("Expirado")
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
