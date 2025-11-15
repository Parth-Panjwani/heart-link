# Vercel Full Stack Deployment Guide

This guide will help you deploy **both frontend and backend** on Vercel.

## 🎯 Environment Variables for Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these **3 required** environment variables:

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
```

### 2. Firebase Project ID
```
FIREBASE_PROJECT_ID=nidhi-russia
```

### 3. Firebase Private Key
```
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
```
**⚠️ Important:** Keep the `\n` characters or use `\\n` (double backslash)

### 4. Firebase Client Email
```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
```

### 5. Frontend API URL (Optional)
```
VITE_API_URL=https://your-app.vercel.app/api
```
**Note:** If not set, it will auto-detect and use `/api` (same domain)

---

## 📋 Complete Environment Variables List

Copy-paste these into Vercel:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
VITE_API_URL=https://your-app.vercel.app/api
```

---

## 🚀 Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all 5 variables above
   - **Important:** Select "Production", "Preview", and "Development" for each

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

---

## 🔧 How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `nidhi-russia`
3. Click ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download JSON file
7. Copy from JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

---

## ✅ That's It!

Your app is now fully deployed on Vercel with:
- ✅ Frontend (React/Vite)
- ✅ Backend API (Express serverless functions)
- ✅ MongoDB connection
- ✅ Firebase push notifications

---

## 🐛 Troubleshooting

### API Routes Not Working
- Check `api/server.js` exists
- Verify `vercel.json` has correct rewrites
- Check Vercel function logs

### MongoDB Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0`)

### Firebase Not Working
- Verify all 3 Firebase env vars are set
- Check `FIREBASE_PRIVATE_KEY` has proper format

---

## 📞 Support

Email: theparthpanjwani@gmail.com

