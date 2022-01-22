import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = () => {
  mongoose
    .connect(config.databaseUrl)
    .then((result) => {
      console.log("MongoDB Connected...");
    })
    .catch((err) => {
      console.log("MongoDB Connection Error!!!");
      process.exit(0);
    });
};

export default connectDB;
