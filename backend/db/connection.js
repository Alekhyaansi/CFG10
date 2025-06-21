// db/connection.js

const mongoose = require("mongoose");

const dbconnection = async () => {
  try {
    const dburl = process.env.DB_URI;
    if (!dburl) throw new Error("DB_URI not defined in .env");

    await mongoose.connect(dburl);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // exit the app if connection fails
  }
};

module.exports = dbconnection;
