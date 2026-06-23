const express = require('express');
const authuser = require('../middleware/auth.middleware');
const mockInterviewController = require('../controller/mockinterview');

const router = express.Router();

router.post('/start', authuser, mockInterviewController.startMockInterview);
router.get('/session/:sessionId', authuser, mockInterviewController.getMockInterviewSession);
router.post('/session/:sessionId/answer', authuser, mockInterviewController.submitMockInterviewAnswer);
router.get('/session/:sessionId/summary', authuser, mockInterviewController.getMockInterviewSummary);
router.get('/report/:interviewId/sessions', authuser, mockInterviewController.getMockInterviewSessionsByReport);

module.exports = router;
