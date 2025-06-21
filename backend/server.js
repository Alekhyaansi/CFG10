// Entry point of the backend server
require('dotenv').config();
const dbconnection = require('./db/connection');
const express = require('express');
const app = express();
const PORT = process.env.PORT 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const questionRoutes = require('./routes/questionRoutes');
const wqcRoutes = require('./routes/wqcRoutes')
const saathiRoutes = require('./routes/saathiRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questions', questionRoutes);

app.use('/api/wqc',wqcRoutes);
app.use('/api/saathi', saathiRoutes);

app.use('/api/assessment', assessmentRoutes);


// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('CFG10 BACKEND API');
});

// TODO: Add routes and middleware

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});