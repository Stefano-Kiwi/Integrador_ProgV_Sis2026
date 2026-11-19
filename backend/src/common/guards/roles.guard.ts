import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, type AppRole } from '../decorators/roles.decorator.js';

interface JwtPayload {
  sub: number;
  id_rol: number;
  clase_rol?: string;
}

/**
 * Guard que verifica si el usuario autenticado tiene uno de los roles requeridos.
 * Solo actúa cuando el endpoint tiene el decorador @Roles(...).
 * Si no hay roles definidos, deja pasar (el JwtAuthGuard ya habrá validado el token).
 *
 * Requiere que JwtAuthGuard haya corrido primero y haya adjuntado `request.user`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si el endpoint no tiene @Roles(), cualquier usuario autenticado puede acceder.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    // Si no hay usuario adjunto (no debería pasar si JwtAuthGuard corrió primero)
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    // Comparamos id_rol del token con los roles permitidos
    // El payload solo tiene id_rol (número), necesitamos el nombre del rol.
    // Se espera que el campo clase_rol esté en el payload; si no, la verificación
    // se hace solo por id_rol usando el mapa definido abajo.
    const roleNameMap: Record<number, AppRole> = {
      1: 'Cliente',
      2: 'Instructor',
      3: 'Gerente',
      4: 'Administrador',
    };

    const userRoleName = user.clase_rol ?? roleNameMap[user.id_rol];

    if (!userRoleName || !requiredRoles.includes(userRoleName as AppRole)) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere uno de los roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

