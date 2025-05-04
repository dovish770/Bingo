import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const URI: string | undefined = process.env.MONGO_URI;
    console.log(process.env.MONGO_URI);

    if (!URI) {
      throw new Error("No mongo URI");
    }
    const conn = await mongoose.connect(URI);
    console.log(`Mongo Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export default connectDB;
