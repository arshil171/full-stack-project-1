import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const Dbconnect = async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log("Database Successfully connected");
};   
