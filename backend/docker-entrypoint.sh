#!/bin/sh
set -e

echo "📦 Aplicando migraciones de Prisma..."
ATTEMPTS=0
until npx prisma migrate deploy; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 15 ]; then
    echo "❌ No se pudo conectar a PostgreSQL tras 15 intentos."
    exit 1
  fi
  echo "⏳ Esperando a que PostgreSQL acepte conexiones TCP (intento $ATTEMPTS/15)..."
  sleep 2
done

echo "🌱 Ejecutando seeder de base de datos..."
npm run seed

echo "🚀 Iniciando servidor FitZone Sports Backend..."
exec "$@"
