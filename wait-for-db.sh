#!/bin/sh

set -e

host="$1"
port="$2"
shift 2  # Shift to get any remaining arguments

echo "Waiting for Postgres at $host:$port"

while ! nc -z "$host" "$port"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec "$@"  # Pass the remaining arguments to exec
