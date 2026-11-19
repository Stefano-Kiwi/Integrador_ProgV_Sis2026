# RNF-04 — Escalabilidad (alta de nueva sede sin detener el sistema)

## Requisito
La arquitectura permite dar de alta una nueva sede en caliente (en tiempo de ejecución) sin reiniciar el servidor ni modificar código o configuración.

## Diseño e implementación
- **API stateless con persistencia relacional:** [sedes.controller.ts](../../backend/src/sedes/sedes.controller.ts) expone `POST /sedes` (protegido con `@Roles('Gerente', 'Administrador')`) que inserta la nueva sede en PostgreSQL y queda disponible de inmediato para:
  - Alta de canchas (`POST /canchas` con el nuevo `sede_id`).
  - Programación de clases (`POST /clases` con el nuevo `sede_id`).
  - Validación de acceso multi-sede (`POST /acceso/validar`), consulta de aforo (`GET /acceso/aforo/:sedeId`) y snapshot offline (`GET /acceso/sedes/:sedeId/snapshot`).
- **Carga inicial multi-sede:** [seed.mjs](../../backend/prisma/seed.mjs) carga 26 sedes activas simultáneamente.

## Evidencia ejecutada
Comando:
```powershell
cd backend
npx vitest run src/common/common-and-catalogs.spec.ts
```

Salida real (capturada el 2026-11-19):
```text
 ✓ src/common/common-and-catalogs.spec.ts (3 tests) 9ms
   ✓ SedesService: lista, busca, crea y traduce P2002 a 409
```

Ejemplo de verificación en vivo (sin reiniciar el backend):
```bash
curl -X POST http://localhost:3000/sedes \
  -H "Authorization: Bearer <TOKEN_GERENTE>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"FitZone Nueva Sede 27","direccion":"Av. Principal 100","localidad":"Concordia","aforo_maximo":90}'
```
