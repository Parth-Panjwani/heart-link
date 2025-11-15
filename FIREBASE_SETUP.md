# Firebase Cloud Messaging (FCM) Setup Guide

## Overview

Firebase Cloud Messaging has been integrated to provide real-time push notifications for:

- **Nudges**: When someone nudges Nidhi, she receives a push notification
- **Messages**: When someone sends a message, the recipient gets notified

## Installation

1. **Install Firebase dependencies:**

   ```bash
   npm install firebase firebase-admin
   ```

2. **Service Account Key**
   - The `serviceAccountKey.json` file is already created with your Firebase credentials
   - Keep this file secure and never commit it to public repositories
   - The file is already in `.gitignore` for security

## How It Works

### Frontend (Client)

1. **Permission Request**: Users are prompted to enable notifications in Settings
2. **FCM Token**: Once permission is granted, a unique FCM token is generated
3. **Token Storage**: The token is stored in MongoDB associated with the user's ID
4. **Service Worker**: Background notifications are handled by `firebase-messaging-sw.js`

### Backend (Server)

1. **Firebase Admin**: Server uses Firebase Admin SDK to send notifications
2. **Token Lookup**: When a nudge/message is sent, server looks up recipient's FCM tokens
3. **Notification Sending**: Server sends push notification to all recipient's devices
4. **Error Handling**: Invalid tokens are automatically detected and can be cleaned up

## User Flow

### For Regular Users:

1. Go to **Settings** → **Push Notifications**
2. Click **"Enable Notifications"**
3. Browser will ask for permission
4. Once granted, FCM token is automatically saved to MongoDB
5. User will receive notifications when:
   - Someone sends them a message
   - (Future: Other events)

### For Nidhi:

1. Same setup process as above
2. Receives notifications when:
   - Someone nudges her
   - Someone sends her a message

## API Endpoints

### Update FCM Token

```
PUT /api/users/:userId/fcm-token
Body: {
  fcmToken: string,
  email?: string,
  name?: string
}
```

### Remove FCM Token

```
DELETE /api/users/:userId/fcm-token
Body: {
  fcmToken: string
}
```

## Database Schema

### User Collection

```javascript
{
  userId: string,        // User's ID from AuthContext
  email: string,        // User's email
  name: string,         // User's name
  fcmTokens: [string],  // Array of FCM tokens (supports multiple devices)
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

1. **Enable Notifications**:

   - Login as a user
   - Go to Settings
   - Enable notifications
   - Check browser console for FCM token

2. **Test Nudge Notification**:

   - Login as a non-Nidhi user
   - Send a nudge to Nidhi
   - If Nidhi has notifications enabled, she should receive a push notification

3. **Test Message Notification**:
   - Send a message to Nidhi
   - She should receive a notification with message preview

## Troubleshooting

### Notifications Not Working

1. **Check Browser Support**:

   - Ensure browser supports notifications (Chrome, Firefox, Edge, Safari)
   - HTTPS is required (or localhost for development)

2. **Check Permissions**:

   - Browser notification permission must be granted
   - Check in browser settings if permission was denied

3. **Check Service Worker**:

   - Open DevTools → Application → Service Workers
   - Ensure `firebase-messaging-sw.js` is registered
   - Check for any errors

4. **Check FCM Token**:

   - Go to Settings page
   - Check if token is displayed
   - Verify token is saved in MongoDB

5. **Check Server Logs**:
   - Look for Firebase Admin initialization messages
   - Check for notification sending errors
   - Invalid tokens will be logged

### Common Issues

**"Firebase Admin not initialized"**

- Check that `serviceAccountKey.json` exists in root directory
- Verify JSON file is valid
- Check server logs for initialization errors

**"Invalid FCM token"**

- Token may have expired
- User may have cleared browser data
- Token will be automatically detected and can be removed

**"Service Worker registration failed"**

- Ensure `firebase-messaging-sw.js` is in `/public` directory
- Check browser console for specific errors
- Verify HTTPS (required for service workers)

## Security Notes

1. **Service Account Key**: Keep `serviceAccountKey.json` secure
2. **FCM Tokens**: Tokens are user-specific and stored securely in MongoDB
3. **Notifications**: Only sent to authenticated users with valid tokens
4. **Rate Limiting**: Consider implementing rate limiting for notification endpoints

## Future Enhancements

- [ ] Notification preferences (enable/disable per type)
- [ ] Notification history
- [ ] Badge counts
- [ ] Sound customization
- [ ] Notification actions (reply, mark as read, etc.)
