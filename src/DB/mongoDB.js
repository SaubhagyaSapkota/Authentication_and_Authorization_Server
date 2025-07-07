import mongoose from "mongoose";
import winstonLogger from "../logger/winston.logger.js";

// for connecting to the mongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    winstonLogger.info("MongoDB Connected Successfully");
  } catch (error) {
    winstonLogger.info("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
