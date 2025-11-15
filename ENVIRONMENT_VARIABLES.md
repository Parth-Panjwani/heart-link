# Environment Variables for Heart Link Deployment

## 📋 Complete List of Environment Variables

### Frontend (Vercel) - Required

| Variable Name | Description | Example Value | Required |
|--------------|-------------|---------------|----------|
| `VITE_API_URL` | Backend API base URL (must include `/api` at the end) | `https://heart-link-backend.railway.app/api` | ✅ Yes |

**⚠️ Important:** The `VITE_API_URL` must end with `/api`!

---

### Backend (Railway/Render) - Required

| Variable Name | Description | Example Value | Required |
|--------------|-------------|---------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://username:password@cluster.mongodb.net/heart-link` | ✅ Yes |
| `PORT` | Server port (usually auto-assigned by hosting platform) | `3001` | ⚠️ Optional |

**Note:** `PORT` is optional - Railway and Render auto-assign ports. Only set if your platform requires it.

---

### Firebase Configuration

**Frontend Firebase Config:**
Currently hardcoded in `src/lib/firebase.ts`. No environment variables needed for frontend Firebase.

**Backend Firebase:**
The backend uses `serviceAccountKey.json` file. You have two options:

#### Option 1: Use JSON File (Current Setup)
- Upload `serviceAccountKey.json` to your backend hosting platform
- No environment variables needed

#### Option 2: Use Environment Variables (Recommended for Production)
Convert Firebase service account to environment variables:

| Variable Name | Description | Example Value | Required |
|--------------|-------------|---------------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `nidhi-russia` | ⚠️ Optional |
| `FIREBASE_PRIVATE_KEY` | Firebase private key (from service account) | `-----BEGIN PRIVATE KEY-----\n...` | ⚠️ Optional |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | `firebase-adminsdk@...` | ⚠️ Optional |

**Note:** Firebase config is currently hardcoded. For production, consider moving to environment variables.

---

## 🚀 Quick Setup Guide

### For Vercel (Frontend)

1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
3. Make sure to include `/api` at the end!

### For Railway (Backend)

1. Go to your Railway project → Variables tab
2. Add:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/heart-link
   ```
3. Upload `serviceAccountKey.json` file (or use env vars for Firebase)

### For Render (Backend)

1. Go to your Render service → Environment tab
2. Add:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/heart-link
   PORT = 3001
   ```
3. Upload `serviceAccountKey.json` file (or use env vars for Firebase)

---

## 📝 Environment Variable Examples

### Development (.env.local - Frontend)
```env
VITE_API_URL=http://localhost:3001/api
```

### Production (Vercel - Frontend)
```env
VITE_API_URL=https://heart-link-backend.railway.app/api
```

### Development (Backend)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
PORT=3001
```

### Production (Railway/Render - Backend)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
PORT=3001
```

---

## 🔒 Security Notes

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Never commit `serviceAccountKey.json`** - Already in `.gitignore`
3. **Use environment variables** in production, not hardcoded values
4. **Rotate credentials** if accidentally exposed
5. **Use different MongoDB databases** for development and production

---

## ✅ Verification Checklist

After setting environment variables:

- [ ] Frontend `VITE_API_URL` includes `/api` at the end
- [ ] Backend `MONGODB_URI` is correct and accessible
- [ ] Backend can connect to MongoDB (check logs)
- [ ] Frontend can connect to backend API (test in browser console)
- [ ] Firebase service account is configured (if using push notifications)
- [ ] All environment variables are set in production (not just development)

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` includes `/api` at the end
- Verify backend URL is correct and accessible
- Check CORS settings in backend

### Backend can't connect to MongoDB
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for testing)
- Verify MongoDB user has proper permissions

### Firebase not working
- Check `serviceAccountKey.json` is uploaded to backend
- Verify Firebase project settings
- Check authorized domains in Firebase Console

---

## 📞 Support

For issues or questions:
- Email: theparthpanjwani@gmail.com
- Check deployment guides: `VERCEL_DEPLOYMENT.md`

