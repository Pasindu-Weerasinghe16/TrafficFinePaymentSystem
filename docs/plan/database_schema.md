# Database Schema

A simple relational database schema (e.g., MySQL or PostgreSQL) to support the requirements without overengineering.

## Tables

### 1. `users`
Handles authentication for Admins.
- `id` (PK)
- `username` (String)
- `password_hash` (String)
- `role` (String: ADMIN)

### 2. `officers`
Stores traffic police officer details for SMS notifications.
- `id` (PK)
- `badge_number` (String, Unique)
- `phone_number` (String)
- `district` (String)

### 3. `fine_categories`
Defines the types of fines and base amounts.
- `id` (PK) - Represents the category identifier
- `name` (String)
- `amount` (Decimal)

### 4. `traffic_fines`
Stores issued fines.
- `id` (PK)
- `reference_number` (String, Unique)
- `category_id` (FK -> fine_categories.id)
- `officer_id` (FK -> officers.id)
- `location` (String)
- `status` (String: PENDING, PAID)
- `issued_at` (Timestamp)

### 5. `payments`
Tracks successful payment transactions.
- `id` (PK)
- `fine_id` (FK -> traffic_fines.id)
- `amount_paid` (Decimal)
- `payment_method` (String)
- `paid_at` (Timestamp)
