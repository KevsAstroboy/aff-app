#!/bin/sh
set -e

echo "=== AFF App Entrypoint ==="

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" 2>/dev/null; do
    echo "PostgreSQL not ready, waiting..."
    sleep 2
done
echo "PostgreSQL is ready!"

# Apply seed if not already done (check for a marker table or use idempotent SQL)
echo "Applying database seed..."
PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/init-scripts/aff_db.sql 2>/dev/null || true
echo "Database seed applied (or already exists)."

# Wait for Redis
echo "Waiting for Redis..."
until nc -z "$REDIS_HOST" 6379 2>/dev/null; do
    echo "Redis not ready, waiting..."
    sleep 2
done
echo "Redis is ready!"

# Wait for MongoDB
echo "Waiting for MongoDB..."
until nc -z "$MONGO_HOST" 27017 2>/dev/null; do
    echo "MongoDB not ready, waiting..."
    sleep 2
done
echo "MongoDB is ready!"

# Wait for MinIO
echo "Waiting for MinIO..."
until nc -z "$MINIO_HOST" 9000 2>/dev/null; do
    echo "MinIO not ready, waiting..."
    sleep 2
done
echo "MinIO is ready!"

# Create MinIO bucket if not exists
echo "Ensuring MinIO bucket exists..."
mc alias set myminio http://$MINIO_HOST:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY 2>/dev/null || true
mc mb myminio/$MINIO_BUCKET 2>/dev/null || true
mc anonymous set download myminio/$MINIO_BUCKET 2>/dev/null || true
echo "MinIO bucket ready."

# Generate Prisma client
echo "Generating Prisma client..."
cd /app/api && npx prisma generate
echo "Prisma client generated."

# Start API (background)
echo "Starting API on port 3000..."
cd /app/api && node dist/src/main.js &
API_PID=$!

# Start Web (background) on port 3001, listen on all interfaces
echo "Starting Web on port 3001..."
cd /app/web && PORT=3001 HOSTNAME=0.0.0.0 node server.js &
WEB_PID=$!

# Give apps time to start
sleep 5

# Start Nginx (foreground)
echo "Starting Nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

echo "=== AFF App Started ==="
echo "  - API:   http://localhost:3000"
echo "  - Web:   http://localhost:3001"
echo "  - Nginx: http://localhost:80"

# Wait for any process to exit
wait -n $API_PID $WEB_PID $NGINX_PID

# Exit with status of process that exited first
exit $?
