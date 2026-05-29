import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DATA_DIR = path.resolve('./data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize local JSON database if not exists
function initLocalDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: [],
      chats: [],
      workouts: [],
      trackers: []
    }, null, 2));
  }
}

// Local JSON DB Helper functions
class LocalCollection {
  constructor(name) {
    this.name = name;
  }

  read() {
    initLocalDB();
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return { users: [], chats: [], workouts: [], trackers: [] };
    }
  }

  write(data) {
    initLocalDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    const data = this.read();
    const items = data[this.name] || [];
    return items.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const data = this.read();
    const items = data[this.name] || [];
    return items.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  }

  async create(newItem) {
    const data = this.read();
    const items = data[this.name] || [];
    const id = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    const createdItem = { _id: id, createdAt: new Date().toISOString(), ...newItem };
    items.push(createdItem);
    data[this.name] = items;
    this.write(data);
    return createdItem;
  }

  async updateOne(query, update) {
    const data = this.read();
    const items = data[this.name] || [];
    const index = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index === -1) return { modifiedCount: 0 };
    
    // Support standard $set or simple properties merge
    const current = items[index];
    const updates = update.$set ? update.$set : update;
    
    // Perform nested array operations if needed (mocking basic mongoose updates)
    if (update.$push) {
      for (let arrKey in update.$push) {
        current[arrKey] = current[arrKey] || [];
        current[arrKey].push(update.$push[arrKey]);
      }
    }
    
    items[index] = { ...current, ...updates };
    data[this.name] = items;
    this.write(data);
    return { modifiedCount: 1, item: items[index] };
  }

  async deleteMany(query) {
    const data = this.read();
    const items = data[this.name] || [];
    const beforeCount = items.length;
    const remaining = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    data[this.name] = remaining;
    this.write(data);
    return { deletedCount: beforeCount - remaining.length };
  }
}

// Database Connection Manager
const dbConnection = {
  isMongoDB: false,
  collections: {},

  async connect() {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      try {
        console.log('🔄 Connecting to MongoDB database...');
        await mongoose.connect(mongoUri);
        this.isMongoDB = true;
        console.log('⚡ MongoDB Connected successfully!');
      } catch (err) {
        console.error('❌ MongoDB Connection failed. Falling back to local JSON database.', err.message);
        this.isMongoDB = false;
        initLocalDB();
        console.log('⚡ Local JSON Database Initialized as Fallback!');
      }
    } else {
      this.isMongoDB = false;
      initLocalDB();
      console.log('⚡ MongoDB URI not found. Using local JSON database storage.');
    }

    // Set up standard collection interfaces
    this.collections.users = new LocalCollection('users');
    this.collections.chats = new LocalCollection('chats');
    this.collections.workouts = new LocalCollection('workouts');
    this.collections.trackers = new LocalCollection('trackers');
  },

  getCollection(name) {
    return this.collections[name];
  }
};

export default dbConnection;
