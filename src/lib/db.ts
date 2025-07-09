import mongoose from 'mongoose'

const mongodb_url = process.env.MONGODB_URI ;

if (!mongodb_url) {
    throw new Error (" please define mongo environment variable")
}

async function connectDb() {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }
    const opts = {
        bufferCommands: false,
    }
    await mongoose.connect(mongodb_url!, opts);
    return mongoose;
}

export default connectDb;