# Manual de instalación y operación — FitZone Sports

**Versión:** 1.0 · **Repositorio:** Integrador_ProgV_Sis2026

## Índice

1. [Requisitos previos · Versiones exactas de software](#1-requisitos-previos--versiones-exactas-de-software)
2. [Puesta en marcha en entorno de desarrollo](#2-puesta-en-marcha-en-entorno-de-desarrollo)
3. [Puesta en marcha en entorno de producción](#3-puesta-en-marcha-en-entorno-de-producción)
4. [Variables de entorno: tabla completa](#4-variables-de-entorno-tabla-completa)
5. [Base de datos: migraciones, reversión y datos semilla](#5-base-de-datos-migraciones-reversión-y-datos-semilla)
6. [Despliegue: estrategia adoptada y procedimiento de reversión](#6-despliegue-estrategia-adoptada-y-procedimiento-de-reversión)
7. [Respaldo y restauración](#7-respaldo-y-restauración)
8. [Operación degradada: caída de la conexión principal y resincronización](#8-operación-degradada-caída-de-la-conexión-principal-y-resincronización)
9. [Alta de una sede nueva sin detener el sistema](#9-alta-de-una-sede-nueva-sin-detener-el-sistema)
10. [Monitoreo: registros, métricas y verificación de estado](#10-monitoreo-registros-métricas-y-verificación-de-estado)
11. [Resolución de problemas de instalación](#11-resolución-de-problemas-de-instalación)

## 1. Requisitos previos · Versiones exactas de software

El repositorio no fija versiones exactas para todas las herramientas. Estos son los tags de los Dockerfiles y Compose, junto con las versiones instaladas en el entorno usado para documentar:

| Componente | Versión/tag declarado | Observación |
|---|---|---|
| Docker Engine | 29.4.3 observado | Docker Desktop puede incluir el Engine. |
| Docker Compose | 5.1.3 observado | Se usa el subcomando `docker compose`. |
| PostgreSQL | `postgres:18-alpine`; servidor observado: 18.7 | Servicio de base declarado en `docker-compose.yml`. |
| Node.js backend | `node:22-slim`; runtime observado: 22.23.5 | Tag de imagen móvil; versión observada en el contenedor documentado. |
| Node.js frontend build | `node:20-alpine` | Compila Vite; luego se copia el resultado a Nginx. |
| Nginx runtime | `nginx:alpine`; runtime observado: 1.31.9 | Tag de imagen móvil; sirve frontend por HTTP y HTTPS. |
| Prisma | CLI y cliente 5.22.0 (lockfile) | Dependencias del backend. |
| NestJS | 12.0.1 (lockfile) | Dependencia del backend. |
| React / Vite | React 19.2.8, Vite 8.2.2 (lockfile) | Dependencias del frontend. |

Los tags `alpine` y las versiones con `^` no son fijaciones inmutables. Para un despliegue controlado, fijá versiones o digests compatibles y validá la actualización. Se necesita Git, Docker en ejecución y los puertos 5173, 5443, 3000 y 5432 libres para el Compose actual.

## 2. Puesta en marcha en entorno de desarrollo

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env
# Editar .env si se necesitan valores locales diferentes

docker compose up --build
```

Compose construye backend y frontend y levanta PostgreSQL. El backend reintenta la conexión a la base, aplica migraciones pendientes con `prisma migrate deploy`, ejecuta `npm run seed` e inicia NestJS. La primera construcción descarga imágenes y dependencias y puede tardar varios minutos. Para dejarlo en segundo plano:

```powershell
docker compose up --build -d
docker compose logs -f --tail=100
```

| Uso | Dirección |
|---|---|
| Portal socio / panel | `http://localhost:5173` |
| HTTPS local (certificado autofirmado; útil para probar cámara) | `https://localhost:5443` |
| API NestJS publicada | `http://localhost:3000` |
| Swagger UI | `http://localhost:3000/api` |
| PostgreSQL desde el host | `localhost:5432` |

Cuentas sembradas para demostración (README): `admin@fitzone.com` / `Admin123!` (gerente); `recepcion.centro@fitzone.com` / `Recepcion123!` (administrador de sede); `carlos.cliente@fitzone.com` / `Cliente123!` (socio activo). El seed vuelve a fijar estas contraseñas al ejecutarse. No las uses fuera de desarrollo.

Detener servicios conservando la base:

```powershell
docker compose down
```

`docker compose down -v` elimina el volumen de PostgreSQL y sus datos. Reservalo para reiniciar deliberadamente una instancia descartable; no lo uses para el apagado habitual.

## 3. Puesta en marcha en entorno de producción

**Este repositorio no incluye un Compose de producción ni está endurecido para producción.** El Compose actual publica PostgreSQL en el host, permite valores inseguros por omisión si falta `.env`, el HTTPS del frontend usa un certificado autofirmado y el entrypoint ejecuta el seed de demostración en cada inicio. El seed crea cuentas de prueba y les restablece contraseñas conocidas. No publiques esta configuración tal cual en Internet ni la conectes a datos reales.

Antes de habilitar producción, el equipo operador debe preparar y revisar un despliegue separado que:

1. Retire el seed de prueba del arranque productivo y evite recrear/restablecer cuentas demo.
2. Reemplace secretos de ejemplo por valores aleatorios únicos almacenados en un gestor de secretos.
3. Use PostgreSQL administrado o privado, sin publicar su puerto a redes públicas, con almacenamiento persistente y política de backup/restauración verificada.
4. Termine TLS con certificado válido en un proxy/ingress y publique solo los endpoints necesarios.
5. Fije versiones/digests de imágenes, ejecute migraciones en una ventana controlada y pruebe restauración y reversión.
6. Incorpore health checks, monitoreo de aplicación/base y un proceso de actualización. Compose local no ofrece despliegue rolling ni alta disponibilidad.

Luego de implementar y aprobar esos cambios, se puede desplegar con Compose o la plataforma que defina la organización. Este repositorio no proporciona un comando de producción listo y seguro.

## 4. Variables de entorno: tabla completa

El `.env.example` raíz declara estas variables. Copialo como `.env` para personalizar la interpolación de Compose. Los valores `change_me_*` son marcadores de desarrollo, no secretos seguros.

| Variable | Valor de ejemplo | Uso / alcance |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Usuario inicial de PostgreSQL; Compose lo pasa al contenedor y arma la URL interna del backend. |
| `POSTGRES_PASSWORD` | `change_me_postgres_password` | Contraseña local; Compose la usa en la URL interna del backend. Cambiar en cualquier ambiente propio. |
| `POSTGRES_DB` | `fitzone_sports` | Base inicial; Compose construye con ella la URL interna. |
| `PORT` | `3000` | Puerto de escucha de NestJS dentro del contenedor backend. |
| `DATABASE_URL` | URL con host `localhost:5432` | Ejemplo para correr backend directamente en el host. En Compose, backend recibe una URL armada con el host de servicio `postgres`; esta variable no reemplaza la URL interna. |
| `JWT_SECRET` | `change_me_jwt_secret` | Firma de tokens JWT; configurar un secreto aleatorio privado. |
| `QR_SECRET` | `change_me_qr_secret` | Firma/validación del QR dinámico; configurar un secreto aleatorio privado. |

`backend/.env.example` declara además `VITE_CLUB_NAME`, `VITE_SEDE_ID` y `VITE_SEDE_NOMBRE`. El Compose raíz no carga ese archivo ni pasa esas variables como `build.args` al compilar el frontend, por lo que no reconfiguran automáticamente la imagen. `frontend/.env.example` está vacío. El código también referencia `VITE_SEDE_LOCALIDAD` como `import.meta.VITE_SEDE_LOCALIDAD` (no como `import.meta.env.VITE_SEDE_LOCALIDAD`); no se incluye entre las variables configurables por Vite en este estado.

Compose usa expresiones `${VARIABLE:-valor}` para usuario, contraseña, base, puerto y secretos; si falta una variable, se aplica el valor por defecto del YAML. Revisá `docker compose config` antes de un despliegue propio y no compartas su salida si contiene secretos.

## 5. Base de datos: migraciones, reversión y datos semilla

PostgreSQL conserva datos en el volumen nombrado `postgres_data`. Al iniciar, `backend/docker-entrypoint.sh` reintenta la conexión hasta 15 veces, ejecuta `npx prisma migrate deploy`, corre el seed y luego inicia el backend.

Migraciones versionadas en `backend/prisma/migrations/`:

- `0_init`
- `20261118000000_indices_parciales_y_disponibilidad`
- `20261118010000_reserva_cancha_cumplida_y_penalidad`
- `20261118020000_reserva_clase_penalidad`

Consultar estado aplicado:

```powershell
docker compose exec backend npx prisma migrate status
```

El seed de demostración puede ejecutarse manualmente con `docker compose exec backend npm run seed`. Carga sedes, usuarios, planes, clases y registros de muestra. No es una rutina productiva; no se debe ejecutar contra datos reales. El entrypoint actual sí lo ejecuta automáticamente en cada inicio.

### Procedimiento de reversión de migraciones

No hay archivos `down.sql` ni reversión automática. Tratá cada reversión como una operación de base con respaldo y ventana de mantenimiento:

1. Detené temporalmente las escrituras de la aplicación y avisá a los operadores.
2. Identificá la migración y su estado con `npx prisma migrate status`; confirmá también su fila en `_prisma_migrations`.
3. Tomá un backup verificable de la base actual y localizá el backup previo a la migración, si existe.
4. Si quedó **fallida/incompleta**, revisá su SQL y el esquema actual. Aplicá manualmente, con revisión técnica, las sentencias inversas necesarias para regresar al esquema anterior; después marcá esa migración como revertida para que Prisma pueda reintentarlo al corregir la causa:

   ```powershell
   docker compose exec backend npx prisma migrate resolve --rolled-back NOMBRE_MIGRACION
   ```

5. Si quedó **aplicada**, la opción preferida es restaurar el backup previo en una instancia controlada. Verificá esquema, datos e historial de migraciones antes de reabrir escrituras. No marques como revertida una migración aplicada sin haber restaurado o deshecho efectivamente sus cambios.
6. Si no existe backup previo y los cambios están aplicados, prepará una migración compensatoria hacia adelante, revisada y respaldada. No improvises SQL destructivo sobre producción.
7. Verificá `prisma migrate status`, salud de la aplicación y registros pertinentes. Conservá el backup y el registro de intervención.

No ejecutes `migrate reset` en producción: elimina y recrea la base. Revertir el código de aplicación tampoco revierte el esquema; confirmá que el código anterior sea compatible con las migraciones ya aplicadas.

## 6. Despliegue: estrategia adoptada y procedimiento de reversión

El proyecto usa Docker Compose con tres servicios: PostgreSQL, backend NestJS y frontend Nginx. El desarrollo local se actualiza con `docker compose up --build`; Compose recrea los contenedores necesarios, pero no define despliegue rolling ni réplicas.

Flujo recomendado para un ambiente no productivo:

1. Revisar el cambio y sus migraciones.
2. Respaldar la base y registrar tags/imágenes actuales.
3. Construir y recrear: `docker compose up --build -d`.
4. Confirmar migraciones, `docker compose ps`, logs y flujos afectados.

Para revertir la aplicación, volver a desplegar las imágenes de la versión anterior y revisar sus logs. Si el cambio incluyó una migración incompatible, detenerse y seguir la sección 5 o aplicar una migración compensatoria. No borrar el volumen PostgreSQL para corregir un despliegue.

## 7. Respaldo y restauración

El volumen Docker persiste al ejecutar `docker compose down`, pero no reemplaza un backup. Programá dumps fuera del contenedor y guardalos con acceso restringido y retención. Ejemplo PowerShell para producir un dump SQL local usando usuario y base del `.env`:

```powershell
$envLines = Get-Content .env
$dbUser = ($envLines | Where-Object { $_ -match '^POSTGRES_USER=' } | Select-Object -First 1) -replace '^POSTGRES_USER=', ''
$dbName = ($envLines | Where-Object { $_ -match '^POSTGRES_DB=' } | Select-Object -First 1) -replace '^POSTGRES_DB=', ''
cmd /c "docker compose exec -T postgres pg_dump -U $dbUser $dbName > backup-fitzone.sql"
```

Antes de restaurar, poné la aplicación en mantenimiento y confirmá el destino/fecha del backup. Restaurar en una base de recuperación vacía:

```powershell
Get-Content .\backup-fitzone.sql -Raw | docker compose exec -T postgres psql -U postgres -d fitzone_sports
```

Ajustá usuario y base al ambiente real. En recuperación crítica, restaurá primero en una instancia aislada y verificá integridad antes del cambio de destino. Ensayá periódicamente tanto la lectura del dump como la restauración completa.

## 8. Operación degradada: caída de la conexión principal y resincronización

El terminal de acceso descarga un snapshot local de socios activos para una sede. Si pierde conexión, puede validar el QR con el snapshot y guardar ingresos aceptados en una cola local del navegador; el panel indica el modo offline y los pendientes.

1. Confirmá **Modo offline** y que haya snapshot local reciente. Sin snapshot, puede no autorizar ingresos.
2. Seguí la política de acceso de la sede; no tomes como autorizado un intento que no pudo validarse con la copia local.
3. No borres datos del navegador ni almacenamiento local del terminal: allí quedan cola y snapshot.
4. Al recuperar red, el panel intenta sincronizar periódicamente. También se puede pulsar **Sincronizar ahora**.
5. Revisá aceptados, duplicados/conflictos y aforo. Resolvé manualmente conflictos operativos.

La sincronización es idempotente ante duplicados identificables, pero no elimina conflictos de negocio (por ejemplo, intentos incompatibles entre sedes). Registrá hora de caída y conflictos.

## 9. Alta de una sede nueva sin detener el sistema

El alta está disponible desde el panel gerente mientras los servicios siguen activos:

1. Iniciá sesión como Gerente y abrí **Sedes → Nueva sede**.
2. Ingresá nombre único, dirección, localidad y aforo máximo entero positivo.
3. Guardá y verificá la ficha y su aparición en los selectores que consultan sedes.
4. Coordiná aparte la asignación de personal, canchas, clases y operación de la sede.

La API actual permite crear sedes, pero no editar las existentes. Validá los datos antes de guardar. El alta no requiere detener backend ni base.

## 10. Monitoreo: registros, métricas y verificación de estado

Comprobar servicios y PostgreSQL:

```powershell
docker compose ps
docker compose logs --tail=100 postgres
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
```

Seguir backend en vivo: `docker compose logs -f --tail=100 backend`. Compose define healthcheck para PostgreSQL (`pg_isready`); backend y frontend no declaran healthcheck y el repositorio no configura métricas ni logs centralizados.

Comprobaciones manuales: abrir el portal, consultar `http://localhost:3000/api` para Swagger y confirmar respuesta del login/API. Revisar logs de arranque para errores de conexión, migración y seed. Los reportes del frontend son datos mock y no sirven como métricas productivas.

## 11. Resolución de problemas de instalación

| Síntoma | Diagnóstico / acción |
|---|---|
| `docker compose` no se reconoce | Instalar/actualizar Docker Desktop con Compose integrado y abrir el Engine. Confirmar con `docker version` y `docker compose version`. |
| Puerto ocupado | Revisar procesos que usan 5173, 5443, 3000 o 5432; detener el conflicto o cambiar el mapeo de puertos. |
| Backend termina tras 15 intentos | Revisar `docker compose ps`, salud/logs de `postgres`, credenciales `POSTGRES_*` y volumen. Backend espera que PostgreSQL esté healthy. |
| Error `P1001` / conexión a base | Dentro de Compose, el host es `postgres`, no `localhost`; revisar URL interna, base, usuario y contraseña. Desde el host se usa `localhost:5432`. |
| Error de migración Prisma | Consultar logs backend y `npx prisma migrate status`; no borrar volumen. Seguir la sección 5. |
| Login devuelve 401 | Revisar correo, contraseña, rol y finalización del seed. Contraseñas de README solo aplican a la base demo. |
| Frontend carga pero API falla | Confirmar backend, Swagger y logs de Nginx/backend. Revisar el proxy `/backend` en `frontend/nginx.conf`. |
| Cámara no disponible | Probar `https://localhost:5443`, aceptar el certificado local de prueba y habilitar cámara; o pegar token manualmente. |
| Reiniciar todo | `docker compose down` conserva datos. Usar `docker compose down -v` solo si se acepta perder toda la base local. |
