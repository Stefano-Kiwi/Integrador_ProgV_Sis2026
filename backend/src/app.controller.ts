import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator.js';

@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Get('index')
  @Public()
  @ApiResponse({ status: 200, description: 'Devuelve la página de inicio' })
  getHello(): string {
    return this.appService.getHello();
  }
}


