import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: number;
  id_rol: number;
  id_rol: number;
  iat?: number;
  exp?: number;
}

/**
 * Extrae el payload del JWT del request (ya validado por JwtAuthGuard).
 *
 * @example
 * // Obtener todo el payload
 * @CurrentUser() user: JwtPayload
 *
 * // Obtener solo el id
 * @CurrentUser('sub') userId: number
 */
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);

