import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside your platform settings'
  );
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Cache the MongoDB connection
let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    cachedPromise = MongoClient.connect(MONGODB_URI!, options);
  }

  try {
    cachedClient = await cachedPromise;
    return cachedClient;
  } catch (error) {
    cachedPromise = null;
    throw error;
  }
}

export default connectToDatabase;
