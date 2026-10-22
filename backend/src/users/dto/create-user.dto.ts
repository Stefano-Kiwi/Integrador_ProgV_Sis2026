import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** Tipos de cuenta que existen hoy en el modelo (no hay cuentas de personal). */
export const TIPOS_USUARIO = ['SOCIO', 'CLIENTE_EXTERNO'] as const;
export type TipoUsuario = (typeof TIPOS_USUARIO)[number];

/**
 * Datos para crear un usuario. Por ahora solo lo usa el servicio internamente
 * (no hay endpoint de alta: el CRUD de usuarios está fuera de alcance).
 */
export class CreateUserDto {
  @ApiProperty({ enum: TIPOS_USUARIO })
  @IsIn(TIPOS_USUARIO)
  tipo: TipoUsuario;

  @ApiProperty({ example: '30123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dni: string;

  @ApiProperty({ example: 'Ana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({ example: 'ana@fitzone.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({ example: '1155551234' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  /** Contraseña en texto plano: se hashea en el servicio y nunca se guarda así. */
  @ApiProperty({ minLength: 8, example: 'MiClaveSegura1' })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt solo usa los primeros 72 bytes
  password: string;
}
