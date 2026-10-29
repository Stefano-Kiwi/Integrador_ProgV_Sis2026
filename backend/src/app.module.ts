import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SedesModule } from './sedes/sedes.module.js';
import { PlanesModule } from './planes/planes.module.js';
import { ClasesModule } from './clases/clases.module.js';
import { CanchasModule } from './canchas/canchas.module.js';
import { PagosModule } from './pagos/pagos.module.js';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

