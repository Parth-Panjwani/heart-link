# How to Create New Users

There are **two ways** to create new users in Heart Link:

## Option 1: Using the Signup Form (Current - localStorage)

**Steps:**

1. Go to the login page (`/login`)
2. Click "Don't have an account? Sign up"
3. Fill in:
   - **Name**: Your display name
   - **Email**: Your email address
   - **Password**: Your password
4. Click "Create Account"

**Note:** Users created this way are stored in **localStorage** (browser storage). They will:

- ✅ Work immediately
- ✅ Persist across browser sessions
- ❌ Not sync across devices
- ❌ Be lost if browser data is cleared

## Option 2: Using MongoDB Backend (Recommended for Production)

To enable MongoDB user storage, you need to:

### 1. Update AuthContext to use API

The backend API endpoints are already created:

- `POST /api/users/signup` - Create new user
- `POST /api/users/login` - Login user
- `GET /api/users/:userId` - Get user by ID
- `GET /api/users` - Get all users

### 2. Steps to Use Backend Signup:

1. Make sure your backend server is running:

   ```bash
   npm run server
   ```

2. The signup form will automatically use the backend API if available

3. Users created this way will be stored in **MongoDB** and will:
   - ✅ Sync across all devices
   - ✅ Persist permanently
   - ✅ Work with Firebase notifications
   - ✅ Support multiple users properly

## Current Test Users

For testing, these accounts are pre-configured:

- **Nidhi**: `nidhi@test.com` / `nidhi123`
- **User One**: `user1@test.com` / `user123`
- **User Two**: `user2@test.com` / `user223`

## Switching Between localStorage and MongoDB

Currently, the app uses **localStorage** by default. To switch to MongoDB:

1. Update `AuthContext.tsx` to use `usersApi` from `@/lib/api`
2. Replace localStorage calls with API calls
3. Handle authentication tokens properly

Would you like me to update the AuthContext to use MongoDB backend for user management?
