import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { sede } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { SedesRepository } from './sedes.repository.js';
import type { CreateSedeDto } from './dto/create-sede.dto.js';
import type { JwtPayload } from '../common/decorators/current-user.decorator.js';
import { obtenerSedeRestringida, validarAccesoASede } from '../common/auth/branch-scope.js';

@Injectable()
export class SedesService {
  constructor(private readonly sedesRepository: SedesRepository) {}

  async findAll(user?: JwtPayload): Promise<sede[]> {
    const sedeGerente = obtenerSedeRestringida(user);
    if (sedeGerente !== null) {
      const propia = await this.sedesRepository.findById(sedeGerente);
      return propia ? [propia] : [];
    }
    return this.sedesRepository.findAll();
  }

  async findById(id: number, user?: JwtPayload): Promise<sede> {
    validarAccesoASede(user, id);
    const found = await this.sedesRepository.findById(id);
    if (!found) {
      throw new NotFoundException(`Sede con ID ${id} no encontrada`);
    }
    return found;
  }

  async create(dto: CreateSedeDto): Promise<sede> {
    try {
      return await this.sedesRepository.create(dto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una sede con ese nombre');
      }
      throw error;
    }
  }
}
