// Express.js + MongoDB backend server for Heart Link
// Run: node server.js
// Note: This file uses CommonJS syntax. If you get module errors, rename to server.cjs

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// Note: If password contains special characters like @, use URL encoding (%40 for @)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nidhipanjwani:nidhi%40189@nidhi.wlb4xkj.mongodb.net/heart-link?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Schemas
const eventSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  title: { type: String, required: true },
  targetDate: { type: Date, required: true },
  sentiment: { type: String, enum: ['far-from-home', 'together-soon', 'special-occasion', 'milestone', 'celebration', 'reunion'] },
}, { timestamps: true });

const journeySchema = new mongoose.Schema({
  departureDate: { type: Date, default: new Date('2024-01-15') },
  distance: { type: Number, default: 4842 },
  heartMessage: { type: String, default: 'Missing you every day ❤️' },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  readAt: { type: Date },
}, { timestamps: true });

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String },
  notes: { type: String },
}, { timestamps: true });

// Models
const Event = mongoose.model('Event', eventSchema);
const Journey = mongoose.model('Journey', journeySchema);
const Message = mongoose.model('Message', messageSchema);
const Todo = mongoose.model('Todo', todoSchema);

// Helper function to format response
const formatEvent = (event) => ({
  id: event._id.toString(),
  emoji: event.emoji,
  title: event.title,
  targetDate: event.targetDate.toISOString(),
  sentiment: event.sentiment,
  createdAt: event.createdAt.toISOString(),
  updatedAt: event.updatedAt.toISOString(),
});

const formatMessage = (message) => ({
  id: message._id.toString(),
  senderId: message.senderId,
  senderName: message.senderName,
  message: message.message,
  status: message.status,
  readAt: message.readAt ? message.readAt.toISOString() : undefined,
  createdAt: message.createdAt.toISOString(),
  updatedAt: message.updatedAt.toISOString(),
});

const formatTodo = (todo) => ({
  id: todo._id.toString(),
  text: todo.text,
  completed: todo.completed,
  dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined,
  priority: todo.priority,
  category: todo.category,
  notes: todo.notes,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString(),
});

// ==================== EVENTS ROUTES ====================

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events.map(formatEvent));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(formatEvent(event));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event({
      emoji: req.body.emoji,
      title: req.body.title,
      targetDate: new Date(req.body.targetDate),
      sentiment: req.body.sentiment,
    });
    await event.save();
    res.status(201).json(formatEvent(event));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.emoji) updateData.emoji = req.body.emoji;
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.targetDate) updateData.targetDate = new Date(req.body.targetDate);
    if (req.body.sentiment !== undefined) updateData.sentiment = req.body.sentiment;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(formatEvent(event));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== JOURNEY ROUTES ====================

app.get('/api/journey', async (req, res) => {
  try {
    let journey = await Journey.findOne();
    if (!journey) {
      journey = new Journey({
        departureDate: new Date('2024-01-15'),
        distance: 4842,
        heartMessage: 'Missing you every day ❤️',
      });
      await journey.save();
    }
    res.json({
      departureDate: journey.departureDate.toISOString(),
      distance: journey.distance,
      heartMessage: journey.heartMessage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/journey', async (req, res) => {
  try {
    let journey = await Journey.findOne();
    if (!journey) {
      journey = new Journey({
        departureDate: req.body.departureDate ? new Date(req.body.departureDate) : new Date('2024-01-15'),
        distance: req.body.distance || 4842,
        heartMessage: req.body.heartMessage || 'Missing you every day ❤️',
      });
    } else {
      if (req.body.departureDate) journey.departureDate = new Date(req.body.departureDate);
      if (req.body.distance !== undefined) journey.distance = req.body.distance;
      if (req.body.heartMessage) journey.heartMessage = req.body.heartMessage;
    }
    await journey.save();
    res.json({
      departureDate: journey.departureDate.toISOString(),
      distance: journey.distance,
      heartMessage: journey.heartMessage,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== MESSAGES ROUTES ====================

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages.map(formatMessage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(formatMessage(message));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message({
      senderId: req.body.senderId,
      senderName: req.body.senderName,
      message: req.body.message,
      status: req.body.status || 'sent',
      readAt: req.body.readAt ? new Date(req.body.readAt) : undefined,
    });
    await message.save();
    res.status(201).json(formatMessage(message));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/messages/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.message) updateData.message = req.body.message;
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.readAt) updateData.readAt = new Date(req.body.readAt);
    if (req.body.status === 'read' && !updateData.readAt) {
      updateData.readAt = new Date();
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(formatMessage(message));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TODOS ROUTES ====================

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos.map(formatTodo));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(formatTodo(todo));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      completed: req.body.completed || false,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      priority: req.body.priority || 'medium',
      category: req.body.category,
      notes: req.body.notes,
    });
    await todo.save();
    res.status(201).json(formatTodo(todo));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.text !== undefined) updateData.text = req.body.text;
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(formatTodo(todo));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

