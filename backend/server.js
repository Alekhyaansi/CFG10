// server.js

require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/connection"); // ✅ Import DB function
const assessmentRoutes = require('./routes/assessmentRoutes');
const app = express();
const PORT = process.env.PORT 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const questionRoutes = require('./routes/questionRoutes');
const wqcRoutes = require('./routes/wqcRoutes')
const saathiRoutes = require('./routes/saathiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

app.use(express.json());
app.use(cors()); // ✅ Enable CORS
dbconnection();


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("CFG10 BACKEND API");
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/wqc',wqcRoutes)
app.use('/api/courses', courseRoutes);
app.use('/api/trainer', trainerRoutes);
// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('CFG10 BACKEND API');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is up and running at http://localhost:${PORT} 🚀`);
});
