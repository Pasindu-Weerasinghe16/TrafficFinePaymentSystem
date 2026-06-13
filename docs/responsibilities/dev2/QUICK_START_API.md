# QUICK START - API ENDPOINTS

**Time to Ready**: 5-10 minutes  
**Difficulty**: Easy

---

## ⚡ QUICKEST PATH TO RUNNING

### STEP 1: Build (2-3 minutes)
```bash
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem\sl-police-monolith
mvn clean package -DskipTests
```
✅ Wait for: `BUILD SUCCESS`

---

### STEP 2: Start Application (30 seconds)
```bash
mvn spring-boot:run
```
✅ Wait for: `Tomcat started on port(s): 8081`

---

### STEP 3: Test Login (PowerShell - 1 minute)

**Copy & Paste This Command**:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' | ConvertFrom-Json

Write-Host "SUCCESS! Token received:" -ForegroundColor Green
Write-Host $response.token
```

✅ You should see a long token string starting with `eyJ...`

---

## 📊 API FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│           API ENDPOINT FLOW                              │
└─────────────────────────────────────────────────────────┘

1. CLIENT REQUEST
   ↓
   ┌──────────────────────────────────┐
   │ POST /api/auth/login             │
   │ {                                │
   │   "username": "admin",           │
   │   "password": "Admin@123"        │
   │ }                                │
   └──────────────────────────────────┘
   ↓
2. SERVER PROCESSING
   ↓
   ┌──────────────────────────────────┐
   │ AuthController                   │
   │ ↓                                │
   │ Load User from Database          │
   │ ↓                                │
   │ Validate Password (BCrypt)       │
   │ ↓                                │
   │ Generate JWT Token               │
   └──────────────────────────────────┘
   ↓
3. CLIENT RECEIVES TOKEN
   ↓
   ┌──────────────────────────────────┐
   │ {                                │
   │   "token": "eyJ...",             │
   │   "username": "admin",           │
   │   "role": "ADMIN"                │
   │ }                                │
   └──────────────────────────────────┘
   ↓
4. USE TOKEN FOR PROTECTED ENDPOINTS
   ↓
   ┌──────────────────────────────────┐
   │ GET /api/admin/categories        │
   │ Header:                          │
   │ Authorization: Bearer eyJ...     │
   └──────────────────────────────────┘
   ↓
5. JWT FILTER VALIDATES TOKEN
   ↓
   ┌──────────────────────────────────┐
   │ JwtAuthenticationFilter          │
   │ ↓                                │
   │ Extract token from header        │
   │ ↓                                │
   │ Validate signature               │
   │ ↓                                │
   │ Check expiration                 │
   │ ↓                                │
   │ Set user in SecurityContext      │
   └──────────────────────────────────┘
   ↓
6. ACCESS GRANTED / DENIED
   ↓
   ✅ Valid Token → 200 OK (data returned)
   ❌ Invalid Token → 401 Unauthorized
   ❌ Expired Token → 401 Unauthorized
   ❌ No Token → 401 Unauthorized
```

---

## 🔄 COMPLETE TESTING FLOW

### Login Test
```
1. Run: mvn spring-boot:run
2. Wait: "Tomcat started on port(s): 8081"
3. Send: POST http://localhost:8081/api/auth/login
   Body: {"username":"admin","password":"Admin@123"}
4. Receive: {"token":"eyJ...", "username":"admin", "role":"ADMIN"}
5. Status: ✅ 200 OK
```

### Protected Endpoint Test (with Token)
```
1. Copy token from login response
2. Send: GET http://localhost:8081/api/admin/categories
   Header: Authorization: Bearer eyJ...
3. Receive: [] or [{"id":1, "name":"Speeding", "amount":1500}]
4. Status: ✅ 200 OK
```

### Protected Endpoint Test (without Token)
```
1. Send: GET http://localhost:8081/api/admin/categories
   (NO Authorization header)
2. Receive: Error message
3. Status: ❌ 401 Unauthorized
```

---

## 📱 TESTING WITH DIFFERENT TOOLS

### Option 1: PowerShell (Built-in Windows)

**Login**:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' -ErrorAction SilentlyContinue

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

**Call Protected Endpoint**:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/admin/categories" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"} -ErrorAction SilentlyContinue

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

### Option 2: cURL (Git Bash / WSL)

**Login**:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

**Call Protected Endpoint**:
```bash
TOKEN="eyJ..." # Replace with actual token

curl -X GET http://localhost:8081/api/admin/categories \
  -H "Authorization: Bearer $TOKEN"
```

---

### Option 3: Postman (GUI - Easiest)

**Step 1**: Open Postman
**Step 2**: Create request
- Method: `POST`
- URL: `http://localhost:8081/api/auth/login`
- Body (JSON): `{"username":"admin","password":"Admin@123"}`

**Step 3**: Send → Copy token from response
**Step 4**: Create new request
- Method: `GET`
- URL: `http://localhost:8081/api/admin/categories`
- Headers: `Authorization: Bearer <token>`

**Step 5**: Send → See response

---

## ✅ VERIFICATION CHECKLIST

```
STEP 1: Build & Compile
  [ ] mvn clean package -DskipTests runs successfully
  [ ] BUILD SUCCESS message appears
  [ ] JAR file created: target/sl-police-monolith-0.0.1-SNAPSHOT.jar

STEP 2: Application Startup
  [ ] mvn spring-boot:run starts without errors
  [ ] "Tomcat started on port(s): 8081" appears in logs
  [ ] Port 8081 is accessible

STEP 3: Database Connection
  [ ] No database connection errors in logs
  [ ] "HikariPool" message appears
  [ ] Application does not crash

STEP 4: Login Endpoint
  [ ] POST /api/auth/login returns 200 OK
  [ ] Response contains "token" field
  [ ] Response contains "username" field
  [ ] Response contains "role" field
  [ ] Token is valid JWT format (eyJ...)

STEP 5: Protected Endpoints
  [ ] GET /api/admin/categories returns 200 OK with token
  [ ] GET /api/admin/categories returns 401 without token
  [ ] Authorization header format: "Bearer <token>" works
  [ ] Invalid token returns 401

STEP 6: Public Endpoints
  [ ] GET /api/fines/validate works without token
  [ ] POST /api/payments works without token
```

---

## 🐛 TROUBLESHOOTING - 30 SECOND FIXES

### Problem: "Connection refused" on 8081
```bash
# Solution:
netstat -ano | findstr :8081
# If nothing shows, app isn't running
# If PID shows, it's running (check logs)
```

### Problem: "Build FAILURE"
```bash
# Solution:
mvn clean
mvn compile
# Check error message - usually missing dependency
```

### Problem: "401 Unauthorized" on public endpoints
```bash
# This should NOT happen
# Check if you're calling a /api/admin/* endpoint instead
# Public endpoints: /api/fines/*, /api/payments/*, /api/auth/*
```

### Problem: "Invalid username or password"
```bash
# Solutions:
# 1. Check spelling: "admin" (lowercase)
# 2. Check password: "Admin@123"
# 3. Verify user exists in database
```

### Problem: Token works for 5 minutes then stops
```bash
# This is normal
# Token expires after 24 hours
# Just login again to get fresh token
```

---

## 📝 ENDPOINT REFERENCE

### Public Endpoints

```
POST /api/auth/login
├─ Request: {"username":"admin","password":"Admin@123"}
└─ Response: {"token":"eyJ...","username":"admin","role":"ADMIN"}

GET /api/fines/validate?referenceNumber=REF001&categoryId=1
├─ No authentication required
└─ Response: {"amount":1500,"categoryName":"Speeding","isAlreadyPaid":false}

POST /api/payments
├─ Request: {...payment details...}
└─ Response: {"success":true,"receiptNumber":"..."}
```

### Protected Endpoints (Require Token)

```
GET /api/admin/categories
├─ Header: Authorization: Bearer <token>
└─ Response: []

GET /api/admin/officers
├─ Header: Authorization: Bearer <token>
└─ Response: []

GET /api/admin/fines
├─ Header: Authorization: Bearer <token>
└─ Response: []

GET /api/admin/stats/overview
├─ Header: Authorization: Bearer <token>
└─ Response: {"totalCollections":0,"pendingFines":0}
```

---

## 🚀 START HERE - 5 MINUTE SETUP

```powershell
# Window 1: Build
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem\sl-police-monolith
mvn clean package -DskipTests

# Window 2: Run (after build completes)
mvn spring-boot:run

# Window 3: Test (after "Tomcat started" message)
$r = Invoke-WebRequest "http://localhost:8081/api/auth/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' | ConvertFrom-Json
$r.token
```

**Result**: ✅ You should see a long token string

---

## 📞 QUICK HELP

| Question | Answer |
|----------|--------|
| **How to start?** | Run `mvn spring-boot:run` in sl-police-monolith folder |
| **Where is server?** | http://localhost:8081 |
| **How to login?** | POST to /api/auth/login with username/password |
| **What is token?** | JWT string used to access protected endpoints |
| **How to use token?** | Add header: `Authorization: Bearer <token>` |
| **Token expires?** | Yes, after 24 hours. Login again to get new one |
| **Public endpoints?** | /api/fines/*, /api/payments/*, /api/auth/* |
| **Protected endpoints?** | /api/admin/* (require token) |

---

**Ready to test?** → Start with Step 1 above! ✅

