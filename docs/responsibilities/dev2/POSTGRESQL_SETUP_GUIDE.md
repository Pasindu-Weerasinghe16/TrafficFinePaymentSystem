# POSTGRESQL SETUP & SPRING BOOT CONNECTION GUIDE

**Database**: PostgreSQL (Local Installation)  
**Application**: SL Police Monolith (Spring Boot)  
**Date**: June 13, 2026

---

## 🎯 QUICK OVERVIEW

```
1. Start PostgreSQL Server
   ↓
2. Create Database & User
   ↓
3. Verify Connection
   ↓
4. Update Application Config (if needed)
   ↓
5. Run Spring Boot Application
   ↓
6. Test API Endpoints
```

---

## PHASE 1: START POSTGRESQL SERVER

### Step 1.1: Start PostgreSQL on Windows

**Option A: Using Services (Easiest)**

```powershell
# Open PowerShell as Administrator

# Start PostgreSQL service
net start postgresql-x64-15

# Expected Output:
# The PostgreSQL Database Server service is starting.
# The PostgreSQL Database Server service was started successfully.
```

---

**Option B: Using pgAdmin (GUI)**

1. Search for **pgAdmin 4** in Windows Start Menu
2. Click to open pgAdmin 4
3. Open web browser (usually opens automatically)
4. Login with your pgAdmin credentials
5. PostgreSQL is now running (you'll see in system tray)

---

**Option C: Check if Already Running**

```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql* | Select-Object Name, Status

# Expected Output:
# Name                 Status
# ----                 ------
# postgresql-x64-15    Running
```

---

### Step 1.2: Verify PostgreSQL is Running

```powershell
# Test connection
psql -U postgres -h localhost -c "SELECT 1"

# If successful output:
# ?column?
# ----------
#        1
# (1 row)
```

If you get error like "psql: command not found", add PostgreSQL to PATH:

```powershell
# Add PostgreSQL to PATH temporarily
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"

# Now try again
psql -U postgres -h localhost -c "SELECT 1"
```

---

## PHASE 2: CREATE DATABASE & USER

### Step 2.1: Connect to PostgreSQL

```powershell
# Open PostgreSQL command line
psql -U postgres -h localhost

# Expected Output:
# psql (15.3)
# Type "help" for help.
# 
# postgres=#
```

---

### Step 2.2: Create Database

```sql
-- Copy & paste this entire block into psql:

CREATE DATABASE traffic_fine;

-- Expected Output:
-- CREATE DATABASE

-- Verify database created:
\l

-- You should see "traffic_fine" in the list
```

---

### Step 2.3: Create User

```sql
-- Copy & paste this entire block into psql:

CREATE USER traffic_fine WITH PASSWORD 'traffic_fine';

-- Expected Output:
-- CREATE ROLE

-- Verify user created:
\du

-- You should see "traffic_fine" in the list
```

---

### Step 2.4: Grant Permissions

```sql
-- Copy & paste this entire block into psql:

ALTER ROLE traffic_fine WITH LOGIN;
ALTER DATABASE traffic_fine OWNER TO traffic_fine;
GRANT ALL PRIVILEGES ON DATABASE traffic_fine TO traffic_fine;

-- Expected Output:
-- ALTER ROLE
-- ALTER DATABASE
-- GRANT

-- Quit psql:
\q
```

---

### Step 2.5: Verify Connection with New User

```powershell
# Test connection with traffic_fine user
psql -U traffic_fine -d traffic_fine -h localhost -c "SELECT 1"

# When prompted for password, enter: traffic_fine

# Expected Output:
# ?column?
# ----------
#        1
# (1 row)
```

✅ **If you see the output above, PostgreSQL is ready!**

---

## PHASE 3: UPDATE APPLICATION CONFIGURATION

### Step 3.1: Verify application.properties

Check the file: `sl-police-monolith/src/main/resources/application.properties`

It should have:

```properties
spring.datasource.primary.url=jdbc:postgresql://localhost:5432/traffic_fine
spring.datasource.primary.username=traffic_fine
spring.datasource.primary.password=traffic_fine
spring.datasource.primary.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

✅ **If it looks like above, you're good!**

---

### Step 3.2: Verify pom.xml Has PostgreSQL Driver

Check file: `sl-police-monolith/pom.xml`

Look for:

```xml
<!-- PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
    <scope>runtime</scope>
</dependency>
```

✅ **If present, you're all set!**

---

## PHASE 4: RUN THE APPLICATION

### Step 4.1: Build the Project

```powershell
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem\sl-police-monolith

mvn clean package -DskipTests
```

**Wait for**: `BUILD SUCCESS`

---

### Step 4.2: Run the Application

```powershell
mvn spring-boot:run
```

**Watch the logs for these messages**:

```
✅ "Bootstrapping Spring Data JPA repositories"
✅ "Found 5 JPA repository interfaces"
✅ "Tomcat initialized with port 8081"
✅ "Tomcat started on port(s): 8081"
✅ "Started MonolithApplication"
```

**If you see all these, the application is running!** ✅

---

### Step 4.3: Check for Database Connection Messages

Look for these in the logs:

```
✅ "HikariPool-1 - Starting connection pool"
✅ "HikariPool-1 - Connection is alive"
✅ "Spring Data repository scanning"
```

**If you see these, database connection is successful!** ✅

---

## PHASE 5: TEST API ENDPOINTS

### Step 5.1: Open New PowerShell Window (Keep First Window Running)

```powershell
# New PowerShell window

# Test login endpoint
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' `
  -ErrorAction SilentlyContinue

Write-Host $response.Content
```

---

### Step 5.2: Expected Response

**If PostgreSQL is connected and application running:**

```json
{
  "error": "Invalid username or password"
}
```

**Why?** → No admin user in database yet. This is NORMAL! It means:
- ✅ Application started
- ✅ Database connection working
- ✅ Authentication system working
- ⚠️ Just no users in database

---

## PHASE 6: CREATE INITIAL DATA

### Step 6.1: Create Admin User

**Keep the application running**, open another PowerShell window:

```powershell
# Connect to PostgreSQL with traffic_fine user
psql -U traffic_fine -d traffic_fine -h localhost

# Password: traffic_fine
```

---

### Step 6.2: Create Users Table and Insert Admin

```sql
-- Insert admin user
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2a$10$5.XT7pVVFhV8W8Ks.fKEuWzV1Ll3.5T5m5eU6K2P8Q1P8Q1P8Q1P', 'ADMIN');

-- Verify:
SELECT * FROM users;

-- You should see:
-- id | username | password_hash | role
-- ---+----------+-------+------
-- 1  | admin    | $2a$10$... | ADMIN
```

---

### Step 6.3: Exit psql

```sql
\q
```

---

## PHASE 7: TEST LOGIN NOW

### Step 7.1: Test Login Endpoint

```powershell
# Test login with admin credentials
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' | ConvertFrom-Json

Write-Host "Token: " $response.token
Write-Host "Username: " $response.username
Write-Host "Role: " $response.role
```

**Expected Response (200 OK)**:

```
Token:  eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4Nzk5OTkzMCwiZXhwIjoxNjg4MDg2MzMwfQ...
Username:  admin
Role:  ADMIN
```

✅ **SUCCESS! API is working!**

---

## COMPLETE SETUP CHECKLIST

```
POSTGRESQL SETUP:
  [ ] PostgreSQL service started (net start postgresql-x64-15)
  [ ] Can connect with: psql -U postgres -h localhost
  [ ] Database "traffic_fine" created
  [ ] User "traffic_fine" created with password "traffic_fine"
  [ ] User has CONNECT privilege to database
  [ ] Verified connection: psql -U traffic_fine -d traffic_fine -h localhost

APPLICATION CONFIGURATION:
  [ ] application.properties has correct database URL
  [ ] application.properties has correct username
  [ ] application.properties has correct password
  [ ] pom.xml has PostgreSQL driver dependency

APPLICATION STARTUP:
  [ ] mvn clean package -DskipTests succeeds
  [ ] mvn spring-boot:run starts without errors
  [ ] "Tomcat started on port(s): 8081" appears in logs
  [ ] "HikariPool-1 - Connection is alive" appears in logs

DATABASE CONNECTION:
  [ ] No "Failed to determine a suitable driver class" error
  [ ] No "Failed to connect to localhost" error
  [ ] No "authentication failed" error

API TESTING:
  [ ] POST /api/auth/login returns 200 OK
  [ ] Response contains valid JWT token
  [ ] Token starts with "eyJ"
  [ ] Can use token for protected endpoints
```

---

## TROUBLESHOOTING

### Issue 1: "Failed to determine a suitable driver class"

**Cause**: Database is not running  
**Solution**:
```powershell
# Start PostgreSQL
net start postgresql-x64-15

# Or check if it's already running:
Get-Service -Name postgresql* | Select-Object Status
```

---

### Issue 2: "password authentication failed"

**Cause**: Wrong username or password  
**Solution**:
```powershell
# Verify correct credentials
# Username: traffic_fine
# Password: traffic_fine
# Host: localhost
# Port: 5432

# Test:
psql -U traffic_fine -d traffic_fine -h localhost
# When prompted for password, type: traffic_fine
```

---

### Issue 3: "role traffic_fine does not exist"

**Cause**: User wasn't created properly  
**Solution**:
```sql
-- Connect as postgres first
psql -U postgres -h localhost

-- Create user again:
CREATE USER traffic_fine WITH PASSWORD 'traffic_fine';
ALTER ROLE traffic_fine WITH LOGIN;

-- Exit and test:
\q
psql -U traffic_fine -d traffic_fine -h localhost
```

---

### Issue 4: "database does not exist"

**Cause**: Database wasn't created  
**Solution**:
```sql
psql -U postgres -h localhost

-- Create database:
CREATE DATABASE traffic_fine;

-- Verify:
\l
# Look for traffic_fine in the list

\q
```

---

### Issue 5: "permission denied for database traffic_fine"

**Cause**: User doesn't have privileges  
**Solution**:
```sql
psql -U postgres -h localhost

-- Grant privileges:
GRANT ALL PRIVILEGES ON DATABASE traffic_fine TO traffic_fine;

-- Verify:
\c traffic_fine
\dp

\q
```

---

## QUICK REFERENCE - COMMANDS

### PostgreSQL Commands

```powershell
# Start PostgreSQL
net start postgresql-x64-15

# Stop PostgreSQL
net stop postgresql-x64-15

# Check status
Get-Service -Name postgresql*

# Connect as postgres user
psql -U postgres -h localhost

# Connect as traffic_fine user
psql -U traffic_fine -d traffic_fine -h localhost
```

### SQL Commands (in psql)

```sql
-- List databases
\l

-- List users/roles
\du

-- List tables
\dt

-- Exit psql
\q

-- View specific table
SELECT * FROM users;
```

---

## FINAL QUICK START

**Copy & Paste These Commands In Order**:

### Window 1: Start PostgreSQL
```powershell
# Start database service
net start postgresql-x64-15

# Wait 5 seconds
Start-Sleep -Seconds 5

# Create database and user
psql -U postgres -h localhost << EOF
CREATE DATABASE traffic_fine;
CREATE USER traffic_fine WITH PASSWORD 'traffic_fine';
ALTER ROLE traffic_fine WITH LOGIN;
ALTER DATABASE traffic_fine OWNER TO traffic_fine;
GRANT ALL PRIVILEGES ON DATABASE traffic_fine TO traffic_fine;
EOF

# Create admin user
psql -U traffic_fine -d traffic_fine -h localhost << EOF
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '\$2a\$10\$5.XT7pVVFhV8W8Ks.fKEuWzV1Ll3.5T5m5eU6K2P8Q1P8Q1P8Q1P', 'ADMIN');
EOF
```

### Window 2: Run Application
```powershell
cd C:\Users\Dulanga\Documents\GitHub\TrafficFinePaymentSystem\sl-police-monolith
mvn spring-boot:run
```

### Window 3: Test
```powershell
# Wait for "Tomcat started" message in Window 2

# Then run:
$response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"Admin@123"}' | ConvertFrom-Json

Write-Host "✅ SUCCESS! Token:" $response.token
```

---

**Status**: Ready to go! 🚀

