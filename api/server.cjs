// Vercel serverless function - Express app wrapper
// This imports the Express app from server.cjs

const mongoose = require('mongoose');
const admin = require('firebase-admin');

// MongoDB connection handler
let mongooseConnection = null;
let isConnecting = false;

async function connectDB() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  
  // If already connecting, wait for it
  if (isConnecting) {
    return new Promise((resolve) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
    });
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  try {
    isConnecting = true;
    // Connect if not already connected
    if (mongoose.connection.readyState === 0) {
      mongooseConnection = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected');
    }
    isConnecting = false;
    return mongoose.connection;
  } catch (error) {
    isConnecting = false;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Initialize Firebase Admin from environment variables (only once)
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    // Check if already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
      });
      console.log('✅ Firebase Admin initialized');
    }
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization failed:', error.message);
}

// Import the Express app from server.cjs
// server.cjs now exports the app instead of listening
const app = require('../server.cjs');

// Vercel serverless function handler
// Vercel provides Node.js-compatible req/res, so we can use Express directly
// But we need to ensure MongoDB is connected first
const handler = async (req, res) => {
  try {
    // Vercel rewrite: /api/users/signup -> /api/server
    // According to Vercel docs, req.url should contain the ORIGINAL path after rewrite
    // But if it doesn't, we need to check headers or reconstruct it
    
    // Log all available information for debugging
    console.log('📥 Request received:', {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      path: req.path,
      headers: {
        'x-vercel-original-path': req.headers['x-vercel-original-path'],
        'x-vercel-rewrite-path': req.headers['x-vercel-rewrite-path'],
        'x-original-path': req.headers['x-original-path'],
        'x-invoke-path': req.headers['x-invoke-path']
      }
    });
    
    // Vercel should preserve the original URL in req.url
    // But if we're getting /server or /api/server, we need to fix it
    let pathToUse = req.url;
    
    // Check if we got the rewritten destination path (exactly /server or /api/server)
    if (pathToUse === '/server' || pathToUse === '/api/server') {
      // Try to get original path from Vercel headers
      const originalPath = req.headers['x-vercel-original-path'] || 
                          req.headers['x-vercel-rewrite-path'] ||
                          req.headers['x-original-path'];
      
      if (originalPath) {
        pathToUse = originalPath;
        console.log('✅ Using original path from headers:', pathToUse);
      } else {
        // This shouldn't happen, but if it does, log it
        console.error('❌ Original path not found in headers or req.url');
        console.error('Full request object keys:', Object.keys(req));
        // Return error to help debug
        return res.status(500).json({
          error: 'Path resolution error',
          message: 'Could not determine original request path',
          receivedUrl: req.url,
          availableHeaders: Object.keys(req.headers).filter(h => h.toLowerCase().includes('path') || h.toLowerCase().includes('vercel'))
        });
      }
    }
    
    // Ensure path starts with /api for Express routes
    if (pathToUse && !pathToUse.startsWith('/api')) {
      pathToUse = '/api' + (pathToUse.startsWith('/') ? pathToUse : '/' + pathToUse);
    }
    
    // Set the URL for Express
    req.url = pathToUse;
    req.originalUrl = req.originalUrl || pathToUse;
    
    console.log('📋 Final path for Express:', req.url);
    
    // Ensure MongoDB is connected before handling request
    await connectDB();
    
    // Handle request with Express app directly
    app(req, res);
  } catch (error) {
    console.error('❌ Handler error:', error.message);
    console.error('Stack:', error.stack);

    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Internal server error', 
        details: error.message
      });
    }
  }
};

module.exports = handler;
