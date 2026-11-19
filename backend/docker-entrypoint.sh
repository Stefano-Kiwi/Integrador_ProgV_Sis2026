#!/bin/sh
set -e

echo "🌱 Ejecutando seeder de base de datos..."
npm run seed

echo "🚀 Iniciando servidor FitZone Sports Backend..."
exec "$@"
