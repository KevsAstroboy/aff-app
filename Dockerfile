# ==============================================================================
# Stage 1: Build API (NestJS)
# ==============================================================================
FROM node:22-alpine AS api-builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY apps/api/package*.json ./
RUN npm ci

COPY apps/api/ ./
COPY apps/api/prisma ./prisma

RUN npx prisma generate
RUN npm run build

# ==============================================================================
# Stage 2: Build Web (Next.js)
# ==============================================================================
FROM node:22-alpine AS web-builder

WORKDIR /app

COPY apps/web/package*.json ./
RUN npm ci

COPY apps/web/ ./

# Set API URL for build time (relative path for nginx proxy)
ENV NEXT_PUBLIC_API_URL=/api

RUN npm run build

# ==============================================================================
# Stage 3: Production Runtime
# ==============================================================================
FROM node:22-alpine AS runtime

# Install dependencies
RUN apk add --no-cache \
    nginx \
    postgresql-client \
    netcat-openbsd \
    openssl \
    curl

# Install MinIO client for bucket creation
RUN curl -fsSL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc \
    && chmod +x /usr/local/bin/mc

WORKDIR /app

# Copy API build
COPY --from=api-builder /app/dist ./api/dist
COPY --from=api-builder /app/node_modules ./api/node_modules
COPY --from=api-builder /app/package*.json ./api/
COPY --from=api-builder /app/prisma ./api/prisma

# Copy Web build
COPY --from=web-builder /app/.next/standalone ./web
COPY --from=web-builder /app/.next/static ./web/.next/static
COPY --from=web-builder /app/public ./web/public

# Copy init scripts (seed SQL)
COPY init-scripts/ ./init-scripts/

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Environment variables (defaults, can be overridden)
ENV NODE_ENV=production \
    PORT=3000 \
    POSTGRES_HOST=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_DB=aff_db \
    REDIS_HOST=redis \
    MONGO_HOST=mongodb \
    MINIO_HOST=minio \
    MINIO_ACCESS_KEY=minioadmin \
    MINIO_SECRET_KEY=minioadmin \
    MINIO_BUCKET=aff-uploads

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
