const express = require('express');
const authuser = require('../middleware/auth.middleware')
const interviewController = require('../controller/interview') ;
const upload = require('../middleware/file.middleware') ;

const router = express.Router() ;

/**
 * @route POST /api/interview
 * @desc Generate a new interview report 
 * @access Private
 */
router.post("/" , authuser , upload.single("resume") , interviewController.generateInterviewReport) ;

/**
 * @route GET /api/interview/:interviewId
 * @desc Get the interview report by id
 * @access Private
 */
router.get("/report/:interviewId" , authuser , interviewController.getInterviewReport) ;

router.get("/" , authuser , interviewController.getAllInterviewReports) ;

router.post("/resume/pdf/:interviewId" , interviewController.generateResumePDF) ;



module.exports = router;