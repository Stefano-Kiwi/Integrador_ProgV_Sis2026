import { Injectable } from '@nestjs/common';
import type { usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export interface NewUserData {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  foto_url?: string;
  id_rol: number;
  sede_base_id?: number;
  passwordHash: string;
}

export const PUBLIC_USER_SELECT = {
  id: true,
  dni: true,
  nombre: true,
  apellido: true,
  email: true,
  telefono: true,
  foto_url: true,
  id_rol: true,
  sede_base_id: true,
  creado_at: true,
  rol: {
    select: {
      id_rol: true,
      clase_rol: true,
    },
  },
  sede_base: {
    select: {
      id: true,
      nombre: true,
    },
  },
} as const;

export type PublicUser = Omit<usuario, 'password_hash'> & {
  rol?: { id_rol: number; clase_rol: string };
  sede_base?: { id: number; nombre: string } | null;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  findById(id: number): Promise<PublicUser | null> {
    return this.prisma.usuario.findUnique({ where: { id }, select: PUBLIC_USER_SELECT });
  }

  findAll(): Promise<PublicUser[]> {
    return this.prisma.usuario.findMany({
      select: PUBLIC_USER_SELECT,
      orderBy: { id: 'asc' },
    });
  }

  create(data: NewUserData): Promise<PublicUser> {
    const { passwordHash, ...rest } = data;
    return this.prisma.usuario.create({
      data: {
        ...rest,
        password_hash: passwordHash,
      },
      select: PUBLIC_USER_SELECT,
    });
  }
}
