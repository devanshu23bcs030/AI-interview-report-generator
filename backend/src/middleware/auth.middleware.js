const jwt = require('jsonwebtoken');
// import the blacktokenmodel
const blacklisttokenmodel = require('../models/blacklist')

async function authuser(req , res , next){
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Token not present ."
        });
    }
    const istokenblacklisted = await blacklisttokenmodel.findOne({ token: token })
    if (istokenblacklisted) {
        return res.status(401).json({
            message: "Token is Blacklisted !! ."
        });
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log("Error in the authuser middleware " , error)
        return res.status(401).json({
            message: "Invalid token ."
        }); 
    }
}

module.exports = authuser