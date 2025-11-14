require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ✅ CORS fix: only allow your Netlify frontend
app.use(cors({
    origin: 'https://habit-tracker00.netlify.app', // <-- এখানে তোমার FE URL
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', require('./routes/public')); 
app.use('/api/habits', require('./routes/habits')); 

app.get('/', (req, res) => res.send('Habit Tracker API is running'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
