import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv"
dotenv.config()
const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    if (!process.env.URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    await mongoose.connect(`${process.env.URI}`);
    logger.info("DB CONNECTED.......");
  } catch (error: any) {
    logger.debug(error);
    logger.error("Unable to connect to DB:", error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default dbConnect;
