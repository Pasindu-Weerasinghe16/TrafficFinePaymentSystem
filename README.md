# SL Police Traffic Fine Platform

This repository keeps the shared team environment pinned so all computers can run the same stable versions and start the full stack in Docker Desktop.

## Pinned Versions

- Java: [`.java-version`](.java-version)
- Node.js: [`.nvmrc`](.nvmrc)
- React Native: [sl-police-mobile-app/package.json](sl-police-mobile-app/package.json)
- Infra stack: [`docker-compose.yml`](docker-compose.yml)

## Root Environment Variables

The root [`.env`](.env) file is the source of truth for shared version pins used by Docker Compose and the service Dockerfiles.

| Variable | Value |
| --- | --- |
| `JAVA_VERSION` | `25` |
| `NODE_VERSION` | `24.16.0` |
| `REACT_VERSION` | `19.2.7` |
| `REACT_NATIVE_VERSION` | `0.86.0` |
| `NGINX_VERSION` | `1.30.2-alpine` |
| `POSTGRES_VERSION` | `18.4-alpine` |
| `SPRING_BOOT_BASE_IMAGE` | `eclipse-temurin:25-jre-alpine` |
| `NODE_BASE_IMAGE` | `node:24.16.0-alpine` |

## Version Matrix

| Component | Version |
| --- | --- |
| Java | `25` |
| Node.js | `24.16.0` |
| React | `19.2.7` |
| React Native | `0.86.0` |
| NGINX | `1.30.2-alpine` |
| PostgreSQL | `18.4-alpine` |
| Spring Boot runtime image | `eclipse-temurin:25-jre-alpine` |
| Mobile container image | `node:24.16.0-alpine` |
| Web container image | `node:24.16.0-alpine` |

Docker Desktop is the default runtime for the shared stack.

## Standard Setup

1. Install the exact runtime versions listed in the version files.
2. Start the local infrastructure with `docker compose up --build -d` from the repository root.
3. Keep backend, gateway, mobile, and web work inside the matching `sl-police-*` folders.
4. Update the version files first if the team agrees to move to a new runtime.

## Version Check

Use these commands to confirm your machine matches the repo baseline:

1. `java -version`
2. `node -v`
3. `docker --version`
4. `docker compose version`
5. `docker compose config`

## Work Order

Use this order when starting work so everyone keeps the same environment and shared contracts.

1. Member 1 sets up the root environment first.
2. Member 2 defines auth, schema, and shared DTOs.
3. Member 3 builds the fine and payment business flows.
4. Member 4 wires the React Native mobile app.
5. Member 5 builds the motorist portal.
6. Member 6 builds the admin dashboard.

## Environment Setup Process

Each member should follow the same setup process before editing code.

1. Pull the latest repo changes.
2. Verify the pinned runtime files at the root.
3. Start the shared stack with `docker compose up --build -d`.
4. Open only the folder assigned to that member.
5. Confirm the shared services are running before making changes.
6. Keep all edits inside the allowed folder for that member.

### Member 1 Setup

1. Open the root repo and check `.java-version`, `.nvmrc`, and `docker-compose.yml`.
2. Start Docker Desktop and confirm NGINX, gateway, monolith, and PostgreSQL containers are up.
3. Update infrastructure files only in [sl-police-nginx](sl-police-nginx), [sl-police-gateway](sl-police-gateway), [sl-police-monolith](sl-police-monolith), and the root [docker-compose.yml](docker-compose.yml).



1. Run `docker compose up --build -d` from the repository root.
2. Check the shared services with `docker compose ps`.
3. Use `docker compose logs -f sl-police-nginx` or `docker compose logs -f sl-police-postgres-primary` when debugging infrastructure.

### Member 2 Setup

1. Confirm the shared stack is running.
2. Open [sl-police-monolith](sl-police-monolith) only.
3. Create or update auth, entity, JWT, and DTO files inside that folder.



1. Make sure the root stack is already running with `docker compose up --build -d`.
2. Use `docker compose logs -f sl-police-monolith` to watch backend startup.
3. Restart only the monolith container after backend changes with `docker compose up -d --build sl-police-monolith`.

### Member 3 Setup

1. Confirm the shared stack is running.
2. Open [sl-police-monolith](sl-police-monolith) only.
3. Build fine APIs, payment logic, SMS integration, and replica queries inside that folder.



1. Keep the shared stack running from the root with `docker compose up --build -d`.
2. Monitor backend behavior with `docker compose logs -f sl-police-monolith`.
3. If payment or notification code changes, rebuild only the monolith container with `docker compose up -d --build sl-police-monolith`.

### Member 4 Setup

1. Confirm the shared stack is running.
2. Open [sl-police-mobile-app](sl-police-mobile-app) only.
3. Work on the React Native app, mobile screens, camera features, and token storage inside that folder.



1. Start the root stack with `docker compose up --build -d`.
2. Check the mobile container with `docker compose logs -f sl-police-mobile-app`.
3. Rebuild only the mobile service after app changes with `docker compose up -d --build sl-police-mobile-app`.

### Member 5 Setup

1. Confirm the shared stack is running.
2. Open [sl-police-motorist-portal](sl-police-motorist-portal) only.
3. Work on the motorist portal UI, lookup flow, payment form, and responsive layout inside that folder.



1. Start the root stack with `docker compose up --build -d`.
2. Check the portal container with `docker compose logs -f sl-police-motorist-portal`.
3. Rebuild only the portal service after UI changes with `docker compose up -d --build sl-police-motorist-portal`.

### Member 6 Setup

1. Confirm the shared stack is running.
2. Open [sl-police-admin-portal](sl-police-admin-portal) only.
3. Work on the admin login, charts, and dashboard metrics inside that folder.



1. Start the root stack with `docker compose up --build -d`.
2. Check the admin container with `docker compose logs -f sl-police-admin-portal`.
3. Rebuild only the admin service after dashboard changes with `docker compose up -d --build sl-police-admin-portal`.

## Member Folders

Each member should edit only the folder listed for their work.

- Member 1 - [sl-police-nginx](sl-police-nginx), [sl-police-gateway](sl-police-gateway), [sl-police-monolith](sl-police-monolith), and the root [docker-compose.yml](docker-compose.yml). Use this area for repo strategy, NGINX, gateway routing, and PostgreSQL replication.
- Member 2 - [sl-police-monolith](sl-police-monolith). Use this area for Spring Boot auth, JPA entities, JWT, and shared DTO definitions.
- Member 3 - [sl-police-monolith](sl-police-monolith). Use this area for fine APIs, payment logic, SMS notifications, and replica queries.
- Member 4 - [sl-police-mobile-app](sl-police-mobile-app). Use this area for the React Native mobile app, on-the-spot payment flow, camera features, and local token storage.
- Member 5 - [sl-police-motorist-portal](sl-police-motorist-portal). Use this area for the motorist SPA, fine lookup, payment form, and responsive UI.
- Member 6 - [sl-police-admin-portal](sl-police-admin-portal). Use this area for the admin portal, login, charts, and dashboard metrics.

## Editing Rule

Do not edit another member's folder unless the team agrees on the change first. Shared changes should go through the root config or the shared API contracts defined by the backend members.

## Folder Map

- [sl-police-nginx](sl-police-nginx) - NGINX load balancing layer
- [sl-police-gateway](sl-police-gateway) - Spring Cloud Gateway
- [sl-police-monolith](sl-police-monolith) - Spring Boot core backend
- [sl-police-mobile-app](sl-police-mobile-app) - React Native mobile app
- [sl-police-motorist-portal](sl-police-motorist-portal) - Motorist web portal
- [sl-police-admin-portal](sl-police-admin-portal) - Admin dashboard
