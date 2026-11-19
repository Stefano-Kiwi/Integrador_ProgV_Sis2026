import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class ContratarMembresiaDto {
  @ApiProperty({ example: 1, description: 'ID del plan (Mensual, Trimestral o Anual)' })
  @IsInt()
  @IsPositive()
  plan_id: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID del usuario (opcional; solo personal puede contratar para terceros)',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  usuario_id?: number;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  renovacion_automatica?: boolean;
}

export class RenovarMembresiaDto {
  @ApiPropertyOptional({ example: 2, description: 'Opcional: cambiar de plan al renovar' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  plan_id?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  renovacion_automatica?: boolean;
}
