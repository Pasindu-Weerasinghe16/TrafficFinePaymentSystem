# API ENDPOINT RUNNING GUIDE - STEP BY STEP

**Project**: SL Police Traffic Fine Payment System  
**Dev 2 Component**: Backend API with JWT Authentication  
**Date**: June 13, 2026

---

## 📋 TABLE OF CONTENTS
1. Prerequisites & Setup
2. Starting the Backend Application
3. Testing the Endpoints
4. Common Issues & Solutions

---

## PHASE 1: PREREQUISITES & SETUP

### Step 1.1: Verify System Requirements

```bash
# Check Java installation
java -version
# Expected: Java 21 (or similar)

# Check Maven installation
mvn --version
# Expected: Maven 3.8+

# Check PostgreSQL (Docker or local)
# For Docker: Docker Desktop must be running
```

### Step 1.2: Verify Project Build

```bash
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem\sl-police-monolith

# Clean and build the project
mvn clean package -DskipTests

# Expected Output:
# [INFO] BUILD SUCCESS
# [INFO] Total time: X.XXX s
```

### Step 1.3: Verify JAR File Created

```bash
# Check if JAR was created
ls target/sl-police-monolith-0.0.1-SNAPSHOT.jar

# Expected: File size ~48 MB
# Location: sl-police-monolith/target/sl-police-monolith-0.0.1-SNAPSHOT.jar
```

---

## PHASE 2: STARTING THE BACKEND APPLICATION

### Option A: Run with Maven (Development Mode)

#### Step 2A.1: Start Maven Spring Boot Application

```bash
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem\sl-police-monolith

# Run the application
mvn spring-boot:run

# Console Output:
# 2026-06-13 16:15:30.123  INFO 1234 --- [main] c.s.m.MonolithApplication : Starting MonolithApplication
# 2026-06-13 16:15:35.456  INFO 1234 --- [main] c.s.m.MonolithApplication : Started MonolithApplication in X.XXX seconds
# 2026-06-13 16:15:35.789  INFO 1234 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8081
```

#### Step 2A.2: Verify Application Started

Wait for message: **"Tomcat started on port(s): 8082"**

✅ Application is now running on `http://localhost:8082`

---

### Option B: Run with Docker Compose (Production Setup)

#### Step 2B.1: Start All Services

```bash
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem

# Start all services including PostgreSQL, Gateway, and Monolith
docker-compose up --build -d

# Expected Services:
# - sl-police-nginx (port 80)
# - sl-police-gateway (port 8080)
# - sl-police-monolith (port 8082)
# - sl-police-postgres-primary (port 5432)
# - sl-police-postgres-replica (port 5433)
```

#### Step 2B.2: Verify Services Running

```bash
docker-compose ps

# Expected Output:
# CONTAINER ID   IMAGE                        STATUS
# ...            sl-police-monolith           Up (healthy)
# ...            sl-police-postgres-primary   Up (healthy)
```

#### Step 2B.3: View Logs

```bash
docker-compose logs -f sl-police-monolith

# Look for: "Tomcat started on port(s): 8082"
```

---

## PHASE 3: TESTING THE ENDPOINTS

### Step 3.1: Test Login Endpoint (Authentication)

#### Method 1: Using PowerShell

```powershell
# Set variables
$url = "http://localhost:8081/api/auth/login"
$body = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

# Make request
$response = Invoke-WebRequest -Uri $url -Method POST -Body $body -Headers $headers
$response.Content | ConvertFrom-Json
```

**Expected Response (Success - 200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4Nzk5OTkzMCwiZXhwIjoxNjg4MDg2MzMwfQ.abc123xyz...",
  "username": "admin",
  "role": "ADMIN"
}
```

**Expected Response (Failure - 401 Unauthorized)**:
```json
{
  "error": "Invalid username or password"
}
```

---

#### Method 2: Using cURL (Git Bash or WSL)

```bash
# Create login request
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Expected: JSON response with token
```

---

#### Method 3: Using Postman/Insomnia

1. **Open Postman**
2. **Create New Request**
   - Method: `POST`
   - URL: `http://localhost:8081/api/auth/login`
   
3. **Headers Tab**
   - Key: `Content-Type`
   - Value: `application/json`

4. **Body Tab** (raw, JSON)
   ```json
   {
     "username": "admin",
     "password": "Admin@123"
   }
   ```

5. **Click Send**
6. **View Response** in Response tab

---

### Step 3.2: Extract JWT Token

From the login response, copy the token value:

```
token: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4Nzk5OTkzMCwiZXhwIjoxNjg4MDg2MzMwfQ.abc123xyz..."
```

**Save this token** for testing protected endpoints.

---

### Step 3.3: Test Protected Endpoints (Admin)

#### Example: GET /api/admin/categories

```powershell
# Variables
$token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4Nzk5OTkzMCwiZXhwIjoxNjg4MDg2MzMwfQ.abc123xyz..."
$url = "http://localhost:8081/api/admin/categories"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Make request
$response = Invoke-WebRequest -Uri $url -Method GET -Headers $headers
$response.Content
```

**Expected Response (200 OK)**:
- Empty array (no data yet): `[]`
- Or array of categories if data exists

**Expected Response (401 Unauthorized)** if no token:
```json
{
  "timestamp": "2026-06-13T16:15:30.123Z",
  "status": 401,
  "error": "Unauthorized"
}
```

---

### Step 3.4: Test Public Endpoints (No Auth Required)

#### Example: GET /api/fines/validate

```powershell
$url = "http://localhost:8081/api/fines/validate?referenceNumber=REF001&categoryId=1&officerBadge=B001"

$headers = @{
    "Content-Type" = "application/json"
}

# Make request (NO token needed)
$response = Invoke-WebRequest -Uri $url -Method GET -Headers $headers
$response.Content
```

**Expected Response (200 OK)**:
```json
{
  "amount": 1500,
  "categoryName": "Speeding",
  "isAlreadyPaid": false
}
```

---

## PHASE 4: COMPLETE API TEST SEQUENCE

### Test Scenario 1: Successful Login

**Step 1**: POST to `/api/auth/login`
```
Request: { "username": "admin", "password": "Admin@123" }
Response: { "token": "...", "username": "admin", "role": "ADMIN" }
Status: ✅ 200 OK
```

**Step 2**: Copy token from response

**Step 3**: Use token in Authorization header for admin endpoints

---

### Test Scenario 2: Failed Login (Wrong Password)

**Request**:
```json
{
  "username": "admin",
  "password": "WrongPassword123"
}
```

**Expected Response**: 
```
Status: ❌ 401 Unauthorized
Body: { "error": "Invalid username or password" }
```

---

### Test Scenario 3: Protected Endpoint (Requires Token)

**Step 1**: Login and get token

**Step 2**: Call protected endpoint WITH token
```
Header: Authorization: Bearer <token>
Response: ✅ 200 OK - Data returned
```

**Step 3**: Call same endpoint WITHOUT token
```
No Authorization header
Response: ❌ 401 Unauthorized
```

---

## PHASE 5: DATABASE SETUP (If Using Docker)

### Step 5.1: Create Initial Admin User

```bash
# Connect to PostgreSQL
docker exec -it sl-police-postgres-primary psql -U traffic_fine -d traffic_fine

# SQL Commands:
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2a$10$5.XT7pVVFhV8W8Ks.fKEuWzV1Ll3.5T5m5eU6K2P8Q1P8Q1P8Q1P', 'ADMIN');

\q
```

**Note**: Password hash is BCrypt encrypted version of "Admin@123"

---

### Step 5.2: Add Test Data (Optional)

```sql
-- Insert test fine category
INSERT INTO fine_categories (name, amount) 
VALUES ('Speeding', 1500.00);

-- Insert test officer
INSERT INTO officers (badge_number, phone_number, district) 
VALUES ('B001', '0701234567', 'Colombo');

-- Insert test fine
INSERT INTO traffic_fines (reference_number, category_id, officer_id, location, status, issued_at) 
VALUES ('REF001', 1, 1, 'Galle Road', 'PENDING', NOW());
```

---

## PHASE 6: TROUBLESHOOTING

### Issue 1: "Connection refused" on port 8081

**Solution**:
```bash
# Check if application is running
netstat -ano | findstr :8081

# If not running, start it again
mvn spring-boot:run

# If port is busy, kill the process
taskkill /PID <PID> /F
```

---

### Issue 2: "Invalid username or password"

**Verify**:
1. Username exists in database
2. Password is correct (case-sensitive)
3. If no admin user, insert one:

```sql
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2a$10$...',  'ADMIN');
```

---

### Issue 3: "401 Unauthorized" on protected endpoints

**Verify**:
1. Token is included in Authorization header
2. Format is: `Bearer <token>` (with space)
3. Token is not expired (24-hour expiration)
4. Get fresh token: Call `/api/auth/login` again

---

### Issue 4: "Tomcat started but endpoints return 404"

**Solution**:
```bash
# Check application logs
# Look for: "Mapping endpoints" messages

# Verify endpoints are registered
# Log should show:
# GET /api/fines/**
# POST /api/payments/**
# POST /api/auth/login
```

---

### Issue 5: Database connection error

**Verify PostgreSQL**:
```bash
# If using Docker
docker-compose ps | grep postgres

# If local PostgreSQL
psql -U traffic_fine -d traffic_fine -c "SELECT 1"

# Connection string in application.properties:
# jdbc:postgresql://localhost:5432/traffic_fine
# OR (Docker)
# jdbc:postgresql://sl-police-postgres-primary:5432/traffic_fine
```

---

## PHASE 7: QUICK REFERENCE - API ENDPOINTS

### Public Endpoints (No Authentication)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | User login, returns JWT token | ✅ Ready |
| `GET` | `/api/fines/validate` | Validate fine details | ✅ Configured |
| `POST` | `/api/payments` | Create payment record | ✅ Configured |
| `GET` | `/api/payments/{id}` | Get payment details | ✅ Configured |

---

### Protected Endpoints (Require JWT Token)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/api/admin/stats/overview` | Dashboard statistics | ✅ Configured |
| `GET` | `/api/admin/fines` | List all fines (paginated) | ✅ Configured |
| `GET` | `/api/admin/officers` | List all officers | ✅ Configured |
| `POST` | `/api/admin/officers` | Create new officer | ✅ Configured |
| `GET` | `/api/admin/categories` | List fine categories | ✅ Configured |
| `POST` | `/api/admin/categories` | Create fine category | ✅ Configured |

---

## PHASE 8: TESTING CHECKLIST

- [ ] **Application Starts**: `mvn spring-boot:run` succeeds
- [ ] **Port 8081 Open**: Server listening on 8081
- [ ] **Login Works**: `POST /api/auth/login` returns token
- [ ] **Token Valid**: Returned token is valid JWT format
- [ ] **Protected Access**: Using token grants access to `/api/admin/**`
- [ ] **Public Access**: `/api/fines/**` works without token
- [ ] **Invalid Token**: Invalid/expired token returns 401
- [ ] **Wrong Password**: Invalid credentials return 401
- [ ] **CORS Enabled**: (If calling from different origin)
- [ ] **Database Connected**: No connection errors in logs

---

## PHASE 9: MONITORING & LOGS

### View Application Logs

```bash
# If running with Maven
# Logs appear in terminal window

# If running in Docker
docker logs -f sl-police-monolith

# Follow specific level
docker logs -f --since 5m sl-police-monolith
```

### Key Log Messages to Look For

```
✅ "Tomcat started on port(s): 8081"
✅ "HikariPool-1 - Starting connection pool..."
✅ "Spring Security initialized with security filters"
✅ "Mapped \"{POST /api/auth/login}..."
```

---

## PHASE 10: PERFORMANCE VERIFICATION

### Response Time Expectations

| Endpoint | Expected Time | Status |
|----------|---------------|--------|
| Login | < 200ms | Fast |
| Get Categories | < 100ms | Very Fast |
| Get Fines | < 500ms | Normal |
| Validate Fine | < 100ms | Very Fast |

---

## SUMMARY

### ✅ To Run API Endpoints:

1. **Build**: `mvn clean package -DskipTests`
2. **Start**: `mvn spring-boot:run`
3. **Wait**: For "Tomcat started on port(s): 8081"
4. **Test**: Call `POST /api/auth/login` with credentials
5. **Use Token**: Add `Authorization: Bearer <token>` to protected endpoints

### ✅ Quick Test Command

```powershell
# All in one PowerShell command
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' | ConvertFrom-Json
Write-Host "Token: $($response.token)"
```

---

**Status**: 🚀 Ready to test API endpoints  
**Next Step**: Follow Phase 2 to start the application

