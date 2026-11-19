# Anexo A — Portada e Índice del Dossier

Documento oficial de presentación, estructura temática, resumen ejecutivo e índice documental del Dossier Técnico correspondiente al Trabajo Integrador Final (TIF) de la cátedra de **Programación V (Ciclo Lectivo 2026)**, carrera de Licenciatura en Sistemas, Facultad de Ciencias de la Administración — Universidad Nacional de Entre Ríos.

---

<!-- ===================================================================== -->
<!--                             PORTADA                                  -->
<!-- ===================================================================== -->

<div align="center">

# UNIVERSIDAD NACIONAL DE ENTRE RÍOS
## FACULTAD DE CIENCIAS DE LA ADMINISTRACIÓN
### Licenciatura en Sistemas — Cátedra de Programación V — Año 2026

<br>

---

<br>

# TRABAJO INTEGRADOR FINAL
## Caso de Estudio: «FitZone Sports»
### *Plataforma Integral Multi-sede para la Gestión Operativa, Reservas y Acceso en Clubes y Gimnasios*

<br>

---

<br>

### **Equipo 12**

| Apellido y Nombre | Legajo | Rol | Usuario de Git |
| :--- | :---: | :--- | :---: |
| **Serantes, Matías** | 11.452 | **P1** / Arquitectura & Backend | `@matiasfs99` |
| **Carbajal, Stéfano** | 11.234 | **P2** / Base de Datos & Seguridad | `@Stefano-Kiwi` |
| **Caraballo, Ian** | 11.678 | **P3** / Frontend Core & Integración | `@iancarab` |
| **Chang, Denis** | 11.890 | **P4** / Mobile & QA | `@Sined108` |
| **Polo, Lautaro** | 11.312 | **P5** / Frontend Servicios & QA | `@politen22` |

<br>

---

<br>

### **Metadatos de Entrega**

* **Fecha de entrega:** 21 de noviembre de 2026
* **URL del repositorio:** [`https://github.com/uner-fcad-prog5/2026-tif-equipo12-fitzone`](https://github.com/uner-fcad-prog5/2026-tif-equipo12-fitzone)
* **Tag oficial de versión final:** `v1.0.0-entrega-final`
* **Hash del commit:** `6699f27` (`6699f27bdc1389620bfe4f6c320166e0658d56cd`)

</div>

<div style="page-break-after: always;"></div>
\newpage

---

<!-- ===================================================================== -->
<!--                         ÍNDICE DEL DOSSIER                           -->
<!-- ===================================================================== -->

# Índice General del Dossier

### [1. Resumen ejecutivo del sistema](#seccion-1) .......................................................................... Pág. 3
* 1.1 Declaración de propósito y problemática de negocio
* 1.2 Módulos funcionales y reglas de negocio críticas
* 1.3 Arquitectura técnica y tecnologías seleccionadas
* 1.4 Principales logros de ingeniería y métricas de calidad

### [2. Arquitectura: diagramas C4 de los niveles 1, 2 y 3](#seccion-2) ............................................ Pág. 4
* 2.1 Diagrama C4 Nivel 1: Contexto del Sistema (Actores e integraciones externas)
* 2.2 Diagrama C4 Nivel 2: Contenedores (Frontend SPA, API NestJS, PostgreSQL 18)
* 2.3 Diagrama C4 Nivel 3: Componentes del Backend (Módulos desacoplados y dependencias)
* 2.4 Justificación del enfoque Monolítico Modular frente a Microservicios

### [3. Registros de decisión arquitectónica: ADR-001 a ADR-006](#seccion-3) ............................ Pág. 8
* 3.1 ADR-001: Adopción del Monolito Modular con NestJS sobre Node.js
* 3.2 ADR-002: Base de Datos Relacional PostgreSQL 18 y Prisma ORM con migraciones DDL
* 3.3 ADR-003: Autenticación Stateless con JWT y Control de Acceso Basado en Roles (RBAC)
* 3.4 ADR-004: Patrón Strategy para liquidación dinámica de tarifas de canchas
* 3.5 ADR-005: Patrón Observer transaccional para la lista de espera de clases grupales
* 3.6 ADR-006: Credencial QR dinámica rotativa con HMAC-SHA256 y arquitectura offline-first

### [4. Modelado: clases, secuencia, estados, actividad, DER y despliegue](#seccion-4) ................. Pág. 12
* 4.1 Diagrama de Clases del dominio y capas de servicio
* 4.2 Diagramas de Secuencia (Flujo de reservas concurrentes, Liberación de cupos y Validación QR)
* 4.3 Diagramas de Estados (Ciclo de vida de Membresías y Reservas de Turnos)
* 4.4 Diagrama de Actividad (Control de acceso multi-sede y validación anti-fraude)
* 4.5 Diagrama Entidad-Relación (DER) de las 17 entidades relacionales
* 4.6 Diagrama de Despliegue en infraestructura de contenedores Docker Compose

### [5. Patrones de diseño aplicados y su justificación](#seccion-5) ................................................ Pág. 17
* 5.1 Patrón Strategy: Cálculo dinámico de tarifas de canchas deportivas
* 5.2 Patrón Adapter: Aislamiento e integración de la pasarela de pagos simulada
* 5.3 Patrón Builder: Generación estructurada de comprobantes oficiales en PDF 1.4
* 5.4 Patrón Observer: Lista de espera automática y reactiva en clases grupales
* 5.5 Patrón Repository: Aislamiento del dominio respecto al motor de persistencia

### [6. Estrategia de pruebas y reporte de cobertura](#seccion-6) ................................................... Pág. 21
* 6.1 Pirámide de pruebas automatizadas (Unitarias, Integración y Concurrencia)
* 6.2 Reporte de Cobertura con Vitest / V8 (83.90% statements, 97/97 tests en verde)
* 6.3 Pruebas de integración end-to-end de flujos completos con Supertest
* 6.4 Pruebas de estrés y concurrencia real sobre PostgreSQL (Validación de RN-01 y RN-02)

### [7. Cumplimiento de los requisitos no funcionales, con su evidencia](#seccion-7) ................. Pág. 25
* 7.1 RNF-01: Disponibilidad (99,5%) y operación offline de terminales (Snapshot y resincronización)
* 7.2 RNF-02: Seguridad en pagos (Tokenización estricta sin almacenamiento de datos PAN/CVV)
* 7.3 RNF-03: Rendimiento en consultas de disponibilidad (Índices y `EXPLAIN ANALYZE` en 0.068 ms)
* 7.4 RNF-04: Escalabilidad horizontal y alta en caliente de sedes sin downtime

### [8. Planificación: plan, cronograma, trazabilidad, seguimiento y riesgos](#seccion-8) ......... Pág. 29
* 8.1 Alcance del proyecto, supuestos y restricciones
* 8.2 Estructura de Desglose del Trabajo (EDT / WBS): 8 Épicas, 22 Historias y 66 Subtareas
* 8.3 Cronograma de los 8 Sprints de desarrollo a lo largo de 12 semanas
* 8.4 Matriz de trazabilidad bidireccional (RF-01 a RF-14, RN-01 a RN-03, RNF-01 a RNF-04)
* 8.5 Seguimiento de horas estimadas vs. trabajadas por sprint (Desvío global +4.6%)
* 8.6 Matriz de riesgos del proyecto (R-01 a R-06) y análisis de desvíos

### [9. Bitácoras individuales de los integrantes](#seccion-9) ............................................................ Pág. 35
* 9.1 Bitácora individual de Matías Serantes (P1)
* 9.2 Bitácora individual de Stéfano Carbajal (P2)
* 9.3 Bitácora individual de Ian Caraballo (P3)
* 9.4 Bitácora individual de Denis Chang (P4)
* 9.5 Bitácora individual de Lautaro Polo (P5)

### [10. Índice de los manuales entregados, con su ubicación en el repositorio](#seccion-10) ........ Pág. 41
* 10.1 Tabla cruzada de documentación técnica y manuales operativos
* 10.2 Manual de Usuario del Portal del Socio
* 10.3 Manual de Operación de la Consola de Administración y Recepción
* 10.4 Guía de Puesta en Marcha y Despliegue con Docker Compose
* 10.5 Especificación OpenAPI / Swagger UI interactivo

### [11. Anexo: Tablero del proyecto exportado](#seccion-11) ............................................................. Pág. 43
* 11.1 Registro consolidado de Historias de Usuario (`PROGV-2026-TIF-Equipo12-Registro.xlsx`)
* 11.2 Distribución de tareas por estado al cierre de Sprint 8 (100% de HU completadas en Done)

<div style="page-break-after: always;"></div>
\newpage

---

<!-- ===================================================================== -->
<!--                    DESARROLLO DE SECCIONES INICIALES                 -->
<!-- ===================================================================== -->

<a name="seccion-1"></a>
## 1. Resumen ejecutivo del sistema

**FitZone Sports** es una plataforma integral de software de nivel empresarial, diseñada e implementada bajo una arquitectura de **monolito modular** de alto rendimiento, orientada a unificar, automatizar y transformar digitalmente la operación comercial y deportiva de cadenas multi-sede de clubes y gimnasios. En el contexto actual de la industria del fitness y el deporte, las organizaciones enfrentan serios problemas de dispersión de datos, sobreventa de turnos por concurrencia no controlada, fraudes en el ingreso a las instalaciones por duplicación de credenciales y fallas operativas críticas provocadas por la pérdida transitoria de conectividad a Internet en las terminales de recepción. FitZone Sports resuelve de manera directa y sistemática cada una de estas problemáticas mediante un enfoque de ingeniería riguroso.

### Propósito y Problemática Resuelta
El sistema centraliza en un único entorno desacoplado:
1. **Control de Acceso Multi-sede Inteligente y Seguro:** Se elimina el uso de credenciales plásticas estáticas o códigos QR fijos fácilmente clonables, implementando una credencial digital en el dispositivo móvil del socio con códigos **QR dinámicos rotativos** (validez de 60 segundos con firma criptográfica HMAC-SHA256). Para mitigar caídas de conectividad en las sedes, las terminales de recepción operan bajo una arquitectura *offline-first* capaz de validar accesos contra una instantánea local (*snapshot*) de socios activos y resincronizar ingresos de manera idempotente sin generar duplicados (**RNF-01**). Adicionalmente, el sistema erradica el fraude de pases compartidos impidiendo ingresos simultáneos en sedes diferentes sin egreso previo (**RN-01**) y computa el aforo en tiempo real (**RF-05**).
2. **Reserva Automatizada de Clases Grupales y Lista de Espera Reactiva:** Gestiona el agendamiento de clases con ventanas de anticipación de 48 horas y penalidades automáticas ante cancelaciones tardías (menos de 2 horas previas, **RF-07**). Integra un mecanismo transaccional de lista de espera basado en el patrón **Observer**, el cual, ante la liberación de una vacante, promueve automáticamente al primer socio en cola bajo estricto orden de llegada (FIFO), notificándolo de inmediato (**RF-08**).
3. **Gestión de Canchas Deportivas y Concurrencia Estricta:** Permite la reserva de canchas (Pádel, Tenis y Fútbol 5) con disponibilidad horaria optimizada a nivel de base de datos para responder en sub-milisegundos (**0.068 ms, RNF-03**). Resuelve de raíz el riesgo de sobreventa concurrente mediante restricciones de unicidad parciales en PostgreSQL (**RN-02**), calculando las tarifas de forma desacoplada y transparente mediante el patrón **Strategy** (descuento del 15% para socios activos, recargos por horario pico de 18:00 a 22:00 hs y tarifas diferenciales para clientes externos, **RF-11**).
4. **Membresías, Control de Mora y Pasarela de Pagos Tokenizada:** Administra planes de cuotas periódicas bloqueando el acceso a servicios ante situaciones de morosidad (**RN-03**). Integra una pasarela de pagos simulada certificada bajo principios **PCI-DSS (RNF-02, RF-13)** que nunca almacena datos sensibles de tarjetas (PAN, CVV), operando exclusivamente con tokens opacos `tok_<hex>` y emitiendo comprobantes de pago oficiales en formato **PDF 1.4 real (RF-14)**.

### Stack Tecnológico
La solución adopta una arquitectura cliente-servidor completamente tipada de punta a punta en **TypeScript**:
* **Backend:** Construido sobre **NestJS** (Node.js), adoptando una arquitectura modular por capas con Inyección de Dependencias, Validación declarativa con DTOs (`class-validator`), contratos interactivos documentados con **OpenAPI 3.0 / Swagger UI** y seguridad JWT con bcryptjs.
* **Persistencia:** Motor relacional **PostgreSQL 18** ejecutándose en contenedores Alpine Linux, administrado a través de **Prisma ORM** complementado con migraciones DDL en SQL puro para la creación de índices parciales condicionales.
* **Frontend Web y Mobile:** Aplicación Single Page (SPA) desarrollada en **React** con **Vite**, estilizada con **Tailwind CSS** y CSS modular. Incorpora soporte PWA y acceso a cámara mediante APIs WebRTC para el escaneo de códigos QR en vivo tanto en terminales fijas como en navegadores móviles.
* **DevOps e Infraestructura:** Orquestación completa mediante **Docker Compose** y pipelines de Integración Continua (CI) en **GitHub Actions** con PostgreSQL real en cada pull request.

### Principales Logros Técnicos y Métricas de Calidad
* **Patrones de Diseño de Software:** Aplicación rigurosa de **Strategy** (precios dinámicos), **Observer** (lista de espera reactiva), **Repository** (desacoplamiento de Prisma), **Adapter** (pasarela de pagos simulada), **Builder** (comprobantes PDF) y **Guards / Decorators** (seguridad RBAC declarativa).
* **Calidad y Pruebas Automatizadas:** Suite de **97 pruebas automatizadas (100% en verde)** ejecutadas con **Vitest** y **Supertest**, alcanzando una cobertura global del **83.90%** en statements (superando con holgura el umbral académico del 70%).
* **Verificación de Concurrencia Real:** Certificación mediante pruebas de estrés sobre PostgreSQL donde 12 solicitudes simultáneas de reserva sobre el mismo turno arrojan exactamente 1 código `201 Created` y 11 códigos `409 Conflict`, garantizando no sobreventa.

<div style="page-break-after: always;"></div>
\newpage

---

<a name="seccion-10"></a>
## 10. Índice de los manuales entregados, con su ubicación en el repositorio

A continuación se detalla el índice exhaustivo de la documentación técnica, arquitectónica y operativa incorporada en el repositorio del proyecto, indicando su ruta relativa exacta y la síntesis de su contenido:

| Documento / Manual | Ubicación en el Repositorio | Audiencia Objetivo | Descripción del Contenido |
| :--- | :--- | :---: | :--- |
| **Plan de Proyecto Oficial (Anexo H)** | [`docs/planificacion/plan-de-proyecto.md`](../planificacion/plan-de-proyecto.md) | Docentes / Evaluadores / PM | Plan integral: alcance, supuestos, restricciones, equipo, EDT con 22 HUs, cronograma de 8 sprints, matriz de trazabilidad (RF-01 a 14, RN-01 a 03, RNF-01 a 04), seguimiento real y registro de riesgos. |
| **Portada e Índice del Dossier (Anexo A)** | [`docs/dossier/anexo-a-portada-e-indice.md`](anexo-a-portada-e-indice.md) | Docentes / Evaluadores | Portada académica formal, índice general paginado, resumen ejecutivo denso e índice de manuales del dossier en PDF. |
| **Guía de Despliegue y Puesta en Marcha** | [`README.md`](../../README.md) | Desarrolladores / Operadores | Instrucciones para la clonación, variables de entorno, arranque de servicios con `docker compose up --build`, credenciales de prueba del seed y ejecución de suites de pruebas. |
| **Contrato OpenAPI / Swagger UI** | [`backend/swagger.json`](../../backend/swagger.json) | Desarrolladores Frontend / API Consumers | Especificación OpenAPI 3.0 exportada con la totalidad de endpoints, esquemas DTO, parámetros, códigos de respuesta HTTP y contratos REST. |
| **Diagrama C4 Nivel 1 (Contexto)** | [`docs/diagrama-contexto.png`](../diagrama-contexto.png) | Arquitectos / Desarrolladores | Vista de alto nivel que delimita las fronteras del sistema, usuarios (Socio, Instructor, Admin, Gerente) y sistemas externos. |
| **Diagrama C4 Nivel 2 (Contenedores)** | [`docs/diagrama-containers.png`](../diagrama-containers.png) | Arquitectos / DevOps | Vista de contenedores lógicos: SPA React, Terminal Web WebRTC, API Monolito NestJS y PostgreSQL 18. |
| **Diagrama C4 Nivel 3 (Componentes)** | [`docs/diagrama-componentes.png`](../diagrama-componentes.png) | Desarrolladores Backend | Desglose modular de NestJS: AuthModule, UsersModule, MembresiasModule, AccesoModule, ClasesModule, CanchasModule, PagosModule y PrismaModule. |
| **Catálogo de Componentes UI** | [`docs/catalogo-componentes.md`](../catalogo-componentes.md) | Diseñadores / Frontend Devs | Catálogo estructurado bajo Atomic Design con la nómina de átomos, moléculas y organismos de la interfaz React y sus props. |
| **Evidencia RNF-01 (Offline y Disponibilidad)** | [`docs/rnf/RNF-01.md`](../rnf/RNF-01.md) | QA / Auditores Técnicos | Justificación técnica y comandos de prueba ejecutados para snapshot local y sincronización idempotente en terminales de acceso. |
| **Evidencia RNF-02 (Seguridad en Pagos / PCI)** | [`docs/rnf/RNF-02.md`](../rnf/RNF-02.md) | Seguridad / Auditores | Certificación de tokenización estricta sin almacenamiento de datos de tarjeta en base de datos (`pago.token_pasarela`). |
| **Evidencia RNF-03 (Rendimiento Canchas)** | [`docs/rnf/RNF-03.md`](../rnf/RNF-03.md) | DBAs / Backend Devs | Evidencia empírica de consulta de disponibilidad mediante `EXPLAIN (ANALYZE, BUFFERS)` sobre PostgreSQL (0.068 ms medidos). |
| **Evidencia RNF-04 (Escalabilidad de Sedes)** | [`docs/rnf/RNF-04.md`](../rnf/RNF-04.md) | Arquitectos / DevOps | Evidencia de alta en caliente de nuevas sedes en tiempo de ejecución sin reinicio del servidor ni caída de servicio. |
| **Manual de Usuario: Portal del Socio** | `docs/manuales/manual-portal-socio.md` *(Previsto)* | Socios y Clientes | Guía paso a paso para el registro, contratación de membresías, visualización de credencial QR dinámica, reservas de clases/canchas y descarga de PDFs. |
| **Manual de Usuario: Consola de Administración** | `docs/manuales/manual-consola-admin.md` *(Previsto)* | Recepcionistas / Admins | Guía de operación para el control de accesos con cámara WebRTC, monitoreo de aforo, contingencia offline y gestión de canchas y clases. |
| **Registro de Decisiones Arquitectónicas (ADRs)** | `docs/adr/` *(ADR-001 a ADR-008)* | Arquitectos de Software | Historial formal de decisiones técnicas tomadas por el equipo (monolito modular, índices parciales, Strategy, Observer, JWT, PDF 1.4). |
| **Tablero del Proyecto Exportado** | `docs/planificacion/PROGV-2026-TIF-Equipo12-Registro.xlsx` | Evaluadores / Cátedra | Archivo de planilla de cálculo con la exportación completa de épicas, historias de usuario, horas reales y tracking del proyecto. |

