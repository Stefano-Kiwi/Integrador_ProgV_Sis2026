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

  create(data: CreateSedeDto): Promise<sede> {
    return this.prisma.sede.create({
      data,
    });
  }
}
