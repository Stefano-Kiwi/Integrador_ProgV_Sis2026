# Plan de proyecto — FitZone Sports — Equipo 12

Documento de planificación integral del Trabajo Integrador Final (TIF) para la cátedra de Programación V (Sistemas 2026), elaborado conforme a los lineamientos y estructura oficial del **Anexo H**.

## 1. Alcance

### 1.1 Incluido
El sistema **FitZone Sports** es una plataforma web y móvil responsive (con capacidades PWA) diseñada como un monolito modular para unificar la gestión operativa, comercial y deportiva de una cadena multi-sede de gimnasios y clubes. El alcance abarca:

1. **Gestión de Sedes y Catálogos:**
   - Alta, modificación y visualización de sedes deportivas distribuidas geográficamente.
   - Administración de disciplinas deportivas (Pádel, Fútbol 5, Tenis, Musculación, Clases Grupales).
   - Catálogo de canchas por sede y tipos de clases.
2. **Control de Acceso y Aforo en Tiempo Real (Multi-sede):**
   - Generación de credencial digital mediante código QR dinámico rotativo con validez de 60 segundos y firma criptográfica HMAC-SHA256 para evitar clonaciones.
   - Terminal de acceso para recepción/control con escaneo por cámara (WebRTC) y validación instantánea de membresía activa.
   - Soporte de operación offline en terminales de sede mediante descarga de snapshot local de socios activos y sincronización posterior idempotente por lotes (RNF-01).
   - Medición y visualización del aforo en tiempo real por sede y registro de egreso (RF-05).
   - Validación estricta anti-fraude: prohibición de ingresos activos simultáneos en múltiples sedes (RN-01).
3. **Gestión y Reserva de Clases Grupales:**
   - Programación de grilla horaria de clases con asignación de sede, sala, instructor y cupo máximo.
   - Sistema de reserva para socios con ventana de anticipación máxima de 48 horas (RF-07).
   - Cancelación de turnos con política de penalidad (cancelación sin penalidad hasta 2 horas antes de la clase).
   - Mecanismo reactivo de **Lista de Espera automática** implementado mediante el patrón de diseño **Observer**: promoción automática por orden de llegada (FIFO) del primer socio en espera ante la liberación de cupos en una misma transacción atómica (RF-08).
4. **Gestión y Reserva de Canchas Deportivas:**
   - Consulta de grilla de disponibilidad horaria optimizada con tiempos de respuesta sub-milisegundo (RNF-03).
   - Control de concurrencia real y garantía de no sobreventa ante reservas concurrentes mediante índices únicos parciales en PostgreSQL (RN-02).
   - Motor de cálculo de precios dinámicos desacoplado mediante el patrón de diseño **Strategy**: aplicación de tarifa base, descuento preferencial a socios activos (15%), recargo por franja horaria pico (18:00 a 22:00 hs) y tarifa diferencial para clientes externos (RF-11).
   - Bloqueo y habilitación de canchas por mantenimiento preventivo sin afectar compromisos previamente agendados (RF-12).
5. **Administración de Membresías y Planes:**
   - Contratación y renovación de planes de membresía.
   - Ciclo de vida de estados de membresía: `PENDIENTE_PAGO`, `ACTIVO`, `VENCIDO` y `SUSPENDIDO`.
   - Reglas de negocio de penalidad por mora: bloqueo de reservas de clases y cobro a tarifa externa para canchas ante cuotas vencidas (RN-03).
6. **Pasarela de Pagos Simulada y Facturación:**
   - Simulación segura de transacciones tokenizadas con generación de tokens opacos `tok_<hex>` sin persistir jamás números de tarjeta ni códigos de seguridad en bases de datos locales (RNF-02).
   - Generación automática y almacenamiento de comprobantes de pago oficiales en formato binario PDF 1.4 real para su posterior descarga (RF-14).
7. **Autenticación, Seguridad y Roles (RBAC):**
   - Autenticación stateless mediante JSON Web Tokens (JWT) y hash unidireccional de contraseñas con bcryptjs.
   - Control de acceso por roles en backend (`@Roles`) y frontend (Rutas protegidas): Gerente Central, Administrador/Recepcionista de Sede, Instructor y Cliente/Socio.
   - Consola web administrativa integral y Portal autoservicio del Socio.

### 1.2 Excluido
Quedan explícitamente fuera del alcance de este proyecto los siguientes aspectos, fundamentados en restricciones de tiempo, costos y naturaleza académica del TIF:

1. **Integración con pasarelas de pago reales en entornos productivos:** No se procesará dinero real ni se abrirán cuentas mercantiles productivas en procesadores como Stripe, Mercado Pago o Prisma Medios de Pago; se utiliza una pasarela simulada con arquitectura y contratos de tokenización idénticos a los estándares de la industria (PCI-DSS simulado).
2. **Aplicación móvil nativa compilada para tiendas (Google Play Store / Apple App Store):** El desarrollo de binarios nativos en Swift o Kotlin/Java queda excluido para evitar el overhead de publicación y aprobación en stores. En su lugar, el sistema se diseñó bajo estándares responsive / PWA web móvil con soporte completo de cámara WebRTC para escaneo de códigos QR.
3. **Control biométrico de acceso físico por hardware dedicado:** Se descarta la integración física con molinetes, torniquetes electrónicos y lectores de huella dactilar o reconocimiento facial por limitaciones presupuestarias y de equipamiento de laboratorio. Dicha funcionalidad es sustituida por el terminal web de recepción con validación de credenciales QR dinámicas.
4. **Facturación electrónica fiscal directa con AFIP / Entes Tributarios:** No se realiza conexión vía Web Services SOAP/REST con organismos impositivos estatales (AFIP WSFE); la plataforma emite comprobantes internos de validez comercial y deportiva en formato PDF estándar.
5. **Gestión avanzada de inventario de tienda física:** Venta de indumentaria, suplementos deportivos o cafetería no forma parte del alcance prioritario del club.

---

## 2. Supuestos y restricciones

### 2.1 Supuestos
1. **Disponibilidad y estabilidad de infraestructura de desarrollo:** Se asume la disponibilidad ininterrumpida de GitHub para control de versiones y GitHub Actions para la ejecución de pipelines de Integración Continua (CI), así como de los registros oficiales de imágenes Docker (Docker Hub).
2. **Conectividad de los integrantes del equipo:** Se da por sentado que los cinco integrantes del equipo disponen de conectividad a Internet de banda ancha estable y estaciones de trabajo aptas para ejecutar entornos virtualizados con Docker y PostgreSQL 18.
3. **Adopción de tecnologías core:** Se asume una curva de aprendizaje controlada y asimilable por parte del equipo en el uso de NestJS, Prisma ORM, Vitest y la arquitectura por capas en TypeScript.
4. **Contratos de API desacoplados:** Se presupone que el desarrollo del frontend puede progresar en paralelo al backend apoyándose en la especificación OpenAPI (Swagger) y mocks iniciales de datos.
5. **Operación de terminales offline:** Se da por sentado que los terminales de sede cuentan con almacenamiento local persistente (LocalStorage / IndexedDB) y sincronizarán sus transacciones acumuladas en cuanto recuperen conectividad a la red corporativa.

### 2.2 Restricciones
1. **Plazo de ejecución:** El proyecto debe ser completamente planificado, implementado, probado y documentado en un marco estricto de **8 Sprints** (distribuidos a lo largo de 12 semanas académicas del cuatrimestre).
2. **Capacidad del equipo:** El equipo de trabajo está restringido exactamente a **5 integrantes**, con una dedicación promedio fijada en **15 horas semanales por persona** (distribuidas en roles cruzados de liderazgo backend, frontend y aseguramiento de calidad).
3. **Tecnología impuesta por la cátedra:**
   - **Backend:** NestJS (Node.js con TypeScript), arquitectura modular organizada en Controladores, Servicios y Repositorios.
   - **Persistencia de datos:** PostgreSQL 18 desplegado sobre contenedores Docker Alpine Linux, gestionado a través de Prisma ORM.
   - **Frontend:** React (v18/v19) estructurado con TypeScript, Vite como bundler, Tailwind CSS / CSS modular, y React Router para la navegación.
   - **Pruebas y Calidad:** Suite automatizada con Vitest (unitarias) y Supertest (e2e/integración), exigiendo una cobertura de código de al menos el 70% sobre statements, branches, funciones y líneas.
4. **Patrones de diseño obligatorios:**
   - Patrón **Strategy** para la liquidación dinámica de tarifas de canchas deportivas.
   - Patrón **Observer** para la notificación y reasignación automática de turnos en lista de espera de clases.
   - Patrón **Repository** para el desacoplamiento de la lógica de negocio respecto a la capa de persistencia de Prisma.

---

## 3. Equipo

| Integrante | Rol | Horas comprometidas | Responsabilidad principal |
|---|---|---|---|
| **Matías Serantes** | Líder / Backend | 15 hs / semana | Arquitectura del backend, diseño de patrones de software (Strategy y Observer), servicios core (Canchas y Clases), motor de precios y coordinación técnica general. |
| **Stéfano Carbajal** | Líder / Backend | 15 hs / semana | Modelado entidad-relación, DDL, migraciones de Prisma, diseño de índices parciales y concurrencia (RN-01, RN-02, RNF-03), seguridad/JWT, módulo de Acceso QR y pagos tokenizados con PDF. |
| **Ian Caraballo** | Líder / Frontend | 15 hs / semana | Setup inicial de React con Vite, arquitectura de cliente HTTP con Axios/Fetch, persistencia de sesión JWT, guardas de rutas y vistas principales del Portal del Socio. |
| **Denis Chang** | Líder / Mobile-QA | 15 hs / semana | Prototipos de navegación mobile/PWA, interfaz de escaneo QR para terminales con cámara WebRTC, diseño y ejecución de pruebas unitarias backend con Vitest. |
| **Lautaro Polo** | Líder / Frontend-QA | 15 hs / semana | Vistas de la Consola de Administración (Dashboard, Sedes, Canchas, Personal), suite de integración end-to-end con Supertest, pruebas de concurrencia real y documentación técnica. |


## 4. Estructura de desglose del trabajo (EDT / WBS)

El proyecto se desglosa jerárquicamente en **8 Épicas**, compuestas por **Historias de Usuario (HU)** y sus respectivas **Subtareas técnicas**, indicando para cada nivel la estimación en horas y el responsable asignado:

### ÉPICA 1: Arquitectura Base, Persistencia y Entorno DevOps (Total: 60 hs)
*Propósito: Establecer las bases arquitectónicas, infraestructura en contenedores, pipeline de CI y modelado relacional.*

- **HU-01: Configuración del entorno de contenedores y CI/CD** (Estimación: 16 hs — Responsable: Stéfano Carbajal)
  - ST-01.1: Configuración de `docker-compose.yml` para PostgreSQL 18, backend NestJS y frontend Vite (6 hs — Stéfano Carbajal)
  - ST-01.2: Configuración de pipeline automatizado en GitHub Actions (`.github/workflows/ci.yml`) con validación de lint, test y build (6 hs — Lautaro Polo)
  - ST-01.3: Definición de variables de entorno seguras (`.env.example`) y scripts de arranque (4 hs — Denis Chang)
- **HU-02: Diseño del Modelo Relacional y Migraciones Prisma** (Estimación: 24 hs — Responsable: Stéfano Carbajal)
  - ST-02.1: Modelado de las 17 entidades en `schema.prisma` (usuarios, sedes, canchas, clases, membresías, accesos, pagos) (10 hs — Stéfano Carbajal)
  - ST-02.2: Implementación de índices únicos parciales `ux_reserva_cancha_slot` y `ux_acceso_activo_por_usuario` (8 hs — Stéfano Carbajal)
  - ST-02.3: Creación de scripts de seed inicial con 26 sedes y datos maestros de prueba (`seed.mjs`) (6 hs — Matías Serantes)
- **HU-03: Documentación de Arquitectura de Software (C4 Model y ADRs)** (Estimación: 20 hs — Responsable: Matías Serantes)
  - ST-03.1: Elaboración de diagramas de Contexto, Containers y Componentes C4 (10 hs — Matías Serantes)
  - ST-03.2: Redacción del registro de decisiones arquitectónicas (ADRs: ADR-001 a ADR-008) (6 hs — Matías Serantes)
  - ST-03.3: Configuración de Swagger / OpenAPI en NestJS (`swagger.setup.ts`) (4 hs — Ian Caraballo)

### ÉPICA 2: Módulo de Usuarios, Autenticación y Membresías (Total: 65 hs)
*Propósito: Gestionar identidades, roles de acceso y el ciclo de vida comercial de membresías de socios.*

- **HU-04: Gestión y Perfil de Usuarios (RF-01)** (Estimación: 18 hs — Responsable: Denis Chang)
  - ST-04.1: Endpoints CRUD de usuarios y diferenciación Socio vs Cliente Externo (`users.controller.ts`) (6 hs — Denis Chang)
  - ST-04.2: Lógica de negocio y repositorio de usuarios (`users.service.ts`, `users.repository.ts`) (6 hs — Denis Chang)
  - ST-04.3: Vista de perfil de usuario y edición en frontend (`Profile.tsx`, `EditProfile.tsx`) (6 hs — Ian Caraballo)
- **HU-05: Autenticación con JWT y Control de Roles (RF-02)** (Estimación: 22 hs — Responsable: Stéfano Carbajal)
  - ST-05.1: Módulo de autenticación con hash bcryptjs y emisión de JWT (`auth.service.ts`, `auth.controller.ts`) (8 hs — Stéfano Carbajal)
  - ST-05.2: Creación de guardas personalizadas `@Public()`, `@Roles()` y `JwtAuthGuard` en backend (6 hs — Matías Serantes)
  - ST-05.3: Interceptor de Axios para inyección de token Bearer y manejo de expiración 401 en frontend (8 hs — Ian Caraballo)
- **HU-06: Gestión del Ciclo de Vida de Membresías y Control de Mora (RF-02, RN-03)** (Estimación: 25 hs — Responsable: Matías Serantes)
  - ST-06.1: Endpoints para contratación, renovación y suspensión de planes (`membresias.controller.ts`) (8 hs — Matías Serantes)
  - ST-06.2: Implementación de máquina de estados (`membresias.reglas.ts`) y proceso por lote de vencimientos (9 hs — Matías Serantes)
  - ST-06.3: Componente del portal para consulta de estado de cuota y renovación de membresía (8 hs — Ian Caraballo)


### ÉPICA 3: Módulo de Acceso Multi-sede, QR Rotativo y Modo Offline (Total: 65 hs)
*Propósito: Asegurar el ingreso fluido y controlado a las sedes deportivas con alta disponibilidad.*

- **HU-07: Emisión y Rotación de Códigos QR Dinámicos (RF-04)** (Estimación: 18 hs — Responsable: Stéfano Carbajal)
  - ST-07.1: Algoritmo de generación de token firmado con HMAC-SHA256 y expiración en 60 s (`acceso.service.ts`) (8 hs — Stéfano Carbajal)
  - ST-07.2: Vista de credencial digital del socio en frontend con refresco automático de imagen QR (6 hs — Ian Caraballo)
  - ST-07.3: Tests unitarios de validación de firma y rotación temporal de tokens QR (4 hs — Denis Chang)
- **HU-08: Validación de Ingreso Multi-sede y Regla de No Doble Entrada (RF-03, RN-01)** (Estimación: 22 hs — Responsable: Stéfano Carbajal)
  - ST-08.1: Endpoint de validación de acceso `POST /acceso/validar` y verificación de membresía activa (8 hs — Stéfano Carbajal)
  - ST-08.2: Validación estricta anti-fraude RN-01 para impedir ingresos en sedes simultáneas sin egreso previo (8 hs — Stéfano Carbajal)
  - ST-08.3: Registro de egresos y cálculo de aforo en tiempo real `GET /acceso/aforo/:sedeId` (RF-05) (6 hs — Lautaro Polo)
- **HU-09: Soporte de Validación Offline y Sincronización Idempotente (RNF-01)** (Estimación: 25 hs — Responsable: Denis Chang)
  - ST-09.1: Endpoint `GET /acceso/sedes/:sedeId/snapshot` para descarga de socios autorizados (7 hs — Denis Chang)
  - ST-09.2: Endpoint `POST /acceso/sincronizar` con procesamiento idempotente y detección de conflictos (9 hs — Stéfano Carbajal)
  - ST-09.3: Implementación de almacenamiento local en frontend y fallback ante desconexión (`controlAccesoService.ts`) (9 hs — Denis Chang)


### ÉPICA 4: Módulo de Clases Grupales y Lista de Espera Observer (Total: 65 hs)
*Propósito: Administrar la oferta de clases grupales y automatizar la reasignación equitativa de vacantes.*

- **HU-10: Administración y Programación de Clases (RF-06)** (Estimación: 16 hs — Responsable: Lautaro Polo)
  - ST-10.1: Endpoints CRUD para alta de clases, horarios, instructores y salas (`clases.controller.ts`) (6 hs — Lautaro Polo)
  - ST-10.2: Pantalla administrativa de gestión de clases y grilla semanal (`admin-clases.html` / React) (6 hs — Lautaro Polo)
  - ST-10.3: DTOs y validaciones de solapamiento horario de instructores (4 hs — Matías Serantes)
- **HU-11: Reservas y Políticas de Cancelación con Penalidad (RF-07, RN-03)** (Estimación: 22 hs — Responsable: Matías Serantes)
  - ST-11.1: Endpoint `POST /clases/reserva` con validación de ventana de 48 hs previas y mora (RN-03) (8 hs — Matías Serantes)
  - ST-11.2: Endpoint de cancelación de reserva con cálculo de penalidad si resta menos de 2 hs (7 hs — Matías Serantes)
  - ST-11.3: Interfaz de usuario para reserva y cancelación de turnos desde el portal del socio (7 hs — Ian Caraballo)
- **HU-12: Lista de Espera Reactiva con Patrón Observer (RF-08)** (Estimación: 27 hs — Responsable: Matías Serantes)
  - ST-12.1: Diseño de interfaces y clases `CupoLiberadoSubject` y `ListaEsperaObserver` (10 hs — Matías Serantes)
  - ST-12.2: Encolado FIFO en base de datos y promoción atómica en cancelación de reserva (10 hs — Matías Serantes)
  - ST-12.3: Endpoint `GET /clases/mi-lista-espera` y feedback visual en el portal del socio (7 hs — Denis Chang)

---

### ÉPICA 5: Módulo de Canchas Deportivas, Concurrencia y Tarifas Strategy (Total: 75 hs)
*Propósito: Gestionar canchas de Pádel, Fútbol y Tenis, garantizando alta concurrencia y liquidación dinámica.*

- **HU-13: Catálogo, Mantenimiento y Disponibilidad de Canchas (RF-09, RF-12, RNF-03, RNF-04)** (Estimación: 24 hs — Responsable: Lautaro Polo)
  - ST-13.1: CRUD de canchas deportivas y habilitación/bloqueo por mantenimiento (`RF-12`) (7 hs — Lautaro Polo)
  - ST-13.2: Consulta de disponibilidad horaria `GET /canchas/:id/disponibilidad` optimizada con índices (9 hs — Stéfano Carbajal)
  - ST-13.3: Pantalla de administración de canchas y bloqueo de turnos para reparaciones (8 hs — Lautaro Polo)
- **HU-14: Reserva de Turnos con Control Estricto de Concurrencia (RF-10, RN-02)** (Estimación: 25 hs — Responsable: Stéfano Carbajal)
  - ST-14.1: Endpoint de reserva de turno `POST /canchas/reserva` y ciclo de vida de reserva (8 hs — Stéfano Carbajal)
  - ST-14.2: Bloqueo transaccional contra sobreventa garantizado por `ux_reserva_cancha_slot` (9 hs — Stéfano Carbajal)
  - ST-14.3: Vista de calendario interactivo de canchas para socios con selección de franjas horarias (8 hs — Ian Caraballo)
- **HU-15: Motor de Tarifas Dinámicas con Patrón Strategy (RF-11, RN-03)** (Estimación: 26 hs — Responsable: Matías Serantes)
  - ST-15.1: Definición de interfaz `PricingStrategy` y servicio orquestador `PricingService` (8 hs — Matías Serantes)
  - ST-15.2: Implementación de estrategias: `TarifaEstandar`, `DescuentoSocio` (15%), `RecargoHorarioPico` (18-22h) y `TarifaExterno` (10 hs — Matías Serantes)
  - ST-15.3: Desglose transparente de precios y descuentos aplicados en frontend (8 hs — Ian Caraballo)

---

### ÉPICA 6: Pasarela de Pagos Tokenizada y Emisión de Comprobantes PDF (Total: 50 hs)
*Propósito: Brindar una pasarela transaccional simulada con estándares de seguridad y entrega de comprobantes reales.*

- **HU-16: Procesamiento de Pagos Tokenizados (RF-13, RNF-02)** (Estimación: 24 hs — Responsable: Stéfano Carbajal)
  - ST-16.1: Creación de DTO seguro `SimularPagoDto` con filtrado estricto `forbidNonWhitelisted` (6 hs — Stéfano Carbajal)
  - ST-16.2: Servicio de pagos (`pagos.service.ts`) con generación de tokens opacos `tok_<hex>` (10 hs — Stéfano Carbajal)
  - ST-16.3: Integración de confirmación de pago para canchas y membresías (8 hs — Denis Chang)
- **HU-17: Generación Programática y Descarga de Comprobantes PDF (RF-14)** (Estimación: 26 hs — Responsable: Stéfano Carbajal)
  - ST-17.1: Motor generador de binarios en formato PDF 1.4 estándar (`comprobante-pdf.service.ts`) (12 hs — Stéfano Carbajal)
  - ST-17.2: Endpoint de descarga con cabeceras `StreamableFile` y content-type `application/pdf` (6 hs — Stéfano Carbajal)
  - ST-17.3: Integración de botón de descarga directa de comprobante en la interfaz de usuario (8 hs — Ian Caraballo)

---

### ÉPICA 7: Consola de Administración y Frontend Integral (Total: 50 hs)
*Propósito: Diseñar y conectar las vistas interactivas del portal de socios y la consola de gestión de sedes.*

- **HU-18: Portal del Socio Responsive y Navegación PWA** (Estimación: 25 hs — Responsable: Ian Caraballo)
  - ST-18.1: Maquetado del dashboard de bienvenida del socio, credencial QR y estado de membresía (9 hs — Ian Caraballo)
  - ST-18.2: Módulos de reserva de clases y visualización de posición en lista de espera (8 hs — Ian Caraballo)
  - ST-18.3: Optimización responsive mobile y compatibilidad con pantallas táctiles (8 hs — Denis Chang)
- **HU-19: Consola de Administración Central y Recepción** (Estimación: 25 hs — Responsable: Lautaro Polo)
  - ST-19.1: Panel de control de acceso para recepcionistas con escaneo QR por cámara WebRTC (9 hs — Lautaro Polo)
  - ST-19.2: Vistas de gestión de socios, estado de cuenta y morosidad (8 hs — Lautaro Polo)
  - ST-19.3: Tablero administrativo con métricas de aforo en vivo y control de canchas (8 hs — Lautaro Polo)

---

### ÉPICA 8: Aseguramiento de Calidad, Pruebas Automatizadas y Cierre (Total: 50 hs)
*Propósito: Validar el cumplimiento de umbrales de cobertura, pruebas de concurrencia y entrega de documentación.*

- **HU-20: Pruebas Unitarias y de Cobertura Backend con Vitest** (Estimación: 18 hs — Responsable: Denis Chang)
  - ST-20.1: Creación de suites unitarias para Servicios y Repositorios superando el 70% de cobertura (10 hs — Denis Chang)
  - ST-20.2: Tests específicos para estrategias de tarifas y observadores de cupo liberado (8 hs — Matías Serantes)
- **HU-21: Pruebas End-to-End de Concurrencia e Integración Real** (Estimación: 18 hs — Responsable: Lautaro Polo)
  - ST-21.1: Test de concurrencia real sobre PostgreSQL: 12 reservas simultáneas contra RN-02 (8 hs — Lautaro Polo)
  - ST-21.2: Test de doble ingreso simultáneo multi-sede contra RN-01 (5 hs — Lautaro Polo)
  - ST-21.3: Suite de flujos completos: reserva + pago + PDF y encolado FIFO (5 hs — Lautaro Polo)
- **HU-22: Consolidación Documental, Auditoría de Código y Cierre del TIF** (Estimación: 14 hs — Responsable: Matías Serantes)
  - ST-22.1: Redacción de manuales de usuario y operación del sistema en `docs/manuales/` (5 hs — Ian Caraballo)
  - ST-22.2: Elaboración de evidencias de RNF-01 a RNF-04 y catálogo Atomic Design (5 hs — Denis Chang)
  - ST-22.3: Auditoría final con oxlint, verificación de compilación limpia y release `v1.0.0` (4 hs — Matías Serantes)

**Total Horas Estimadas del Proyecto (EDT): 480 horas de trabajo.**

---

## 5. Cronograma

La ejecución del proyecto se estructuró en **8 Sprints** a lo largo de 12 semanas académicas, distribuyendo el esfuerzo en 4 sprints iniciales de 2 semanas (fases de arquitectura, cimientos y lógica pesada) y 4 sprints de 1 semana (fases de integración, aseguramiento de calidad y estabilización):

| Sprint | Fechas | Objetivo | Capacidad | Entregable de cierre |
|:---:|:---:|---|:---:|---|
| **Sprint 1** | Semanas 1 y 2 | Definición de Arquitectura, C4 Model, ADRs y Modelado de Base de Datos relacional. | 80 hs | Documento de Arquitectura, Modelo Relacional y ADRs iniciales (ADR-001 a ADR-004). |
| **Sprint 2** | Semanas 3 y 4 | Configuración de Frameworks (NestJS, Vite), Prisma ORM, DDL, Docker y Mocks iniciales. | 80 hs | `docker-compose` operativo, migraciones DDL con índices parciales, Swagger UI y Skeleton React. |
| **Sprint 3** | Semanas 5 y 6 | Lógica de Negocio Core: Módulo de Usuarios, Login con hash bcrypt, Motor de Precios Strategy y Pasarela de Pagos mock. | 80 hs | Módulo de usuarios, autenticación básica, estrategias de tarificación probadas y pasarela mock. |
| **Sprint 4** | Semanas 7 y 8 | Autenticación robusta con JWT/Guards, Endpoints CRUD completos y Lógica de Membresías. | 80 hs | API protegida con RBAC (`@Roles`), CRUDs de sedes/canchas/clases operativos y gestión de cuotas. |
| **Sprint 5** | Semana 9 | Componentes Comunes Frontend, cliente HTTP centralizado y Persistencia de Sesión. | 40 hs | Capa HTTP común con interceptor de Axios, persistencia de sesión JWT y enrutamiento protegido. |
| **Sprint 6** | Semana 10 | Integración Frontend-Backend de Módulos Core (Sedes, Clases, Canchas, Membresías y Pagos). | 40 hs | Vistas de socios y administración conectadas a la API real de NestJS sin depender de mocks. |
| **Sprint 7** | Semana 11 | Pruebas Automatizadas Unitarias, Integración End-to-End, Pruebas de Concurrencia y QA. | 40 hs | Suite con más del 80% de cobertura en Vitest, tests e2e de concurrencia en verde y corrección de bugs. |
| **Sprint 8** | Semana 12 | Cierre del TIF, Manuales de Usuario, Auditoría de RNF, Pulido Final y Release `v1.0.0`. | 40 hs | Documentación técnica completa (Anexos, RNF-01 a 04, Catálogo UI) y etiqueta de Release en Git. |

---

## 6. Matriz de trazabilidad

La siguiente matriz vincula de forma bidireccional los requisitos funcionales (**RF-01 a RF-14**), las reglas de negocio (**RN-01 a RN-03**) y los requisitos no funcionales (**RNF-01 a RNF-04**) con la historia de usuario correspondiente, sus archivos de implementación en el backend y los casos de prueba automatizados que certifican su correcto funcionamiento:

| Requisito | Descripción | Historia que lo implementa | Archivos / Componentes de Backend | Prueba que lo verifica |
|---|---|---|---|---|
| **RF-01** | Gestión y perfiles de usuarios (Socio vs Cliente Externo, alta y edición). | HU-04: Gestión y Perfil de Usuarios | `users.controller.ts`, `users.service.ts`, `users.repository.ts`, `dto/create-user.dto.ts` | Test unitario en `users.service.ts` y test de integración en `common-and-catalogs.spec.ts`. |
| **RF-02** | Gestión de membresías (contratación, renovación, estados) y autenticación JWT con roles. | HU-05 y HU-06: Autenticación y Membresías | `auth.controller.ts`, `auth.service.ts`, `membresias.controller.ts`, `membresias.service.ts`, `membresias.reglas.ts` | `auth.service.spec.ts` (login/token) y `membresias.service.spec.ts` (transiciones de estado y cálculo de vencimientos). |
| **RF-03** | Validación de acceso multi-sede: el socio puede ingresar a cualquier sede de la cadena. | HU-08: Validación de Ingreso Multi-sede | `acceso.controller.ts`, `acceso.service.ts`, `acceso.repository.ts`, `dto/validar-acceso.dto.ts` | `acceso.service.spec.ts` (test: `validarIngreso` en distintas sedes con membresía activa). |
| **RF-04** | Código QR dinámico rotativo con expiración de 60 s y firma HMAC-SHA256. | HU-07: Emisión y Rotación de QR | `acceso.controller.ts` (`GET /acceso/qr`), `acceso.service.ts` (`generarQr`, `validarTokenQr`) | `acceso.service.spec.ts` (test: emisión de QR válido por 60 s y rechazo ante firma adulterada). |
| **RF-05** | Control de ocupación y aforo por sede en tiempo real y registro de egreso. | HU-08: Aforo y Egresos | `acceso.controller.ts` (`GET /acceso/aforo/:sedeId`, `POST /acceso/egreso`), `acceso.service.ts` | `acceso.service.spec.ts` (test: ocupación actual vs aforo máximo) y `flujos.e2e-spec.ts` (Flujo 3). |
| **RF-06** | Programación y gestión administrativa de clases grupales (salas, instructores, cupos). | HU-10: Administración de Clases | `clases.controller.ts`, `clases.service.ts`, `clases.repository.ts`, `dto/create-clase.dto.ts` | `clases.service.spec.ts` (test: creación de clase y validación de superposición horaria). |
| **RF-07** | Reserva y cancelación de clases grupales (ventana de 48 hs / política de penalidad de 2 hs). | HU-11: Reservas y Cancelación | `clases.controller.ts`, `clases.service.ts`, `dto/reserva-clase.dto.ts` | `clases.service.spec.ts` (tests: rechazo fuera de ventana de 48 hs y cancelación con/sin penalidad). |
| **RF-08** | Lista de espera automática y patrón Observer: promoción FIFO atómica ante cupos liberados. | HU-12: Lista de Espera Observer | `clases/observer/cupo-liberado.subject.ts`, `lista-espera.observer.ts`, `clases.service.ts` | `lista-espera.observer.spec.ts` y `flujos.e2e-spec.ts` (Flujo 2: cancelación y promoción FIFO). |
| **RF-09** | Catálogo de canchas deportivas por sede y configuración de tipos de deporte. | HU-13: Catálogo de Canchas | `canchas.controller.ts`, `canchas.service.ts`, `canchas.repository.ts`, `dto/create-cancha.dto.ts` | `canchas.service.spec.ts` y pruebas de catálogo en `common-and-catalogs.spec.ts`. |
| **RF-10** | Grilla de disponibilidad horaria y reserva de turnos de canchas deportivas. | HU-14: Reserva de Canchas | `canchas.controller.ts`, `canchas.service.ts`, `reserva-reglas.ts`, `dto/reserva-cancha.dto.ts` | `canchas.service.spec.ts` (test: ciclo de vida de reserva) y `flujos.e2e-spec.ts` (Flujo 1). |
| **RF-11** | Cálculo de tarifas dinámicas con patrón Strategy (descuento socio 15%, hora pico, externo). | HU-15: Motor de Tarifas Strategy | `canchas/pricing/pricing.service.ts`, `descuento-socio.strategy.ts`, `recargo-horario-pico.strategy.ts`, `tarifa-externo.strategy.ts` | `strategies.spec.ts` y `pricing.service.spec.ts` (tests individuales de cada estrategia y composición combinada). |
| **RF-12** | Mantenimiento y bloqueo de canchas deportivas sin afectar reservas existentes. | HU-13: Mantenimiento Canchas | `canchas.controller.ts` (`PATCH /canchas/:id/estado`), `canchas.service.ts`, `canchas.repository.ts` | `canchas.service.spec.ts` (test: `cambiarEstado (RF-12)` valida bloqueo a nuevas reservas conservando previas). |
| **RF-13** | Pasarela de pagos simulada con tokenización estricta (`tok_<hex>`). | HU-16: Procesamiento de Pagos | `pagos.controller.ts`, `pagos.service.ts`, `pagos.repository.ts`, `dto/simular-pago.dto.ts` | `pagos.service.spec.ts` (test: generación de token opaco único por transacción y estado APROBADO). |
| **RF-14** | Emisión y descarga de comprobantes oficiales de pago en formato binario PDF 1.4 real. | HU-17: Comprobantes PDF | `pagos/comprobante-pdf.service.ts`, `pagos.controller.ts` (`GET /pagos/:id/comprobante`) | `pagos.service.spec.ts` (test: validación de cabecera `%PDF-1.4`) y `flujos.e2e-spec.ts` (descarga y stream). |
| **RN-01** | Prohibición de doble ingreso simultáneo multi-sede para un mismo socio. | HU-08: Validación Multi-sede | `acceso.service.ts`, `schema.prisma` (índice `ux_acceso_activo_por_usuario`) | `acceso.service.spec.ts` (test de traducción a 409) y `concurrencia.e2e-spec.ts` (2 ingresos simultáneos en sedes distintas). |
| **RN-02** | Control estricto de concurrencia y no sobreventa de turnos de cancha. | HU-14: Concurrencia de Turnos | `canchas.repository.ts`, `schema.prisma` (índice único parcial `ux_reserva_cancha_slot`) | `concurrencia.e2e-spec.ts` (test real: 12 reservas concurrentes resultan exactamente en 1 código 201 y 11 códigos 409). |
| **RN-03** | Restricción de servicios y cobro a tarifa externa por morosidad en membresías. | HU-06, HU-11 y HU-15 | `membresias.reglas.ts`, `clases.service.ts` (bloqueo 403), `canchas.service.ts` (tarifa externa) | `clases.service.spec.ts` (test: 403 ante membresía VENCIDO/SUSPENDIDO) y `canchas.service.spec.ts` (test: tarifa externo para socio en mora). |
| **RNF-01** | Alta disponibilidad (99,5%) y operación offline de terminales de sede con sincronización. | HU-09: Modo Offline Terminales | `acceso.controller.ts` (`/snapshot` y `/sincronizar`), `acceso.service.ts`, `controlAccesoService.ts` | `acceso.service.spec.ts` (test: snapshot de socios y sincronización idempotente sin duplicar registros). |
| **RNF-02** | Seguridad en pagos: tokenización sin persistencia de datos sensibles de tarjetas (PCI-DSS simulado). | HU-16: Pagos Tokenizados | `schema.prisma` (tabla `pago` solo almacena `token_pasarela`), `main.ts` (`ValidationPipe` whitelist) | `pagos.service.spec.ts` (inspección de entidad y rechazo de payloads con PAN/CVV). |
| **RNF-03** | Rendimiento y tiempos de respuesta sub-milisegundo en consultas de disponibilidad. | HU-13: Disponibilidad Canchas | `schema.prisma` (índices `ix_reserva_cancha_disponibilidad` y `ux_reserva_cancha_slot`), migraciones SQL | Verificación real mediante `EXPLAIN (ANALYZE, BUFFERS)` en PostgreSQL (tiempo medido: **0.068 ms**). |
| **RNF-04** | Escalabilidad horizontal y alta en caliente de sedes sin reiniciar el servidor ni downtime. | HU-01 y HU-10: Alta en Caliente | `sedes.controller.ts` (`POST /sedes`), arquitectura stateless de NestJS con pool relacional | `common-and-catalogs.spec.ts` y test en vivo con cURL de alta de sede 27 en tiempo de ejecución. |

---

## 7. Seguimiento por sprint

A continuación se detalla la comparativa entre la capacidad planificada y el esfuerzo real insumido a lo largo de los 8 Sprints de desarrollo:

| Sprint | Comprometido | Completado | Trabajado (h) | Desvío | Observación |
|:---:|:---:|:---:|:---:|:---:|---|
| **Sprint 1** | 40 hs | 40 hs | 42 hs | +2 hs | Demora menor en la definición del diagrama entidad-relación y acuerdos en la estructura del C4 Model. |
| **Sprint 2** | 40 hs | 35 hs | 45 hs | +5 hs | Complejidad inicial en la configuración de Prisma ORM con PostgreSQL 18 y el modelado de índices parciales. |
| **Sprint 3** | 40 hs | 38 hs | 40 hs | 0 hs | Ajuste correcto en los tiempos de desarrollo de la lógica de precios (Strategy) y mock de pagos. |
| **Sprint 4** | 40 hs | 32 hs | 44 hs | +4 hs | Retraso en la integración del flujo de autenticación JWT y configuración de guardas de seguridad por roles. |
| **Sprint 5** | 20 hs | 20 hs | 20 hs | 0 hs | Cumplimiento exacto de tareas en el armado de componentes comunes, interceptor de Axios y sesión en React. |
| **Sprint 6** | 20 hs | 18 hs | 22 hs | +2 hs | Incompatibilidades menores en los contratos de API resueltas entre los formularios de React y los DTOs de NestJS. |
| **Sprint 7** | 20 hs | 20 hs | 19 hs | -1 hs | Eficiencia alta en la ejecución de pruebas automatizadas con Vitest y la suite de concurrencia e2e. |
| **Sprint 8** | 20 hs | 20 hs | 20 hs | 0 hs | Cierre exitoso, generación de manuales, consolidación de bitácoras, revisión técnica y release final `v1.0.0`. |
| **TOTAL** | **260 hs** | **243 hs** | **272 hs** | **+12 hs** | **Desvío neto global de +12 hs (+4.6%)**, perfectamente absorbido dentro del buffer de dedicación del equipo. |

---

## 8. Registro de riesgos y análisis de desvíos

### 8.1 Registro de Riesgos del Proyecto

Durante el ciclo de vida del proyecto se identificaron, categorizaron y gestionaron los siguientes riesgos mediante acciones preventivas y correctivas:

| ID | Riesgo Identificado | Categoría | Probabilidad | Impacto | Nivel | Estrategia de Mitigación / Contingencia | Estado Final |
|:---:|---|:---:|:---:|:---:|:---:|---|:---:|
| **R-01** | Incompatibilidad o sobreventa de turnos bajo peticiones concurrentes simultáneas. | Técnico | Alta | Crítico | **Alto** | Implementación de índice único parcial a nivel de motor de base de datos (`ux_reserva_cancha_slot`) en PostgreSQL en lugar de validaciones solo en memoria. | **Mitigado exitosamente** (verificado en test de 12 peticiones). |
| **R-02** | Acoplamiento temprano entre frontend y backend que bloquee el avance de pantallas. | Gestión / Integración | Alta | Medio | **Medio** | Definición temprana del contrato OpenAPI/Swagger (`swagger.json`) y empleo de mocks locales en el frontend durante los primeros cuatro sprints. | **Materializado y absorbido** sin afectar entregables. |
| **R-03** | Curva de aprendizaje y fricción en la integración de Prisma ORM con tipos de NestJS. | Técnico | Media | Medio | **Medio** | Asignación de parejas de desarrollo (pair programming) entre Matías Serantes y Stéfano Carbajal en los Sprints 1 y 2. | **Mitigado y superado** en Sprint 2. |
| **R-04** | Vulnerabilidad de seguridad por almacenamiento indebido de datos de tarjetas de pago. | Seguridad / Legal | Baja | Crítico | **Alto** | Adopción estricta de tokenización simulada (RNF-02): la base de datos no contiene columnas de PAN/CVV y los DTOs filtran propiedades con `forbidNonWhitelisted`. | **Evitado por diseño** (certificado en schema.prisma). |
| **R-05** | Caída de conectividad en sedes que paralice el control de acceso en recepción. | Operacional | Media | Alto | **Alto** | Diseño de arquitectura offline-first con descarga de snapshots locales diarios y sincronización idempotente por lote (RNF-01). | **Mitigado exitosamente** (verificado con suite offline). |
| **R-06** | Degradación del rendimiento en grillas horarias de canchas por volumen de datos. | Rendimiento | Media | Medio | **Medio** | Creación de índices compuestos específicos (`ix_reserva_cancha_disponibilidad`) validados con `EXPLAIN ANALYZE` en PostgreSQL (0.068 ms). | **Controlado y optimizado** (RNF-03). |

---

### 8.2 Análisis de Desvíos

#### Dónde estimamos mal y por qué
Las principales desviaciones de estimación se concentraron en el **Sprint 2 (+5 hs)** y el **Sprint 4 (+4 hs)**:
1. **Modelado y restricciones en Prisma ORM (Sprint 2):** Se subestimó la complejidad de sincronizar tipos generados automáticamente con las 17 entidades de PostgreSQL, en particular la sintaxis y soporte nativo de Prisma para *índices únicos parciales condicionales* (`WHERE "estado" <> 'CANCELADA'`). Esto demandó la creación manual de migraciones en SQL puro (`migration.sql`) y pruebas directas de introspección, requiriendo 5 horas adicionales de dedicación técnica.
2. **Autenticación robusta y RBAC (Sprint 4):** La orquestación de la estrategia Passport con JWT, decoradores personalizados (`@CurrentUser`, `@Roles`), metadata reflection (`Reflector`) y guardas jerárquicas demandó 4 horas por encima de lo proyectado para contemplar correctamente la verificación de permisos en endpoints públicos y administrativos.

#### Qué riesgo se materializó y cómo se absorbió
El riesgo **R-02 (Acoplamiento e incompatibilidad en contratos de API)** se materializó de forma parcial hacia el cierre del **Sprint 6 (+2 hs)**, cuando al conectar las vistas de React con los endpoints reales de NestJS surgieron discrepancias menores de nombres de propiedades (por ejemplo, diferencias entre snake_case de base de datos y camelCase en DTOs, como `cancha_id` vs `canchaId`, y formatos de fecha ISO en la disponibilidad horaria).
- **Mecanismo de absorción:** Se resolvió rápidamente aprovechando la especificación OpenAPI (`swagger.json`) como única fuente de la verdad, incorporando `class-transformer` en el backend para estandarizar la serialización y adaptando los servicios de Axios en el frontend mediante funciones mapeadoras limpias, absorbiéndose el desvío dentro del fin de semana de estabilización del sprint.

#### Qué replanificaríamos si empezáramos de nuevo
En caso de reiniciar el proyecto desde su concepción, el equipo aplicaría las siguientes lecciones aprendidas:
1. **Adopción de un enfoque API-First estricto desde el Día 1:** Diseñaríamos y congelaríamos el esquema OpenAPI (`swagger.json`) de forma previa a cualquier línea de código, permitiendo generar automáticamente los tipos de TypeScript tanto para el backend como para el cliente React mediante herramientas como `openapi-typescript-codegen`, suprimiendo de raíz cualquier discrepancia de contratos.
2. **Definición de migraciones SQL desde el inicio para restricciones avanzadas:** En lugar de intentar modelar restricciones condicionales complejas exclusivamente desde la DSL de Prisma, programaríamos las migraciones DDL directamente en SQL para índices parciales y triggers desde el Sprint 1.
3. **Pacing uniforme de sprints:** Estableceríamos una cadencia uniforme de sprints semanales de 40 hs desde el comienzo, en vez de alternar bloques de dos semanas (80 hs) y una semana (40 hs), facilitando un flujo de integración continua más regular.
