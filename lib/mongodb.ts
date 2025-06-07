import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  } else {
    throw new Error(
      'Please define the MONGODB_URI environment variable in your deployment platform'
    );
  }
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
} catch (e) {
  throw new Error('Failed to connect to MongoDB');
}

// Export a module-scoped MongoClient promise
export default clientPromise;
