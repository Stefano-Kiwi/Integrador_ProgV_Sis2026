import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { plan_membresia } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PlanesRepository } from './planes.repository.js';
import type { CreatePlanDto } from './dto/create-plan.dto.js';

@Injectable()
export class PlanesService {
  constructor(private readonly planesRepository: PlanesRepository) {}

  findAll(): Promise<plan_membresia[]> {
    return this.planesRepository.findAll();
  }

  async findById(id: number): Promise<plan_membresia> {
    const plan = await this.planesRepository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Plan de membresía con ID ${id} no encontrado`);
    }
    return plan;
  }

  async create(dto: CreatePlanDto): Promise<plan_membresia> {
    try {
      return await this.planesRepository.create(dto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe un plan con ese nombre');
      }
      throw error;
    }
  }
}
