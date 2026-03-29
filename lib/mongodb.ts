import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Switched to true for more stability in DEV
        };

        console.log('Connecting to MongoDB...');
        cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
            console.log('MongoDB Connected Successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error('MongoDB Connection Error:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
