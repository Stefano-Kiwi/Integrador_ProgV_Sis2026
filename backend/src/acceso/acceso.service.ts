import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccesoRepository } from './acceso.repository.js';
import type { ValidarAccesoDto } from './dto/validar-acceso.dto.js';
import type { SincronizarAccesosDto } from './dto/sincronizar-accesos.dto.js';

export const QR_VENTANA_SEGUNDOS = 60;

export interface QrTokenPayload {
  userId: number;
  /** Número de ventana de 60 segundos (Math.floor(epochSec / 60)). */
  win: number;
  /** Epoch en segundos del inicio de la ventana. */
  iat: number;
  /** Epoch en segundos de expiración (iat + 60). */
  exp: number;
}

@Injectable()
export class AccesoService {
  constructor(private readonly accesoRepository: AccesoRepository) {}

  private getSecret(): string {
    return process.env.QR_SECRET || process.env.JWT_SECRET || 'fitzone-qr-dev-secret';
  }

  /** Firma un payload JSON con HMAC-SHA256 en formato `<base64url(payload)>.<base64url(sig)>`. */
  private firmarPayload(payload: QrTokenPayload): string {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = createHmac('sha256', this.getSecret()).update(body).digest('base64url');
    return `${body}.${sig}`;
  }

  /** Verifica formato y firma HMAC-SHA256 usando comparación en tiempo constante. */
  verificarFirmaQr(token: string): QrTokenPayload {
    const partes = token.split('.');
    if (partes.length !== 2 || !partes[0] || !partes[1]) {
      throw new UnauthorizedException('Formato de código QR inválido.');
    }

    const [body, sigRecibida] = partes;
    const sigEsperada = createHmac('sha256', this.getSecret()).update(body).digest('base64url');

    const bufRecibida = Buffer.from(sigRecibida);
    const bufEsperada = Buffer.from(sigEsperada);
    if (
      bufRecibida.length !== bufEsperada.length ||
      !timingSafeEqual(bufRecibida, bufEsperada)
    ) {
      throw new UnauthorizedException('Firma de código QR inválida.');
    }

    let payload: unknown;
    try {
      payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    } catch {
      throw new UnauthorizedException('Contenido de código QR corrupto.');
    }

    const p = payload as Partial<QrTokenPayload>;
    if (
      typeof p.userId !== 'number' ||
      typeof p.iat !== 'number' ||
      typeof p.exp !== 'number' ||
      typeof p.win !== 'number'
    ) {
      throw new UnauthorizedException('Payload de código QR incompleto.');
    }

    return p as QrTokenPayload;
  }

  /** RF-04: emite el QR dinámico del socio (validez de 60 s, rota cada minuto). */
  async generarQr(userId: number, ahora: Date = new Date()) {
    const activa = await this.accesoRepository.tieneMembresiaActiva(userId);
    if (!activa) {
      throw new ForbiddenException(
        'Tu membresía no está activa. No es posible emitir el código QR de acceso.',
      );
    }

    const ahoraSeg = Math.floor(ahora.getTime() / 1000);
    const win = Math.floor(ahoraSeg / QR_VENTANA_SEGUNDOS);
    const iat = win * QR_VENTANA_SEGUNDOS;
    const exp = iat + QR_VENTANA_SEGUNDOS;

    const qr = this.firmarPayload({ userId, win, iat, exp });

    return {
      qr,
      userId,
      emitido_at: new Date(iat * 1000).toISOString(),
      expira_at: new Date(exp * 1000).toISOString(),
      validez_segundos: QR_VENTANA_SEGUNDOS,
    };
  }

  /** RF-03 + RF-04 + RN-01: valida QR, membresía activa y registra ingreso en cualquier sede. */
  async validarIngreso(dto: ValidarAccesoDto, ahora: Date = new Date()) {
    const payload = this.verificarFirmaQr(dto.qr);

    const ahoraSeg = Math.floor(ahora.getTime() / 1000);
    if (ahoraSeg >= payload.exp) {
      throw new UnauthorizedException('Código QR vencido. Solicitá un nuevo código.');
    }

    const sede = await this.accesoRepository.findSedeById(dto.sedeId);
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${dto.sedeId} no encontrada`);
    }

    const activa = await this.accesoRepository.tieneMembresiaActiva(payload.userId);
    if (!activa) {
      throw new ForbiddenException(
        'Acceso denegado: la membresía del socio está vencida, suspendida o inexistente.',
      );
    }

    // Validación amistosa de RN-01; la garantía final es ux_acceso_activo_por_usuario (P2002).
    const activo = await this.accesoRepository.findAccesoActivo(payload.userId);
    if (activo) {
      throw new ConflictException(
        `El socio ya registra un ingreso activo en la sede #${activo.sede_id} (RN-01).`,
      );
    }

    let ingreso;
    try {
      ingreso = await this.accesoRepository.createIngreso(payload.userId, dto.sedeId, ahora);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'El socio ya registra un ingreso activo en otra sede (RN-01).',
        );
      }
      throw error;
    }

    return {
      autorizado: true,
      acceso_id: ingreso.id,
      usuario_id: ingreso.usuario_id,
      sede_id: ingreso.sede_id,
      sede_nombre: sede.nombre,
      ingreso_at: ingreso.ingreso_at,
      mensaje: `Ingreso autorizado en ${sede.nombre}.`,
    };
  }

  /** Registra el egreso del socio cerrando su acceso abierto (egreso_at). */
  async registrarEgreso(userId: number, ahora: Date = new Date()) {
    const activo = await this.accesoRepository.findAccesoActivo(userId);
    if (!activo) {
      throw new NotFoundException('El socio no tiene un ingreso activo registrado.');
    }

    const cerrado = await this.accesoRepository.registrarEgreso(activo.id, ahora);
    return {
      acceso_id: cerrado.id,
      usuario_id: cerrado.usuario_id,
      sede_id: cerrado.sede_id,
      ingreso_at: cerrado.ingreso_at,
      egreso_at: cerrado.egreso_at,
      mensaje: 'Egreso registrado correctamente.',
    };
  }

  /** RF-05: ocupación actual (accesos con egreso_at IS NULL) y aforo máximo de la sede. */
  async obtenerAforo(sedeId: number) {
    const sede = await this.accesoRepository.findSedeById(sedeId);
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${sedeId} no encontrada`);
    }

    const aforoActual = await this.accesoRepository.contarAforoActual(sedeId);
    const porcentaje =
      sede.aforo_maximo > 0 ? Math.round((aforoActual / sede.aforo_maximo) * 100) : 0;

    return {
      sede_id: sede.id,
      sede_nombre: sede.nombre,
      aforo_actual: aforoActual,
      aforo_maximo: sede.aforo_maximo,
      porcentaje_ocupacion: porcentaje,
    };
  }

  /**
   * RNF-01: sincroniza un lote de ingresos validados offline por el terminal de sede.
   * Es idempotente: si el mismo (userId, sedeId, timestamp) ya fue registrado, no duplica.
   */
  async sincronizarOffline(dto: SincronizarAccesosDto) {
    const aceptados: Array<{
      userId: number;
      sedeId: number;
      timestamp: string;
      acceso_id: number;
      duplicado: boolean;
    }> = [];
    const conflictos: Array<{
      userId: number;
      sedeId: number;
      timestamp: string;
      motivo: string;
    }> = [];

    for (const item of dto.ingresos) {
      const tsDate = new Date(item.timestamp);

      // 1. Idempotencia: si el evento ya existe, se informa aceptado sin duplicar.
      const existente = await this.accesoRepository.findAccesoPorClaveOffline(
        item.userId,
        item.sedeId,
        tsDate,
      );
      if (existente) {
        aceptados.push({
          userId: item.userId,
          sedeId: item.sedeId,
          timestamp: item.timestamp,
          acceso_id: existente.id,
          duplicado: true,
        });
        continue;
      }

      // 2. Verificar firma HMAC y pertenencia del QR (el token puede haber vencido mientras estaba offline).
      try {
        const payload = this.verificarFirmaQr(item.qrToken);
        if (payload.userId !== item.userId) {
          conflictos.push({
            userId: item.userId,
            sedeId: item.sedeId,
            timestamp: item.timestamp,
            motivo: 'El QR no corresponde al usuario informado.',
          });
          continue;
        }
      } catch (err) {
        conflictos.push({
          userId: item.userId,
          sedeId: item.sedeId,
          timestamp: item.timestamp,
          motivo: err instanceof Error ? err.message : 'QR inválido.',
        });
        continue;
      }

      // 3. Verificar membresía activa
      const activa = await this.accesoRepository.tieneMembresiaActiva(item.userId);
      if (!activa) {
        conflictos.push({
          userId: item.userId,
          sedeId: item.sedeId,
          timestamp: item.timestamp,
          motivo: 'Membresía inactiva o en mora.',
        });
        continue;
      }

      // 4. Registrar ingreso respetando RN-01 (índice ux_acceso_activo_por_usuario)
      try {
        const creado = await this.accesoRepository.createIngreso(item.userId, item.sedeId, tsDate);
        aceptados.push({
          userId: item.userId,
          sedeId: item.sedeId,
          timestamp: item.timestamp,
          acceso_id: creado.id,
          duplicado: false,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          conflictos.push({
            userId: item.userId,
            sedeId: item.sedeId,
            timestamp: item.timestamp,
            motivo: 'El socio ya tiene un ingreso activo en otra sede (RN-01).',
          });
          continue;
        }
        throw error;
      }
    }

    return {
      total: dto.ingresos.length,
      aceptados,
      conflictos,
    };
  }

  /** RNF-01: snapshot de socios activos de la red para validación offline en el terminal de sede. */
  async obtenerSnapshotSede(sedeId: number) {
    const sede = await this.accesoRepository.findSedeById(sedeId);
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${sedeId} no encontrada`);
    }

    const membresias = await this.accesoRepository.findSociosActivosSnapshot();
    const socios = membresias.map((m) => ({
      userId: m.usuario.id,
      dni: m.usuario.dni,
      nombre: m.usuario.nombre,
      apellido: m.usuario.apellido,
      membresia_estado: m.estado,
      fecha_fin: m.fecha_fin,
    }));

    return {
      sede_id: sede.id,
      sede_nombre: sede.nombre,
      aforo_maximo: sede.aforo_maximo,
      generado_at: new Date().toISOString(),
      total_socios_activos: socios.length,
      socios,
    };
  }
}
