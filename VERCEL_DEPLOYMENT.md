# Vercel Deployment Guide for Heart Link

This guide will help you deploy Heart Link to Vercel. Since the app has both a frontend (React/Vite) and backend (Express/MongoDB), we'll deploy them separately.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A MongoDB Atlas account (or your MongoDB URI)
- Firebase project set up (for push notifications)
- Git repository (GitHub, GitLab, or Bitbucket)

## Option 1: Frontend on Vercel + Backend on Railway/Render (Recommended)

This is the recommended approach as it's simpler and more reliable for a full Express server.

### Step 1: Deploy Backend First

#### Option A: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect Node.js automatically
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - Set to `3001` (or Railway will auto-assign)
   - Add Firebase service account key (see below)

6. Update the start command in Railway:
   ```
   node server.cjs
   ```

7. Railway will provide a URL like: `https://your-app.railway.app`
8. Copy this URL - you'll need it for the frontend

#### Option B: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `heart-link-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.cjs`
   - **Plan**: Free or Starter

5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - Set to `3001`

6. Render will provide a URL like: `https://heart-link-backend.onrender.com`
7. Copy this URL - you'll need it for the frontend

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite configuration
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add environment variables:
   - `VITE_API_URL` - Your backend URL (e.g., `https://your-app.railway.app/api` or `https://heart-link-backend.onrender.com/api`)
   - Make sure to include `/api` at the end!

7. Click "Deploy"
8. Once deployed, Vercel will provide a URL like: `https://heart-link.vercel.app`

### Step 3: Update Firebase Configuration

1. In your Firebase Console, add your Vercel domain to authorized domains
2. Update `src/lib/firebase.ts` if needed to use production Firebase config
3. Ensure Firebase service account key is properly configured in backend

### Step 4: Update CORS in Backend

Make sure your backend (`server.cjs`) allows requests from your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://your-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## Option 2: Full Stack on Vercel (Advanced)

If you want everything on Vercel, you'll need to convert your Express routes to Vercel serverless functions. This is more complex but keeps everything in one place.

### Converting Backend to Serverless Functions

1. Create an `api` folder in your project root
2. Convert each Express route to a serverless function
3. Example structure:
   ```
   api/
     users/
       [userId]/
         index.js
       login.js
       signup.js
     events/
       index.js
     ...
   ```

This approach requires significant refactoring and is not recommended unless you're comfortable with serverless architecture.

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway/Render)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (usually `3001` or auto-assigned)
- Firebase service account (as JSON file or environment variables)

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend can connect to backend API
- [ ] MongoDB connection is working
- [ ] Firebase push notifications are configured
- [ ] CORS is properly configured for your Vercel domain
- [ ] Environment variables are set correctly
- [ ] Test user registration/login flow
- [ ] Test all CRUD operations
- [ ] Verify push notifications work

## Troubleshooting

### CORS Errors
- Ensure backend CORS includes your Vercel domain
- Check that `VITE_API_URL` includes `/api` at the end

### API Connection Issues
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend logs for errors
- Ensure backend is running and accessible

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0` for testing)
- Ensure MongoDB user has proper permissions

### Firebase Issues
- Verify service account key is properly configured
- Check Firebase project settings
- Ensure authorized domains include your Vercel domain

## Custom Domain Setup

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update CORS in backend to include custom domain
5. Update Firebase authorized domains

## Support

For issues or questions:
- Email: theparthpanjwani@gmail.com
- Check Vercel docs: https://vercel.com/docs
- Check Railway docs: https://docs.railway.app
- Check Render docs: https://render.com/docs

