import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Injectable } from '@nestjs/common';

export interface DatosComprobantePdf {
  pagoId: number;
  concepto: string;
  detalle: string;
  monto: number;
  fecha: Date;
  tokenPasarela: string;
}

/** Escapa caracteres especiales para literales de texto PDF (ISO-8859-1 / ASCII). */
function sanitizarTextoPdf(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes para compatibilidad total con Helvetica estándar
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' ');
}

/**
 * Generador de comprobantes PDF reales (RF-14) en formato PDF 1.4 estándar,
 * sin dependencias externas. Guarda los archivos en `storage/comprobantes/`.
 */
@Injectable()
export class ComprobantePdfService {
  /** Construye un documento PDF 1.4 válido en memoria con el detalle del pago. */
  generarBuffer(datos: DatosComprobantePdf): Buffer {
    const fechaStr = datos.fecha.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const montoStr = `$ ${datos.monto.toFixed(2)}`;

    const lineas: Array<{ texto: string; size: number; y: number }> = [
      { texto: 'FITZONE SPORTS - COMPROBANTE DE PAGO', size: 16, y: 760 },
      { texto: '------------------------------------------------------------', size: 10, y: 740 },
      { texto: `Comprobante Nro: #${datos.pagoId}`, size: 12, y: 710 },
      { texto: `Fecha de emision: ${fechaStr}`, size: 12, y: 690 },
      { texto: `Concepto: ${datos.concepto}`, size: 12, y: 660 },
      { texto: `Detalle: ${datos.detalle}`, size: 12, y: 640 },
      { texto: `Monto abonado: ${montoStr}`, size: 14, y: 605 },
      { texto: `Token pasarela (RNF-02): ${datos.tokenPasarela}`, size: 10, y: 575 },
      { texto: '------------------------------------------------------------', size: 10, y: 550 },
      { texto: 'Documento emitido automaticamente por FitZone Sports.', size: 9, y: 530 },
    ];

    const contenidoStream = [
      'BT',
      ...lineas.map(
        (l) => `/F1 ${l.size} Tf 1 0 0 1 50 ${l.y} Tm (${sanitizarTextoPdf(l.texto)}) Tj`,
      ),
      'ET',
    ].join('\n');

    const objetos = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      `5 0 obj\n<< /Length ${Buffer.byteLength(contenidoStream, 'utf-8')} >>\nstream\n${contenidoStream}\nendstream\nendobj\n`,
    ];

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];

    for (const obj of objetos) {
      offsets.push(Buffer.byteLength(pdf, 'utf-8'));
      pdf += obj;
    }

    const xrefStart = Buffer.byteLength(pdf, 'utf-8');
    pdf += `xref\n0 ${objetos.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

    return Buffer.from(pdf, 'utf-8');
  }

  /** Ruta relativa donde se almacena el comprobante de un pago. */
  rutaRelativa(pagoId: number): string {
    return `storage/comprobantes/recibo-${pagoId}.pdf`;
  }

  /** Genera y escribe el archivo PDF en disco, devolviendo su ruta relativa. */
  guardarPdf(datos: DatosComprobantePdf): string {
    const rel = this.rutaRelativa(datos.pagoId);
    const abs = resolve(process.cwd(), rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, this.generarBuffer(datos));
    return rel;
  }

  /** Lee un archivo PDF previamente generado desde disco (null si no existe). */
  leerPdf(rutaRelativa: string): Buffer | null {
    const abs = resolve(process.cwd(), rutaRelativa);
    if (!existsSync(abs)) {
      return null;
    }
    return readFileSync(abs);
  }
}
