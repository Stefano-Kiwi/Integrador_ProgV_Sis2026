import { Injectable } from '@nestjs/common';
import type { estado_membresia, usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';

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
  membresia: {
    select: {
      id: true,
      estado: true,
      fecha_fin: true,
    },
    orderBy: { creada_at: 'desc' as const },
    take: 1,
  },
  instructor: {
    select: {
      id: true,
    },
  },
} as const;

export type TipoUsuario = 'SOCIO' | 'CLIENTE_EXTERNO';

export type PublicUser = Omit<usuario, 'password_hash'> & {
  rol?: { id_rol: number; clase_rol: string };
  sede_base?: { id: number; nombre: string } | null;
  membresia?: Array<{ id: number; estado: estado_membresia; fecha_fin: Date }>;
  instructor?: { id: number } | null;
  /** RF-01: SOCIO si posee al menos una membresía registrada; CLIENTE_EXTERNO en caso contrario. */
  tipo_usuario?: TipoUsuario;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<PublicUser | null> {
    const user = await this.prisma.usuario.findUnique({ where: { id }, select: PUBLIC_USER_SELECT });
    if (user && user.id_rol === 2 && !user.instructor) {
      const ins = await this.prisma.instructor.upsert({
        where: { usuario_id: id },
        update: {},
        create: { usuario_id: id },
      });
      return { ...user, instructor: { id: ins.id } };
    }
    return user;
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

  update(id: number, data: UpdateUserDto): Promise<PublicUser> {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: PUBLIC_USER_SELECT,
    });
  }
}
