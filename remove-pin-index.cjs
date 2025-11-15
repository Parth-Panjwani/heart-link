// Script to remove unique index on PIN field if it exists
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nidhipanjwani:nidhi@189@nidhi.wlb4xkj.mongodb.net/heart-link';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

async function removePinIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Checking for PIN index...');
    const collection = mongoose.connection.db.collection('users');
    const indexes = await collection.indexes();
    
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Check if there's a unique index on PIN
    const pinIndex = indexes.find(idx => idx.key && idx.key.pin);
    if (pinIndex && pinIndex.unique) {
      console.log('Found unique index on PIN, removing it...');
      await collection.dropIndex(pinIndex.name);
      console.log(`✅ Removed unique index: ${pinIndex.name}`);
    } else {
      console.log('✅ No unique index found on PIN field');
    }
    
    console.log('\n✅ Index check complete!');
    
  } catch (error) {
    console.error('Error removing PIN index:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

removePinIndex();

