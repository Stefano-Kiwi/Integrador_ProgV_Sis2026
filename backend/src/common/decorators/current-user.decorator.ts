import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: number;
  id_rol: number;
  clase_rol?: string;
  sede_base_id?: number | null;
  iat?: number;
  exp?: number;
}

/**
 * Extrae el payload del JWT del request (ya validado por JwtAuthGuard).
 */
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
