const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const MAX_QUESTIONS_PER_SESSION = 5;

const evaluationGeminiSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: 'Score from 0 to 10',
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        improvedAnswer: {
            type: Type.STRING,
        },
        confidenceLevel: {
            type: Type.STRING,
            enum: ['low', 'medium', 'high'],
        },
        clarityLevel: {
            type: Type.STRING,
            enum: ['low', 'medium', 'high'],
        },
        feedback: {
            type: Type.STRING,
        },
        topic: {
            type: Type.STRING,
            description: 'Primary skill or topic tested by this question',
        },
    },
    required: [
        'score',
        'strengths',
        'weaknesses',
        'improvedAnswer',
        'confidenceLevel',
        'clarityLevel',
        'feedback',
        'topic',
    ],
};

function buildQuestionList(report, mode = 'mixed') {
    const technical = (report.technicalQuestions || []).map((q, index) => ({
        index,
        type: 'technical',
        question: q.question,
        answer: q.answer,
        intention: q.intention,
    }));

    const behavioural = (report.behaviouralQuestions || []).map((q, index) => ({
        index,
        type: 'behavioural',
        question: q.question,
        answer: q.answer,
        intention: q.intention,
    }));

    let questions = [];

    if (mode === 'technical') {
        questions = technical;
    } else if (mode === 'behavioural') {
        questions = behavioural;
    } else {
        questions = [...technical, ...behavioural];
    }

    return questions.slice(0, MAX_QUESTIONS_PER_SESSION).map((q, index) => ({
        ...q,
        index,
    }));
}

function computeProgress(answers, totalQuestions) {
    const attempted = answers.length;
    const averageScore = attempted === 0
        ? 0
        : Number((answers.reduce((sum, item) => sum + item.score, 0) / attempted).toFixed(1));

    return {
        attempted,
        totalQuestions,
        averageScore,
    };
}

function computeSummary(answers, totalQuestions) {
    const attempted = answers.length;
    const averageScore = attempted === 0
        ? 0
        : Number((answers.reduce((sum, item) => sum + item.score, 0) / attempted).toFixed(1));

    const strongTopics = [...new Set(
        answers
            .filter((item) => item.score >= 7 && item.topic)
            .map((item) => item.topic),
    )];

    const weakTopics = [...new Set(
        answers
            .filter((item) => item.score < 6 && item.topic)
            .map((item) => item.topic),
    )];

    let overallFeedback = 'Complete at least one question to receive feedback.';

    if (attempted > 0) {
        if (averageScore >= 8) {
            overallFeedback = 'Excellent performance. You communicated clearly and covered the key points well. Keep refining details for edge cases.';
        } else if (averageScore >= 6) {
            overallFeedback = 'Solid foundation. Focus on structuring answers with clearer examples and tighter conclusions.';
        } else {
            overallFeedback = 'Needs improvement. Review weak topics, practice STAR format for behavioral questions, and rehearse concise technical explanations.';
        }
    }

    return {
        totalQuestions,
        attempted,
        averageScore,
        strongTopics,
        weakTopics,
        overallFeedback,
    };
}

async function evaluateAnswer({
    question,
    questionType,
    idealAnswer,
    intention,
    userAnswer,
}) {
    const prompt = `You are a senior interviewer evaluating a mock interview answer.

Question type: ${questionType}
Question: ${question}
Ideal/reference answer: ${idealAnswer || 'Not provided'}
Interviewer intention: ${intention || 'Not provided'}

Candidate answer:
"""
${userAnswer}
"""

Evaluate strictly but constructively:
1. Score from 0 to 10 based on relevance, depth, structure, and examples
2. List 2-3 strengths
3. List 2-3 weak areas
4. Provide an improved sample answer based on the candidate's response
5. Assess confidence and clarity from writing quality
6. Identify the primary topic/skill tested

Be honest. Vague or very short answers should score below 5.
Return ONLY valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: evaluationGeminiSchema,
        },
    });

    const evaluation = JSON.parse(response.text);

    return {
        score: Math.min(10, Math.max(0, evaluation.score)),
        strengths: evaluation.strengths || [],
        weaknesses: evaluation.weaknesses || [],
        improvedAnswer: evaluation.improvedAnswer || '',
        confidenceLevel: evaluation.confidenceLevel || 'medium',
        clarityLevel: evaluation.clarityLevel || 'medium',
        feedback: evaluation.feedback || '',
        topic: evaluation.topic || questionType,
    };
}

module.exports = {
    MAX_QUESTIONS_PER_SESSION,
    buildQuestionList,
    computeProgress,
    computeSummary,
    evaluateAnswer,
};
