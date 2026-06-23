const express = require('express');
const authController = require('../controller/auth');
const authuser = require('../middleware/auth.middleware')

const router = express.Router();

// api/auth/register
router.post("/register" , authController.registerUser)
// api/auth/login
router.post("/login" , authController.loginUser)
// api/auth/logout
router.get("/logout" , authController.logoutUser)
// api/auth/getme
router.get("/getme" , authuser , authController.getMe)

module.exports = router;