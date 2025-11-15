// Express.js + MongoDB backend server for Heart Link
// Run: node server.cjs

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin
// Only initialize from file if running locally (not in Vercel)
if (require.main === module) {
  try {
    // Use dynamic require to avoid errors if file doesn't exist
    const fs = require('fs');
    const path = require('path');
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized from file');
    }
  } catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(compression()); // Compress all responses
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size

// MongoDB connection
// Only connect if running directly (not imported as module)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://superparth:parth123@russia.eejnxrp.mongodb.net/heart-link?retryWrites=true&w=majority&authSource=admin';

if (require.main === module) {
  // Only connect when running directly (local development)
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      console.log('📊 Database:', mongoose.connection.name);
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
    });
}

// Helper function to generate space code
function generateSpaceCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Schemas
const eventSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who owns this event
  emoji: { type: String, required: true },
  title: { type: String, required: true },
  targetDate: { type: Date, required: true },
  sentiment: { type: String }, // Custom sentiment text
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const journeySchema = new mongoose.Schema({
  departureDate: { type: String, required: true },
  distance: { type: Number, required: true },
  heartMessage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who sent the message
  senderId: { type: String, required: true }, // ID of sender
  senderName: { type: String, required: true }, // Name of sender
  recipientId: { type: String, required: true }, // ID of recipient
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const todoSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who owns this todo
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String },
  notes: { type: String },
  isShared: { type: Boolean, default: false }, // Shared with space members
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const nudgeSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  recipientId: { type: String, required: true },
  seen: { type: Boolean, default: false },
  seenAt: { type: Date },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true }, // Email must be unique
  phone: { type: String, required: true }, // Phone number
  pin: { type: String, required: true }, // 4-digit PIN (can be reused, no uniqueness)
  fcmTokens: [{ type: String }], // Array to support multiple devices
  spaceCode: { type: String, index: true }, // Unique space code for group (optional - can be set later)
  spaceId: { type: String, index: true }, // Space ID (same for all users in space) (optional - can be set later)
  spaceName: { type: String }, // Name of the space (set by creator)
  isSpaceCreator: { type: Boolean, default: false }, // Creator of the space
  country1: { type: String, default: "India" }, // First country for user
  country2: { type: String, default: "Krasnoyarsk" }, // Second country for partner/remote
  timezone1: { type: String, default: "Asia/Kolkata" }, // Timezone for country1
  timezone2: { type: String, default: "Asia/Krasnoyarsk" }, // Timezone for country2
  coordinates1: { lat: { type: Number, default: 23.0225 }, lng: { type: Number, default: 72.5714 } }, // Coordinates for country1
  coordinates2: { lat: { type: Number, default: 56.0153 }, lng: { type: Number, default: 92.8932 } }, // Coordinates for country2
}, { timestamps: true });

// Models
const Event = mongoose.model('Event', eventSchema);
const Journey = mongoose.model('Journey', journeySchema);
const Message = mongoose.model('Message', messageSchema);
const Todo = mongoose.model('Todo', todoSchema);
const Nudge = mongoose.model('Nudge', nudgeSchema);
const User = mongoose.model('User', userSchema);

// Helper function to send FCM notification
const sendFCMNotification = async (fcmToken, title, body, data = {}) => {
  if (!admin.apps.length) {
    console.warn('Firebase Admin not initialized, skipping notification');
    return;
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
};

// ==================== EVENT ROUTES ====================

// Get all events for a user's space
app.get('/api/events', async (req, res) => {
  try {
    const { userId } = req.query;
    let events = [];

    if (userId) {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If user has a space, get events from all users in that space
      if (user.spaceId) {
        const spaceUsers = await User.find({ spaceId: user.spaceId }, { userId: 1 });
        const spaceUserIds = spaceUsers.map(u => u.userId);
        events = await Event.find({ userId: { $in: spaceUserIds } }).sort({ createdAt: -1 });
      } else {
        // User has no space yet, return only their own events (solo mode)
        events = await Event.find({ userId: user.userId }).sort({ createdAt: -1 });
      }
    } else {
      events = await Event.find().sort({ createdAt: -1 });
    }

    res.json(events.map(e => ({
      id: e._id.toString(),
      userId: e.userId,
      emoji: e.emoji,
      title: e.title,
      targetDate: e.targetDate.toISOString(),
      sentiment: e.sentiment,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    })));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new event
app.post('/api/events', async (req, res) => {
  try {
    const { userId, emoji, title, targetDate, sentiment } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const event = new Event({
      emoji,
      title,
      targetDate: new Date(targetDate),
      sentiment: sentiment || undefined,
      userId, // Store userId with event
    });

    await event.save();

    res.status(201).json({
      id: event._id.toString(),
      userId: event.userId,
      emoji: event.emoji,
      title: event.title,
      targetDate: event.targetDate.toISOString(),
      sentiment: event.sentiment,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const { emoji, title, targetDate, sentiment } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Verify user owns this event
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const eventOwner = await User.findOne({ userId: event.userId });
    if (!eventOwner || eventOwner.spaceId !== user.spaceId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (event.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    event.emoji = emoji;
    event.title = title;
    event.targetDate = new Date(targetDate);
    event.sentiment = sentiment || undefined;
    event.updatedAt = new Date();

    await event.save();

    res.json({
      id: event._id.toString(),
      userId: event.userId,
      emoji: event.emoji,
      title: event.title,
      targetDate: event.targetDate.toISOString(),
      sentiment: event.sentiment,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== JOURNEY ROUTES ====================

app.get('/api/journey', async (req, res) => {
  try {
    let journey = await Journey.findOne();
    if (!journey) {
      journey = new Journey({
        departureDate: '2024-01-15',
        distance: 4842,
        heartMessage: 'Missing you every day ❤️',
      });
      await journey.save();
    }
    res.json({
      departureDate: journey.departureDate,
      distance: journey.distance,
      heartMessage: journey.heartMessage,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/journey', async (req, res) => {
  try {
    const { departureDate, distance, heartMessage } = req.body;
    let journey = await Journey.findOne();
    if (!journey) {
      journey = new Journey({ departureDate, distance, heartMessage });
    } else {
      journey.departureDate = departureDate;
      journey.distance = distance;
      journey.heartMessage = heartMessage;
    }
    await journey.save();
    res.json({
      departureDate: journey.departureDate,
      distance: journey.distance,
      heartMessage: journey.heartMessage,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== MESSAGE ROUTES ====================

app.get('/api/messages', async (req, res) => {
  try {
    const { userId } = req.query;
    let messages = [];

    if (userId) {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If user has a space, get messages from all users in that space
      if (user.spaceId) {
        const spaceUsers = await User.find({ spaceId: user.spaceId }, { userId: 1 });
        const spaceUserIds = spaceUsers.map(u => u.userId);
        messages = await Message.find({
          $or: [
            { senderId: { $in: spaceUserIds }, recipientId: userId },
            { senderId: userId, recipientId: { $in: spaceUserIds } }
          ]
        }).sort({ createdAt: -1 });
      } else {
        // User has no space yet, return empty
        messages = [];
      }
    } else {
      messages = await Message.find().sort({ createdAt: -1 });
    }

    res.json(messages.map(m => ({
      id: m._id.toString(),
      userId: m.userId,
      senderId: m.senderId,
      senderName: m.senderName,
      recipientId: m.recipientId,
      message: m.message,
      status: m.status,
      readAt: m.readAt ? m.readAt.toISOString() : null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    })));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { userId, senderId, senderName, recipientId, message } = req.body;

    if (!userId || !senderId || !senderName || !recipientId || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const messageDoc = new Message({
      userId,
      senderId,
      senderName,
      recipientId,
      message,
      status: 'sent',
    });

    await messageDoc.save();

    // Send FCM notification to recipient
    const recipient = await User.findOne({ userId: recipientId });
    if (recipient && recipient.fcmTokens && recipient.fcmTokens.length > 0) {
      for (const token of recipient.fcmTokens) {
        await sendFCMNotification(
          token,
          `New message from ${senderName}`,
          message,
          { type: 'message', senderId, messageId: messageDoc._id.toString() }
        );
      }
    }

    res.status(201).json({
      id: messageDoc._id.toString(),
      userId: messageDoc.userId,
      senderId: messageDoc.senderId,
      senderName: messageDoc.senderName,
      recipientId: messageDoc.recipientId,
      message: messageDoc.message,
      status: messageDoc.status,
      createdAt: messageDoc.createdAt.toISOString(),
      updatedAt: messageDoc.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    message.status = status;
    if (status === 'read') {
      message.readAt = new Date();
    }
    await message.save();
    res.json({
      id: message._id.toString(),
      status: message.status,
      readAt: message.readAt ? message.readAt.toISOString() : null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== TODO ROUTES ====================

app.get('/api/todos', async (req, res) => {
  try {
    const { userId } = req.query;
    let todos = [];

    if (userId) {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If user has a space, get todos from all users in that space
      if (user.spaceId) {
        const spaceUsers = await User.find({ spaceId: user.spaceId }, { userId: 1 });
        const spaceUserIds = spaceUsers.map(u => u.userId);
        // Get user's personal todos OR shared todos from space
        todos = await Todo.find({
          $or: [
            { userId: { $in: spaceUserIds }, isShared: true }, // Shared todos from space
            { userId: userId, isShared: false } // User's personal todos
          ]
        }).sort({ createdAt: -1 });
      } else {
        // User has no space yet, only return their personal todos
        todos = await Todo.find({ userId, isShared: false }).sort({ createdAt: -1 });
      }
    } else {
      todos = await Todo.find().sort({ createdAt: -1 });
    }

    res.json(todos.map(t => ({
      id: t._id.toString(),
      userId: t.userId,
      text: t.text,
      completed: t.completed,
      dueDate: t.dueDate,
      priority: t.priority,
      category: t.category,
      notes: t.notes,
      isShared: t.isShared,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { userId, text, completed, dueDate, priority, category, notes, isShared } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const todo = new Todo({
      userId,
      text,
      completed: completed || false,
      dueDate: dueDate || undefined,
      priority: priority || 'medium',
      category: category || undefined,
      notes: notes || undefined,
      isShared: isShared || false,
    });

    await todo.save();

    res.status(201).json({
      id: todo._id.toString(),
      userId: todo.userId,
      text: todo.text,
      completed: todo.completed,
      dueDate: todo.dueDate,
      priority: todo.priority,
      category: todo.category,
      notes: todo.notes,
      isShared: todo.isShared,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { userId, text, completed, dueDate, priority, category, notes, isShared } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Verify user owns this todo or it's a shared todo in their space
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (todo.userId !== userId) {
      // Check if it's a shared todo in user's space
      if (!todo.isShared || !user.spaceId) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      const todoOwner = await User.findOne({ userId: todo.userId });
      if (!todoOwner || todoOwner.spaceId !== user.spaceId) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    todo.text = text;
    todo.completed = completed;
    todo.dueDate = dueDate || undefined;
    todo.priority = priority || 'medium';
    todo.category = category || undefined;
    todo.notes = notes || undefined;
    todo.isShared = isShared || false;
    todo.updatedAt = new Date();

    await todo.save();

    res.json({
      id: todo._id.toString(),
      userId: todo.userId,
      text: todo.text,
      completed: todo.completed,
      dueDate: todo.dueDate,
      priority: todo.priority,
      category: todo.category,
      notes: todo.notes,
      isShared: todo.isShared,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this todo' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== NUDGE ROUTES ====================

app.get('/api/nudges', async (req, res) => {
  try {
    const { userId, seen } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Build query
    const query = { recipientId: userId };
    if (seen !== undefined) {
      query.seen = seen === 'true';
    }

    const nudges = await Nudge.find(query).sort({ createdAt: -1 });
    res.json(nudges.map(n => ({
      id: n._id.toString(),
      senderId: n.senderId,
      senderName: n.senderName,
      recipientId: n.recipientId,
      seen: n.seen,
      seenAt: n.seenAt ? n.seenAt.toISOString() : null,
      createdAt: n.createdAt.toISOString(),
    })));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/nudges', async (req, res) => {
  try {
    const { senderId, senderName, recipientId } = req.body;

    if (!senderId || !senderName || !recipientId) {
      return res.status(400).json({ error: 'senderId, senderName, and recipientId are required' });
    }

    const nudge = new Nudge({
      senderId,
      senderName,
      recipientId,
    });

    await nudge.save();

    // Send FCM notification to recipient
    const recipient = await User.findOne({ userId: recipientId });
    if (recipient && recipient.fcmTokens && recipient.fcmTokens.length > 0) {
      for (const token of recipient.fcmTokens) {
        await sendFCMNotification(
          token,
          `💓 Nudge from ${senderName}`,
          `${senderName} is thinking of you!`,
          { type: 'nudge', senderId, nudgeId: nudge._id.toString() }
        );
      }
    }

    res.status(201).json({
      id: nudge._id.toString(),
      senderId: nudge.senderId,
      senderName: nudge.senderName,
      recipientId: nudge.recipientId,
      seen: nudge.seen,
      seenAt: nudge.seenAt ? nudge.seenAt.toISOString() : null,
      createdAt: nudge.createdAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/nudges/:id/seen', async (req, res) => {
  try {
    const nudge = await Nudge.findById(req.params.id);
    if (!nudge) {
      return res.status(404).json({ error: 'Nudge not found' });
    }
    nudge.seen = true;
    nudge.seenAt = new Date();
    await nudge.save();
    res.json({
      id: nudge._id.toString(),
      seen: nudge.seen,
      seenAt: nudge.seenAt.toISOString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get unseen nudges count
app.get('/api/nudges/unseen-count', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const count = await Nudge.countDocuments({ recipientId: userId, seen: false });
    res.json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark all nudges as seen for a user
app.put('/api/nudges/mark-all-seen', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await Nudge.updateMany(
      { recipientId: userId, seen: false },
      { seen: true, seenAt: new Date() }
    );

    res.json({ message: 'All nudges marked as seen' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, pin, name } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ error: 'Email and PIN are required' });
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    // Find user by email and PIN
    const user = await User.findOne({ email: email.toLowerCase().trim(), pin });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or PIN' });
    }

    // Update name if provided and different
    if (name && name.trim() && name !== user.name) {
      user.name = name.trim();
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        spaceCode: user.spaceCode || undefined,
        spaceId: user.spaceId || undefined,
        spaceName: user.spaceName || undefined,
        isSpaceCreator: user.isSpaceCreator || false,
        country1: user.country1,
        country2: user.country2,
        timezone1: user.timezone1,
        timezone2: user.timezone2,
        coordinates1: user.coordinates1,
        coordinates2: user.coordinates2,
        createdAt: user.createdAt,
      },
      token: user.userId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new user (signup) - WITHOUT creating space
app.post('/api/users/signup', async (req, res) => {
  try {

    const { name, email, phone, pin } = req.body;

    if (!name || !email || !phone || !pin) {
      return res.status(400).json({ error: 'Name, email, phone, and PIN are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate PIN format
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
    }

    // Check MongoDB connection state
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // PIN can be reused - no uniqueness check

    // Generate userId
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new user WITHOUT space (space will be created/joined later via modal)
    const user = new User({
      userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      pin,
      fcmTokens: [],
      // spaceCode and spaceId will be set when user chooses to create/join space
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        spaceCode: user.spaceCode || undefined,
        spaceId: user.spaceId || undefined,
        spaceName: user.spaceName || undefined,
        isSpaceCreator: user.isSpaceCreator || false,
        country1: user.country1,
        country2: user.country2,
        timezone1: user.timezone1,
        timezone2: user.timezone2,
        coordinates1: user.coordinates1,
        coordinates2: user.coordinates2,
        createdAt: user.createdAt,
      },
      token: user.userId,
    });
  } catch (error) {
    // Check for MongoDB authentication errors
    if (error.message && (error.message.includes('bad auth') || error.message.includes('authentication failed'))) {
      console.error('❌ MongoDB Authentication Error:', error.message);
      return res.status(500).json({ error: 'Database authentication failed. Please check MongoDB credentials.' });
    }

    if (error.code === 11000) {
      // Duplicate key error - only check for email, ignore PIN
      if (error.keyPattern?.email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      // If it's a PIN duplicate error, ignore it (PINs can be reused)
      if (error.keyPattern?.pin) {
        // PIN can be reused, so we'll just continue - retry the save
        // The user should already be saved, so we can return success
        // But to be safe, let's try to find the user and return it
        try {
          const savedUser = await User.findOne({ email: email.toLowerCase().trim() });
          if (savedUser) {
            return res.status(201).json({
              success: true,
              user: {
                id: savedUser.userId,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                spaceCode: savedUser.spaceCode || undefined,
                spaceId: savedUser.spaceId || undefined,
                spaceName: savedUser.spaceName || undefined,
                isSpaceCreator: savedUser.isSpaceCreator || false,
                country1: savedUser.country1,
                country2: savedUser.country2,
                timezone1: savedUser.timezone1,
                timezone2: savedUser.timezone2,
                coordinates1: savedUser.coordinates1,
                coordinates2: savedUser.coordinates2,
                createdAt: savedUser.createdAt,
              },
              token: savedUser.userId,
            });
          }
        } catch (findError) {
          // If we can't find the user, continue with normal error handling
        }
      }
    }
    // Don't expose PIN-related errors to the client
    if (error.message && error.message.toLowerCase().includes('pin')) {
      return res.status(400).json({ error: 'Failed to create account. Please try again.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Create space for existing user
app.post('/api/users/:userId/create-space', async (req, res) => {
  try {
    const { userId } = req.params;
    const { spaceName } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.spaceCode && user.spaceId) {
      return res.status(400).json({ error: 'User already has a space' });
    }

    // Generate space code
    let spaceCode = generateSpaceCode();
    let spaceId = `space_${Date.now()}`;

    // Ensure space code is unique
    while (await User.findOne({ spaceCode })) {
      spaceCode = generateSpaceCode();
    }

    // Update user with space
    user.spaceCode = spaceCode;
    user.spaceId = spaceId;
    user.spaceName = spaceName?.trim() || undefined;
    user.isSpaceCreator = true;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        spaceCode: user.spaceCode,
        spaceId: user.spaceId,
        spaceName: user.spaceName,
        isSpaceCreator: user.isSpaceCreator,
        country1: user.country1,
        country2: user.country2,
        timezone1: user.timezone1,
        timezone2: user.timezone2,
        coordinates1: user.coordinates1,
        coordinates2: user.coordinates2,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join existing space with code
app.post('/api/users/join-space', async (req, res) => {
  try {
    const { name, email, phone, pin, spaceCode } = req.body;

    if (!name || !email || !phone || !pin || !spaceCode) {
      return res.status(400).json({ error: 'Name, email, phone, PIN, and space code are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate PIN format
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // PIN can be reused - no uniqueness check

    // Find space by code
    const spaceOwner = await User.findOne({ spaceCode: spaceCode.toUpperCase() });
    if (!spaceOwner) {
      return res.status(404).json({ error: 'Invalid space code' });
    }

    // Generate userId
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new user in existing space
    const user = new User({
      userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      pin,
      fcmTokens: [],
      spaceCode: spaceOwner.spaceCode,
      spaceId: spaceOwner.spaceId,
      isSpaceCreator: false,
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        spaceCode: user.spaceCode,
        spaceId: user.spaceId,
        spaceName: user.spaceName,
        isSpaceCreator: user.isSpaceCreator,
        country1: user.country1,
        country2: user.country2,
        timezone1: user.timezone1,
        timezone2: user.timezone2,
        coordinates1: user.coordinates1,
        coordinates2: user.coordinates2,
        createdAt: user.createdAt,
      },
      token: user.userId,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - only check for email, ignore PIN
      if (error.keyPattern?.email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      // If it's a PIN duplicate error, ignore it (PINs can be reused)
      if (error.keyPattern?.pin) {
        // PIN can be reused, so we'll just continue - retry the save
        // The user should already be saved, so we can return success
        // But to be safe, let's try to find the user and return it
        try {
          const savedUser = await User.findOne({ email: email.toLowerCase().trim() });
          if (savedUser) {
            return res.status(201).json({
              success: true,
              user: {
                id: savedUser.userId,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                spaceCode: savedUser.spaceCode,
                spaceId: savedUser.spaceId,
                spaceName: savedUser.spaceName,
                isSpaceCreator: savedUser.isSpaceCreator,
                country1: savedUser.country1,
                country2: savedUser.country2,
                timezone1: savedUser.timezone1,
                timezone2: savedUser.timezone2,
                coordinates1: savedUser.coordinates1,
                coordinates2: savedUser.coordinates2,
                createdAt: savedUser.createdAt,
              },
              token: savedUser.userId,
            });
          }
        } catch (findError) {
          // If we can't find the user, continue with normal error handling
        }
      }
    }
    // Don't expose PIN-related errors to the client
    if (error.message && error.message.toLowerCase().includes('pin')) {
      return res.status(400).json({ error: 'Failed to join space. Please try again.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Join space for existing user
app.post('/api/users/:userId/join-space', async (req, res) => {
  try {
    const { userId } = req.params;
    const { spaceCode } = req.body;

    if (!spaceCode) {
      return res.status(400).json({ error: 'Space code is required' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.spaceCode && user.spaceId) {
      return res.status(400).json({ error: 'User already has a space' });
    }

    // Find space by code
    const spaceOwner = await User.findOne({ spaceCode: spaceCode.toUpperCase() });
    if (!spaceOwner) {
      return res.status(404).json({ error: 'Invalid space code' });
    }

    // Update user to join space
    user.spaceCode = spaceOwner.spaceCode;
    user.spaceId = spaceOwner.spaceId;
    user.isSpaceCreator = false;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        spaceCode: user.spaceCode,
        spaceId: user.spaceId,
        spaceName: user.spaceName,
        isSpaceCreator: user.isSpaceCreator,
        country1: user.country1,
        country2: user.country2,
        timezone1: user.timezone1,
        timezone2: user.timezone2,
        coordinates1: user.coordinates1,
        coordinates2: user.coordinates2,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (admin only, or filtered for regular users)
app.get('/api/users', async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      const requestingUser = await User.findOne({ userId });
      if (!requestingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Users can see other users in the same space (for partner selection)
      if (requestingUser.spaceId) {
        const spaceUsers = await User.find(
          { spaceId: requestingUser.spaceId, userId: { $ne: requestingUser.userId } },
          { pin: 0 }
        ); // Don't send PINs, exclude self
        return res.json(spaceUsers.map(u => ({
          id: u.userId,
          name: u.name,
          email: u.email,
          phone: u.phone,
          spaceCode: u.spaceCode,
          spaceId: u.spaceId,
          isSpaceCreator: u.isSpaceCreator,
          createdAt: u.createdAt,
        })));
      } else {
        // User has no space, return empty
        return res.json([]);
      }
    }

    // Default: return empty if no userId provided
    res.json([]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get space info by code - MUST be before /api/users/:userId route
app.get('/api/spaces/:spaceCode', async (req, res) => {
  try {
    const { spaceCode } = req.params;

    const spaceOwner = await User.findOne({ spaceCode: spaceCode.toUpperCase() });
    if (!spaceOwner) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json({
      success: true,
      space: {
        code: spaceOwner.spaceCode,
        name: spaceOwner.spaceName,
        creatorName: spaceOwner.name,
        creatorId: spaceOwner.userId,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user countries and timezones - MUST be before /api/users/:userId route
app.put('/api/users/:userId/countries', async (req, res) => {
  try {
    const { userId } = req.params;
    const { country1, country2, timezone1, timezone2, coordinates1, coordinates2 } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (country1) user.country1 = country1;
    if (country2) user.country2 = country2;
    if (timezone1) user.timezone1 = timezone1;
    if (timezone2) user.timezone2 = timezone2;
    if (coordinates1) user.coordinates1 = coordinates1;
    if (coordinates2) user.coordinates2 = coordinates2;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        country1: user.country1,
        country2: user.country2,
        timezone1: user.timezone1,
        timezone2: user.timezone2,
        coordinates1: user.coordinates1,
        coordinates2: user.coordinates2,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user by ID - MUST be after more specific routes like /countries
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      spaceCode: user.spaceCode || undefined,
      spaceId: user.spaceId || undefined,
      spaceName: user.spaceName || undefined,
      isSpaceCreator: user.isSpaceCreator || false,
      country1: user.country1,
      country2: user.country2,
      timezone1: user.timezone1,
      timezone2: user.timezone2,
      coordinates1: user.coordinates1,
      coordinates2: user.coordinates2,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== USER FCM TOKEN ROUTES ====================

app.put('/api/users/:userId/fcm-token', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ error: 'FCM token is required' });
    }

    let user = await User.findOne({ userId });

    if (!user) {
      // Create new user record (you might want to get email/name from auth)
      user = new User({
        userId,
        email: req.body.email || '',
        name: req.body.name || '',
        phone: req.body.phone || '',
        pin: req.body.pin || '0000',
        fcmTokens: [fcmToken],
      });
    } else {
      // Add token if not already present
      if (!user.fcmTokens.includes(fcmToken)) {
        user.fcmTokens.push(fcmToken);
      }
    }

    await user.save();
    res.json({ message: 'FCM token updated successfully', tokens: user.fcmTokens });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/:userId/fcm-token', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fcmToken } = req.body;

    const user = await User.findOne({ userId });
    if (user && fcmToken) {
      user.fcmTokens = user.fcmTokens.filter(token => token !== fcmToken);
      await user.save();
    }

    res.json({ message: 'FCM token removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Quote Generation Endpoint - Generate a single random quote
app.get('/api/quotes/generate', async (req, res) => {
  try {
    // Generate a random emotional quote about long-distance relationships
    const quoteTemplates = [
      "Even thousands of kilometers apart, our hearts beat as one ❤️",
      "Distance means nothing when someone means everything 💕",
      "Love knows no distance; it has no continent; its eyes are for the stars ✨",
      "The best thing to hold onto in life is each other 💖",
      "No matter where you are, you're always in my heart 🫶",
      "Every heartbeat reminds me of you, no matter the miles between us 💗",
      "You're my home, no matter where I am 🌍❤️",
      "Distance is just a test to see how far love can travel 🚀💝",
      "True love doesn't mean being inseparable; it means being separated and nothing changes 💫",
      "The simple lack of you is more to me than others' presence 🌙💕",
      "I carry your heart with me (I carry it in my heart) 💌",
      "Love will travel as far as you let it. It has no limits ❤️🌎",
      "Missing you gets easier every day because even though you're one day further from the last time I saw you, you're one day closer to the next time I will 🌅",
      "Distance is not for the fearful, it's for the bold. It's for those who are willing to spend a lot of time alone in exchange for a little time with the one they love 💪💕",
      "I exist in two places: here and where you are 🌍💫",
    ];

    const randomQuote = quoteTemplates[Math.floor(Math.random() * quoteTemplates.length)];
    res.json({ quote: randomQuote });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Get all quotes (for compatibility)
app.get('/api/quotes', async (req, res) => {
  try {
    const quoteTemplates = [
      "Even thousands of kilometers apart, our hearts beat as one ❤️",
      "Distance means nothing when someone means everything 💕",
      "Love knows no distance; it has no continent; its eyes are for the stars ✨",
      "The best thing to hold onto in life is each other 💖",
      "No matter where you are, you're always in my heart 🫶",
      "Every heartbeat reminds me of you, no matter the miles between us 💗",
      "You're my home, no matter where I am 🌍❤️",
      "Distance is just a test to see how far love can travel 🚀💝",
      "True love doesn't mean being inseparable; it means being separated and nothing changes 💫",
      "The simple lack of you is more to me than others' presence 🌙💕",
      "I carry your heart with me (I carry it in my heart) 💌",
      "Love will travel as far as you let it. It has no limits ❤️🌎",
      "Missing you gets easier every day because even though you're one day further from the last time I saw you, you're one day closer to the next time I will 🌅",
      "Distance is not for the fearful, it's for the bold. It's for those who are willing to spend a lot of time alone in exchange for a little time with the one they love 💪💕",
      "I exist in two places: here and where you are 🌍💫",
    ];

    res.json(quoteTemplates.map((quote, index) => ({ id: index + 1, quote })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Export app for Vercel serverless functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}

// Only listen if running directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  });
}
