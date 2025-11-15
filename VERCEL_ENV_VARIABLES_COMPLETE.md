# Complete Environment Variables List for Vercel

## 📋 All Environment Variables to Add in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables (select **Production**, **Preview**, and **Development** for each):

---

## ✅ Required Environment Variables

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
**⚠️ Important:** Keep the `\n` characters in the private key (or use `\\n` with double backslash)

### 4. Firebase Client Email
```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
```

---

## 🔧 Optional Environment Variables

### 5. Frontend API URL (Optional - Auto-detects if not set)
```
VITE_API_URL=https://your-app.vercel.app/api
```
**Note:** If you don't set this, it will automatically use `/api` (same domain)

---

## 📝 Copy-Paste Ready Format

Here's the exact format to paste into Vercel:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nidhi-russia.iam.gserviceaccount.com
VITE_API_URL=https://your-app.vercel.app/api
```

---

## 🎯 Summary

**Total: 4 Required + 1 Optional = 5 Environment Variables**

1. ✅ `MONGODB_URI` - Required
2. ✅ `FIREBASE_PROJECT_ID` - Required  
3. ✅ `FIREBASE_PRIVATE_KEY` - Required
4. ✅ `FIREBASE_CLIENT_EMAIL` - Required
5. ⚠️ `VITE_API_URL` - Optional (auto-detects `/api` if not set)

---

## 📍 Where to Add

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable one by one
6. **Important:** Select all three environments:
   - ☑️ Production
   - ☑️ Preview  
   - ☑️ Development
7. Click **Save**
8. **Redeploy** your project (or it will auto-redeploy)

---

## ✅ That's It!

Once you add these 4-5 environment variables, your app will be fully configured for Vercel deployment!

