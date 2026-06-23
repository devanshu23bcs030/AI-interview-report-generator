const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cookieParser());

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true)
        const allowed =
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
        callback(null, allowed)
    },
    credentials: true
}))
// Import all the routes here
const authrouter = require('./routes/auth')
const interviewrouter = require('./routes/interview')
const mockinterviewrouter = require('./routes/mockinterview')

// Use the routes here
app.use('/api/auth', authrouter)
app.use('/api/interview', interviewrouter)
app.use('/api/mock-interview', mockinterviewrouter)

module.exports = app