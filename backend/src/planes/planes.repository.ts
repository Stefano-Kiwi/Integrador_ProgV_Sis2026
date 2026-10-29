import { Injectable } from '@nestjs/common';
import type { plan_membresia } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePlanDto } from './dto/create-plan.dto.js';

@Injectable()
export class PlanesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<plan_membresia[]> {
    return this.prisma.plan_membresia.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number): Promise<plan_membresia | null> {
    return this.prisma.plan_membresia.findUnique({
      where: { id },
    });
  }

  create(data: CreatePlanDto): Promise<plan_membresia> {
    return this.prisma.plan_membresia.create({
      data: {
        nombre: data.nombre,
        duracion_meses: data.duracion_meses,
        precio: data.precio,
      },
    });
  }
}
