# Quick Start: Deploy Heart Link to Vercel

## 🚀 Fastest Way to Deploy

### Step 1: Deploy Backend (5 minutes)

**Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
5. Railway auto-detects Node.js and runs `node server.cjs`
6. Copy your Railway URL (e.g., `https://heart-link-production.up.railway.app`)

**Option B: Render**
1. Go to [render.com](https://render.com) → Sign up
2. Click "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.cjs`
5. Add environment variable: `MONGODB_URI`
6. Copy your Render URL

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite - **don't change anything!**
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api` ⚠️ **Include `/api` at the end!**
6. Click "Deploy"
7. Done! Your app is live at `https://your-app.vercel.app`

### Step 3: Test It

1. Open your Vercel URL
2. Try signing up a new user
3. Create a space
4. Test all features

## 🔧 Troubleshooting

**CORS Error?**
- Backend CORS currently allows all origins (good for testing)
- If issues persist, check backend logs

**API Not Working?**
- Verify `VITE_API_URL` includes `/api` at the end
- Check backend is running (visit backend URL directly)
- Check browser console for errors

**MongoDB Connection Failed?**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for testing)

## 📝 Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/heart-link
PORT=3001 (optional, auto-assigned)
```

## 🎉 That's It!

Your Heart Link app is now live! Share the Vercel URL with your users.

For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

