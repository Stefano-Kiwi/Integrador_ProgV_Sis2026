import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, ArrayNotEmpty } from 'class-validator';
import { APP_ROLES, type AppRole } from '../decorators/roles.decorator.js';

export class VerifyRolDto {
  @ApiProperty({
    description: 'Lista de roles que pueden acceder a la página. Se aprueba si el usuario tiene AL MENOS uno.',
    example: ['Gerente', 'Administrador'],
    enum: APP_ROLES,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(APP_ROLES, { each: true })
  roles: AppRole[];
}

export class MeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '30123456' })
  dni: string;

  @ApiProperty({ example: 'Carlos' })
  nombre: string;

  @ApiProperty({ example: 'Gómez' })
  apellido: string;

  @ApiProperty({ example: 'carlos@fitzone.com' })
  email: string;

  @ApiProperty({ example: { id_rol: 1, clase_rol: 'Cliente' } })
  rol: { id_rol: number; clase_rol: string };

  @ApiProperty({ required: false })
  sede_base?: { id: number; nombre: string } | null;
}

export class VerifyResponseDto {
  @ApiProperty({ example: true })
  autorizado: boolean;

  @ApiProperty({ example: 'Cliente' })
  rol_usuario: string;

  @ApiProperty({ example: ['Gerente', 'Administrador'] })
  roles_requeridos: string[];
}

