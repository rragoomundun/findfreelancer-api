import mongoose from 'mongoose';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`[OK] Connected to database ${conn.connection.db.databaseName} on port ${conn.connection.port}`.green);
};

export default connectDB;
