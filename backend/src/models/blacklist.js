const mongoose = require('mongoose');

const blacklisttokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true , "Token is required to be added in the blacklist collection"]
    }
}, { timestamps: true })

const blacklisttokenmodel = mongoose.model('BlacklistToken', blacklisttokenSchema)

module.exports = blacklisttokenmodel