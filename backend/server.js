// server.js

require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/connection"); // ✅ Import DB function
const authRoutes = require("./routes/authRoutes"); // ✅ Your auth routes

const app = express();
const PORT = process.env.PORT;
const adminRoutes = require("./routes/adminRoutes");
const questionRoutes = require("./routes/questionRoutes");

// ✅ Connect to MongoDB
dbconnection();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin (Vite)
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/wqc", wqcRoutes);

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("CFG10 BACKEND API");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is up and running at http://localhost:${PORT} 🚀`);
});
