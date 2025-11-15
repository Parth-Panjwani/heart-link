# Heart Link Deployment Checklist

## Pre-Deployment

- [ ] All code is committed to Git
- [ ] Environment variables are documented
- [ ] MongoDB Atlas database is set up
- [ ] Firebase project is configured
- [ ] Service account key is ready (for backend)

## Backend Deployment (Railway/Render)

- [ ] Create account on Railway or Render
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `PORT` (if needed)
- [ ] Upload Firebase service account key (if using file)
- [ ] Set start command: `node server.cjs`
- [ ] Deploy and get backend URL
- [ ] Test backend health endpoint: `https://your-backend-url.com/api/health`
- [ ] Verify MongoDB connection in logs
- [ ] Update CORS if needed (currently allows all origins)

## Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Import Git repository
- [ ] Verify build settings:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Set environment variable:
  - [ ] `VITE_API_URL` = `https://your-backend-url.com/api` (include /api!)
- [ ] Deploy
- [ ] Get Vercel deployment URL

## Post-Deployment Testing

- [ ] Test homepage loads
- [ ] Test user signup
- [ ] Test user login
- [ ] Test space creation/joining
- [ ] Test all CRUD operations:
  - [ ] Create/Read/Update/Delete Moments
  - [ ] Create/Read/Update/Delete Tasks
  - [ ] Send/Receive Messages
  - [ ] Send Nudges
- [ ] Test push notifications
- [ ] Test time converter
- [ ] Test weather display
- [ ] Test distance map
- [ ] Test on mobile device
- [ ] Test PWA installation

## Firebase Configuration

- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Verify service worker loads: `/firebase-messaging-sw.js`
- [ ] Test notification permissions
- [ ] Test push notifications work

## MongoDB Configuration

- [ ] Verify IP whitelist (allow all: `0.0.0.0/0` for testing)
- [ ] Verify database user permissions
- [ ] Test database connection from backend

## CORS Configuration

- [ ] Backend CORS allows Vercel domain (currently allows all)
- [ ] No CORS errors in browser console
- [ ] API requests work from frontend

## Custom Domain (Optional)

- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] Update CORS in backend
- [ ] Update Firebase authorized domains
- [ ] Test custom domain works

## Performance

- [ ] Check Lighthouse score
- [ ] Verify images are optimized
- [ ] Check bundle size
- [ ] Test loading times

## Security

- [ ] Environment variables are not exposed
- [ ] Service account key is secure
- [ ] MongoDB credentials are secure
- [ ] CORS is properly configured
- [ ] HTTPS is enabled

## Monitoring

- [ ] Set up error tracking (optional)
- [ ] Monitor backend logs
- [ ] Monitor Vercel deployment logs
- [ ] Set up uptime monitoring (optional)

## Documentation

- [ ] Update README with deployment URLs
- [ ] Document environment variables
- [ ] Document any custom configurations

