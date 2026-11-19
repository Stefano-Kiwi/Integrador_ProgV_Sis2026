# MANUAL TÉCNICO — FITZONE SPORTS

**Trabajo Integrador Final — Programación V**  
**Universidad Nacional de Entre Ríos**  
**Facultad de Ciencias de la Administración**  
**Licenciatura en Sistemas — Ciclo lectivo 2026**

**Equipo:** 12  
**Proyecto:** FitZone Sports  
**Versión documental:** 1.0  
**Fecha de revisión:** 19 de noviembre de 2026  
**Repositorio:** https://github.com/Stefano-Kiwi/Integrador_ProgV_Sis2026  
**Código de referencia:** rama `main`, commit `c3de791c5266a116533e883aea503969b79e726c`

**Integrantes:** Ian Caraballo, Stéfano Carbajal Budón, Denis Chang, Lautaro Polo y Matías Serantes.

---

## Introducción

FitZone Sports es una plataforma informática diseñada para gestionar las operaciones de una cadena de gimnasios y complejos deportivos con múltiples sedes.

La aplicación integra la administración de usuarios y membresías, la generación y validación de credenciales QR, el control de acceso, la organización de clases grupales, la reserva de canchas deportivas y la gestión de pagos simulados.

El sistema cuenta con dos interfaces principales: un portal web responsive destinado a los socios y clientes, y una consola administrativa orientada al personal de las sedes.

### Objetivo del manual

El objetivo de este manual es proporcionar la información técnica necesaria para comprender, mantener, probar, desplegar y extender el sistema.

Está dirigido a desarrolladores, responsables de mantenimiento, evaluadores técnicos y futuros integrantes del proyecto.

El documento describe la arquitectura implementada, las tecnologías seleccionadas, el modelo de datos, los patrones de diseño utilizados, las decisiones técnicas relevantes y los procedimientos para incorporar nuevas funcionalidades.

### Alcance y criterio de verificación

Las descripciones se basan en los archivos disponibles en el repositorio indicado. Se distingue entre:

- **Implementado:** funcionalidad identificada directamente en el código fuente.
- **Documentado:** funcionalidad cuyo diseño se explica en los artefactos existentes.
- **Pendiente de verificación:** funcionalidad o resultado que requiere ejecutar pruebas sobre la versión final.
- **Limitación conocida:** comportamiento que todavía no cumple íntegramente el objetivo previsto.

Esta distinción permite utilizar el manual como referencia de mantenimiento sin confundir funcionalidades existentes con mejoras propuestas.

---

# 1. Visión arquitectónica, diagramas C4 e índice de ADR

## 1.1 Arquitectura general

FitZone Sports utiliza una arquitectura de **monolito modular** en el backend y una aplicación web de página única (SPA) en el frontend.

El monolito modular concentra la API y las reglas del negocio en una única aplicación ejecutable, pero separa las responsabilidades mediante módulos funcionales.

Se eligió este enfoque para facilitar el desarrollo y la integración de funcionalidades relacionadas que comparten información, transacciones y reglas de negocio.

Frente a una arquitectura distribuida de microservicios, un monolito modular simplifica la coordinación transaccional, la configuración del entorno y el despliegue inicial. Como contrapartida, los módulos comparten el ciclo de despliegue y parte de la infraestructura.

La aplicación está organizada en tres capas principales:

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Presentación | React, TypeScript, Vite | Interfaz del socio y consola administrativa |
| Aplicación y negocio | Node.js, NestJS, TypeScript | API REST, autenticación, reglas de negocio y coordinación de operaciones |
| Persistencia | PostgreSQL, Prisma ORM | Almacenamiento relacional, integridad de datos, transacciones e índices |

Nginx sirve los archivos compilados del frontend y funciona como proxy inverso para las solicitudes dirigidas al backend.

## 1.2 Tecnologías utilizadas

### Backend

- **Node.js:** entorno de ejecución del servidor.
- **NestJS:** framework para organizar controladores, servicios, módulos e inyección de dependencias.
- **TypeScript:** tipado estático y organización del código.
- **Prisma ORM:** acceso tipado a la base de datos y administración de migraciones.
- **PostgreSQL:** motor relacional de persistencia.
- **JWT:** autenticación de solicitudes.
- **bcryptjs:** verificación de contraseñas mediante hashes.
- **class-validator y class-transformer:** validación y transformación de datos recibidos.
- **Swagger / OpenAPI:** documentación del contrato HTTP.
- **Vitest y Supertest:** pruebas unitarias e integración.

### Frontend

- **React:** construcción de interfaces mediante componentes.
- **TypeScript:** definición de contratos de datos y props.
- **Vite:** servidor de desarrollo y compilación.
- **React Router:** navegación entre vistas.
- **Context API y useReducer:** estado compartido de la aplicación.
- **Fetch API:** comunicación con el backend.
- **html5-qrcode:** lectura de códigos QR mediante cámara.
- **Nginx:** publicación de los archivos estáticos compilados.

### Infraestructura

- Docker y Docker Compose.
- PostgreSQL 18.
- Git y GitHub.
- GitHub Actions.

Las versiones exactas utilizadas en una instalación concreta dependen del lockfile y de las imágenes Docker disponibles en el momento de la construcción.

## 1.3 Organización del sistema

La estructura principal del repositorio es:

```text
Integrador_ProgV_Sis2026/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.mjs
│   ├── src/
│   │   ├── acceso/
│   │   ├── auth/
│   │   ├── canchas/
│   │   ├── clases/
│   │   ├── common/
│   │   ├── pagos/
│   │   ├── planes/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── sedes/
│   │   ├── swagger/
│   │   └── usuarios/
│   └── test/
│
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── portal/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── services/
│   │   └── store/
│   ├── Dockerfile
│   └── nginx.conf
│
├── docs/
│   ├── diagramas/
│   ├── manuales/
│   ├── planificacion/
│   ├── rnf/
│   └── refactoring-code-smells.md
│
└── .github/
    └── workflows/
        └── ci.yml
```

## 1.4 Flujo general de una solicitud

El recorrido típico de una operación es el siguiente:

```text
Usuario
   |
   v
React / TypeScript
   |
   v
Servicio HTTP del frontend
   |
   v
Nginx / Proxy inverso
   |
   v
Controlador NestJS
   |
   v
Servicio de negocio
   |
   v
Repositorio Prisma
   |
   v
PostgreSQL
```

El controlador recibe la solicitud y delega las reglas de negocio al servicio correspondiente.

Los servicios utilizan repositorios para realizar consultas y modificaciones en la base de datos.

La respuesta recorre el camino inverso hasta llegar a la interfaz de usuario.

La lógica de negocio debe permanecer en el backend, de manera que las restricciones sigan siendo válidas aunque se manipulen las solicitudes HTTP.

## 1.5 Modelado C4

El proyecto dispone de diagramas C4 para representar la arquitectura desde distintos niveles de abstracción.

### C4 — Nivel 1: Contexto

Representa FitZone Sports dentro de su entorno y las interacciones con usuarios y servicios externos.

Archivo:

[01-c4-nivel1-contexto.svg](../diagramas/01-c4-nivel1-contexto.svg)

### C4 — Nivel 2: Contenedores

Representa los componentes ejecutables principales: frontend, API, base de datos y terminal de acceso.

Archivo:

[02-c4-nivel2-contenedores.svg](../diagramas/02-c4-nivel2-contenedores.svg)

### C4 — Nivel 3: Componentes del módulo Canchas

Permite identificar las responsabilidades del servicio de canchas, el cálculo de precios y la persistencia.

Archivo:

[03-c4-nivel3-canchas.svg](../diagramas/03-c4-nivel3-canchas.svg)

### C4 — Nivel 3: Componentes del módulo Acceso

Representa el proceso de validación de ingresos, control de QR y componentes vinculados a la operación offline.

Archivo:

[04-c4-nivel3-acceso.svg](../diagramas/04-c4-nivel3-acceso.svg)

Cada diagrama tiene su correspondiente fuente editable en formato `.mmd`, dentro de `docs/diagramas/`.

## 1.6 Decisiones arquitectónicas — ADR

Las decisiones arquitectónicas deben documentarse mediante registros ADR (*Architecture Decision Record*).

El conjunto exigido comprende:

| ADR | Tema |
|---|---|
| ADR-001 | Monolito modular frente a arquitecturas alternativas |
| ADR-002 | Elección del motor de base de datos relacional |
| ADR-003 | Estrategia de operación offline |
| ADR-004 | Control de concurrencia en reservas |
| ADR-005 | Framework backend, IoC y ORM |
| ADR-006 | Framework frontend y gestión de estado |
| ADR-007 | Sincronización del terminal de sede |
| ADR-008 | Estrategia de pruebas y cobertura |
| ADR-009 | Despliegue, contenerización y reversión |
| ADR-010 | Tokenización y tratamiento de pagos |

**Estado documental:** al momento de analizar el commit de referencia, estos archivos todavía no estaban publicados en `docs/adr/`. Sus referencias deberán incorporarse cuando el equipo suba los documentos definitivos.

Los ADR complementan este manual: explican las alternativas consideradas y las consecuencias de las decisiones, mientras que aquí se describe principalmente la implementación resultante.

---

# 2. Los cinco módulos funcionales y sus responsabilidades

La organización funcional de FitZone Sports comprende cinco módulos principales. Además, existen módulos transversales de autenticación, sedes, planes y persistencia.

## 2.1 Módulo M1 — Usuarios y membresías

**Ubicación:** `backend/src/usuarios/`

Este módulo gestiona la información de usuarios, perfiles y relaciones con los planes de membresía.

Sus responsabilidades incluyen:

- Registro de usuarios.
- Consulta y modificación de perfiles.
- Asociación de usuarios con roles.
- Asociación de usuarios con una sede base.
- Contratación de membresías.
- Renovación de membresías.
- Suspensión y consulta de estados.
- Determinación de la condición de socio o cliente externo.

### Modelo de roles

Los roles identificados en el sistema son:

| ID | Rol |
|---|---|
| 1 | Cliente |
| 2 | Instructor |
| 3 | Gerente |
| 4 | Administrador |

El identificador de rol se almacena en `usuario.id_rol` y referencia la tabla `rol`.

Los usuarios también pueden tener una asociación con una sede mediante el campo `sede_base_id`.

### Estados de membresía

El modelo define los estados:

- `PENDIENTE_PAGO`
- `ACTIVO`
- `VENCIDO`
- `SUSPENDIDO`

Estos estados determinan la posibilidad de ingresar a instalaciones, reservar clases y obtener determinados beneficios tarifarios.

Una membresía activa permite acceder a las funcionalidades reservadas a socios habilitados.

Los clientes externos y los socios sin membresía activa no reciben el descuento destinado a socios activos al reservar canchas.

### Archivos relevantes

- `usuarios/users.controller.ts`
- `usuarios/users.service.ts`
- `usuarios/users.repository.ts`
- `usuarios/membresias/membresias.controller.ts`
- `usuarios/membresias/membresias.service.ts`
- `usuarios/membresias/membresias.repository.ts`

## 2.2 Módulo M2 — Control de acceso

**Ubicación:** `backend/src/acceso/`

Este módulo administra la generación de credenciales QR y el registro de ingresos y egresos.

Sus principales responsabilidades son:

- Generar códigos QR temporales.
- Verificar firmas y vencimientos de QR.
- Validar el estado de la membresía.
- Registrar el ingreso de un usuario a una sede.
- Evitar ingresos simultáneos activos.
- Registrar egresos.
- Consultar aforo.
- Proveer información para operación offline.
- Sincronizar registros generados sin conexión.

### Código QR dinámico

El código QR utiliza un contenido firmado mediante HMAC-SHA256.

El token incorpora información sobre el usuario y una ventana temporal de validez.

El backend genera códigos válidos durante ventanas de 60 segundos, impidiendo reutilizar normalmente un código después de su vencimiento.

### Acceso multi-sede

Un socio con membresía activa puede ingresar en una sede distinta de su sede base.

Sin embargo, no puede mantener dos accesos abiertos simultáneamente.

Esta regla se implementa en la lógica de negocio y se respalda mediante una restricción de unicidad en PostgreSQL.

### Aforo

El aforo actual se obtiene contando los accesos de una sede cuyo campo `egreso_at` permanece en `NULL`.

Ese valor se compara con `sede.aforo_maximo`.

### Archivos relevantes

- `acceso/acceso.controller.ts`
- `acceso/acceso.service.ts`
- `acceso/acceso.repository.ts`

## 2.3 Módulo M3 — Clases grupales

**Ubicación:** `backend/src/clases/`

Administra las clases programadas y su participación.

Sus funciones incluyen:

- Consulta de clases.
- Programación de actividades.
- Asociación con sede, instructor y disciplina.
- Capacidad máxima y cupos disponibles.
- Reserva de plazas.
- Cancelación de reservas.
- Lista de espera.
- Promoción automática cuando se libera un cupo.

### Reserva de clases

Al solicitar una reserva se comprueba el estado de la membresía y la disponibilidad temporal.

El servicio establece un período máximo de anticipación de 48 horas.

Si existen cupos, se registra una reserva confirmada.

Si la clase está completa, el usuario puede incorporarse a la lista de espera.

### Cancelaciones

La cancelación sin penalidad está permitida hasta dos horas antes del comienzo de la clase.

Cuando se cancela una reserva, se libera el cupo y se ejecuta el mecanismo de lista de espera.

### Patrón Observer

La promoción automática de participantes se implementa utilizando Observer. El mecanismo se describe detalladamente en la sección 4.2.

### Archivos relevantes

- `clases/clases.controller.ts`
- `clases/clases.service.ts`
- `clases/clases.repository.ts`
- `clases/observer/`

## 2.4 Módulo M4 — Canchas deportivas

**Ubicación:** `backend/src/canchas/`

Este módulo administra las instalaciones deportivas y las reservas de turnos.

Sus responsabilidades son:

- Consultar canchas por sede.
- Registrar nuevas canchas.
- Consultar disponibilidad.
- Obtener el precio de los turnos.
- Registrar reservas.
- Aplicar descuentos y recargos.
- Evitar la sobreventa.
- Cancelar reservas.
- Habilitar o inhabilitar canchas por mantenimiento.

### Disponibilidad

El sistema construye una grilla de franjas horarias.

En el código revisado, los turnos tienen una duración de una hora y se generan desde las 08:00 hasta las 23:00, sin incluir un turno que comience a las 23:00.

Cada franja se informa como libre, ocupada o en mantenimiento.

### Precio dinámico

El módulo utiliza estrategias de precio intercambiables para aplicar la tarifa estándar, descuentos y recargos.

### Concurrencia

La no sobreventa se garantiza mediante un índice único parcial definido directamente en PostgreSQL.

### Estados de cancha

Una cancha puede encontrarse en:

- `HABILITADA`
- `EN_MANTENIMIENTO`

El cambio a mantenimiento impide nuevas reservas sin modificar automáticamente las reservas existentes.

### Archivos relevantes

- `canchas/canchas.controller.ts`
- `canchas/canchas.service.ts`
- `canchas/canchas.repository.ts`
- `canchas/reserva-reglas.ts`
- `canchas/pricing/`

## 2.5 Módulo M5 — Pagos y comprobantes

**Ubicación:** `backend/src/pagos/`

Este módulo registra pagos simulados asociados a membresías y reservas deportivas.

Sus responsabilidades incluyen:

- Identificar el origen del pago.
- Registrar su importe y estado.
- Simular una confirmación.
- Generar un token de pasarela.
- Actualizar la entidad correspondiente.
- Emitir comprobantes descargables.

### Tokenización simulada

La implementación genera tokens utilizando bytes aleatorios del módulo criptográfico de Node.js.

Los tokens presentan un formato similar a `tok_<identificador>`.

Este procedimiento representa una operación de tokenización, pero **no equivale a una integración real con una pasarela bancaria**.

La aplicación no necesita almacenar números de tarjeta para completar los flujos simulados.

### Comprobantes PDF

El servicio `ComprobantePdfService` genera documentos en formato PDF 1.4.

Los comprobantes incluyen información del pago, concepto, monto, fecha y token.

Los archivos se guardan en `storage/comprobantes/`.

El sistema también puede regenerar el contenido del comprobante cuando el archivo físico no se encuentra disponible.

### Archivos relevantes

- `pagos/pagos.controller.ts`
- `pagos/pagos.service.ts`
- `pagos/pagos.repository.ts`
- `pagos/comprobante-pdf.service.ts`

## 2.6 Módulos transversales

### Autenticación

El módulo `auth/` valida las credenciales de los usuarios y genera JWT.

### Sedes

El módulo `sedes/` administra la información de sucursales y sus capacidades.

### Planes

El módulo `planes/` administra los planes de membresía disponibles.

### Seguridad

El directorio `common/guards/` contiene mecanismos de autenticación y autorización.

### Persistencia

El módulo `prisma/` centraliza la conexión con la base de datos.

## 2.7 Arquitectura del frontend

El frontend divide sus pantallas por contexto:

- `src/portal/`: portal del socio.
- `src/admin/`: consola administrativa.
- `src/layouts/`: estructuras de navegación y presentación.
- `src/components/`: componentes reutilizables.
- `src/services/`: comunicación HTTP.
- `src/store/`: estado compartido.

El proyecto utiliza una organización inspirada en Atomic Design.

En `components/atoms/` se encuentran componentes pequeños como botones, entradas, etiquetas y elementos de carga.

Los componentes más complejos se agrupan en moléculas y organismos.

### Cliente HTTP

El archivo `src/services/apiClient.ts` centraliza parte de la comunicación con la API.

Su función principal `apiRequest<T>`:

1. Construye la URL usando el prefijo `/backend`.
2. Recupera el token almacenado.
3. Agrega el encabezado `Authorization` cuando corresponde.
4. Serializa los datos enviados.
5. Interpreta los errores HTTP.
6. Devuelve una respuesta tipada.

Existe además `apiRequestBlob` para descargar contenido binario, como comprobantes PDF.

### Estado global

`src/store/AppStore.tsx` utiliza React Context y `useReducer`.

El estado compartido incluye:

- Usuario autenticado.
- Token de sesión.
- Indicador de carga.
- Sede seleccionada.
- Conectividad.
- Acciones para refrescar o cerrar la sesión.

### Seguridad del frontend

La interfaz dispone de protección de rutas y controles basados en roles.

Sin embargo, estas validaciones no constituyen una garantía de seguridad por sí mismas: el backend debe repetir las comprobaciones para cada operación protegida.

---

# 3. Modelo de datos y convenciones de persistencia

## 3.1 Motor y ORM

El sistema utiliza PostgreSQL como base de datos relacional y Prisma ORM como tecnología de acceso.

El esquema principal se encuentra en:

`backend/prisma/schema.prisma`

Este archivo define las tablas, relaciones, tipos enumerados e índices que Prisma puede representar.

Las migraciones se almacenan en:

`backend/prisma/migrations/`

## 3.2 Entidades principales

| Entidad | Responsabilidad |
|---|---|
| `rol` | Identifica los roles de usuario |
| `sede` | Representa las sucursales |
| `usuario` | Almacena identidad, perfil y rol |
| `credencial_qr` | Mantiene la información asociada a credenciales |
| `plan_membresia` | Define planes comerciales |
| `membresia` | Relaciona usuarios y planes |
| `acceso` | Registra ingresos y egresos |
| `tipo_clase` | Catálogo de disciplinas grupales |
| `instructor` | Perfil de instructor asociado a un usuario |
| `clase` | Programación de actividades |
| `reserva_clase` | Reservas confirmadas o canceladas |
| `lista_espera_clase` | Solicitudes pendientes de cupo |
| `tipo_cancha` | Catálogo de disciplinas deportivas |
| `cancha` | Instalaciones disponibles |
| `reserva_cancha` | Reservas de turnos deportivos |
| `pago` | Operaciones de pago |
| `comprobante` | Comprobantes emitidos |

## 3.3 Relaciones principales

Un usuario pertenece a un rol y puede estar asociado a una sede base.

Una sede puede tener múltiples canchas, clases y registros de acceso.

Una membresía vincula un usuario con un plan.

Una clase pertenece a una sede, tiene un tipo de clase y está asignada a un instructor.

Una reserva de clase relaciona a un usuario con una clase.

Una cancha pertenece a una sede y a un tipo de cancha.

Una reserva de cancha pertenece a una cancha y a un usuario.

Un pago puede corresponder a una membresía o a una reserva de cancha.

Un comprobante está asociado a un pago.

Estas relaciones permiten reconstruir los recorridos funcionales desde la identidad del usuario hasta los servicios contratados y los movimientos registrados.

## 3.4 Claves e índices

Las tablas utilizan identificadores enteros como claves primarias.

Las relaciones se representan mediante claves foráneas.

Por ejemplo:

```prisma
model cancha {
  id             Int     @id @default(autoincrement())
  sede_id        Int
  tipo_cancha_id Int
  nombre         String  @db.VarChar(100)
  costo_hora     Decimal @db.Decimal(10, 2)

  @@unique([sede_id, nombre])
}
```

Este fragmento resume campos y la restricción de unicidad relevantes; el modelo completo incluye otras propiedades y relaciones.

La restricción evita que una sede tenga dos canchas con el mismo nombre.

El esquema también declara índices para consultas frecuentes, como reservas por cancha, fecha y horario.

## 3.5 Restricciones SQL especiales

Existen reglas que requieren índices únicos parciales, implementados mediante SQL.

Por ejemplo:

```sql
CREATE UNIQUE INDEX "ux_reserva_cancha_slot"
ON "reserva_cancha"("cancha_id", "fecha", "hora_inicio")
WHERE "estado" <> 'CANCELADA';
```

Esta restricción impide que existan dos reservas activas para una misma cancha, fecha y hora.

Las reservas canceladas no bloquean permanentemente el turno.

También se define:

```sql
CREATE UNIQUE INDEX "ux_acceso_activo_por_usuario"
ON "acceso"("usuario_id")
WHERE "egreso_at" IS NULL;
```

Este índice impide que un usuario tenga simultáneamente dos registros de ingreso sin egreso.

Estas reglas están documentadas en la migración:

`backend/prisma/migrations/20261118000000_indices_parciales_y_disponibilidad/migration.sql`

Es importante conservar estas migraciones: no alcanza con reconstruir únicamente los modelos del archivo Prisma.

## 3.6 Convenciones de persistencia

El proyecto adopta las siguientes convenciones:

- Nombres de entidades y columnas en `snake_case`.
- Identificadores enteros autoincrementales.
- Referencias mediante claves foráneas.
- Fechas con tipos temporales de PostgreSQL.
- Importes monetarios con tipos decimales.
- Estados definidos mediante enumeraciones.
- Consultas y escrituras encapsuladas principalmente en repositorios.
- Transacciones para operaciones que deben mantenerse consistentes.

Los campos monetarios se representan mediante `Decimal` en Prisma para evitar utilizar tipos de coma flotante como almacenamiento principal de importes.

## 3.7 Migraciones y datos de prueba

Prisma permite aplicar las migraciones registradas:

```bash
cd backend
npm run db:migrate
```

Para generar el cliente Prisma:

```bash
npx prisma generate
```

Para cargar los datos de demostración:

```bash
npm run seed
```

El archivo `seed.mjs` crea 26 sedes de prueba, tipos de canchas, canchas, clases, usuarios y otras entidades necesarias para demostrar los recorridos funcionales.

Utiliza operaciones `upsert` para evitar duplicaciones de determinados registros cuando se ejecuta nuevamente.

**Advertencia:** el seed incluye credenciales de demostración y puede restablecer contraseñas de usuarios de prueba. No debe utilizarse indiscriminadamente sobre una base de datos de producción.

## 3.8 Diagrama entidad-relación

El DER físico se encuentra en:

[12-der-fisico.svg](../diagramas/12-der-fisico.svg)

Su fuente editable está disponible como:

`docs/diagramas/12-der-fisico.mmd`

---

# 4. Patrones de diseño aplicados y su ubicación en el código

Los patrones de diseño permiten reutilizar soluciones reconocidas para problemas frecuentes.

El proyecto utiliza explícitamente Strategy, Observer y Repository.

También aprovecha mecanismos de creación e inyección de objetos proporcionados por NestJS.

## 4.1 Strategy — Precio dinámico de canchas

### Problema

El precio de una reserva puede variar según el horario y la situación del usuario.

Una implementación basada únicamente en condicionales dentro del servicio de reservas aumentaría el acoplamiento y dificultaría agregar nuevas reglas.

### Solución aplicada

Se utiliza el patrón Strategy.

Cada regla tarifaria se encapsula en una clase que implementa la interfaz `PricingStrategy`.

La interfaz está definida en:

`backend/src/canchas/pricing/pricing-strategy.interface.ts`

Su contrato principal es:

```typescript
export interface PricingStrategy {
  readonly nombre: string;

  aplica(ctx: PricingContext): boolean;

  calcular(ctx: PricingContext): PricingAjuste;
}
```

Cada estrategia determina si corresponde aplicarse y devuelve los ajustes calculados.

### Estrategias implementadas

| Estrategia | Archivo | Comportamiento |
|---|---|---|
| `TarifaEstandar` | `tarifa-estandar.strategy.ts` | Conserva el precio base |
| `DescuentoSocio` | `descuento-socio.strategy.ts` | Descuento del 15 % a socios activos |
| `RecargoHorarioPico` | `recargo-horario-pico.strategy.ts` | Recargo del 20 % en turnos de 19:00 y 20:00 |
| `TarifaExterno` | `tarifa-externo.strategy.ts` | Identifica la tarifa sin descuento de socio |

El recargo pico se aplica desde las 19:00 hasta las 21:00, con el límite superior excluido.

### Contexto de cálculo

El objeto `PricingContext` contiene:

```typescript
export interface PricingContext {
  costoHora: number;
  horaInicio: number;
  esSocioActivo: boolean;
}
```

Esta información permite evaluar las reglas disponibles.

### Composición de estrategias

`PricingService` recibe las estrategias registradas mediante inyección de dependencias.

Itera sobre ellas, ejecuta las aplicables y suma descuentos o recargos.

El cálculo utiliza la fórmula:

**Monto total = precio base − descuentos + recargos**

Los valores se redondean a dos decimales y el resultado no puede ser negativo.

El servicio también devuelve la lista `estrategias_aplicadas`, facilitando explicar qué reglas intervinieron.

### Ejemplo conceptual

Para una cancha con precio base de $10.000, un socio activo que reserva a las 19:00 obtiene:

| Concepto | Importe |
|---|---:|
| Precio base | $10.000 |
| Descuento de socio, 15 % | −$1.500 |
| Recargo pico, 20 % | +$2.000 |
| **Total** | **$10.500** |

El recargo se calcula sobre el precio base, no sobre el importe ya descontado.

### Ventajas

- Cada regla puede probarse de forma independiente.
- El servicio principal no necesita conocer los detalles de cada tarifa.
- Se pueden agregar estrategias mediante el registro de clases.
- Las reglas aplicadas quedan identificadas en la respuesta.

## 4.2 Observer — Lista de espera de clases

### Problema

Cuando una reserva de clase es cancelada, puede liberarse un cupo.

El sistema debe asignarlo automáticamente al primer usuario de la lista de espera sin incorporar toda esa lógica dentro del procedimiento de cancelación.

### Solución aplicada

Se utiliza el patrón Observer.

El sistema define un evento de cupo liberado y observadores que responden a ese evento.

### Componentes

**Subject**

`backend/src/clases/observer/cupo-liberado.subject.ts`

La clase `CupoLiberadoSubject` mantiene los observadores registrados.

Ofrece métodos para suscribir, desuscribir y notificar.

**Interfaz del observador**

`backend/src/clases/observer/cupo-liberado.interface.ts`

Define el método `update` que deben implementar los observadores.

**Observador concreto**

`backend/src/clases/observer/lista-espera.observer.ts`

La clase `ListaEsperaObserver` se suscribe al iniciarse el módulo.

Cuando recibe una notificación, identifica al primer usuario de la lista de espera.

### Orden de promoción

Las solicitudes se ordenan por:

1. Fecha de creación ascendente.
2. Identificador ascendente como criterio de desempate.

Esto establece un orden FIFO (*First In, First Out*).

### Secuencia de funcionamiento

1. Un usuario cancela una reserva confirmada.
2. El servicio valida que la cancelación sea posible.
3. Se actualiza la reserva a `CANCELADA`.
4. Se libera un cupo.
5. El servicio notifica al `CupoLiberadoSubject`.
6. `ListaEsperaObserver` busca al primer usuario en espera.
7. Se crea una nueva reserva confirmada.
8. La entrada de lista de espera pasa a `CONVERTIDO`.
9. Se registra una notificación simulada.

La promoción se ejecuta dentro de la transacción Prisma de cancelación y liberación del cupo.

### Notificaciones

`NotificacionesService` registra mensajes mediante el logger de NestJS y mantiene un historial en memoria.

Esto permite demostrar el comportamiento Observer sin depender de un proveedor externo de correo o mensajería.

No debe confundirse con una integración real de notificaciones push, SMS o email.

### Diagrama relacionado

[11-actividad-lista-espera.svg](../diagramas/11-actividad-lista-espera.svg)

## 4.3 Repository — Abstracción de la persistencia

### Problema

Si los servicios de negocio ejecutan consultas SQL directamente, quedan fuertemente acoplados a la tecnología de persistencia.

Además, las pruebas unitarias requieren acceso a la base de datos o una configuración más compleja.

### Solución aplicada

El proyecto utiliza clases Repository.

Cada repositorio concentra operaciones de acceso a las entidades de su módulo.

Ejemplos:

```text
UsuariosService  → UsersRepository   → Prisma
ClasesService    → ClasesRepository  → Prisma
CanchasService   → CanchasRepository → Prisma
PagosService     → PagosRepository   → Prisma
AccesoService    → AccesoRepository  → Prisma
```

### Ejemplo

`CanchasRepository` centraliza operaciones sobre canchas y reservas.

Incluye consultas por identificador, consultas de disponibilidad, inserción de reservas y modificación del estado de mantenimiento.

El servicio de negocio utiliza estos métodos para implementar las reglas funcionales.

### Ventajas

- Separación de responsabilidades.
- Menor duplicación de consultas.
- Servicios más fáciles de probar.
- Concentración de detalles de persistencia.
- Posibilidad de sustituir repositorios por dobles de prueba.

### Limitación

Los servicios siguen dependiendo de contratos de repositorio concretos y de determinados tipos relacionados con Prisma.

Por lo tanto, la separación mejora el diseño, pero no constituye una independencia completa respecto del ORM.

## 4.4 Patrones creacionales y estructurales

### Inyección de dependencias e inversión de control

NestJS administra la construcción de controladores, servicios y repositorios.

Los componentes se registran mediante decoradores como:

```typescript
@Injectable()
```

y:

```typescript
@Module({
  providers: [CanchasService, CanchasRepository]
})
```

El contenedor resuelve las dependencias necesarias.

En el módulo Canchas se utiliza además un proveedor con `useFactory` para construir la colección inyectable de estrategias de precio.

Este mecanismo constituye una **fábrica configurada mediante el contenedor de dependencias**, aunque no implica necesariamente una implementación independiente del patrón GoF Factory Method.

### Composición de componentes

En el frontend, React permite construir pantallas complejas mediante componentes más pequeños.

Se reutilizan átomos, moléculas y organismos, siguiendo principios de composición.

### Fachada de comunicación HTTP

`apiRequest<T>` concentra operaciones comunes para las solicitudes HTTP y ofrece una interfaz uniforme a los servicios del frontend.

Puede describirse como una fachada ligera de acceso a la API, sin afirmar que toda la aplicación implementa formalmente el patrón GoF Facade.

### Criterio de documentación

Los patrones que el proyecto implementa explícitamente son Strategy, Observer y Repository.

Los demás mecanismos se presentan por su función arquitectónica real, sin atribuir clases o jerarquías inexistentes.

---

# 5. Control de concurrencia en las reservas

## 5.1 Problema de concurrencia

Dos usuarios pueden intentar reservar la misma cancha, en la misma fecha y a la misma hora.

Si el sistema se limita a consultar primero si el horario está disponible, ambas solicitudes podrían obtener una respuesta afirmativa.

Después, ambas podrían intentar registrar una reserva.

Este comportamiento se conoce como condición de carrera (*race condition*).

## 5.2 Validación previa

El servicio consulta si existe una reserva activa para el turno solicitado.

Si encuentra una, devuelve un conflicto.

Esta comprobación mejora la respuesta de la aplicación, pero no garantiza por sí sola que dos solicitudes simultáneas no se superpongan.

## 5.3 Garantía a nivel de base de datos

La protección definitiva está implementada mediante el índice parcial:

```sql
CREATE UNIQUE INDEX "ux_reserva_cancha_slot"
ON "reserva_cancha"("cancha_id", "fecha", "hora_inicio")
WHERE "estado" <> 'CANCELADA';
```

Este índice impide que PostgreSQL confirme dos reservas activas con la misma combinación de cancha, fecha y hora.

La protección funciona incluso cuando dos solicitudes llegan al mismo tiempo.

## 5.4 Tratamiento del error

Cuando la base de datos detecta un conflicto de unicidad, Prisma puede devolver el error `P2002`.

El servicio traduce ese error a una excepción HTTP `409 Conflict`.

De esta forma, el cliente recibe una respuesta comprensible y puede informar que el turno ya fue reservado.

### Resultado esperado

Para doce solicitudes simultáneas sobre el mismo turno:

- Una debe registrar la reserva.
- Once deben recibir un conflicto.
- La base de datos debe contener una única reserva activa para ese turno.

Este comportamiento está contemplado en:

`backend/test/concurrencia.e2e-spec.ts`

## 5.5 Transacciones

Las transacciones permiten agrupar operaciones que deben completarse de manera conjunta.

El proyecto utiliza `prisma.$transaction` para operaciones que modifican varias entidades relacionadas.

Por ejemplo, en el proceso de cancelación de clases se registra la cancelación y se promueve al usuario correspondiente de la lista de espera dentro de una misma transacción.

Esto evita dejar confirmada la cancelación mientras falla la asignación del cupo.

## 5.6 Concurrencia en los ingresos

La regla RN-01 establece que un usuario no puede mantener ingresos activos en dos sedes simultáneamente.

La restricción principal se implementa mediante:

```sql
CREATE UNIQUE INDEX "ux_acceso_activo_por_usuario"
ON "acceso"("usuario_id")
WHERE "egreso_at" IS NULL;
```

Cuando un usuario registra un egreso, se completa el campo `egreso_at` y deja de existir un acceso abierto para ese registro.

Así puede volver a ingresar a una sede conforme a las reglas del sistema.

## 5.7 Pruebas de concurrencia

Las pruebas de integración utilizan PostgreSQL real y Supertest.

La prueba de reservas envía múltiples solicitudes sobre el mismo horario y verifica la cantidad de respuestas exitosas y conflictivas.

La prueba de acceso envía dos ingresos simultáneos hacia sedes diferentes y verifica que solamente uno resulte autorizado.

### Diagramas relacionados

[07-seq-reserva-concurrente.svg](../diagramas/07-seq-reserva-concurrente.svg)

[12-der-fisico.svg](../diagramas/12-der-fisico.svg)

## 5.8 Consideraciones adicionales

La garantía de no sobreventa de canchas se apoya en una restricción comprobable a nivel de base de datos.

Otros flujos, como la asignación de cupos de clases, deben evaluarse por separado ante concurrencia extrema, porque utilizan reglas y entidades diferentes.

La ausencia de una prueba de concurrencia específica no debe interpretarse automáticamente como garantía de seguridad concurrente.

---

# 6. Arquitectura offline del control de acceso

## 6.1 Objetivo

El requisito RNF-01 establece que el terminal de sede debe continuar con determinadas operaciones de validación cuando se pierde la conexión con el servidor central.

Para lograrlo, la arquitectura utiliza una copia local de información y una cola de operaciones pendientes.

## 6.2 Operación normal

En condiciones de conectividad, el terminal:

1. Lee un QR mediante cámara o entrada manual.
2. Envía el token al backend.
3. El backend verifica la firma y el vencimiento.
4. Consulta la membresía del usuario.
5. Comprueba la inexistencia de un ingreso abierto.
6. Registra el acceso.
7. Devuelve el resultado.

El endpoint correspondiente es:

```http
POST /acceso/validar
```

## 6.3 Snapshot local

Para permitir el funcionamiento offline, el terminal descarga una copia de los socios activos.

El endpoint utilizado es:

```http
GET /acceso/sedes/:sedeId/snapshot
```

El snapshot contiene información mínima para identificar usuarios y consultar su estado de membresía.

Entre sus campos se encuentran:

- Identificador del usuario.
- DNI.
- Nombre y apellido.
- Estado de membresía.
- Fecha de finalización.
- Sede del snapshot.
- Fecha de generación.

El sistema contempla usuarios activos de la red, porque la regla RF-03 permite el acceso multi-sede.

## 6.4 Persistencia local

El frontend implementa el mecanismo en:

`frontend/src/services/controlAccesoService.ts`

Los datos se almacenan mediante `localStorage`.

Se utilizan claves identificables por sede, junto con una cola persistente de ingresos pendientes.

Este mecanismo permite conservar determinados datos entre recargas de la aplicación mientras el navegador mantenga su almacenamiento.

No equivale a una base de datos local transaccional ni garantiza persistencia ilimitada.

## 6.5 Validación sin conexión

Cuando la comunicación con el backend no está disponible, el frontend intenta utilizar la copia local.

El procedimiento implementado:

1. Decodifica el contenido del QR.
2. Comprueba su estructura.
3. Verifica que no haya vencido.
4. Recupera el snapshot de la sede.
5. Busca al usuario.
6. Comprueba que figure con membresía activa.
7. Encola el ingreso para sincronización posterior.

### Limitación importante de seguridad

En el código de referencia, la validación offline del navegador **decodifica el payload del QR, pero no comprueba criptográficamente su firma HMAC antes de autorizarlo localmente**.

La firma se verifica posteriormente en el backend durante la sincronización.

Esto significa que la autorización offline local no ofrece el mismo nivel de garantía que la validación online.

Una implementación fortalecida debería incorporar un mecanismo de verificación criptográfica local adecuado, junto con una política de distribución y protección de claves, o utilizar credenciales verificables mediante criptografía asimétrica.

No corresponde afirmar que esta verificación local está implementada en la versión analizada.

## 6.6 Cola de ingresos pendientes

Cada ingreso autorizado localmente se representa mediante datos como:

```typescript
interface IngresoOfflineItem {
  userId: number;
  sedeId: number;
  timestamp: string;
  qrToken: string;
}
```

Los eventos se agregan a la cola persistida por el navegador.

Cuando la conexión se recupera, la aplicación puede reenviar los eventos pendientes al servidor.

## 6.7 Sincronización

El endpoint es:

```http
POST /acceso/sincronizar
```

El servidor recibe un lote de ingresos.

Para cada evento:

1. Comprueba si ya existe un registro equivalente.
2. Verifica la firma del QR.
3. Comprueba la correspondencia entre QR y usuario.
4. Consulta el estado de membresía.
5. Intenta registrar el ingreso.
6. Devuelve un resultado de aceptación o conflicto.

La idempotencia se implementa comprobando la combinación de usuario, sede y marca temporal del ingreso.

Un evento previamente registrado no debe generar una segunda operación equivalente.

## 6.8 Resolución de conflictos

Pueden producirse conflictos si:

- El QR no corresponde al usuario informado.
- La firma resulta inválida.
- La membresía no se encuentra activa.
- El usuario ya tiene un ingreso abierto.
- Existen operaciones que contradicen las reglas actuales de la base de datos.

Los resultados se clasifican como aceptados o conflictivos.

El terminal muestra al operador la cantidad de operaciones procesadas.

### Consideración temporal

La sincronización puede producirse cuando el QR ya venció. El backend verifica su firma y pertenencia al usuario, y procesa el evento conforme a las reglas implementadas.

Esto es diferente de autorizar un QR vencido en el momento de su lectura local.

## 6.9 Recuperación de la conexión

En `AdminControlAcceso.tsx` se implementa un mecanismo que intenta sincronizar los eventos pendientes al recuperar conectividad.

También se consulta periódicamente la cola mientras existe conexión, con un intervalo programado de 30 segundos.

Cuando el servidor procesa el lote, el frontend actualiza el estado local y presenta el resultado.

## 6.10 Limitaciones operativas

La arquitectura offline debe considerar:

- Antigüedad del snapshot.
- Cambios de membresía realizados mientras el terminal está desconectado.
- Posibles diferencias entre la validación local y la definitiva.
- Seguridad del almacenamiento en el navegador.
- Disponibilidad del dispositivo.
- Conflictos de acceso multi-sede.
- Recuperación de datos ante pérdida del almacenamiento local.

La versión analizada implementa una solución funcional de snapshot y cola, pero no una plataforma offline completamente independiente de los riesgos anteriores.

### Diagramas relacionados

[08-seq-acceso-offline.svg](../diagramas/08-seq-acceso-offline.svg)

[04-c4-nivel3-acceso.svg](../diagramas/04-c4-nivel3-acceso.svg)

### Evidencia documental

[RNF-01](../rnf/RNF-01.md)

---

# 7. Guía de extensión

Esta sección presenta los dos casos de extensión exigidos por la cátedra.

Su objetivo es demostrar cómo agregar funcionalidades reutilizando los módulos y patrones existentes, sin modificar innecesariamente otras áreas del sistema.

## 7.1 Caso resuelto: agregar canchas de tenis

### Situación inicial

FitZone Sports administra canchas deportivas mediante dos entidades relacionadas:

- `tipo_cancha`: identifica la disciplina.
- `cancha`: representa una instalación concreta perteneciente a una sede.

Esta separación permite incorporar nuevas disciplinas sin crear una tabla diferente para cada deporte.

### Objetivo

Registrar canchas de tenis para que puedan visualizarse y reservarse utilizando el mismo mecanismo que las demás canchas.

### Solución aplicada

El código actual ya contempla el tipo de cancha `Tenis`.

El archivo:

`backend/prisma/seed.mjs`

contiene una operación que registra el tipo si todavía no existe.

Fragmento representativo:

```javascript
const tipoTenis = await prisma.tipo_cancha.upsert({
  where: { nombre: 'Tenis' },
  update: {},
  create: { nombre: 'Tenis' },
});
```

Posteriormente, el seed utiliza el tipo registrado para crear canchas en distintas sedes.

No se necesita modificar el esquema relacional porque `cancha.tipo_cancha_id` ya referencia `tipo_cancha`.

### Procedimiento para agregar otra cancha de tenis

**Paso 1. Verificar el tipo de cancha.**

Comprobar que `tipo_cancha` contiene el registro `Tenis`.

Si no existe, incorporarlo mediante un proceso autorizado de administración o una carga controlada de datos.

**Paso 2. Identificar la sede.**

Cada cancha requiere un identificador de sede válido.

**Paso 3. Registrar la cancha.**

La API dispone de un endpoint de creación:

```http
POST /canchas
Authorization: Bearer <TOKEN_VALIDO>
Content-Type: application/json
```

Ejemplo de cuerpo:

```json
{
  "nombre": "Tenis 2",
  "sede_id": 1,
  "tipo_cancha_id": 3,
  "costo_hora": 12000
}
```

Los identificadores `1` y `3` son ilustrativos: deben sustituirse por los valores reales de la base de datos.

**Paso 4. Aplicar autorización.**

La operación debe respetar el rol del usuario.

Un gerente debe trabajar exclusivamente con las canchas de su sede, mientras que las operaciones administrativas de alcance superior deben conservar sus autorizaciones correspondientes.

La restricción debe verificarse en el backend, no solamente en un selector de la interfaz.

**Paso 5. Consultar disponibilidad.**

Una vez registrada la instalación, la grilla puede consultarse mediante:

```http
GET /canchas/:id/disponibilidad?fecha=2026-11-20
```

El servicio de disponibilidad utiliza el mismo comportamiento para los distintos tipos de cancha.

**Paso 6. Reservar un turno.**

El procedimiento de reserva utiliza:

```http
POST /canchas/reserva
```

La reserva conserva las reglas generales de disponibilidad, precio dinámico y no sobreventa.

### Cambios necesarios

Para incorporar una nueva cancha de un tipo existente, no es necesario modificar el modelo de datos ni agregar un nuevo servicio.

Solamente se necesita registrar una entidad `cancha` correctamente relacionada.

Para introducir una disciplina nueva, se registra primero un nuevo `tipo_cancha`.

### Validaciones necesarias

- El tipo de cancha existe.
- La sede existe.
- El nombre no está duplicado dentro de la sede.
- El precio es mayor que cero.
- El usuario está autorizado.
- La cancha aparece en los listados correspondientes.
- La disponibilidad se calcula correctamente.
- No se aceptan reservas simultáneas duplicadas.

### Pruebas sugeridas

Registrar una cancha de tenis y verificar:

1. Que aparece en la consulta de canchas de la sede.
2. Que tiene el tipo `Tenis`.
3. Que la disponibilidad inicialmente no contiene reservas activas.
4. Que puede reservarse una franja libre.
5. Que una segunda solicitud sobre el mismo turno recibe un conflicto.
6. Que otra franja permanece disponible.
7. Que un gerente de otra sede no puede administrarla.

### Resultado del caso

El diseño existente permite incorporar canchas de tenis sin duplicar lógica de precios, disponibilidad ni reservas.

Este caso demuestra la extensibilidad proporcionada por el modelo relacional de tipos de cancha y la reutilización de los servicios del módulo.

## 7.2 Caso resuelto: agregar una estrategia de precio

### Situación inicial

El sistema implementa cuatro estrategias de precio registradas mediante el patrón Strategy.

Se necesita permitir que aparezcan nuevas reglas comerciales sin reescribir el cálculo principal de reservas.

### Objetivo del ejemplo

Agregar un **recargo de apertura temprana del 10 %** para los turnos que comienzan a las 08:00.

Este ejemplo utiliza únicamente propiedades que ya existen en `PricingContext`.

No es necesario modificar la base de datos.

### Paso 1. Crear una nueva clase

Crear:

`backend/src/canchas/pricing/recargo-apertura-temprana.strategy.ts`

Contenido:

```typescript
import { Injectable } from '@nestjs/common';

import {
  redondear,
  type PricingAjuste,
  type PricingContext,
  type PricingStrategy,
} from './pricing-strategy.interface.js';

@Injectable()
export class RecargoAperturaTemprana implements PricingStrategy {
  readonly nombre = 'RecargoAperturaTemprana';

  aplica(ctx: PricingContext): boolean {
    return ctx.horaInicio === 8;
  }

  calcular(ctx: PricingContext): PricingAjuste {
    return {
      descuento: 0,
      recargo: redondear(ctx.costoHora * 0.10),
    };
  }
}
```

La clase implementa la interfaz existente.

El método `aplica` indica cuándo corresponde utilizar la estrategia.

El método `calcular` devuelve el recargo monetario.

### Paso 2. Registrar la estrategia

Modificar:

`backend/src/canchas/pricing/index.ts`

Agregar el import:

```typescript
import { RecargoAperturaTemprana } from './recargo-apertura-temprana.strategy.js';
```

Incorporar la clase a la colección existente:

```typescript
export const PRICING_STRATEGY_CLASSES = [
  TarifaEstandar,
  DescuentoSocio,
  RecargoHorarioPico,
  TarifaExterno,
  RecargoAperturaTemprana,
];
```

También puede exportarse la nueva clase desde el índice para que otros módulos y pruebas la importen mediante el punto de entrada común.

### Paso 3. Utilizar la inyección existente

`CanchasModule` registra automáticamente las clases incluidas en `PRICING_STRATEGY_CLASSES`.

Por ese motivo no es necesario modificar la implementación de `PricingService` para esta extensión.

Cuando calcule una tarifa a las 08:00, la nueva estrategia será evaluada junto con las demás.

### Paso 4. Comprobar el cálculo

Supongamos:

- Precio base: $10.000.
- Hora de inicio: 08:00.
- Usuario: cliente externo.

El sistema aplica:

| Concepto | Importe |
|---|---:|
| Precio base | $10.000 |
| Recargo de apertura, 10 % | +$1.000 |
| Descuento de socio | $0 |
| **Total** | **$11.000** |

Si el usuario es socio activo, también se aplicaría el descuento correspondiente, salvo que una regla comercial establezca explícitamente su incompatibilidad.

La implementación actual suma los ajustes de las estrategias aplicables; no dispone de una política general de exclusividad entre descuentos y recargos.

### Paso 5. Agregar pruebas unitarias

Crear:

`backend/src/canchas/pricing/recargo-apertura-temprana.strategy.spec.ts`

Ejemplo:

```typescript
import { describe, expect, it } from 'vitest';

import { RecargoAperturaTemprana } from './recargo-apertura-temprana.strategy.js';

describe('RecargoAperturaTemprana', () => {
  const estrategia = new RecargoAperturaTemprana();

  it('aplica a las 08:00', () => {
    expect(
      estrategia.aplica({
        costoHora: 10000,
        horaInicio: 8,
        esSocioActivo: false,
      }),
    ).toBe(true);
  });

  it('no aplica a las 09:00', () => {
    expect(
      estrategia.aplica({
        costoHora: 10000,
        horaInicio: 9,
        esSocioActivo: false,
      }),
    ).toBe(false);
  });

  it('calcula un recargo del 10 %', () => {
    expect(
      estrategia.calcular({
        costoHora: 10000,
        horaInicio: 8,
        esSocioActivo: false,
      }),
    ).toEqual({
      descuento: 0,
      recargo: 1000,
    });
  });
});
```

Este código representa la prueba que debe incorporarse si se adopta la extensión. No forma parte de las pruebas existentes en el commit de referencia.

### Paso 6. Ejecutar la prueba

Desde `backend/`:

```bash
npx vitest run src/canchas/pricing/recargo-apertura-temprana.strategy.spec.ts
```

Después ejecutar la suite general para detectar regresiones.

### Paso 7. Validar la integración

Además del test unitario, se recomienda verificar que:

1. La grilla de disponibilidad muestre el precio resultante.
2. La creación de la reserva utilice ese importe.
3. La respuesta identifique la estrategia aplicada.
4. El registro del pago utilice el importe calculado.
5. No se alteren las tarifas de otros horarios.

### Resultado del caso

Strategy permite agregar una nueva política tarifaria mediante una clase adicional y su registro.

La lógica principal de `PricingService` permanece sin modificaciones.

Si una estrategia futura necesitara información que no está disponible en `PricingContext`, como el día de la semana o un evento especial, sería necesario ampliar el contrato y las llamadas que construyen ese contexto.

---

# 8. Pruebas: ejecución y lectura de cobertura

## 8.1 Estrategia general

El sistema utiliza pruebas en distintos niveles.

| Nivel | Herramientas | Objetivo |
|---|---|---|
| Unitarias | Vitest | Validar reglas de negocio y componentes aislados |
| Integración | Vitest, Supertest, NestJS | Verificar interacción entre módulos y endpoints |
| Concurrencia | Supertest, PostgreSQL | Comprobar restricciones bajo solicitudes simultáneas |
| Build y lint | Nest CLI, TypeScript, Vite, oxlint | Detectar problemas de compilación y calidad estática |

El backend utiliza Vitest.

Las pruebas unitarias normalmente sustituyen dependencias reales por mocks o dobles de prueba.

Las pruebas de integración utilizan una aplicación NestJS y, en los casos correspondientes, una base PostgreSQL.

## 8.2 Pruebas unitarias

Ubicarse en el backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm ci
```

Generar el cliente Prisma:

```bash
npx prisma generate
```

Ejecutar las pruebas:

```bash
npm test
```

Para ejecutar un archivo específico:

```bash
npx vitest run src/canchas/pricing/strategies.spec.ts
```

Este enfoque permite detectar rápidamente si una modificación introdujo un error en una funcionalidad concreta.

## 8.3 Cobertura

La configuración está definida en:

`backend/vitest.config.ts`

El proyecto utiliza el proveedor de cobertura V8.

El comando es:

```bash
npm run test:cov
```

Los reportes configurados incluyen:

- Salida de texto.
- LCOV.
- Resumen JSON.

La cobertura considera cuatro indicadores:

### Statements

Porcentaje de sentencias de código ejecutadas durante las pruebas.

### Branches

Porcentaje de ramas de decisión cubiertas, como alternativas de condiciones.

### Functions

Porcentaje de funciones ejecutadas.

### Lines

Porcentaje de líneas de código ejecutadas.

## 8.4 Umbral mínimo

La configuración establece un mínimo del **70 %** para:

- Statements.
- Branches.
- Functions.
- Lines.

El alcance de medición está definido por `include` y `exclude` en `vitest.config.ts`.

En particular, se excluyen del cálculo varias categorías de archivos, como controladores, repositorios, módulos, DTO y archivos de configuración.

Por eso, el porcentaje obtenido debe interpretarse como cobertura del **conjunto de archivos configurado**, y no como porcentaje de cobertura de absolutamente todo el repositorio.

## 8.5 Resultados documentados

El README del proyecto declara para una ejecución anterior:

| Indicador | Cobertura informada |
|---|---:|
| Statements | 83,90 % |
| Branches | 70,64 % |
| Functions | 83,15 % |
| Lines | 83,68 % |

También informa 97 pruebas unitarias aprobadas.

Estos valores corresponden al reporte documentado previamente por el equipo.

**No representan una medición ejecutada sobre el commit de referencia de este manual.** Para la entrega definitiva debe repetirse `npm run test:cov` y conservarse el resultado actualizado.

## 8.6 Pruebas de integración

El comando configurado es:

```bash
npm run test:e2e
```

Estas pruebas necesitan una instancia de PostgreSQL disponible y una base preparada con migraciones y datos de demostración.

Antes de ejecutarlas debe comprobarse que `DATABASE_URL`, `JWT_SECRET` y las demás variables necesarias estén configuradas para el entorno de prueba.

Los principales archivos son:

- `backend/test/flujos.e2e-spec.ts`
- `backend/test/concurrencia.e2e-spec.ts`

### Flujos evaluados

**Flujo 1: Reserva de cancha y pago.**

Comprueba una reserva, la simulación de pago y la descarga del comprobante PDF.

**Flujo 2: Reserva y lista de espera de clases.**

Comprueba la reserva de una clase, la incorporación a lista de espera, la cancelación y la promoción automática.

**Flujo 3: Acceso QR.**

Comprueba la generación de QR, validación de ingreso, consulta de aforo y registro de egreso.

## 8.7 Pruebas de concurrencia

El archivo `concurrencia.e2e-spec.ts` contempla dos escenarios centrales.

### RN-02 — Reserva duplicada

Se envían doce solicitudes simultáneas para una cancha, fecha y horario.

El criterio de aceptación es que únicamente una obtenga éxito.

### RN-01 — Accesos simultáneos

Se intenta registrar un mismo usuario en dos sedes al mismo tiempo.

El criterio de aceptación es que un ingreso resulte autorizado y el otro obtenga un conflicto.

## 8.8 Pruebas de compilación

Backend:

```bash
cd backend
npm run lint
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

En el frontend, `npm run build` ejecuta la compilación TypeScript y después la construcción de Vite.

## 8.9 Procedimiento recomendado antes de entregar

1. Instalar las dependencias desde los lockfiles.
2. Generar el cliente Prisma.
3. Ejecutar lint del backend.
4. Ejecutar build del backend.
5. Ejecutar las pruebas unitarias y la cobertura.
6. Preparar PostgreSQL con migraciones y seed.
7. Ejecutar las pruebas de integración.
8. Ejecutar lint y build del frontend.
9. Revisar los resultados del pipeline de GitHub Actions.
10. Registrar los resultados reales y el commit evaluado.

Las pruebas deben ejecutarse sobre la versión que finalmente sea etiquetada para la entrega.

---

# 9. Pipeline de integración y entrega continuas

## 9.1 Objetivo

La integración continua busca detectar defectos antes de incorporar cambios al código principal.

FitZone Sports utiliza GitHub Actions.

El workflow se encuentra en:

`.github/workflows/ci.yml`

## 9.2 Eventos que activan el pipeline

El workflow se ejecuta ante:

- Pull Requests dirigidos a `main` o `master`.
- Pushes a `main` o `master`.

Esto permite verificar cambios propuestos y modificaciones ya integradas.

## 9.3 Trabajos configurados

El pipeline define tres trabajos principales.

### Backend — Unitarias y cobertura

Pasos:

1. Obtener el código con `actions/checkout`.
2. Configurar Node.js.
3. Ejecutar `npm ci`.
4. Generar el cliente Prisma.
5. Ejecutar lint.
6. Compilar el backend.
7. Ejecutar las pruebas con cobertura.

El trabajo permite detectar errores de tipado, compilación y funcionamiento de las reglas de negocio.

### Backend — Integración y concurrencia

Este trabajo utiliza un servicio PostgreSQL 18 dentro del entorno de GitHub Actions.

Pasos:

1. Instalar dependencias.
2. Generar Prisma Client.
3. Configurar la base de datos.
4. Aplicar las migraciones.
5. Ejecutar el seed.
6. Ejecutar las pruebas E2E.

De esta manera, las pruebas pueden verificar índices, transacciones y restricciones reales de PostgreSQL.

### Frontend — Build

Pasos:

1. Obtener el código.
2. Configurar Node.js.
3. Instalar dependencias con `npm ci`.
4. Ejecutar el build del frontend.

Esta etapa verifica que el proyecto React y TypeScript pueda generar sus artefactos de distribución.

## 9.4 Interpretación de resultados

Cada trabajo puede finalizar correctamente o con errores.

Un fallo puede indicar:

- Dependencias incompatibles.
- Errores de TypeScript.
- Problemas de lint.
- Tests fallidos.
- Migraciones incorrectas.
- Defectos de concurrencia.
- Fallos de compilación del frontend.

Ante un fallo, se deben revisar los logs del trabajo correspondiente antes de integrar la modificación.

## 9.5 Relación con el despliegue

El workflow inspeccionado implementa **integración continua (CI)**.

No contiene una etapa automatizada que publique la aplicación en un servidor productivo después de las pruebas.

Por ese motivo, no corresponde afirmar que el repositorio dispone actualmente de despliegue continuo automatizado completo.

La construcción y puesta en marcha mediante Docker existen como procedimientos separados.

El diseño del pipeline se representa en:

[14-pipeline-cicd.svg](../diagramas/14-pipeline-cicd.svg)

## 9.6 Contenerización

El backend utiliza una imagen basada en Node.js 22.

El frontend utiliza una construcción de varias etapas: primero compila la aplicación con Node.js y después utiliza Nginx para servir los archivos estáticos.

PostgreSQL se ejecuta en su propio contenedor.

En el commit analizado existen configuraciones Compose separadas:

- `backend/docker-compose.yml`
- `frontend/docker-compose.yml`

### Puertos declarados

| Servicio | Puerto de acceso |
|---|---|
| Frontend HTTP | `5173` |
| Frontend HTTPS | `5174` |
| Backend | `3000` |
| PostgreSQL | `5432` |

El servidor HTTPS local utiliza un certificado autofirmado generado durante la construcción del frontend.

### Consideración de integración

El archivo `frontend/nginx.conf` del commit analizado utiliza el destino `http://backend:3000/` para el proxy.

Sin embargo, los archivos Compose separados no configuran por sí mismos una red compartida que garantice la resolución del nombre `backend` desde el contenedor frontend.

Para un despliegue reproducible debe utilizarse una red Docker compartida o configurarse un destino de proxy alcanzable desde el contenedor.

También falta un Compose unificado en la raíz del repositorio, requerido por los lineamientos de entrega.

Por lo tanto, **no debe afirmarse que el proyecto completo se levanta actualmente con un único comando desde la raíz**, hasta implementar y verificar esa configuración.

## 9.7 Migraciones durante el arranque

El backend utiliza `docker-entrypoint.sh`.

Este script:

1. Intenta ejecutar `prisma migrate deploy`.
2. Reintenta cuando la base todavía no está disponible.
3. Ejecuta el seed.
4. Inicia la aplicación NestJS.

La ejecución automática del seed está orientada al entorno de demostración.

En producción debería separarse el aprovisionamiento de datos de prueba del arranque habitual.

## 9.8 Procedimiento de reversión

Como guía operativa, una reversión debe identificar primero la versión estable anterior.

El procedimiento recomendado consiste en:

1. Identificar el commit o tag estable.
2. Respaldar la base de datos.
3. Evaluar la compatibilidad de las migraciones aplicadas.
4. Reconstruir las imágenes de esa versión.
5. Desplegar los contenedores correspondientes.
6. Comprobar los endpoints principales.
7. Verificar las reservas y datos existentes.

**Advertencia:** volver a una versión anterior del código no revierte automáticamente las migraciones de PostgreSQL.

Una reversión que involucre modificaciones de esquema necesita un procedimiento específico de recuperación de datos o migración inversa validada.

El manual de instalación y operación contiene procedimientos complementarios de respaldo, restauración y operación.

---

# 10. Convenciones de código, ramas y mensajes de commit

## 10.1 Convenciones generales

El proyecto utiliza TypeScript en backend y frontend.

Las siguientes convenciones permiten localizar responsabilidades y reducir duplicación:

- Los controladores reciben solicitudes HTTP.
- Los servicios implementan reglas de negocio.
- Los repositorios encapsulan la persistencia.
- Los DTO definen los datos aceptados por los endpoints.
- Los componentes React implementan presentación e interacción.
- Los servicios del frontend centralizan la comunicación con la API.
- Las variables y funciones utilizan nombres descriptivos.
- Los cambios funcionales deben acompañarse de pruebas cuando corresponda.

## 10.2 Convenciones del backend

NestJS utiliza archivos identificados por su responsabilidad:

```text
canchas.controller.ts
canchas.service.ts
canchas.repository.ts
canchas.module.ts
```

Los contratos de entrada se agrupan en directorios `dto/`.

Las pruebas unitarias utilizan el sufijo:

```text
.spec.ts
```

Las pruebas de integración utilizan:

```text
.e2e-spec.ts
```

Las rutas de la API están centralizadas en:

`backend/src/routes/app-routes.ts`

## 10.3 Convenciones del frontend

Los componentes React utilizan archivos `.tsx`.

Las pantallas se agrupan por contexto funcional.

Los servicios utilizan archivos `.ts` para concentrar llamadas al backend.

El estado compartido se administra desde `AppStore`.

Cuando resulte apropiado, deben reutilizarse los componentes de `atoms`, `molecules` y `organisms` antes de crear nuevos elementos visuales.

La organización está documentada en:

[Catálogo de componentes](../catalogo-componentes.md)

## 10.4 Control de versiones

Git permite registrar los cambios y mantener el historial del proyecto.

La rama principal del repositorio es `main`.

Como convención recomendada para cambios futuros:

1. Actualizar la rama local.
2. Crear una rama de trabajo cuando el proceso del equipo lo requiera.
3. Realizar cambios de alcance limitado.
4. Ejecutar pruebas.
5. Crear commits descriptivos.
6. Publicar los cambios.
7. Revisarlos antes de integrarlos a `main`.

Para correcciones directamente en `main`, debe existir coordinación entre integrantes para evitar sobrescribir trabajo concurrente.

## 10.5 Mensajes de commit

Se recomiendan mensajes que expliquen la intención del cambio.

Ejemplos:

```text
feat(canchas): agregar estrategia de tarifa promocional
fix(acceso): corregir sincronizacion de ingresos offline
test(clases): cubrir promocion FIFO
docs: actualizar manual tecnico
refactor(frontend): centralizar solicitudes HTTP
```

Los mensajes descriptivos ayudan a relacionar el historial con las bitácoras individuales y las actividades planificadas.

## 10.6 Revisión y mantenimiento

Antes de integrar una modificación, el desarrollador debería comprobar:

- Que el cambio responde a un requisito concreto.
- Que no modifica reglas ajenas sin necesidad.
- Que respeta el modelo de datos.
- Que mantiene los controles de autorización.
- Que no rompe las transacciones.
- Que las pruebas relacionadas siguen funcionando.
- Que el frontend no depende de datos simulados en recorridos que deben ser reales.
- Que la documentación sigue coincidiendo con el código.
- Que no se incorporan contraseñas, tokens ni secretos reales.

## 10.7 Seguridad y gestión de roles

La autenticación utiliza JWT.

El backend incorpora:

- `JwtAuthGuard` para verificar el token.
- `RolesGuard` para aplicar los roles declarados.
- `@CurrentUser()` para recuperar el usuario autenticado.
- `@Roles()` para identificar roles autorizados.
- `@Public()` para declarar rutas de acceso público.

Los servicios deben complementar estas verificaciones con autorización sobre los recursos específicos.

Por ejemplo, un gerente autenticado no debería poder consultar ni modificar recursos de otra sede, aunque conozca sus identificadores.

El identificador de sede autorizado debe derivarse de los datos del usuario autenticado y verificarse contra la base de datos.

Las modificaciones recientes del backend incorporan restricciones por sede en operaciones de clases, canchas y sedes, pero requieren completar la validación de extremo a extremo y las pruebas correspondientes.

## 10.8 Deuda técnica y observaciones de cierre

Durante la revisión del commit indicado se identificaron los siguientes puntos que deben resolverse o verificarse antes de declarar la versión definitiva.

### Observación 1 — Duplicación de propiedad TypeScript

El archivo:

`backend/src/common/decorators/current-user.decorator.ts`

declara dos veces la propiedad `id_rol` en `JwtPayload`.

Debe mantenerse una única declaración.

### Observación 2 — Rutas duplicadas de eliminación de clases

El controlador:

`backend/src/clases/clases.controller.ts`

contiene dos manejadores decorados con:

```typescript
@Delete(APP_ROUTES.CLASES.BY_ID)
```

También deben revisarse sus imports y restricciones de rol.

La coexistencia de dos operaciones para el mismo método y ruta puede provocar un comportamiento incorrecto de autorización o enrutamiento.

Es necesario definir una única política coherente para cancelar o eliminar clases, diferenciando las acciones permitidas a administradores, gerentes e instructores.

### Observación 3 — Restricción de sede en el frontend

La interfaz administrativa todavía debe verificar que la selección de sede y los formularios respeten las restricciones de los gerentes.

Las comprobaciones del backend son imprescindibles, aunque el frontend oculte controles.

### Observación 4 — Validación criptográfica offline

El procedimiento offline del navegador necesita una comprobación criptográfica local para igualar las garantías de autenticidad del flujo online.

### Observación 5 — Despliegue reproducible

Es necesario completar y probar la configuración de Docker, especialmente la conexión entre frontend y backend.

### Observación 6 — Documentación de entorno

El archivo `.env.example` se eliminó del repositorio en una modificación reciente.

Debe recuperarse un ejemplo sin secretos reales o documentarse una alternativa que permita configurar la aplicación desde una instalación limpia.

### Observación 7 — Integración continua

Debe comprobarse el resultado real de GitHub Actions sobre la versión etiquetada.

Las métricas históricas del README no sustituyen una ejecución de la suite sobre el código final.

### Observación 8 — Trazabilidad documental

Deben publicarse los ADR y mantener actualizados los enlaces desde este manual, el README y el dossier.

Estas observaciones constituyen elementos de seguimiento técnico y no deben confundirse con pruebas ya superadas.

---

# Conclusiones

FitZone Sports implementa una solución organizada mediante un backend NestJS modular, una interfaz React y una base de datos PostgreSQL administrada con Prisma.

La arquitectura separa las responsabilidades funcionales y utiliza mecanismos de inyección de dependencias que facilitan la incorporación de nuevas funcionalidades.

Los patrones Strategy, Observer y Repository cumplen funciones concretas dentro del sistema.

Strategy permite modificar y ampliar las reglas tarifarias.

Observer desacopla la promoción de usuarios en lista de espera del proceso de cancelación de clases.

Repository concentra las operaciones de persistencia y mejora la capacidad de probar la lógica de negocio.

La integridad transaccional de PostgreSQL es fundamental para cumplir las reglas de concurrencia del sistema, especialmente la prevención de la sobreventa de canchas y de los ingresos simultáneos en múltiples sedes.

El control de acceso incorpora mecanismos de funcionamiento offline basados en snapshots, almacenamiento local y sincronización posterior, aunque conserva limitaciones de seguridad y operación que deben considerarse antes de cualquier uso productivo.

Los dos casos de extensión muestran que el diseño permite incorporar nuevos tipos de instalaciones y nuevas estrategias de precio reutilizando buena parte de la estructura existente.

Por último, el proyecto cuenta con pruebas automatizadas y un pipeline de integración continua que proporcionan herramientas para detectar defectos y verificar cambios.

La mantenibilidad del sistema depende de conservar la coherencia entre el código fuente, el modelo de datos, los diagramas, las pruebas y los registros de decisiones arquitectónicas.

---

# Referencias técnicas del proyecto

## Código fuente

- `backend/src/app.module.ts`
- `backend/src/auth/`
- `backend/src/usuarios/`
- `backend/src/acceso/`
- `backend/src/clases/`
- `backend/src/canchas/`
- `backend/src/pagos/`
- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`
- `frontend/src/App.tsx`
- `frontend/src/services/`
- `frontend/src/store/AppStore.tsx`
- `frontend/src/components/`

## Diagramas principales

- [C4 — Contexto](../diagramas/01-c4-nivel1-contexto.svg)
- [C4 — Contenedores](../diagramas/02-c4-nivel2-contenedores.svg)
- [C4 — Módulo Canchas](../diagramas/03-c4-nivel3-canchas.svg)
- [C4 — Módulo Acceso](../diagramas/04-c4-nivel3-acceso.svg)
- [UML — Clases del dominio](../diagramas/05-uml-clases-dominio.svg)
- [Secuencia — Reserva y pago](../diagramas/06-seq-reserva-cancha-pago.svg)
- [Secuencia — Concurrencia](../diagramas/07-seq-reserva-concurrente.svg)
- [Secuencia — Acceso offline](../diagramas/08-seq-acceso-offline.svg)
- [Estados — Membresía](../diagramas/09-estados-membresia.svg)
- [Estados — Reserva](../diagramas/10-estados-reserva.svg)
- [Actividad — Lista de espera](../diagramas/11-actividad-lista-espera.svg)
- [DER físico](../diagramas/12-der-fisico.svg)
- [Diagrama de despliegue](../diagramas/13-despliegue.svg)
- [Arquitectura CI/CD](../diagramas/14-pipeline-cicd.svg)

## Pruebas e integración

- `backend/vitest.config.ts`
- `backend/vitest.config.e2e.ts`
- `backend/test/concurrencia.e2e-spec.ts`
- `backend/test/flujos.e2e-spec.ts`
- `.github/workflows/ci.yml`

## Documentación complementaria

- [Manual de usuario](./manual-usuario.md)
- [Manual de instalación y operación](./manual-instalacion-operacion.md)
- [Revisión de code smells y refactorings](../refactoring-code-smells.md)
- [RNF-01 — Operación offline](../rnf/RNF-01.md)
- [RNF-02 — Tratamiento de pagos](../rnf/RNF-02.md)
- [RNF-03 — Rendimiento y disponibilidad](../rnf/RNF-03.md)
- [RNF-04 — Escalabilidad](../rnf/RNF-04.md)

---

**Fin del Manual Técnico — FitZone Sports — Equipo 12 — Versión 1.0.**