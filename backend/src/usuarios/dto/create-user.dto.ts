import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '30123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dni: string;

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Gómez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({ example: 'carlos@fitzone.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({ example: '1155551234' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @ApiPropertyOptional({ example: 'https://fitzone.com/fotos/perfil-1.jpg' })
  @IsOptional()
  @IsString()
  foto_url?: string;

  @ApiProperty({ example: 1, description: 'ID de rol (1: Cliente, 2: Instructor, 3: Gerente)' })
  @IsInt()
  @IsPositive()
  id_rol: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la sede asignada como sede base' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  sede_base_id?: number;

  @ApiProperty({ minLength: 8, example: 'MiClaveSegura1' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
