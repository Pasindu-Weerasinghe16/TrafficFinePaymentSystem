# API Endpoints

A concise list of necessary REST API endpoints to support the frontend applications.

## Authentication (Admin Portal)
- `POST /api/auth/login`
  - Body: `{ "username": "...", "password": "..." }`
  - Response: `{ "token": "jwt-token-string" }`

## Fines (Driver Mobile & Web Portal)
- `GET /api/fines/validate?referenceNumber={ref}&categoryId={id}&officerBadge={badge}`
  - Response: `{ "amount": 1500, "categoryName": "Speeding", "isAlreadyPaid": false }`
  - *Note: Since fines are issued on paper, the DB won't have a record until payment. This endpoint verifies the category and checks if the reference number was already paid.*

## Payments (Driver Mobile & Web Portal)
- `POST /api/payments`
  - Body: `{ "referenceNumber": "...", "categoryId": "...", "officerBadgeNumber": "...", "location": "...", "paymentDetails": { ... } }`
  - Response: `{ "success": true, "receiptNumber": "..." }`
  - *Note: This endpoint internally triggers the SMS notification to the assigned officer.*

## Admin Dashboard & Management (Admin Portal - Requires JWT)

### Statistics
- `GET /api/admin/stats/overview`
  - Response: Total collections, pending fines counts.
- `GET /api/admin/stats/district`
  - Response: `[{ "district": "Colombo", "totalCollected": 50000 }, ... ]`
- `GET /api/admin/stats/category`
  - Response: `[{ "category": "Speeding", "totalCollected": 30000 }, ... ]`

### Fines Management
- `GET /api/admin/fines?page=0&size=20&status=...`
  - Response: Paginated list of all issued fines.
- `GET /api/admin/fines/{id}`
  - Response: Detailed information for a specific fine.

### Officers Management
- `GET /api/admin/officers`
  - Response: List of registered traffic police officers.
- `POST /api/admin/officers`
  - Body: `{ "badgeNumber": "...", "phoneNumber": "...", "district": "..." }`
  - Response: Created officer details.

### Fine Categories
- `GET /api/admin/categories`
  - Response: List of active fine categories and base amounts.
- `POST /api/admin/categories`
  - Body: `{ "name": "...", "amount": 1500 }`
  - Response: Created fine category details.
