# Africa Future Festival - Application Complète

Application web full-stack pour le festival Africa Future Festival (AFF).

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)

## Installation rapide

### Option 1 : Télécharger uniquement docker-compose.yml

```bash
# Créer un dossier
mkdir aff-app && cd aff-app

# Télécharger le fichier docker-compose
curl -O https://raw.githubusercontent.com/kevsengineer/aff-app/main/docker-compose.yml

# Lancer l'application
docker-compose up -d
```

### Option 2 : Cloner le repo complet

```bash
git clone https://github.com/kevsengineer/aff-app.git
cd aff-app
docker-compose up -d
```

## Accès

Une fois lancé, ouvrez votre navigateur :

| Service | URL |
|---------|-----|
| **Application** | http://localhost |
| **Console MinIO** | http://localhost:9001 (user: `minioadmin`, pass: `minioadmin`) |

## Comptes de démonstration

L'application est pré-configurée avec des données de démonstration.

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@aff.com` | `admin123` | Administrateur |
| `user@aff.com` | `user123` | Utilisateur |

## Commandes utiles

```bash
# Démarrer l'application
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f app

# Arrêter l'application
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v

# Redémarrer
docker-compose restart
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
│      (NestJS:3000)       │       (Next.js:3001)             │
├─────────────────────────────────────────────────────────────┤
│                     Services                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │PostgreSQL│  │ MongoDB  │  │  Redis   │  │  MinIO   │    │
│  │  :5432   │  │  :27017  │  │  :6379   │  │  :9000   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Support

Pour toute question ou problème, contactez l'équipe technique.

---

**Africa Future Festival** - Abidjan, Côte d'Ivoire
