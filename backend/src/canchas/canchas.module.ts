import { Module } from '@nestjs/common';
import { CanchasController } from './canchas.controller.js';
import { CanchasRepository } from './canchas.repository.js';
import { CanchasService } from './canchas.service.js';
import { PRICING_STRATEGIES, PRICING_STRATEGY_CLASSES, PricingService } from './pricing/index.js';

@Module({
  controllers: [CanchasController],
  providers: [
    CanchasRepository,
    CanchasService,
    PricingService,
    // Strategy (RF-11): cada clase de PRICING_STRATEGY_CLASSES se registra y se inyecta como lista.
    ...PRICING_STRATEGY_CLASSES,
    {
      provide: PRICING_STRATEGIES,
      useFactory: (...estrategias: unknown[]) => estrategias,
      inject: PRICING_STRATEGY_CLASSES,
    },
  ],
  exports: [CanchasService],
})
export class CanchasModule {}
