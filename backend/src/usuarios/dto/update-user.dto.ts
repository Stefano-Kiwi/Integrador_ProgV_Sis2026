import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Carlos' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Gómez' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @ApiPropertyOptional({ example: 'carlos.nuevo@fitzone.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ example: '3454999999' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @ApiPropertyOptional({ example: 'https://fitzone.com/fotos/perfil-1.jpg' })
  @IsOptional()
  @IsString()
  foto_url?: string;

  @ApiPropertyOptional({ example: 2, description: 'ID de la nueva sede base' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  sede_base_id?: number;
}
