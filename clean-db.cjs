// Script to clean all data from MongoDB database
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nidhipanjwani:nidhi@189@nidhi.wlb4xkj.mongodb.net/';

const eventSchema = new mongoose.Schema({}, { strict: false });
const journeySchema = new mongoose.Schema({}, { strict: false });
const messageSchema = new mongoose.Schema({}, { strict: false });
const todoSchema = new mongoose.Schema({}, { strict: false });
const nudgeSchema = new mongoose.Schema({}, { strict: false });
const userSchema = new mongoose.Schema({}, { strict: false });

const Event = mongoose.model('Event', eventSchema);
const Journey = mongoose.model('Journey', journeySchema);
const Message = mongoose.model('Message', messageSchema);
const Todo = mongoose.model('Todo', todoSchema);
const Nudge = mongoose.model('Nudge', nudgeSchema);
const User = mongoose.model('User', userSchema);

async function cleanDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Cleaning database...');
    
    // Delete all collections
    const deletedEvents = await Event.deleteMany({});
    console.log(`Deleted ${deletedEvents.deletedCount} events`);
    
    const deletedJourneys = await Journey.deleteMany({});
    console.log(`Deleted ${deletedJourneys.deletedCount} journeys`);
    
    const deletedMessages = await Message.deleteMany({});
    console.log(`Deleted ${deletedMessages.deletedCount} messages`);
    
    const deletedTodos = await Todo.deleteMany({});
    console.log(`Deleted ${deletedTodos.deletedCount} todos`);
    
    const deletedNudges = await Nudge.deleteMany({});
    console.log(`Deleted ${deletedNudges.deletedCount} nudges`);
    
    const deletedUsers = await User.deleteMany({});
    console.log(`Deleted ${deletedUsers.deletedCount} users`);
    
    console.log('\n✅ Database cleaned successfully!');
    console.log('All collections have been cleared.');
    
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

cleanDatabase();

