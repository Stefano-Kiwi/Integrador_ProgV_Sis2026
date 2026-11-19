import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './usuarios/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SedesModule } from './sedes/sedes.module.js';
import { PlanesModule } from './planes/planes.module.js';
import { ClasesModule } from './clases/clases.module.js';
import { CanchasModule } from './canchas/canchas.module.js';
import { PagosModule } from './pagos/pagos.module.js';
import { AccesoModule } from './acceso/acceso.module.js';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    SedesModule,
    PlanesModule,
    ClasesModule,
    CanchasModule,
    PagosModule,
    AccesoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 1º: verifica que haya un JWT válido
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,   // 2º: verifica que el rol sea el correcto
    },
  ],
})
export class AppModule { }
