import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MockModule } from './mock/mock.module.js';

@Module({
  imports: [MockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

