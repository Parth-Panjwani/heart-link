# Environment Variables - Quick Reference (Vercel Full Stack)

## 🎯 Required Environment Variables for Vercel

Since **both frontend and backend** are on Vercel, add these to **Vercel Dashboard → Settings → Environment Variables**:

### 1. MongoDB Connection

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
```

### 2. Firebase Project ID

```env
FIREBASE_PROJECT_ID=nidhi-russia
```

### 3. Firebase Private Key

```env
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----
```

**⚠️ Keep `\n` characters or use `\\n`**

### 4. Firebase Client Email

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
```

### 5. Frontend API URL (Optional)

```env
VITE_API_URL=https://your-app.vercel.app/api
```

**Note:** If not set, auto-detects `/api` (same domain)

---

## 📋 Copy-Paste Ready for Vercel

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
VITE_API_URL=https://your-app.vercel.app/api
```

---

## ✅ Summary

**4 required** environment variables:

1. `MONGODB_URI` ✅
2. `FIREBASE_PROJECT_ID` ✅
3. `FIREBASE_PRIVATE_KEY` ✅
4. `FIREBASE_CLIENT_EMAIL` ✅

**1 optional:** 5. `VITE_API_URL` (auto-detects if not set)

---

## 📖 Detailed Guide

See `VERCEL_FULL_STACK_DEPLOYMENT.md` for complete deployment instructions.
