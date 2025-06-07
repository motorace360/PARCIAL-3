import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

let clientPromise: Promise<MongoClient>;

try {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
} catch (e) {
  console.error('MongoDB connection error:', e);
  throw new Error('Failed to connect to MongoDB');
}

export default clientPromise;
