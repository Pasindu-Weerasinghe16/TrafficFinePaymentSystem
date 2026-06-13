# Dev 4: Android App Developer

## Role Overview
You are building the on-the-spot payment application used by drivers.

**Your Working Directory:** `./sl-police-mobile-app/`

## Prerequisites
- Read `docs/plan/frontend_architecture.md` and `docs/plan/functional_requirements.md`.
- Read `docs/plan/user_stories.md` (Story 1).

## Strict Tasks

**1. Build Static UI (Start Immediately)**
- Build the `sl-police-mobile-app` using React Native (as defined in package.json).
- Create a `Home / Search Screen` that accepts:
  - Reference Number
  - Category ID
  - Officer Badge Number
- Create a `Payment Screen` and `Success Screen`.
- **Constraint**: DO NOT wait for the backend to be ready. Mock the API responses using the JSON defined in `docs/plan/api_endpoints.md`.

**2. Integration**
- Once Dev 1 confirms the Gateway is live, replace your JSON mocks with real HTTP requests to the Gateway URL.
- Test the end-to-end flow of paying a fine.
