require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// ✅ FIX: পাবলিক রুট লোড হচ্ছে /api রুটে
app.use('/api', require('./routes/public')); 
app.use('/api/habits', require('./routes/habits')); // Assuming this handles protected routes

app.get('/', (req,res) => res.send('Habit Tracker API is running'));

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));