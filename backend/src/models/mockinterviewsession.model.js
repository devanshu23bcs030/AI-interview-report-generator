const mongoose = require('mongoose');

const answerEvaluationSchema = new mongoose.Schema({
    questionIndex: {
        type: Number,
        required: true,
    },
    questionType: {
        type: String,
        enum: ['technical', 'behavioural'],
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    idealAnswer: {
        type: String,
    },
    intention: {
        type: String,
    },
    userAnswer: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
    },
    strengths: [{
        type: String,
    }],
    weaknesses: [{
        type: String,
    }],
    improvedAnswer: {
        type: String,
    },
    confidenceLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
    },
    clarityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
    },
    feedback: {
        type: String,
    },
    topic: {
        type: String,
    },
}, {
    _id: false,
});

const sessionQuestionSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['technical', 'behavioural'],
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
    },
    intention: {
        type: String,
    },
}, {
    _id: false,
});

const sessionSummarySchema = new mongoose.Schema({
    totalQuestions: Number,
    attempted: Number,
    averageScore: Number,
    strongTopics: [String],
    weakTopics: [String],
    overallFeedback: String,
}, {
    _id: false,
});

const mockInterviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
    },
    interviewReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewReport',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'abandoned'],
        default: 'in_progress',
    },
    mode: {
        type: String,
        enum: ['technical', 'behavioural', 'mixed'],
        default: 'mixed',
    },
    questions: [sessionQuestionSchema],
    currentQuestionIndex: {
        type: Number,
        default: 0,
    },
    answers: [answerEvaluationSchema],
    summary: sessionSummarySchema,
}, {
    timestamps: true,
});

mockInterviewSessionSchema.index({ user: 1, interviewReport: 1, createdAt: -1 });

const MockInterviewSessionModel = mongoose.model('MockInterviewSession', mockInterviewSessionSchema);

module.exports = MockInterviewSessionModel;
