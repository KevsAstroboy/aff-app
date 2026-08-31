# Africa Future Festival - Application Complète

Application web full-stack pour le festival Africa Future Festival (AFF).

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)

> **Note Windows/Mac** : Installez [Docker Desktop](https://www.docker.com/products/docker-desktop/) qui inclut tout.
>
> **Note Linux** : Installez Docker Engine + Docker Compose plugin.

## Installation (3 étapes)

### Étape 1 : Créer un dossier

```bash
mkdir aff-app
cd aff-app
```

### Étape 2 : Créer le fichier docker-compose.yml

Créez un fichier nommé `docker-compose.yml` et copiez-collez ce contenu :

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: aff-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: aff_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - aff-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
    restart: unless-stopped

  mongodb:
    image: mongo:7
    container_name: aff-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: mongo
      MONGO_INITDB_DATABASE: aff_messages
    volumes:
      - mongo_data:/data/db
    networks:
      - aff-network
    command: mongod --quiet
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: aff-redis
    volumes:
      - redis_data:/data
    networks:
      - aff-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    container_name: aff-minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    networks:
      - aff-network
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  app:
    image: kevsengineer/aff-app:latest
    container_name: aff-app
    ports:
      - "80:80"
    depends_on:
      postgres:
        condition: service_healthy
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: aff_db
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/aff_db
      MONGO_HOST: mongodb
      MONGO_URI: mongodb://mongo:mongo@mongodb:27017/aff_messages?authSource=admin
      REDIS_HOST: redis
      REDIS_URL: redis://redis:6379
      MINIO_HOST: minio
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
      MINIO_BUCKET: aff-uploads
      MINIO_USE_SSL: "false"
      JWT_SECRET: aff-super-secret-jwt-key-change-in-production-64-chars-minimum
      JWT_EXPIRATION: 7d
      MAIL_HOST: smtp.gmail.com
      MAIL_PORT: 587
      MAIL_USER: diakiteabdulkarim094@gmail.com
      MAIL_PASS: iatqgllnacvnghdb
      MAIL_FROM: "Africa Future Festival <diakiteabdulkarim094@gmail.com>"
      NODE_ENV: production
      PORT: 3000
    networks:
      - aff-network
    restart: unless-stopped

volumes:
  postgres_data:
  mongo_data:
  redis_data:
  minio_data:

networks:
  aff-network:
    driver: bridge
```

### Étape 3 : Lancer l'application

```bash
docker compose up -d
```

Cette commande va :
1. Télécharger automatiquement toutes les images nécessaires (première fois uniquement)
2. Créer et démarrer tous les services
3. Initialiser la base de données avec les données de démonstration

**Attendez environ 1-2 minutes** que tous les services démarrent.

## Accès à l'application

Une fois lancée, ouvrez votre navigateur :

| Service | URL |
|---------|-----|
| **Application** | http://localhost |
| **Console MinIO** (optionnel) | http://localhost:9001 |

> Si le port 80 est déjà utilisé, modifiez `"80:80"` en `"8080:80"` dans le docker-compose.yml, puis accédez à http://localhost:8080

## Commandes utiles

```bash
# Voir l'état des services
docker compose ps

# Voir les logs (utile si problème)
docker compose logs -f

# Voir les logs de l'application seulement
docker compose logs -f app

# Arrêter l'application
docker compose down

# Redémarrer l'application
docker compose restart

# Arrêter et SUPPRIMER toutes les données
docker compose down -v
```

## Mise à jour de l'application

Si une nouvelle version est disponible :

```bash
# Télécharger la nouvelle version
docker compose pull

# Redémarrer avec la nouvelle version
docker compose up -d
```

## Problèmes courants

### "Port 80 already in use"

Un autre service utilise le port 80. Solutions :
1. Arrêtez l'autre service (Apache, nginx, etc.)
2. Ou changez le port : remplacez `"80:80"` par `"8080:80"` dans docker-compose.yml

### "Cannot connect to Docker daemon"

Docker n'est pas démarré. Lancez Docker Desktop (Windows/Mac) ou le service Docker (Linux).

### L'application ne répond pas

Attendez 1-2 minutes après `docker compose up -d`. Vérifiez les logs :
```bash
docker compose logs -f app
```

### Réinitialiser complètement

Pour tout supprimer et recommencer :
```bash
docker compose down -v
docker compose up -d
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    http://localhost                         │
├─────────────────────────────────────────────────────────────┤
│                     Nginx (port 80)                         │
│                          │                                  │
│            ┌─────────────┼─────────────┐                    │
│            ▼             │             ▼                    │
│      /api/* → API        │       /* → Frontend              │
│      (NestJS)            │       (Next.js)                  │
├─────────────────────────────────────────────────────────────┤
│                     Services                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │PostgreSQL│  │ MongoDB  │  │  Redis   │  │  MinIO   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Support

Pour toute question ou problème, contactez l'équipe technique.

---

**Africa Future Festival** - Abidjan, Côte d'Ivoire
