const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect Mongo DB successfully");
  } catch (error) {
    console.log("Fail when connecting MongoDB");
  }
};

module.exports = connectDB;
