import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./src/DB/mongoDB.js";
import winstonLogger from "./src/logger/winston.logger.js";
import morganMiddleware from "./src/logger/morgan.logger.js";

dotenv.config();

const app = express();
const port = 5001;

app.use(morganMiddleware);
app.use(express.json());

connectDB().then(() => {
  app.listen(port, () => {
    winstonLogger.info(`The server is running on ${port}`);
  });
});

app.use("/api/auth", authRoutes);
