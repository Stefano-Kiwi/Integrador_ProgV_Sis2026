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

## Evidencia ejecutada (`EXPLAIN ANALYZE` real sobre PostgreSQL 18)
Comando ejecutado el 2026-11-19 contra el contenedor `fitzone_postgres`:
```bash
docker exec -i fitzone_postgres psql -U postgres -d fitzone_sports -c "
EXPLAIN (ANALYZE, BUFFERS)
SELECT hora_inicio, estado
FROM reserva_cancha
WHERE cancha_id = 1
  AND fecha = CURRENT_DATE + 2
  AND estado <> 'CANCELADA';
"
```

Salida real:
```text
                                                                QUERY PLAN
------------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using ux_reserva_cancha_slot on reserva_cancha  (cost=0.15..8.17 rows=1 width=6) (actual time=0.039..0.040 rows=1.00 loops=1)
   Index Cond: ((cancha_id = 1) AND (fecha = (CURRENT_DATE + 2)))
   Index Searches: 1
   Buffers: shared hit=2
 Planning:
   Buffers: shared hit=146
 Planning Time: 1.359 ms
 Execution Time: 0.068 ms
(8 rows)
```

Se verifica el uso directo del índice (`Index Scan using ux_reserva_cancha_slot`) con un tiempo de ejecución de **0.068 ms**.
