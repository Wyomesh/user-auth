import mongoose from "mongoose";
import { DBName } from "../constants.js";

const connectDB = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DBName}`
    );
    console.log(response.connection.host);
  } catch (error) {
    console.error(`Database connection failed : ${error}`);
    process.exit(1);
  }
};

export default connectDB;
