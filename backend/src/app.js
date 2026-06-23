const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-interview-report-generator-ktq6.vercel.app",
      "https://ai-interview-report-generator-ktq6-abmnqedwe.vercel.app"
    ],
    credentials: true,
  })
);

// Import all the routes here
const authrouter = require('./routes/auth');
const interviewrouter = require('./routes/interview');
const mockinterviewrouter = require('./routes/mockinterview');

// Use the routes here
app.use('/api/auth', authrouter);
app.use('/api/interview', interviewrouter);
app.use('/api/mock-interview', mockinterviewrouter);

module.exports = app;