# Signup Debugging Guide

## Quick Checklist

### 1. **Verify Servers Are Running**
```bash
# Terminal 1: Run backend API server (port 8080)
cd server
npm run dev
# Should show: "Server running on port 8080"

# Terminal 2: Run JSON DB server (port 5000)
cd server/config
npm run db
# or
json-server --watch db.json --port 5000
```

### 2. **Check Network Connectivity**
```bash
# Open browser DevTools (F12)
# Go to Network tab
# Try to signup and check:
# - Is POST request made to http://localhost:8080/api/auth/signup?
# - What is the response status (200, 400, 500)?
# - What is in the response body?
```

### 3. **Browser Console Debugging** (F12 → Console)
You should now see logs like:
```
📝 Form Data Submitted: {name: "John", email: "john@example.com", password: "123456"}
```

If there's an error, you'll see:
```
❌ Signup Error Details: {
  message: "...",
  response: {...},
  status: 500,
  fullError: {...}
}
```

### 4. **Server Console Debugging** (Terminal)
You should see logs like:
```
🔐 [VALIDATE] Validating request body: {...}
✅ [VALIDATE] Validation passed
🔵 [SIGNUP] Request received: {...}
🔍 [SIGNUP] Checking if email already exists...
✅ [SIGNUP] User created successfully
```

If error occurs, you'll see:
```
❌ [SIGNUP] Error Details: {
  message: "...",
  code: "ECONNREFUSED",
  url: "http://localhost:5000/users",
  status: undefined
}
```

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `name, email, password are required` | Missing form fields | Check all inputs are filled |
| `Email already registered` | Email exists in DB | Use different email |
| `Signup failed: ECONNREFUSED` | DB server (port 5000) not running | `npm run db` or `json-server --watch db.json --port 5000` |
| `Network Error` | Backend server not running | `npm run dev` (should be port 8080) |
| `CORS error` | Cross-origin issue | Check server has CORS middleware |

## Port Configuration

- **Client**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:8080/api
- **JSON DB**: http://localhost:5000

Update in: `client/src/api/axios.js` baseURL

---

## Browser DevTools Network Tab Steps

1. Open DevTools: **F12**
2. Go to **Network** tab
3. Fill signup form
4. Click **Signup button**
5. Look for POST request to `/auth/signup`
6. Click on it → **Response** tab → Check error message

---

## Using Browser Debugger (Optional)

Add breakpoint in `client/src/pages/Signup.jsx`:
1. Open DevTools → **Sources** tab
2. Find `Signup.jsx` in file tree
3. Click line number in `handleSubmit` to add breakpoint
4. Refresh and try signup again
5. Execution will pause at breakpoint

---

## Full Request/Response Example

**Request (Client sends):**
```json
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "Signup successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (400/500):**
```json
{
  "message": "Email already registered",
  "error": "...",
  "details": "..."
}
```

---

## Logger Output Examples

### Successful Signup
```
🔐 [VALIDATE] Validating request body: {...}
✅ [VALIDATE] Validation passed
🔵 [SIGNUP] Request received: {...}
🔍 [SIGNUP] Checking if email already exists at: http://localhost:5000/users?email=john@example.com
🔍 [SIGNUP] Existing users found: 0
✅ [SIGNUP] Creating new user...
✅ [SIGNUP] User created successfully: 1
```

### Failed Signup (DB Connection Error)
```
❌ [SIGNUP] Error Details: {
  message: "connect ECONNREFUSED 127.0.0.1:5000",
  code: "ECONNREFUSED",
  url: "http://localhost:5000/users?email=john@example.com"
}
```

---

## Next Steps

1. ✅ Added detailed logging to all relevant files
2. 📊 Open browser DevTools (F12) → Console tab
3. 🔧 Check Terminal for server logs
4. 📍 Cross-reference error messages from both
5. 📝 Note the exact error message and share if stuck
