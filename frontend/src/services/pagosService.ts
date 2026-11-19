import { apiRequest, apiRequestBlob } from "./apiClient";

export interface PagoRespuestaApi {
  pago_id: number;
  estado: string;
  token_pasarela: string;
  comprobante: {
    id: number;
    archivo_url: string;
    descarga_url: string;
    emitido_at: string;
  };
}

export interface PagoDetalleApi {
  id: number;
  monto: string | number;
  estado: string;
  token_pasarela: string | null;
  creado_at: string;
  pagado_at: string | null;
  comprobante?: {
    id: number;
    archivo_url: string;
    emitido_at: string;
  } | null;
}

export async function obtenerPagos(): Promise<PagoDetalleApi[]> {
  return apiRequest<PagoDetalleApi[]>("/pagos", { requireAuth: true });
}

export async function obtenerPagoPorId(id: number): Promise<PagoDetalleApi> {
  return apiRequest<PagoDetalleApi>(`/pagos/${id}`, { requireAuth: true });
}

export async function simularPago(
  origenTipo: "cancha" | "membresia",
  origenId: number,
  monto: number
): Promise<PagoRespuestaApi> {
  return apiRequest<PagoRespuestaApi>("/pagos/simular", {
    method: "POST",
    body: { origen_tipo: origenTipo, origen_id: origenId, monto },
    requireAuth: true,
  });
}

export async function descargarComprobantePdf(pagoId: number): Promise<void> {
  const blob = await apiRequestBlob(`/pagos/${pagoId}/comprobante`);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `comprobante-pago-${pagoId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
