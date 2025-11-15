# Actual Environment Variables for Vercel (With Working Keys)

## 📋 Copy These Exact Values to Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables (select **Production**, **Preview**, and **Development** for each):

---

## ✅ Required Environment Variables

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://nidhipanjwani:nidhi@189@nidhi.wlb4xkj.mongodb.net/heart-link
```

### 2. Firebase Project ID
```
FIREBASE_PROJECT_ID=nidhi-russia
```

### 3. Firebase Private Key
```
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy/cQDCjEaikbb\nX3GeBd3kJzLJyyvOh7pQMMttzP8Y7IUxgC8N2JbQIcvrxAMi/yFojJVLMEWePVRL\n5goGBXTHKvw1sTePO8AIwP0T6PbLVI67UbN/NNDIDYjzeIaT0R1c14ZksehDCC1U\nCipw6oCF18XGSiMDBLMhe5S5vCLbWiCbnu4Fg/TYYwB4jsF0p8syzd9ouynRKYDn\nCxfXRaXFXNAQ0cAJGBfEE0yWYzLpV2cmy7vFRmRUnFo5Yhrveo7Pnmkg9R/U2C7B\nLsQl+NeiEXf6kDh0A5pIa3V76LajfCNgdW3lj9LRZP6mzmkmolsVq7RYfqu8vbaE\ntplbzz3FAgMBAAECggEAVsYn7MFYJOG8kEWpM07sz9shCCtzRWEPtiixtr2XPmIM\nAH+AUFocYzK/RcF1M9Y0QBdHmXgBiEF7SIBxg5HJl3UDaJRNtybkZloJV0mtu812\nlOF6/8R/Iz1Mk5xuweKzNXtXMCH/0992+jMjeDJ3tGty+jqe1qvEnArpg1HuJCCx\n1lKdi62W4pv8Fk7waSpbtzZGQHR9aHPlghZ+OlD9LO52hjkbC2i97D5yYO4FkQ0t\nytMiDkBwW31JkABU89iQG0wxSdYzjv0Lg3xruGTIVcBxXC/A3beNs6xwibsX7sak\niPNpaHR+XIapfO/0KnIiV79Z+k+uKsg+zLGQi/v9UQKBgQDd4GdOPHjtl1USLXy2\nYKQTvii4jJpubEkvvM4Zeq733DxczLFodnTF9WZKi+qP6MgZDchVBLwWr5WV+dNI\nP0ljao4EiAKSfcRWo7gxC/aKUp+xKFneMhM7/wdJUZIiNAUYm8W3MWPBdzCg4Hb+\ngJmyuFmDKHIAokFXImR8hlOxXwKBgQDOhOgdXaDwoJeYF7yMYfSohUq0IfKILG5/\nl4doxwRkoyB8o7CwO32h49kDNMkYEVRNSrx09Efr5ImsxlO0xxhaYv+5u1cxq2Ko\nYPPbjBkM3OTgNojBWSxR8u8lHzCRU4iMXfBQqnSokMsWjO3Ki20DsCt4bxwJvfej\nYYtXrDlvWwKBgFZCcwdInV8JcapygsTIx6FhUaWGDFgXw1BK3/mp57I3LkSJ1AMf\n4oA/yrf6s4OlZX3QDO14vMM5GjfHe6vf5uE+wN3kHtPjD1z7o5V16DCYtLsETAQF\nhdLScHvBucWQYdbSYMi66+SAOSiie8CwMJD5+Nrz83ZpnmuI1HZRJuKTAoGBALF3\nGnNpqsw8ZCiJdTf5USGjcP98EIseC1JPZ0gNhWPpnhgdHc9DQAFm52xO5uNsuNG2\ngF3MMSWvfPNgdjvpvq6lVfVH3HTNPvlMXyFxsXERPQjDNB9aPrCpHwH6XGT1sGhW\nrRTUdW0JB8v4DLs5ttMthx119VUVzoCyaOhNEgnzAoGAXGoFYrinxLM/t495/g6a\nVSo9Iz5HgOQLe1WUq3XGdYS+xTtQRSyRMw+BTrwomCV+AK2l6cAlI50jHjW1Q7RQ\n4VlGAMNAuKzPoDjKQL2WiwwUwbZCssjVnCLJSGcP8yXrNN2kqVgklSkDnvuy6Ix7\nmFQ24n5RSwdmwlBx2ulRRCU=\n-----END PRIVATE KEY-----\n
```

### 4. Firebase Client Email
```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nidhi-russia.iam.gserviceaccount.com
```

---

## 🔧 Optional Environment Variables

### 5. Frontend API URL (Optional - Auto-detects if not set)
```
VITE_API_URL=https://your-app.vercel.app/api
```
**Note:** Replace `your-app.vercel.app` with your actual Vercel domain. If you don't set this, it will automatically use `/api` (same domain).

---

## 📝 Complete List (Copy-Paste Ready)

```env
MONGODB_URI=mongodb+srv://nidhipanjwani:nidhi@189@nidhi.wlb4xkj.mongodb.net/heart-link
FIREBASE_PROJECT_ID=nidhi-russia
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy/cQDCjEaikbb\nX3GeBd3kJzLJyyvOh7pQMMttzP8Y7IUxgC8N2JbQIcvrxAMi/yFojJVLMEWePVRL\n5goGBXTHKvw1sTePO8AIwP0T6PbLVI67UbN/NNDIDYjzeIaT0R1c14ZksehDCC1U\nCipw6oCF18XGSiMDBLMhe5S5vCLbWiCbnu4Fg/TYYwB4jsF0p8syzd9ouynRKYDn\nCxfXRaXFXNAQ0cAJGBfEE0yWYzLpV2cmy7vFRmRUnFo5Yhrveo7Pnmkg9R/U2C7B\nLsQl+NeiEXf6kDh0A5pIa3V76LajfCNgdW3lj9LRZP6mzmkmolsVq7RYfqu8vbaE\ntplbzz3FAgMBAAECggEAVsYn7MFYJOG8kEWpM07sz9shCCtzRWEPtiixtr2XPmIM\nAH+AUFocYzK/RcF1M9Y0QBdHmXgBiEF7SIBxg5HJl3UDaJRNtybkZloJV0mtu812\nlOF6/8R/Iz1Mk5xuweKzNXtXMCH/0992+jMjeDJ3tGty+jqe1qvEnArpg1HuJCCx\n1lKdi62W4pv8Fk7waSpbtzZGQHR9aHPlghZ+OlD9LO52hjkbC2i97D5yYO4FkQ0t\nytMiDkBwW31JkABU89iQG0wxSdYzjv0Lg3xruGTIVcBxXC/A3beNs6xwibsX7sak\niPNpaHR+XIapfO/0KnIiV79Z+k+uKsg+zLGQi/v9UQKBgQDd4GdOPHjtl1USLXy2\nYKQTvii4jJpubEkvvM4Zeq733DxczLFodnTF9WZKi+qP6MgZDchVBLwWr5WV+dNI\nP0ljao4EiAKSfcRWo7gxC/aKUp+xKFneMhM7/wdJUZIiNAUYm8W3MWPBdzCg4Hb+\ngJmyuFmDKHIAokFXImR8hlOxXwKBgQDOhOgdXaDwoJeYF7yMYfSohUq0IfKILG5/\nl4doxwRkoyB8o7CwO32h49kDNMkYEVRNSrx09Efr5ImsxlO0xxhaYv+5u1cxq2Ko\nYPPbjBkM3OTgNojBWSxR8u8lHzCRU4iMXfBQqnSokMsWjO3Ki20DsCt4bxwJvfej\nYYtXrDlvWwKBgFZCcwdInV8JcapygsTIx6FhUaWGDFgXw1BK3/mp57I3LkSJ1AMf\n4oA/yrf6s4OlZX3QDO14vMM5GjfHe6vf5uE+wN3kHtPjD1z7o5V16DCYtLsETAQF\nhdLScHvBucWQYdbSYMi66+SAOSiie8CwMJD5+Nrz83ZpnmuI1HZRJuKTAoGBALF3\nGnNpqsw8ZCiJdTf5USGjcP98EIseC1JPZ0gNhWPpnhgdHc9DQAFm52xO5uNsuNG2\ngF3MMSWvfPNgdjvpvq6lVfVH3HTNPvlMXyFxsXERPQjDNB9aPrCpHwH6XGT1sGhW\nrRTUdW0JB8v4DLs5ttMthx119VUVzoCyaOhNEgnzAoGAXGoFYrinxLM/t495/g6a\nVSo9Iz5HgOQLe1WUq3XGdYS+xTtQRSyRMw+BTrwomCV+AK2l6cAlI50jHjW1Q7RQ\n4VlGAMNAuKzPoDjKQL2WiwwUwbZCssjVnCLJSGcP8yXrNN2kqVgklSkDnvuy6Ix7\nmFQ24n5RSwdmwlBx2ulRRCU=\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nidhi-russia.iam.gserviceaccount.com
```

---

## ✅ Summary

**4 Required Environment Variables:**

1. ✅ `MONGODB_URI` = `mongodb+srv://nidhipanjwani:nidhi@189@nidhi.wlb4xkj.mongodb.net/heart-link`
2. ✅ `FIREBASE_PROJECT_ID` = `nidhi-russia`
3. ✅ `FIREBASE_PRIVATE_KEY` = (Full private key above)
4. ✅ `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@nidhi-russia.iam.gserviceaccount.com`

**1 Optional:**
5. ⚠️ `VITE_API_URL` = `https://your-app.vercel.app/api` (replace with your actual domain)

---

## 📍 Steps to Add in Vercel

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Settings → Environment Variables
3. Click "Add New"
4. Add each variable one by one:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://nidhipanjwani:nidhi@189@nidhi.wlb4xkj.mongodb.net/heart-link`
   - Select: ☑️ Production ☑️ Preview ☑️ Development
   - Click Save
5. Repeat for all 4 variables
6. Redeploy your project

---

## ⚠️ Important Notes

- **FIREBASE_PRIVATE_KEY**: Keep the `\n` characters exactly as shown (they represent newlines)
- **VITE_API_URL**: Replace `your-app.vercel.app` with your actual Vercel domain after first deployment
- All variables should be added to Production, Preview, and Development environments

---

## ✅ That's It!

Once you add these 4 environment variables, your Heart Link app will be fully configured on Vercel! 🚀

