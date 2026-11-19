# RNF-02 — Seguridad en pagos (tokenización sin almacenamiento de tarjetas)

## Requisito
Nunca se almacenan datos de tarjetas de crédito/débito localmente (ni número PAN, ni CVV, ni vencimiento); solo se guarda el token devuelto por la pasarela de pagos.

## Diseño e implementación
- **Modelo de datos (`pago` en [schema.prisma](../../backend/prisma/schema.prisma)):** únicamente define `token_pasarela VARCHAR(255)`; no existen columnas para PAN, CVV ni titular de tarjeta.
- **DTO de entrada ([simular-pago.dto.ts](../../backend/src/pagos/dto/simular-pago.dto.ts)):** solo acepta `origen_tipo`, `origen_id` y `monto`. El `ValidationPipe` global con `whitelist: true, forbidNonWhitelisted: true` ([main.ts](../../backend/src/main.ts)) rechaza cualquier propiedad no declarada.
- **Servicio de pagos ([pagos.service.ts](../../backend/src/pagos/pagos.service.ts)):** genera un token opaco `tok_<hex>` por transacción y lo guarda en `pago.token_pasarela`, incluyéndolo además en el comprobante PDF ([comprobante-pdf.service.ts](../../backend/src/pagos/comprobante-pdf.service.ts)).

## Evidencia ejecutada
Comando:
```powershell
cd backend
npx vitest run src/pagos/pagos.service.spec.ts
```

Salida real (capturada el 2026-11-19):
```text
 ✓ src/pagos/pagos.service.spec.ts (8 tests) 732ms
   ✓ debería procesar el pago de una cancha y generar el comprobante PDF real
   ✓ el token_pasarela generado debería ser único en cada llamada
   ✓ debería generar un buffer PDF 1.4 válido con concepto, cancha/horario, monto y fecha
```

Fragmento de contrato verificado en [schema.prisma](../../backend/prisma/schema.prisma):
```prisma
model pago {
  id                Int             @id @default(autoincrement())
  membresia_id      Int?
  reserva_cancha_id Int?
  monto             Decimal         @db.Decimal(10, 2)
  estado            estado_pago     @default(PENDIENTE)
  token_pasarela    String?         @db.VarChar(255)
  creado_at         DateTime        @default(now()) @db.Timestamptz(6)
  pagado_at         DateTime?       @db.Timestamptz(6)
}
```
