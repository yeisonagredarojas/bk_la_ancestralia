#!/bin/sh
# Espera a que Postgres esté disponible antes de iniciar el backend

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  echo "⏳ Esperando a que PostgreSQL ($host:5432) esté disponible..."
  sleep 2
done

echo "✅ PostgreSQL está listo, iniciando la aplicación..."
exec $cmd
