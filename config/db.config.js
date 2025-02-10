const mongoose = require("mongoose");
const { DB_NAME } = require( "../constants.js");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      // `${process.env.MONGODB_URI}/${DB_NAME}`
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\nMongoDB connected! DB HOST: `//,connectionInstance.connection
    );
  } catch (error) {
    console.error("MongoDB connection FAILED:", error);
    process.exit(1);
  }
}
module.exports = {connectDB}
