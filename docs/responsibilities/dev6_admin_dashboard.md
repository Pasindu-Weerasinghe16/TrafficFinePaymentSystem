# Dev 6: Web Developer (Admin Dashboard)

## Role Overview
You are building the secure web dashboard for Senior Police Officials to monitor nationwide traffic fine collections.

**Your Working Directory:** `./sl-police-admin-portal/`

## Prerequisites
- Read `docs/plan/frontend_architecture.md` and `docs/plan/api_endpoints.md`.
- Read `docs/plan/user_stories.md` (Story 3).

## Strict Tasks

**1. Build Static UI (Start Immediately)**
- Build the `sl-police-admin-portal` Single Page Application (React/Vue).
- Create the `Login` screen.
- Create the `DashboardLayout` containing:
  - `OverviewWidgets` (Total collected, Total fines paid).
  - `DistrictStatsChart`.
  - `CategoryBreakdownChart`.
- Create list views for Fines, Officers, and Categories.
- **Constraint**: DO NOT wait for the backend. Use hardcoded mock data for your charts and tables matching the structure in `api_endpoints.md`.

**2. Authentication Integration**
- As soon as Dev 2 finishes the JWT Security configuration, connect your `Login` screen to `/api/auth/login` and store the JWT token locally.

**3. Full Integration**
- Once Dev 3 finishes the Admin endpoints and Dev 1 configures the Gateway, swap all chart and table mock data with live API calls.
- Ensure the JWT token is sent in the Authorization header for all API calls.
