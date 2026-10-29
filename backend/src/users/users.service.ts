import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type { usuario } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { CreateUserDto } from './dto/create-user.dto.js';
import { UsersRepository, type PublicUser } from './users.repository.js';

/** Costo del hash: más alto = más seguro pero más lento. 10 es el estándar. */
const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** Hashea la contraseña y crea el usuario. Devuelve el usuario SIN hash. */
  async create(dto: CreateUserDto): Promise<PublicUser> {
    const { password, email, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    try {
      return await this.usersRepository.create({
        ...rest,
        email: email.toLowerCase(),
        passwordHash,
      });
    } catch (error) {
      // P2002 = violación de unique (email o dni ya existen)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El email o el DNI ya están registrados');
      }
      throw error;
    }
  }

  /** Uso interno de Auth: devuelve el registro con hash. Nunca devolver al cliente. */
  findByEmail(email: string): Promise<usuario | null> {
    return this.usersRepository.findByEmail(email.toLowerCase());
  }

  findAll(): Promise<PublicUser[]> {
    return this.usersRepository.findAll();
  }
}
