# RNF-01 — Disponibilidad (99,5%) y operación offline del terminal de sede

## Requisito
El terminal de sede debe poder validar códigos QR contra su copia local aunque caiga la conexión al servidor central y sincronizar los ingresos de forma idempotente al recuperar conexión.

## Diseño e implementación
- **Snapshot local:** `GET /acceso/sedes/:sedeId/snapshot` ([acceso.controller.ts](../../backend/src/acceso/acceso.controller.ts)) entrega al terminal el subconjunto mínimo de socios con membresía `ACTIVO` de toda la red (soporte multi-sede RF-03).
- **Resincronización idempotente:** `POST /acceso/sincronizar` ([acceso.service.ts](../../backend/src/acceso/acceso.service.ts)) recibe un lote `{ ingresos: [{ userId, sedeId, timestamp, qrToken }] }`, verifica firma HMAC-SHA256, evita duplicados por `(usuario_id, sede_id, ingreso_at)` y reporta `aceptados` (con bandera `duplicado`) y `conflictos` (p. ej. RN-01).
- **Fallback local en frontend:** [controlAccesoService.ts](../../frontend/src/services/controlAccesoService.ts) consulta el backend y cae a copia local ante error de red.

## Evidencia ejecutada
Comando:
```powershell
cd backend
npx vitest run src/acceso/acceso.service.spec.ts
```

Salida real (capturada el 2026-11-19):
```text
 ✓ src/acceso/acceso.service.spec.ts (13 tests) 777ms
   ✓ debería emitir un QR firmado válido por 60 s y rotarlo al minuto siguiente
   ✓ RNF-01: sincronización idempotente no duplica al reenviar y reporta conflictos
   ✓ RNF-01: debería devolver el snapshot de socios activos para validación offline
```
