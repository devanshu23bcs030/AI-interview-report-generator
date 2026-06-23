const usermodel = require('../models/user')
const blacklisttokenmodel = require('../models/blacklist')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerUser(req , res){
    console.log("Register User Called " , req.body)
    const {username , email , password} = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password' });
    }
    const isuserexist = await usermodel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })
    if (isuserexist) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedpass = await bcrypt.hash(password, 10)
    const user = await usermodel.create({
        username,
        email,
        password: hashedpass
    })
    const token = jwt.sign({ id: user._id , username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.cookie("token" , token)
    res.status(201).json(
        {
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        }
    )
}
async function loginUser(req , res){
    console.log("Login User Called " , req.body)
    const {email , password} = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }
    const user = await usermodel.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    const ispasswordmatch = await bcrypt.compare(password, user.password)
    if (!ispasswordmatch) {
        return res.status(400).json({ error: 'Password is wrong'});
    }
    const token = jwt.sign({ id: user._id , username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.cookie("token" , token)
    res.status(200).json(
        {
            message: 'Login successful',
            user: {
                id : user._id ,
                username: user.username,
                email: user.email
            }
        }
    )

}
async function logoutUser(req , res){
    console.log("Logout route hitted " , req.body)
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }
    await blacklisttokenmodel.create({ token })
    res.clearCookie("token")
    res.status(200).json({ message: 'Logout successful' });
}

async function getMe(req , res){
    const user = await usermodel.findById(req.user.id)
    return res.status(200).json({
        message : "User details fetched successfully ." ,
        user : {id: user._id,
        username: user.username,
        email: user.email}
    })
}

module.exports = {registerUser , loginUser , logoutUser , getMe}