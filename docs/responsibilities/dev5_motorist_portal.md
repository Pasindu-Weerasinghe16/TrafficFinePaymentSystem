# Dev 5: Web Developer (Motorist Portal)

## Role Overview
You are building the web application that drivers use from home to pay their fines later.

**Your Working Directory:** `./sl-police-motorist-portal/`

## Prerequisites
- Read `docs/plan/frontend_architecture.md` and `docs/plan/functional_requirements.md`.
- Read `docs/plan/user_stories.md` (Story 2).

## Strict Tasks

**1. Build Static UI (Start Immediately)**
- Build the `sl-police-motorist-portal` Single Page Application (React/Vue).
- Create a `SearchFineForm` that accepts:
  - Reference Number
  - Category ID
  - Officer Badge Number
- Create the `CheckoutComponent` for payment processing and `PaymentConfirmation` screen.
- **Constraint**: DO NOT wait for the backend to be ready. Mock the API responses using the JSON defined in `docs/plan/api_endpoints.md`.

**2. Integration**
- Once Dev 1 confirms the Gateway is live, replace your JSON mocks with real HTTP requests to the Gateway URL.
- Test the end-to-end flow of paying a fine online.
