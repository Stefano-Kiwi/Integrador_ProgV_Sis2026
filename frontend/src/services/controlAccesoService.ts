import { apiRequest } from "./apiClient";

export interface QrDinamicoRespuesta {
  qr: string;
  userId: number;
  emitido_at: string;
  expira_at: string;
  validez_segundos: number;
}

export interface ValidacionAccesoRespuesta {
  autorizado: boolean;
  acceso_id: number;
  usuario_id: number;
  sede_id: number;
  sede_nombre: string;
  ingreso_at: string;
  mensaje: string;
}

export interface EgresoRespuesta {
  acceso_id: number;
  usuario_id: number;
  sede_id: number;
  ingreso_at: string;
  egreso_at: string;
  mensaje: string;
}

export interface AforoSedeRespuesta {
  sede_id: number;
  sede_nombre: string;
  aforo_actual: number;
  aforo_maximo: number;
  porcentaje_ocupacion: number;
}

export interface SocioSnapshot {
  userId: number;
  dni: string;
  nombre: string;
  apellido: string;
  membresia_estado: string;
  fecha_fin: string;
}

export interface SnapshotSedeRespuesta {
  sede_id: number;
  sede_nombre: string;
  aforo_maximo: number;
  generado_at: string;
  total_socios_activos: number;
  socios: SocioSnapshot[];
}

export interface IngresoOfflineItem {
  userId: number;
  sedeId: number;
  timestamp: string;
  qrToken: string;
}

export interface SincronizacionRespuesta {
  total: number;
  aceptados: Array<{
    userId: number;
    sedeId: number;
    timestamp: string;
    acceso_id: number;
    duplicado: boolean;
  }>;
  conflictos: Array<{
    userId: number;
    sedeId: number;
    timestamp: string;
    motivo: string;
  }>;
}

export interface QrPayloadDecodificado {
  userId: number;
  win: number;
  iat: number;
  exp: number;
}

const ULTIMO_QR_KEY = "fitzone_ultimo_qr";
const COLA_OFFLINE_KEY = "fitzone_cola_accesos_offline";
const snapshotKey = (sedeId: number) => `fitzone_snapshot_sede_${sedeId}`;

/** RF-04: pide un QR rotativo de 60 s al backend y lo cachea localmente para fallback offline. */
export async function obtenerQrDinamico(): Promise<QrDinamicoRespuesta> {
  const data = await apiRequest<QrDinamicoRespuesta>("/acceso/qr", { requireAuth: true });
  try {
    localStorage.setItem(ULTIMO_QR_KEY, JSON.stringify(data));
  } catch {
    // ignora errores de cuota en storage
  }
  return data;
}

export function leerUltimoQrLocal(): QrDinamicoRespuesta | null {
  try {
    const raw = localStorage.getItem(ULTIMO_QR_KEY);
    return raw ? (JSON.parse(raw) as QrDinamicoRespuesta) : null;
  } catch {
    return null;
  }
}

/** RF-03 + RF-04 + RN-01: valida el QR contra el servidor central y registra ingreso. */
export async function validarAccesoOnline(
  qr: string,
  sedeId: number
): Promise<ValidacionAccesoRespuesta> {
  return apiRequest<ValidacionAccesoRespuesta>("/acceso/validar", {
    method: "POST",
    body: { qr, sedeId },
    requireAuth: true,
  });
}

/** Registra egreso de un socio cerrando su acceso abierto. */
export async function registrarEgreso(userId?: number): Promise<EgresoRespuesta> {
  return apiRequest<EgresoRespuesta>("/acceso/egreso", {
    method: "POST",
    body: userId ? { userId } : {},
    requireAuth: true,
  });
}

/** RF-05: consulta aforo actual y máximo de una sede. */
export async function obtenerAforoSede(sedeId: number): Promise<AforoSedeRespuesta> {
  return apiRequest<AforoSedeRespuesta>(`/acceso/aforo/${sedeId}`, { requireAuth: true });
}

/** RNF-01: descarga el snapshot de socios activos y lo persiste en localStorage. */
export async function descargarSnapshotSede(sedeId: number): Promise<SnapshotSedeRespuesta> {
  const snapshot = await apiRequest<SnapshotSedeRespuesta>(`/acceso/sedes/${sedeId}/snapshot`, {
    requireAuth: true,
  });
  try {
    localStorage.setItem(snapshotKey(sedeId), JSON.stringify(snapshot));
  } catch {
    // ignora errores de storage
  }
  return snapshot;
}

export function leerSnapshotLocal(sedeId: number): SnapshotSedeRespuesta | null {
  try {
    const raw = localStorage.getItem(snapshotKey(sedeId));
    return raw ? (JSON.parse(raw) as SnapshotSedeRespuesta) : null;
  } catch {
    return null;
  }
}

/** Decodifica la parte payload de un token QR `<base64url(payload)>.<sig>`. */
export function decodificarQrHmac(token: string): QrPayloadDecodificado | null {
  try {
    const partes = token.trim().split(".");
    if (partes.length !== 2 || !partes[0]) return null;
    const base64 = partes[0].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const parsed = JSON.parse(atob(padded)) as Partial<QrPayloadDecodificado>;
    if (
      typeof parsed.userId !== "number" ||
      typeof parsed.exp !== "number" ||
      typeof parsed.iat !== "number"
    ) {
      return null;
    }
    return {
      userId: parsed.userId,
      win: typeof parsed.win === "number" ? parsed.win : 0,
      iat: parsed.iat,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

/** RNF-01: valida un QR contra el snapshot local cuando no hay conexión al servidor. */
export function validarAccesoOffline(
  qr: string,
  sedeId: number
): {
  autorizado: boolean;
  socio?: SocioSnapshot;
  motivo: string;
  itemCola?: IngresoOfflineItem;
} {
  const payload = decodificarQrHmac(qr);
  if (!payload) {
    return { autorizado: false, motivo: "Formato de código QR inválido." };
  }

  const ahoraSeg = Math.floor(Date.now() / 1000);
  if (ahoraSeg >= payload.exp) {
    return {
      autorizado: false,
      motivo: "Código QR vencido (validez 60 s). Solicitá un nuevo código al socio.",
    };
  }

  const snapshot = leerSnapshotLocal(sedeId);
  if (!snapshot) {
    return {
      autorizado: false,
      motivo: "No hay copia local (snapshot) descargada para esta sede.",
    };
  }

  const socio = snapshot.socios.find((s) => s.userId === payload.userId);
  if (!socio || socio.membresia_estado !== "ACTIVO") {
    return {
      autorizado: false,
      motivo: "Socio no encontrado o sin membresía ACTIVA en la copia local.",
    };
  }

  const itemCola: IngresoOfflineItem = {
    userId: socio.userId,
    sedeId,
    timestamp: new Date().toISOString(),
    qrToken: qr.trim(),
  };

  encolarIngresoOffline(itemCola);
  return {
    autorizado: true,
    socio,
    motivo: "Validado contra copia local (pendiente de sincronización).",
    itemCola,
  };
}

/** Lee la cola persistente de ingresos offline desde localStorage. */
export function leerColaOffline(): IngresoOfflineItem[] {
  try {
    const raw = localStorage.getItem(COLA_OFFLINE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as IngresoOfflineItem[]) : [];
  } catch {
    return [];
  }
}

function guardarColaOffline(cola: IngresoOfflineItem[]): void {
  try {
    localStorage.setItem(COLA_OFFLINE_KEY, JSON.stringify(cola));
  } catch {
    // ignora errores de storage
  }
}

export function encolarIngresoOffline(item: IngresoOfflineItem): IngresoOfflineItem[] {
  const actual = leerColaOffline();
  const actualizada = [...actual, item];
  guardarColaOffline(actualizada);
  return actualizada;
}

/** RNF-01: envía los ingresos pendientes a POST /acceso/sincronizar y limpia la cola local. */
export async function sincronizarColaOffline(): Promise<SincronizacionRespuesta | null> {
  const cola = leerColaOffline();
  if (cola.length === 0) return null;

  const resultado = await apiRequest<SincronizacionRespuesta>("/acceso/sincronizar", {
    method: "POST",
    body: { ingresos: cola },
    requireAuth: true,
  });

  // Limpiamos los eventos procesados (tanto aceptados como conflictos ya reportados al operador)
  guardarColaOffline([]);
  return resultado;
}
