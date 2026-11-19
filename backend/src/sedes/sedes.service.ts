import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { sede } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { SedesRepository } from './sedes.repository.js';
import type { CreateSedeDto } from './dto/create-sede.dto.js';
import type { JwtPayload } from '../common/decorators/current-user.decorator.js';

@Injectable()
export class SedesService {
  constructor(private readonly sedesRepository: SedesRepository) {}

  async findAll(user: JwtPayload): Promise<sede[]> {
    if (user.id_rol === 4) return this.sedesRepository.findAll();
    const sedeId = await this.sedesRepository.findSedeBaseId(user.sub);
    return sedeId ? this.sedesRepository.findByIds([sedeId]) : [];
  }

  sedeBaseId(usuarioId: number): Promise<number | null> {
    return this.sedesRepository.findSedeBaseId(usuarioId);
  }

  async findById(id: number): Promise<sede> {
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

  async update(id: number, dto: Partial<CreateSedeDto>, user: JwtPayload): Promise<sede> {
    const sede = await this.findById(id);
    if (user.id_rol === 3 && sede.id !== await this.sedesRepository.findSedeBaseId(user.sub)) {
      throw new ForbiddenException('Solo podés modificar la información de tu sede.');
    }
    return this.sedesRepository.update(id, dto);
  }
}
