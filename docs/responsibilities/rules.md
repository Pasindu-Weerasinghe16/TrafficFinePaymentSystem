# STRICT DEVELOPMENT RULES

> [!CAUTION]
> ANY DEVELOPER FOUND VIOLATING THIS EXECUTION ORDER OR IMPLEMENTING FEATURES OUT OF TURN WILL CAUSE MASSIVE MERGE CONFLICTS. FOLLOW THIS DOCUMENT STRICTLY.

## 1. The Golden Rule of Parallel Frontend Development
**Devs 4, 5, and 6 (Frontend Team)**: 
You are permitted to clone the repository and start building UI components immediately on Day 1. 
- **DO NOT** wait for the backend to be finished.
- **DO NOT** attempt to connect to localhost:8080 or the Gateway immediately.
- **RULE**: You MUST use hardcoded JSON mocks that exactly match the structure defined in `docs/plan/api_endpoints.md`. You may only swap to live API calls when Dev 1 officially announces the Gateway is ready.

## 2. The Step-Wise Backend Rule
The backend and infrastructure must be executed in a strict sequence. 
- **Dev 3 (Core Logic)**: **DO NOT** start writing Services or Controllers until Dev 2 has pushed the JPA Entities to the `main` branch. If you create your own Entity classes, you will cause a massive merge conflict.
- **Dev 2 (Security/DB)**: **DO NOT** attempt to configure the database connection until Dev 1 confirms the Docker Postgres container is running.
- **Dev 1 (Infrastructure)**: **DO NOT** attempt to write the final Gateway routing rules until Dev 3 has finalized the exact REST controller paths.

## 3. Strict Adherence to the Plan
- **No Overengineering**: Do not add extra database tables, do not add extra microservices, do not add caching layers like Redis unless specifically requested by management. Follow the 5-table schema precisely.
- **Data Integrity**: The `location` field and `officerBadgeNumber` MUST be included in the API payloads as per the updated functional requirements.

## 4. Communication Protocol
Once you finish a prerequisite task (e.g., Dev 2 finishing the JWT Auth), you must announce it so the dependent developer (e.g., Dev 6 Admin) knows they can begin integration.

## 5. Git Workflow & Mono-Repo Discipline
Because all 6 projects share a single repository (`TrafficFinePaymentSystem`):
- Commit your work regularly. DO NOT wait until the last moment.
- You must work ONLY inside your designated folder. Do not edit other developers' folders.
- All commits must be merged to the `master/main` branch before final evaluation.
