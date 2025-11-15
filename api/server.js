// Vercel serverless function - Express app wrapper
// This imports the Express app from server.cjs

const mongoose = require('mongoose');
const admin = require('firebase-admin');

// MongoDB connection handler
let mongooseConnection = null;

async function connectDB() {
  if (mongooseConnection) {
    return mongooseConnection;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  try {
    mongooseConnection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    return mongooseConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Initialize Firebase Admin from environment variables
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      })
    });
    console.log('✅ Firebase Admin initialized');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization failed:', error.message);
}

// Import the Express app from server.cjs
// server.cjs now exports the app instead of listening
const app = require('../server.cjs');

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
