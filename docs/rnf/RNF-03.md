# RNF-03 — Rendimiento en consultas de disponibilidad de canchas

## Requisito
La consulta de disponibilidad de canchas (`GET /canchas/:id/disponibilidad?fecha=YYYY-MM-DD`) debe responder en pocos milisegundos mediante índices declarados en base de datos.

## Diseño e implementación
- **Índice compuesto de disponibilidad:** declarado en [schema.prisma](../../backend/prisma/schema.prisma) y creado en la migración [20261118000000_indices_parciales_y_disponibilidad/migration.sql](../../backend/prisma/migrations/20261118000000_indices_parciales_y_disponibilidad/migration.sql):
  ```sql
  CREATE INDEX "ix_reserva_cancha_disponibilidad"
      ON "reserva_cancha"("cancha_id", "fecha", "hora_inicio");
  ```
- **Índice único parcial de no sobreventa (RN-02):**
  ```sql
  CREATE UNIQUE INDEX "ux_reserva_cancha_slot"
      ON "reserva_cancha"("cancha_id", "fecha", "hora_inicio")
      WHERE "estado" <> 'CANCELADA';
  ```

## Comando de verificación (`EXPLAIN ANALYZE`)
Con PostgreSQL levantado (`cd backend/database && docker compose up -d && cd .. && npm run db:migrate && npm run seed`), ejecutar:
```bash
docker exec -i grupo12_ProgV_integrador psql -U postgres -d fitzone_sports -c "
EXPLAIN (ANALYZE, BUFFERS)
SELECT hora_inicio, estado
FROM reserva_cancha
WHERE cancha_id = 1
  AND fecha = CURRENT_DATE + 2
  AND estado <> 'CANCELADA';
"
```

> **Nota de ejecución:** Al generar este documento Docker Desktop no estaba corriendo en el entorno local. Ejecutar el comando anterior con el contenedor activo y pegar la salida de `Index Scan using ux_reserva_cancha_slot` / `ix_reserva_cancha_disponibilidad` y `Execution Time: < 1 ms` debajo para completar la captura final.
