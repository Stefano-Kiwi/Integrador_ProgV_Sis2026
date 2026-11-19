# FitZone Sports

FitZone Sports es una plataforma web monolítica modular que unifica la gestión operativa de una cadena multi-sede de gimnasios y complejos deportivos. Permite administrar usuarios y membresías, validar ingresos multi-sede mediante códigos QR dinámicos rotativos (con soporte offline y resincronización), gestionar reservas de clases grupales con lista de espera automática (patrón Observer) y reservar canchas deportivas con tarifas dinámicas (patrón Strategy) y control estricto de concurrencia. Además integra una pasarela de pagos simulada tokenizada con emisión de comprobantes PDF reales. El sistema está construido con **NestJS + Prisma + PostgreSQL** en el backend y **React + TypeScript + Vite** en el frontend.

---

## Integrantes

| Rol | Integrante | Usuario Git |
| :--- | :--- | :--- |
| **P1** | *(Completar nombre y apellido)* | `@usuario-p1` |
| **P2** | *(Completar nombre y apellido)* | `@usuario-p2` |
| **P3** | *(Completar nombre y apellido)* | `@usuario-p3` |
| **P4** | *(Completar nombre y apellido)* | `@usuario-p4` |

---

## Puesta en marcha

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Integrador_ProgV_Sis2026
   ```
2. **Crear archivo de variables de entorno (opcional, hay valores por defecto para desarrollo local):**
   ```bash
   cp .env.example .env
   ```
3. **Levantar PostgreSQL, Backend (con migraciones y seed automáticos) y Frontend:**
   ```bash
   docker compose up --build
   ```
4. **Acceder a la aplicación:**
   * Portal del socio y Consola Admin: `http://localhost:5173` (o `https://localhost:5443` para cámara QR en móvil)
   * Documentación Swagger UI: `http://localhost:3000/api`
   * Contrato OpenAPI exportado: [`backend/swagger.json`](backend/swagger.json)
5. **Reiniciar desde cero (opcional, borrando volúmenes):**
   ```bash
   docker compose down -v && docker compose up --build
   ```

---

## Credenciales de usuarios de prueba (Seed)

El seed ([`backend/prisma/seed.mjs`](backend/prisma/seed.mjs)) carga **26 sedes**, canchas de **Paddle, Fútbol 5 y Tenis** en cada sede, clases programadas y los siguientes usuarios:

| Perfil | Rol (BD) | Email | Contraseña |
| :--- | :--- | :--- | :--- |
| Gerente central | `Gerente` | `admin@fitzone.com` | `Admin123!` |
| Recepcionista / Admin de sede (Centro) | `Administrador` | `recepcion.centro@fitzone.com` | `Recepcion123!` |
| Socio activo (membresía `ACTIVO`) | `Cliente` | `carlos.cliente@fitzone.com` | `Cliente123!` |
| Cliente externo (sin membresía) | `Cliente` | `externo@fitzone.com` | `Externo123!` |
| Socio en mora (membresía `VENCIDO`, RN-03) | `Cliente` | `mora@fitzone.com` | `Mora123!` |
| Socio con pago pendiente (`PENDIENTE_PAGO`) | `Cliente` | `ana@fitzone.com` | `MiClaveSegura1` |
| Instructor | `Instructor` | `laura.instructor@fitzone.com` | `Instructor123!` |

---

## Documentación del proyecto

| Sección | Enlace | Descripción |
| :--- | :--- | :--- |
| Decisiones de arquitectura (ADR) | [`docs/adr/`](docs/adr/) | Registro de decisiones técnicas y arquitectónicas (incl. ADR-008). |
| Diagramas de arquitectura | [`docs/`](docs/) | [Contexto](docs/diagrama-contexto.png), [Containers](docs/diagrama-containers.png), [Componentes](docs/diagrama-componentes.png) (y `docs/diagramas/` si se añaden vistas adicionales). |
| Manuales de usuario y operación | [`docs/manuales/`](docs/manuales/) | Guías de uso del portal del socio y la consola de administración. |
| Bitácoras del equipo | [`docs/bitacoras/`](docs/bitacoras/) | Seguimiento semanal de avance y decisiones del grupo. |
| Evidencia de RNF | [`docs/rnf/`](docs/rnf/) | [RNF-01](docs/rnf/RNF-01.md) (Offline), [RNF-02](docs/rnf/RNF-02.md) (Pagos), [RNF-03](docs/rnf/RNF-03.md) (Índices), [RNF-04](docs/rnf/RNF-04.md) (Escalabilidad). |
| Catálogo Atomic Design | [`docs/catalogo-componentes.md`](docs/catalogo-componentes.md) | Átomos, moléculas y organismos del frontend con sus props. |

---

## Estado de pruebas y cobertura

* **Suite unitaria backend (`cd backend && npm run test:cov`):** **11 archivos, 97/97 tests en verde**.
* **Cobertura real medida con V8 (umbral mínimo configurado: 70%):**
  * **Statements:** `83.90%`
  * **Branches:** `70.64%`
  * **Functions:** `83.15%`
  * **Lines:** `83.68%`
* **Tests de integración y concurrencia (`cd backend && npm run test:e2e`):**
  * [`backend/test/concurrencia.e2e-spec.ts`](backend/test/concurrencia.e2e-spec.ts): 12 reservas simultáneas (RN-02: exactamente 1 `201`, 11 `409`) y 2 ingresos simultáneos en sedes distintas (RN-01: exactamente 1 autorizado, 1 `409`).
  * [`backend/test/flujos.e2e-spec.ts`](backend/test/flujos.e2e-spec.ts): flujos completos de reserva+pago+PDF, clase+cancelación+Observer FIFO y QR+validación+aforo+egreso.
* **Lint y Build:** `backend` (`oxlint`: 0 errores, `nest build`: OK) y `frontend` (`oxlint`: 0 errores, `tsc -b && vite build`: OK).
* **CI:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) ejecuta lint, build, cobertura y e2e con PostgreSQL 18 en cada PR.

---

## Declaración de uso de asistentes de IA y librerías de terceros

* **Asistentes de IA:** Durante el desarrollo y cierre del trabajo integrador se utilizaron asistentes de IA (Antigravity / Gemini / Claude) como apoyo para la estructuración de módulos, implementación de patrones de diseño (Strategy, Observer, Repository), generación de pruebas automatizadas, reorganización bajo Atomic Design y revisión de documentación. Todo el código generado fue revisado, integrado y verificado por el equipo.
* **Librerías de terceros principales:**
  * **Backend:** `@nestjs/core`, `@nestjs/common`, `@nestjs/jwt`, `@nestjs/swagger`, `@prisma/client`, `prisma`, `bcryptjs`, `class-validator`, `class-transformer`, `vitest`, `@vitest/coverage-v8`, `supertest`, `oxlint`.
  * **Frontend:** `react`, `react-dom`, `react-router-dom`, `vite`, `qrcode`, `html5-qrcode`, `jsqr`, `oxlint`.
  * **Infraestructura:** `PostgreSQL 18 (Alpine)`, `Nginx (Alpine)`, `Docker / Docker Compose`, `GitHub Actions`.
