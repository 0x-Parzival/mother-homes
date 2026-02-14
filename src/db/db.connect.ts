import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv"
dotenv.config()
const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const uri = process.env.URI || process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables (URI, MONGODB_URI, or MONGO_URI)");
    }
    await mongoose.connect(uri);
    logger.info("DB CONNECTED.......");
  } catch (error: any) {
    logger.debug(error);
    logger.error("Unable to connect to DB:", error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default dbConnect;
