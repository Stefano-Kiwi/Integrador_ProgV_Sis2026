import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiResponse } from '@nestjs/swagger';

@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("index")
  @ApiResponse({ status: 200, description: 'devuelve la pagina de inicio' })
  getHello(): string {
    return this.appService.getHello();
  }
}


