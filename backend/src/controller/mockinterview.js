const InterviewReportModel = require('../models/interviewreport.model');
const MockInterviewSessionModel = require('../models/mockinterviewsession.model');
const {
    buildQuestionList,
    computeProgress,
    computeSummary,
    evaluateAnswer,
} = require('../services/mockinterview.service');

const MAX_ANSWER_LENGTH = 5000;

async function startMockInterview(req, res) {
    const { interviewReportId, mode = 'mixed' } = req.body;

    if (!interviewReportId) {
        return res.status(400).json({ message: 'interviewReportId is required' });
    }

    const report = await InterviewReportModel.findById(interviewReportId);

    if (!report) {
        return res.status(404).json({ message: 'Interview report not found' });
    }

    if (report.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const questions = buildQuestionList(report, mode);

    if (questions.length === 0) {
        return res.status(400).json({ message: 'This report has no questions to practice' });
    }

    const session = await MockInterviewSessionModel.create({
        user: req.user.id,
        interviewReport: report._id,
        mode,
        questions,
        currentQuestionIndex: 0,
        answers: [],
    });

    res.status(201).json({
        message: 'Mock interview session started',
        session: formatSessionResponse(session),
    });
}

async function getMockInterviewSession(req, res) {
    const session = await MockInterviewSessionModel.findOne({
        _id: req.params.sessionId,
        user: req.user.id,
    });

    if (!session) {
        return res.status(404).json({ message: 'Mock interview session not found' });
    }

    res.status(200).json({
        message: 'Mock interview session fetched successfully',
        session: formatSessionResponse(session),
    });
}

async function submitMockInterviewAnswer(req, res) {
    const { userAnswer } = req.body;
    const { sessionId } = req.params;

    if (!userAnswer || !userAnswer.trim()) {
        return res.status(400).json({ message: 'Answer is required' });
    }

    if (userAnswer.length > MAX_ANSWER_LENGTH) {
        return res.status(400).json({ message: `Answer must be under ${MAX_ANSWER_LENGTH} characters` });
    }

    const session = await MockInterviewSessionModel.findOne({
        _id: sessionId,
        user: req.user.id,
    });

    if (!session) {
        return res.status(404).json({ message: 'Mock interview session not found' });
    }

    if (session.status !== 'in_progress') {
        return res.status(400).json({ message: 'This mock interview session is already completed' });
    }

    if (session.currentQuestionIndex >= session.questions.length) {
        return res.status(400).json({ message: 'All questions have already been answered' });
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    let evaluation;

    try {
        evaluation = await evaluateAnswer({
            question: currentQuestion.question,
            questionType: currentQuestion.type,
            idealAnswer: currentQuestion.answer,
            intention: currentQuestion.intention,
            userAnswer: userAnswer.trim(),
        });
    } catch (error) {
        console.error('Mock interview evaluation error:', error);
        return res.status(502).json({ message: 'Failed to evaluate answer. Please try again.' });
    }

    const answerRecord = {
        questionIndex: session.currentQuestionIndex,
        questionType: currentQuestion.type,
        question: currentQuestion.question,
        idealAnswer: currentQuestion.answer,
        intention: currentQuestion.intention,
        userAnswer: userAnswer.trim(),
        ...evaluation,
    };

    session.answers.push(answerRecord);
    session.currentQuestionIndex += 1;

    const isLastQuestion = session.currentQuestionIndex >= session.questions.length;

    if (isLastQuestion) {
        session.status = 'completed';
        session.summary = computeSummary(session.answers, session.questions.length);
    }

    await session.save();

    const progress = computeProgress(session.answers, session.questions.length);

    res.status(200).json({
        message: 'Answer evaluated successfully',
        evaluation: answerRecord,
        progress: {
            ...progress,
            isLastQuestion,
        },
        session: formatSessionResponse(session),
    });
}

async function getMockInterviewSummary(req, res) {
    const session = await MockInterviewSessionModel.findOne({
        _id: req.params.sessionId,
        user: req.user.id,
    });

    if (!session) {
        return res.status(404).json({ message: 'Mock interview session not found' });
    }

    if (session.status !== 'completed') {
        return res.status(400).json({ message: 'Session is not completed yet' });
    }

    res.status(200).json({
        message: 'Mock interview summary fetched successfully',
        summary: {
            ...session.summary,
            answers: session.answers,
            sessionId: session._id,
            interviewReportId: session.interviewReport,
            completedAt: session.updatedAt,
        },
    });
}

async function getMockInterviewSessionsByReport(req, res) {
    const report = await InterviewReportModel.findById(req.params.interviewId);

    if (!report) {
        return res.status(404).json({ message: 'Interview report not found' });
    }

    if (report.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const sessions = await MockInterviewSessionModel.find({
        user: req.user.id,
        interviewReport: report._id,
    })
        .sort({ createdAt: -1 })
        .select('-questions -answers');

    res.status(200).json({
        message: 'Mock interview sessions fetched successfully',
        sessions,
    });
}

function formatSessionResponse(session) {
    const currentQuestion = session.status === 'in_progress' && session.currentQuestionIndex < session.questions.length
        ? session.questions[session.currentQuestionIndex]
        : null;

    const progress = computeProgress(session.answers, session.questions.length);

    return {
        _id: session._id,
        interviewReport: session.interviewReport,
        status: session.status,
        mode: session.mode,
        currentQuestionIndex: session.currentQuestionIndex,
        currentQuestion,
        totalQuestions: session.questions.length,
        progress,
        summary: session.summary || null,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
    };
}

module.exports = {
    startMockInterview,
    getMockInterviewSession,
    submitMockInterviewAnswer,
    getMockInterviewSummary,
    getMockInterviewSessionsByReport,
};
