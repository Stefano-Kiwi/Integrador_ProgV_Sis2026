import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembresiasRepository } from './membresias.repository.js';
import { puedeTransicionarMembresia, sumarMeses } from './membresias.reglas.js';
import type { ContratarMembresiaDto, RenovarMembresiaDto } from './dto/membresia.dto.js';
import type { JwtPayload } from '../../common/decorators/current-user.decorator.js';

const ID_ROLES_PERSONAL = [3, 4]; // Gerente, Administrador

@Injectable()
export class MembresiasService {
  constructor(private readonly repo: MembresiasRepository) {}

  /** RF-02: contrata un plan de membresía (queda PENDIENTE_PAGO hasta confirmarse en /pagos/simular). */
  async contratar(dto: ContratarMembresiaDto, user: JwtPayload, ahora: Date = new Date()) {
    const esPersonal = ID_ROLES_PERSONAL.includes(user.id_rol);
    const usuarioId = dto.usuario_id ?? user.sub;
    if (usuarioId !== user.sub && !esPersonal) {
      throw new ForbiddenException('Solo personal autorizado puede contratar planes para otro usuario.');
    }

    const plan = await this.repo.findPlanById(dto.plan_id);
    if (!plan) {
      throw new NotFoundException(`Plan de membresía con ID ${dto.plan_id} no encontrado`);
    }

    const fechaFin = sumarMeses(ahora, plan.duracion_meses);
    return this.repo.create({
      usuario_id: usuarioId,
      plan_id: plan.id,
      fecha_inicio: ahora,
      fecha_fin: fechaFin,
      estado: 'PENDIENTE_PAGO',
      renovacion_automatica: dto.renovacion_automatica ?? false,
    });
  }

  /** RF-02: consulta el estado de la membresía de un usuario y si es SOCIO o CLIENTE_EXTERNO. */
  async consultarEstado(usuarioId: number) {
    const ultima = await this.repo.findUltimaByUsuario(usuarioId);
    if (!ultima) {
      return {
        usuario_id: usuarioId,
        tipo_usuario: 'CLIENTE_EXTERNO' as const,
        estado: 'SIN_MEMBRESIA' as const,
        membresia: null,
      };
    }

    return {
      usuario_id: usuarioId,
      tipo_usuario: 'SOCIO' as const,
      estado: ultima.estado,
      membresia: ultima,
    };
  }

  /**
   * RF-02: renueva una membresía (manual o automática simulada).
   * Pasa a ACTIVO (si estaba VENCIDO / SUSPENDIDO / PENDIENTE_PAGO) o extiende su vigencia si ya estaba ACTIVO.
   */
  async renovar(
    id: number,
    dto: RenovarMembresiaDto,
    user: JwtPayload,
    ahora: Date = new Date(),
  ) {
    const actual = await this.repo.findById(id);
    if (!actual) {
      throw new NotFoundException(`Membresía con ID ${id} no encontrada`);
    }

    const esPersonal = ID_ROLES_PERSONAL.includes(user.id_rol);
    if (actual.usuario_id !== user.sub && !esPersonal) {
      throw new ForbiddenException('Solo podés renovar tu propia membresía.');
    }

    const planId = dto.plan_id ?? actual.plan_id;
    const plan = await this.repo.findPlanById(planId);
    if (!plan) {
      throw new NotFoundException(`Plan de membresía con ID ${planId} no encontrado`);
    }

    // Si aún está vigente, extiende desde fecha_fin; caso contrario desde ahora.
    const base =
      actual.estado === 'ACTIVO' && actual.fecha_fin > ahora ? actual.fecha_fin : ahora;
    const nuevaFechaFin = sumarMeses(base, plan.duracion_meses);

    return this.repo.update(id, {
      plan_id: plan.id,
      fecha_inicio: actual.estado === 'ACTIVO' ? actual.fecha_inicio : ahora,
      fecha_fin: nuevaFechaFin,
      estado: 'ACTIVO',
      ...(dto.renovacion_automatica !== undefined
        ? { renovacion_automatica: dto.renovacion_automatica }
        : {}),
    });
  }

  /** RF-02: suspende una membresía (transición válida desde ACTIVO, VENCIDO o PENDIENTE_PAGO). */
  async suspender(id: number) {
    const actual = await this.repo.findById(id);
    if (!actual) {
      throw new NotFoundException(`Membresía con ID ${id} no encontrada`);
    }

    if (!puedeTransicionarMembresia(actual.estado, 'SUSPENDIDO')) {
      throw new ConflictException(
        `No se puede suspender una membresía que ya se encuentra en estado ${actual.estado}.`,
      );
    }

    return this.repo.update(id, { estado: 'SUSPENDIDO' });
  }

  /** RF-02: transición ACTIVO → VENCIDO para todas las membresías cuya fecha_fin ya expiró. */
  async procesarVencimientos(ahora: Date = new Date()) {
    const vencidasActualizadas = await this.repo.marcarVencidas(ahora);
    return {
      vencidas_actualizadas: vencidasActualizadas,
      ejecutado_at: ahora.toISOString(),
    };
  }
}
