#!/bin/sh
# Wait until PostgreSQL is available before starting the backend.

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  echo "Waiting for PostgreSQL ($host:5432)..."
  sleep 2
done

echo "PostgreSQL is ready, starting the application..."
exec $cmd
