import { Injectable } from '@nestjs/common';
import type { sede } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateSedeDto } from './dto/create-sede.dto.js';

@Injectable()
export class SedesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<sede[]> {
    return this.prisma.sede.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number): Promise<sede | null> {
    return this.prisma.sede.findUnique({
      where: { id },
    });
  }

  findByIds(ids: number[]): Promise<sede[]> {
    return this.prisma.sede.findMany({ where: { id: { in: ids } }, orderBy: { id: 'asc' } });
  }

  findSedeBaseId(usuarioId: number): Promise<number | null> {
    return this.prisma.usuario.findUnique({ where: { id: usuarioId }, select: { sede_base_id: true } })
      .then((usuario) => usuario?.sede_base_id ?? null);
  }

  update(id: number, data: Partial<CreateSedeDto>): Promise<sede> {
    return this.prisma.sede.update({ where: { id }, data });
  }

  create(data: CreateSedeDto): Promise<sede> {
    return this.prisma.sede.create({
      data,
    });
  }
}
