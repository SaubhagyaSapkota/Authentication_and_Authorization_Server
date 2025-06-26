import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./src/DB/mongoDB.js";

dotenv.config();
const app = express();
const port = 5001;

app.use(express.json());
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`The server is running on ${port}`);
  });
});

app.use("/api/auth", authRoutes);
