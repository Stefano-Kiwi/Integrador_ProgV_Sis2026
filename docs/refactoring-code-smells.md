# Revisión de code smells y refactorings — FitZone Sports

**Fecha de revisión:** 19 de noviembre de 2026  
**Base analizada:** rama `main` del repositorio `Stefano-Kiwi/Integrador_ProgV_Sis2026`, commits `61652d5` (refactor de frontend) y posteriores hasta `5d7c2d3` (actualización de README).  
**Alcance:** observación estática de los archivos citados; no equivale a una auditoría exhaustiva de seguridad o una prueba de navegador.

## 1. Objetivo

Reconocer problemas de mantenibilidad (*code smells*) detectables en el código, documentar los refactorings realmente aplicados y distinguirlos de la deuda técnica pendiente. Un refactoring modifica la estructura sin cambiar el comportamiento externo esperado; integrar un endpoint o implementar una funcionalidad nueva no es, por sí solo, un refactoring.

## 2. Refactorings y mejoras estructurales aplicadas

| Problema / motivación | Cambio verificado | Archivos y evidencia | Beneficio y limitación |
| --- | --- | --- | --- |
| Responsabilidades de presentación dispersas en `pages/` | Reorganización por contexto: `frontend/src/admin/` y `frontend/src/portal/`, con actualización de imports y rutas | `frontend/src/App.tsx`; commit `61652d5` | Facilita localizar pantallas y separar la consola del portal. Mover archivos no reduce por sí solo la complejidad interna de componentes grandes. |
| Elementos de interfaz repetidos | Introducción de componentes reutilizables por Atomic Design: átomos (`Button`, `Input`, `Badge`, `Spinner`), moléculas (`FormField`, `Card`, `AlertMessage`) y organismos (`TablaDatos`, `GrillaHoraria`, `RequireAuth`) | `frontend/src/components/`; `docs/catalogo-componentes.md` | Mayor consistencia visual, menos duplicación en nuevas pantallas y componentes con contratos de props. No todas las pantallas migraron a los componentes comunes. |
| Solicitudes HTTP distribuidas en vistas | Extracción de `apiRequest<T>` y `apiRequestBlob` para concentrar URL base, JWT y errores | `frontend/src/services/apiClient.ts`; uso en `frontend/src/services/canchasService.ts`, `pagosService.ts`, `membresiasService.ts` | Menos duplicación de autenticación/errores en servicios migrados; la unificación aún es parcial. |
| Estado de sesión y selección de sede utilizado por varias pantallas | Introducción de `AppStoreProvider` con `useReducer` y hook `useAppStore` | `frontend/src/store/AppStore.tsx`, `frontend/src/main.tsx` | Fuente compartida para usuario, token, conectividad y sede; evita pasar datos por múltiples niveles de componentes. |
| Lógica de precios susceptible a condicionales crecientes | Implementación de Strategy para tarifa estándar, descuento a socio activo, recargo horario pico y tarifa de externo | `backend/src/canchas/pricing/pricing.service.ts` y `pricing/*.strategy.ts` | Extensibilidad: nuevas reglas se agregan como implementaciones; facilita testear estrategias por separado. |
| Acoplamiento de la cancelación de clases con la gestión de espera | Patrón Observer: evento de cupo liberado y promoción FIFO | `backend/src/clases/observer/cupo-liberado.subject.ts`, `lista-espera.observer.ts` | Separa la notificación/promoción de la operación principal; se prueba mediante tests de integración. |
| Acceso a Prisma mezclado con lógica de negocio | Clases de repositorio por módulo (canchas, pagos, clases, usuarios, etc.) | `backend/src/**/**.repository.ts` y servicios correspondientes | Separación entre persistencia y reglas de negocio; mejora el aislamiento de tests de servicio. |

**Evidencia de pruebas del refactor:** `.github/workflows/ci.yml` ejecuta compilación del frontend y del backend, pruebas unitarias con cobertura y pruebas e2e/concurrencia en PostgreSQL. El último CI observado para `Release 1` terminó correctamente. Esto verifica que el código compila y pasa las suites incluidas, no que todas las pantallas estén integradas ni que haya pruebas visuales automáticas.

## 3. Code smells y deuda técnica todavía presentes

### CS-01 — Duplicación de manejo de peticiones HTTP (duplicated code)

- **Ubicación:** `frontend/src/services/reservasAdminService.ts` y `frontend/src/services/pagosAdminService.ts`.
- **Evidencia:** ambos servicios emplean `fetch`, obtienen el token desde `authService`, crean la cabecera `Authorization` y traducen respuestas HTTP por cuenta propia, pese a que existe `apiClient.ts`.
- **Impacto:** errores y mensajes inconsistentes; mantenimiento repetido si cambia la política de autenticación.
- **Refactoring propuesto:** migrar estas funciones a `apiRequest<T>` con traductores específicos de errores de negocio (por ejemplo 409 en reservas); agregar pruebas sobre 401/403/409.
- **Estado:** **pendiente**, no atribuir como corrección realizada.

### CS-02 — Vistas administrativas con fuentes de datos ficticias (mock data leaking into production UI)

- **Ubicación confirmada:**
  - `frontend/src/admin/AdminMembresias.tsx`, `AdminMembresiaDetalle.tsx`, `AdminMembresiaForm.tsx` → `frontend/src/data/membresiasData.ts`.
  - `frontend/src/admin/AdminMembresiaCheckout.tsx` → `savePago` de `frontend/src/data/pagosData.ts`.
  - `frontend/src/admin/AdminReservaDetalle.tsx` y `AdminListaEspera.tsx` → `frontend/src/data/clasesCanchasData.ts`.
  - `frontend/src/admin/AdminReportes.tsx` → constantes `MOCK_*` de `frontend/src/data/reportesConfigData.ts`.
  - `frontend/src/admin/AdminInstructores.tsx`, `AdminTiposClase.tsx`, `AdminTiposCancha.tsx` → constantes `INITIAL_*` de `frontend/src/data/catalogosData.ts`.
- **Impacto:** una operación puede aparentar éxito sin modificar PostgreSQL y el usuario puede confundir datos de muestra con información real.
- **Refactoring propuesto:** separar pantallas demostrativas de pantallas operativas, conectarlas a endpoints reales cuando existan, y mostrar etiquetas claras «Datos de demostración» hasta entonces. La pantalla de reservas/listado y los módulos Canchas, Clases, Planes y Pagos ya tienen integraciones reales en otras vistas.
- **Estado:** **pendiente en los archivos enumerados**.

### CS-03 — Componentes demasiado extensos y múltiples responsabilidades (large component / long method)

- **Ubicación:** `frontend/src/admin/AdminReportes.tsx` (~672 líneas) y `frontend/src/admin/AdminReservaDetalle.tsx` (~592 líneas), en la revisión de `main`.
- **Evidencia:** combinan presentación, cálculos, formularios, filtros y manejo de modales dentro de un mismo archivo.
- **Impacto:** pruebas visuales y mantenimiento más costosos, mayor probabilidad de regresiones.
- **Refactoring propuesto:** extraer componentes (`FiltrosReportes`, `ResumenReserva`, `ModalCancelacion`) y hooks (`useReportes`, `useReservaDetalle`), conservando las reglas de negocio en servicios.
- **Estado:** **pendiente**.

### CS-04 — Reglas de negocio sensibles parcialmente confiadas a datos del cliente

- **Ubicación:** `frontend/src/portal/Pagos.tsx` permite ingresar un monto; `backend/src/pagos/pagos.service.ts` envía `dto.monto` al repositorio; `backend/src/pagos/pagos.repository.ts` lo persiste como `APROBADO`.
- **Evidencia:** en el flujo consultado no se compara el importe solicitado con el precio de la reserva o del plan, ni se bloquea explícitamente un segundo pago para el mismo origen.
- **Impacto:** se podrían generar cobros simulados de montos incorrectos o múltiples registros aprobados para la misma operación; riesgo funcional y de seguridad incluso en la demostración.
- **Mejora propuesta (más que refactoring):** derivar el monto de la base, verificar titularidad y estado del recurso, imponer unicidad/idempotencia según el modelo y agregar pruebas de denegación.
- **Estado:** **pendiente**, no afirmar que quedó resuelto.

### CS-05 — Permisos insuficientemente específicos en recursos particulares

- **Ubicación:** `backend/src/pagos/pagos.controller.ts` protege `GET /pagos` con `@Roles('Administrador','Gerente')`, pero `GET /pagos/:id`, `GET /pagos/:id/comprobante` y `POST /pagos/simular` no incluyen restricciones de rol o comprobación de titularidad en ese controlador/servicio.
- **Impacto:** la autenticación JWT no garantiza por sí sola que el usuario pueda consultar o modificar un pago ajeno.
- **Mejora propuesta:** autorización por propietario o rol para cada recurso, pruebas negativas con rol Cliente e Instructor, y revisión de permisos de la simulación.
- **Estado:** **pendiente**.

### CS-06 — Métricas de cobertura no equivalen a cobertura completa del sistema

- **Ubicación:** `backend/vitest.config.ts`.
- **Evidencia:** el reporte V8 excluye de la medición, entre otros, controladores, repositorios, DTOs, módulos y Prisma; el pipeline incluye build del frontend pero no una suite de tests visuales/e2e de navegador.
- **Impacto:** el valor de **83,90 % de statements** y **83,68 % de líneas** corresponde al alcance instrumentado, no al 83,90 % de todo el repositorio.
- **Mejora propuesta:** mantener documentadas las exclusiones, agregar tests de autorización/integración y de recorridos frontend con navegador cuando haya margen.
- **Estado:** **limitación conocida** (no invalida el CI verde).

## 4. Evaluación de resultados

La extracción de componentes, el cliente de API, el estado global y los patrones GoF redujeron duplicaciones y mejoraron la separación de responsabilidades. Sin embargo, sigue existiendo deuda en pantallas mock, componentes extensos y controles de autorización/montos. La estrategia recomendada para el cierre es **documentar explícitamente qué quedó operativo y qué es demostrativo**, evitando presentar una simulación local como transacción persistida.

## 5. Referencias y trazabilidad

- Refactor de estructura de frontend: commit `61652d5` y archivos de `frontend/src/admin`, `frontend/src/portal`.
- Catálogo de componentes: `docs/catalogo-componentes.md`.
- Cliente HTTP y estado global: `frontend/src/services/apiClient.ts`, `frontend/src/store/AppStore.tsx`.
- Patrones: `backend/src/canchas/pricing/`, `backend/src/clases/observer/` y repositorios de cada módulo.
- Cobertura y CI: `backend/vitest.config.ts`, `.github/workflows/ci.yml`, `README.md`.
- Fuentes mock: directorio `frontend/src/data/`, componentes administrativos señalados en CS-02.

**Autor responsable de revisión:** [COMPLETAR por el integrante que lo revise y entregue].
