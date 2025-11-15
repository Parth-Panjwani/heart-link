# Heart Link 💝

A beautiful, modern web application designed to keep long-distance relationships connected. Share moments, track time together, send messages, and collaborate on tasks with your loved ones.

## ✨ Features

### 🏠 Home Dashboard
- **Time & Weather Cards**: View current time and weather for both locations
- **Distance Map**: Visual representation of the distance between you and your partner
- **Days Apart Tracker**: Count the days since you've been apart
- **Emotional Quotes**: Inspirational quotes to brighten your day
- **Time Converter**: Convert times between your timezones
- **Countdown Events**: Track important upcoming moments together

### 📅 Countdowns
- Create and manage countdown events with custom emojis
- Categorize events by sentiment (excited, nervous, happy, etc.)
- View all shared countdowns from your space
- Edit and delete events

### 💬 Messages
- Send heart messages to your partner
- Real-time message status (sent, delivered, read)
- Push notifications via Firebase Cloud Messaging
- Message history and management

### ✅ Todos
- Personal and shared todo lists
- Priority levels (low, medium, high)
- Due dates and categories
- Notes for additional context
- Share tasks with your space members

### 🗺️ Journey
- Track your journey together
- Set departure dates
- Calculate distance between locations
- Share heart messages about your journey

### ⚙️ Settings
- Manage your profile
- Update countries and timezones
- Configure space settings
- Update FCM tokens for push notifications

### 🔐 Authentication
- Secure signup with email, phone, and 4-digit PIN
- Space-based user management
- Create or join spaces with unique codes
- Persistent sessions

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **date-fns** - Date utilities
- **Firebase** - Push notifications

### Backend
- **Express.js** - Web server
- **MongoDB** - Database (via Mongoose)
- **Firebase Admin** - Push notification service
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression

### Deployment
- **Vercel** - Frontend and serverless functions
- **MongoDB Atlas** - Cloud database

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Firebase project (for push notifications)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd heart-link
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link?retryWrites=true&w=majority&authSource=admin
   PORT=3001
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Set up Firebase** (optional, for push notifications)
   
   Download your Firebase service account key and save it as `serviceAccountKey.json` in the root directory.

5. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately:
   npm run server  # Backend on http://localhost:3001
   npm run dev     # Frontend on http://localhost:5173
   ```

## 📁 Project Structure

```
heart-link/
├── api/                    # Vercel serverless functions
│   ├── server.js          # Serverless function entry point
│   └── server-routes.js    # Route definitions
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   └── firebase-messaging-sw.js  # Service worker
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── api.ts         # API client
│   │   ├── firebase.ts    # Firebase config
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Home dashboard
│   │   ├── Login.tsx      # Login page
│   │   ├── Signup.tsx     # Signup page
│   │   ├── Countdowns.tsx # Countdowns page
│   │   ├── Messages.tsx   # Messages page
│   │   ├── Todo.tsx       # Todos page
│   │   ├── Journey.tsx    # Journey page
│   │   └── Settings.tsx   # Settings page
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── server.cjs             # Express backend server
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🔌 API Endpoints

All API endpoints are prefixed with `/api`:

### Users
- `POST /api/users/signup` - Create new user
- `POST /api/users/login` - Login user
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user
- `POST /api/users/:userId/fcm-token` - Register FCM token

### Events (Countdowns)
- `GET /api/events?userId=...` - Get all events for user's space
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id?userId=...` - Delete event

### Messages
- `GET /api/messages?userId=...` - Get all messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/status` - Update message status
- `DELETE /api/messages/:id` - Delete message

### Todos
- `GET /api/todos?userId=...` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id?userId=...` - Delete todo

### Journey
- `GET /api/journey` - Get journey data
- `PUT /api/journey` - Update journey data

### Spaces
- `POST /api/spaces/create` - Create new space
- `POST /api/spaces/join` - Join existing space
- `GET /api/spaces/:spaceId/users` - Get space members

### Nudges
- `POST /api/nudges` - Send nudge
- `GET /api/nudges?userId=...` - Get nudges
- `PUT /api/nudges/:id/seen` - Mark nudge as seen

## 🗄️ Database Schema

### User
```javascript
{
  userId: String (unique),
  name: String,
  email: String (unique),
  phone: String,
  pin: String (4 digits),
  fcmTokens: [String],
  spaceCode: String,
  spaceId: String,
  spaceName: String,
  isSpaceCreator: Boolean,
  country1: String,
  country2: String,
  timezone1: String,
  timezone2: String,
  coordinates1: { lat: Number, lng: Number },
  coordinates2: { lat: Number, lng: Number }
}
```

### Event
```javascript
{
  userId: String,
  emoji: String,
  title: String,
  targetDate: Date,
  sentiment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  userId: String,
  senderId: String,
  senderName: String,
  recipientId: String,
  message: String,
  status: String (sent/delivered/read),
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Todo
```javascript
{
  userId: String,
  text: String,
  completed: Boolean,
  dueDate: String,
  priority: String (low/medium/high),
  category: String,
  notes: String,
  isShared: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Set Environment Variables**
   
   In Vercel project settings, add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-link?retryWrites=true&w=majority&authSource=admin
   VITE_API_URL=https://your-app.vercel.app/api
   ```
   
   For Firebase (optional):
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for development)
5. Get your connection string
6. Update `MONGODB_URI` in environment variables

### Firebase Setup (Optional)

1. Create a Firebase project
2. Enable Cloud Messaging
3. Generate service account key
4. Download `serviceAccountKey.json` for local development
5. Add environment variables for Vercel deployment

## 🧪 Development Scripts

```bash
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run dev:full     # Start both frontend and backend
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run clean-db     # Clean database (development)
```

## 🔒 Security Notes

- PINs are stored as plain text (4-digit PINs can be reused)
- Email addresses must be unique
- User authentication is session-based
- MongoDB connection uses `authSource=admin` for admin users
- CORS is enabled for all origins (configure for production)

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For issues or suggestions, please contact the maintainer.

## 📧 Support

For support, please open an issue in the repository or contact the project maintainer.

---

Made with ❤️ for long-distance relationships
