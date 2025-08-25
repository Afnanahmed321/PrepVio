import mongoose from 'mongoose';

const connectDB = async () => {
  try{
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(conn.connection.host)
  } catch(error) {
    console.log("Error while connecting to DB:", error)
    process.exit(1)
  }
};

export default connectDB;
