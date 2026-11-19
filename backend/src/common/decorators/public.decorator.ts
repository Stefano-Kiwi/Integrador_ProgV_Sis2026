import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar controladores o métodos como públicos (sin requerir token JWT).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
