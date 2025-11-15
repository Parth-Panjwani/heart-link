// Example Express.js + MongoDB backend server
// Install dependencies: npm install express mongoose cors dotenv

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heart-link';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const eventSchema = new mongoose.Schema({
  emoji: String,
  title: String,
  targetDate: Date,
}, { timestamps: true });

const journeySchema = new mongoose.Schema({
  departureDate: Date,
  distance: Number,
  heartMessage: String,
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['local', 'remote'], required: true },
  message: String,
}, { timestamps: true });

// Models
const Event = mongoose.model('Event', eventSchema);
const Journey = mongoose.model('Journey', journeySchema);
const Message = mongoose.model('Message', messageSchema);

// Routes - Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Journey
app.get('/api/journey', async (req, res) => {
  try {
    let journey = await Journey.findOne();
    if (!journey) {
      // Create default journey
      journey = new Journey({
        departureDate: new Date('2024-01-15'),
        distance: 4842,
        heartMessage: 'Missing you every day ❤️',
      });
      await journey.save();
    }
    res.json(journey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/journey', async (req, res) => {
  try {
    let journey = await Journey.findOne();
    if (!journey) {
      journey = new Journey(req.body);
    } else {
      Object.assign(journey, req.body);
    }
    await journey.save();
    res.json(journey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

