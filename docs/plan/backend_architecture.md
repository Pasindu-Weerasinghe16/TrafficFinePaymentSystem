# Backend Architecture

The backend will be a single, monolithic REST API application focusing on simplicity and maintainability, fulfilling the system's needs without unnecessary microservices overhead.

## Technology Stack
- **Framework**: Java / Spring Boot
- **Database Access**: Spring Data JPA
- **Database**: MySQL or PostgreSQL
- **Security**: Spring Security with JWT tokens

## Layered Architecture
- **Controllers (API Layer)**: Expose RESTful endpoints for mobile and web apps.
- **Services (Business Logic Layer)**: Handle core logic like validating fines, processing payments, and triggering SMS notifications.
- **Repositories (Data Access Layer)**: Spring Data JPA interfaces for database operations.

## Key Components
1. **Auth Service**: Handles login and issues JWT tokens for admin portal access.
2. **Fine Service**: Fetches fine details and verifies reference numbers.
3. **Payment Service**: Processes payment transactions and updates fine statuses.
4. **Notification Service**: Integrates with a 3rd party SMS gateway (or a mock service) to send text messages to officers upon payment completion.
