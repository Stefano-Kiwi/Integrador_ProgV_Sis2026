import { ForbiddenException } from '@nestjs/common';
import type { JwtPayload } from '../decorators/current-user.decorator.js';

const ID_ROL_GERENTE = 3;
const ID_ROL_ADMINISTRADOR = 4;

export function esGerente(user?: JwtPayload | null): boolean {
  if (!user) return false;
  return user.id_rol === ID_ROL_GERENTE || user.clase_rol === 'Gerente';
}

export function esAdministrador(user?: JwtPayload | null): boolean {
  if (!user) return false;
  return user.id_rol === ID_ROL_ADMINISTRADOR || user.clase_rol === 'Administrador';
}

/**
 * Si el usuario autenticado es Gerente, devuelve su `sede_base_id` (desde el token JWT).
 * Lanza 403 si es Gerente sin sede asignada. Para otros roles devuelve null (sin filtro por sede).
 */
export function obtenerSedeRestringida(user?: JwtPayload | null): number | null {
  if (!esGerente(user)) return null;
  const sedeId = user?.sede_base_id;
  if (typeof sedeId !== 'number' || !Number.isInteger(sedeId) || sedeId <= 0) {
    throw new ForbiddenException('Tu cuenta de Gerente no tiene una sede asignada.');
  }
  return sedeId;
}

/** Verifica que un Gerente solo pueda consultar o modificar recursos de su propia sede. */
export function validarAccesoASede(user: JwtPayload | undefined | null, sedeIdRecurso: number): void {
  const sedeGerente = obtenerSedeRestringida(user);
  if (sedeGerente !== null && sedeIdRecurso !== sedeGerente) {
    throw new ForbiddenException(
      'Acceso denegado: como Gerente solo podés operar sobre tu sede asignada.',
    );
  }
}

/**
 * Resuelve la sede efectiva para crear/editar un recurso:
 * - Si es Gerente: rechaza con 403 si intenta operar sobre otra sede y fuerza siempre su `sede_base_id` del token.
 * - Si es Administrador: respeta el `sedeIdSolicitada`.
 */
export function resolverSedeEscritura(
  user: JwtPayload | undefined | null,
  sedeIdSolicitada?: number,
): number {
  const sedeGerente = obtenerSedeRestringida(user);
  if (sedeGerente !== null) {
    if (sedeIdSolicitada !== undefined && sedeIdSolicitada !== sedeGerente) {
      throw new ForbiddenException(
        'Acceso denegado: como Gerente no podés crear ni mover recursos a otra sede.',
      );
    }
    return sedeGerente;
  }
  if (sedeIdSolicitada === undefined) {
    throw new ForbiddenException('Debe especificarse sede_id.');
  }
  return sedeIdSolicitada;
}
