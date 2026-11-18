import { SetMetadata } from '@nestjs/common';

/** Roles válidos de la aplicación (deben coincidir con los valores en la tabla `rol`). */
export type AppRole = 'Cliente' | 'Instructor' | 'Gerente' | 'Administrador';

/** Array con todos los roles válidos (útil para validaciones con class-validator). */
export const APP_ROLES: AppRole[] = ['Cliente', 'Instructor', 'Gerente', 'Administrador'];

export const ROLES_KEY = 'roles';

/**
 * Decorador para restringir el acceso a uno o más roles específicos.
 * Se aplica sobre un método o controlador junto con el RolesGuard global.
 *
 * @example
 * @Roles('Gerente', 'Administrador')
 * @Post()
 * create(@Body() dto: CreateSedeDto) { ... }
 */
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

