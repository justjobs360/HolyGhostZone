import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getClientPromise(): Promise<MongoClient> {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please add your Mongo URI to .env.local');
    }

    const uri = process.env.MONGODB_URI;

    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        let globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        return globalWithMongo._mongoClientPromise!;
    } else {
        // In production mode, it's best to not use a global variable.
        if (!clientPromise) {
            client = new MongoClient(uri);
            clientPromise = client.connect();
        }
        return clientPromise;
    }
}

// Export the function itself, not the result of calling it
// This prevents build-time errors when MONGODB_URI is not available
export default getClientPromise;
