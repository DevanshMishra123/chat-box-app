import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongo-connection-string';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default connectToDatabase;
