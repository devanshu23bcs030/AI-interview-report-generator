const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true ,
        unique: [true, 'Username already taken']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Account already exists with this Email']
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const usermodel = mongoose.model('User', userSchema)

module.exports = usermodel