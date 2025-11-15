# Environment Variables for Vercel Deployment (Full Stack)

Since both frontend and backend are deployed on Vercel, here are **ALL** environment variables you need to add:

## 🎯 Required Environment Variables

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
```
**Required:** Yes ✅  
**Description:** Your MongoDB Atlas connection string  
**Where to get it:** MongoDB Atlas → Connect → Connection String

---

### 2. Firebase Admin SDK (for Push Notifications)

#### Option A: Using Environment Variables (Recommended for Vercel)

```
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
```

**Required:** Yes ✅ (if you want push notifications)  
**Description:** Firebase Admin SDK credentials  
**Where to get it:** 
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy `project_id`, `private_key`, and `client_email` from the JSON file

**⚠️ Important:** 
- Replace `\n` with actual newlines in `FIREBASE_PRIVATE_KEY` OR use `\\n` (double backslash)
- The private key should be on multiple lines

#### Option B: Using Service Account File (Not Recommended for Vercel)
- Upload `serviceAccountKey.json` to Vercel (not recommended, use env vars instead)

---

### 3. Frontend API URL (Optional - Auto-detected)

```
VITE_API_URL=https://your-app.vercel.app/api
```

**Required:** No ⚠️ (Auto-detected if not set)  
**Description:** Backend API URL  
**Note:** If not set, it will default to `/api` (same domain), which works for Vercel!

---

## 📋 Complete Environment Variables List

### Copy-Paste Ready for Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link

# Firebase Admin SDK
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com

# Frontend API URL (Optional - will auto-detect)
VITE_API_URL=https://your-app.vercel.app/api
```

---

## 🔧 How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nidhi-russia`
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Open the JSON file and copy:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

---

## ✅ Minimum Required Variables

For basic functionality (without push notifications):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
```

For full functionality (with push notifications):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
```

---

## 🚀 Quick Setup Steps

1. **Get MongoDB URI:**
   - MongoDB Atlas → Connect → Connection String
   - Copy the connection string

2. **Get Firebase Credentials:**
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Copy the three values

3. **Add to Vercel:**
   - Go to Vercel Dashboard
   - Your Project → Settings → Environment Variables
   - Add all variables above
   - **Important:** Select "Production", "Preview", and "Development" for each variable

4. **Redeploy:**
   - Vercel will automatically redeploy when you add environment variables
   - Or manually trigger a redeploy

---

## 🔒 Security Notes

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Never commit `serviceAccountKey.json` (already in `.gitignore`)
- ✅ Use Vercel's environment variables (encrypted)
- ✅ Rotate credentials if accidentally exposed
- ✅ Use different MongoDB databases for dev/prod

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for Vercel)
- Verify database user has proper permissions

### Firebase Not Working
- Check all three Firebase env vars are set correctly
- Verify `FIREBASE_PRIVATE_KEY` has proper newlines (`\n` or `\\n`)
- Check Firebase project ID matches

### API Routes Not Working
- Verify `VITE_API_URL` is set (or it will auto-detect)
- Check Vercel function logs for errors
- Ensure `api/index.js` is properly configured

---

## 📞 Support

For issues or questions:
- Email: theparthpanjwani@gmail.com

