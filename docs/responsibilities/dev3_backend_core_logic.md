# Dev 3: Backend Core Business Logic

## Role Overview
You are responsible for the core brains of the system—processing payments, validating fines, and generating statistics.

**Your Working Directory:** `./sl-police-monolith/`

## Prerequisites
- Read `docs/plan/api_endpoints.md` and `docs/plan/functional_requirements.md`.
- **WAIT** until Dev 2 pushes the JPA Entities and Repositories to the `main` branch. DO NOT create your own entities.

## Strict Tasks

**1. Fine Validation API**
- Implement `GET /api/fines/validate`.
- Accept `referenceNumber`, `categoryId`, and `officerBadge`.
- Verify the category exists to get the fine amount. Check if the `referenceNumber` is already paid.

**2. Payment Processing API**
- Implement `POST /api/payments`.
- Extract `referenceNumber`, `categoryId`, `officerBadgeNumber`, `location`, and `paymentDetails`.
- Save the `TrafficFine` and `Payment` records to the database.
- Integrate a mock SMS service to "send" an SMS to the officer found by `officerBadgeNumber`.

**3. Admin Management APIs**
- Implement all `/api/admin/**` endpoints as defined in the plan.
- Ensure the stats endpoint returns "Total Fines Paid" (not issued).
- Implement officer and category CRUD endpoints.

**4. Handover**
- **Action Required**: Once endpoints are coded, provide the exact URL paths to Dev 1 so they can configure the Gateway routing.
