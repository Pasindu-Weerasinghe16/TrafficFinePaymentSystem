# Dev 1: Infrastructure & Gateway

## Role Overview
You are responsible for the physical environments, the database containers, and routing traffic from the outside world into the monolithic backend.

**Your Working Directories:** `./docker-compose.yml`, `./sl-police-gateway/`, `./sl-police-nginx/`

## Prerequisites
- Read `docs/plan/backend_architecture.md`.

## Strict Tasks

**1. Database Setup (DO FIRST)**
- Spin up the PostgreSQL database using the `docker-compose.yml`.
- **Constraint**: Ensure there is only a single primary database. Remove any primary-replica clustering to avoid overengineering.
- **Action Required**: Once running, notify Dev 2 so they can begin their JPA work.

**2. API Gateway & Nginx**
- Configure the API Gateway to route incoming traffic to the Spring Boot backend (`sl-police-monolith`).
- **Constraint**: You must wait for Dev 3 to finish writing the Controllers before you finalize the exact routing paths.
- Handle CORS configuration at the Gateway level to ensure the Web Portals (Dev 5 & 6) can communicate with the backend without browser errors.

**3. Integration Support**
- Assist frontends (Dev 4, 5, 6) in pointing their applications to the live Gateway URLs once the backend is fully deployed.
