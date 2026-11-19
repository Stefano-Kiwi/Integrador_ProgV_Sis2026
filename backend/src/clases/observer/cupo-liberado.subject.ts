import { Injectable } from '@nestjs/common';
import type {
  CupoLiberadoEvento,
  CupoLiberadoObserver,
  PromocionListaEspera,
} from './cupo-liberado.interface.js';

/** Subject del patrón Observer (RF-08): notifica a los observadores cuando se libera un cupo. */
@Injectable()
export class CupoLiberadoSubject {
  private readonly observers: CupoLiberadoObserver[] = [];

  subscribe(observer: CupoLiberadoObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer: CupoLiberadoObserver): void {
    const idx = this.observers.indexOf(observer);
    if (idx !== -1) {
      this.observers.splice(idx, 1);
    }
  }

  async notify(evento: CupoLiberadoEvento): Promise<PromocionListaEspera[]> {
    const promociones: PromocionListaEspera[] = [];
    for (const observer of this.observers) {
      const resultado = await observer.update(evento);
      if (resultado) {
        promociones.push(resultado);
      }
    }
    return promociones;
  }
}
