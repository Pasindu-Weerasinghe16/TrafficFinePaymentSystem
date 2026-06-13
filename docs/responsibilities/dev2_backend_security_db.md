# Dev 2: Backend Security & JPA Entities & DB

## Role Overview
You are responsible for laying the foundation of the backend. You build the database schema and secure the API.

**Your Working Directory:** `./sl-police-monolith/`

## Prerequisites
- Read `docs/plan/database_schema.md` and `docs/plan/api_endpoints.md`.
- **WAIT** for Dev 1 to provide the PostgreSQL container.

## Strict Tasks

**1. Database Entities**
- Connect the `sl-police-monolith` application to the Postgres database.
- Create the exactly 5 JPA Entity classes corresponding to the schema:
  - `User` (for admin login)
  - `Officer`
  - `FineCategory`
  - `TrafficFine` (Include the `location` field!)
  - `Payment`
- Create the basic Spring Data JPA Repositories for these entities.
- **Action Required**: Push this code to the `main` branch immediately. Dev 3 is 100% blocked until you do this.

**2. Security & JWT**
- Implement Spring Security.
- Create the `/api/auth/login` endpoint that accepts `{username, password}` and returns a JWT token.
- Secure all endpoints starting with `/api/admin/**` to require this JWT token.
- Allow public access to `/api/fines/**` and `/api/payments/**`.
- **Action Required**: Notify Dev 6 (Admin Dashboard) when login is ready so they can test their UI.
