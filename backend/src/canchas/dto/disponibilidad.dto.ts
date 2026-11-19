import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class DisponibilidadQueryDto {
  @ApiProperty({ example: '2026-12-01', description: 'Fecha a consultar (YYYY-MM-DD)' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' })
  fecha: string;
}

export class PrecioFranjaDto {
  @ApiProperty({ example: 8000 }) precio_base: number;
  @ApiProperty({ example: 1200 }) descuento: number;
  @ApiProperty({ example: 0 }) recargo: number;
  @ApiProperty({ example: 6800 }) monto_total: number;
  @ApiProperty({ example: ['TarifaEstandar', 'DescuentoSocio'], type: [String] }) estrategias_aplicadas: string[];
}

export class FranjaDisponibilidadDto {
  @ApiProperty({ example: 19, description: 'Hora de inicio del turno' }) hora_inicio: number;
  @ApiProperty({ example: 20, description: 'Hora de fin del turno' }) hora_fin: number;
  @ApiProperty({
    enum: ['LIBRE', 'OCUPADA', 'MANTENIMIENTO'],
    description: 'MANTENIMIENTO: la cancha está inhabilitada y no admite reservas',
  })
  estado: 'LIBRE' | 'OCUPADA' | 'MANTENIMIENTO';
  @ApiProperty({ description: 'Precio calculado por las estrategias para el usuario autenticado', type: PrecioFranjaDto })
  precio: PrecioFranjaDto;
}

export class DisponibilidadResponseDto {
  @ApiProperty({ example: 1 }) cancha_id: number;
  @ApiProperty({ example: '2026-12-01' }) fecha: string;
  @ApiProperty({ enum: ['HABILITADA', 'EN_MANTENIMIENTO'] }) cancha_estado: string;
  @ApiProperty({ type: [FranjaDisponibilidadDto] }) franjas: FranjaDisponibilidadDto[];
}
