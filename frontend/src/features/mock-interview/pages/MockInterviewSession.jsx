import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMockInterview } from "../hooks/useMockInterview";
import "../styles/mock-interview.scss";

const MockInterviewSession = () => {
    const { interviewId, sessionId } = useParams();
    const navigate = useNavigate();
    const [userAnswer, setUserAnswer] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

    const {
        loading,
        submitting,
        session,
        evaluation,
        error,
        loadSession,
        submitAnswer,
        setEvaluation,
    } = useMockInterview();

    useEffect(() => {
        const load = async () => {
            if (!sessionId) {
                return;
            }

            const result = await loadSession(sessionId);

            if (result.success && result.session.status === "completed") {
                navigate(`/interview/${interviewId}/mock/${sessionId}/summary`, {
                    replace: true,
                });
            }
        };

        load();
    }, [sessionId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userAnswer.trim() || submitting) {
            return;
        }

        const result = await submitAnswer(sessionId, userAnswer.trim());

        if (result.success) {
            setShowFeedback(true);
        }
    };

    const handleNext = () => {
        if (session?.status === "completed") {
            navigate(`/interview/${interviewId}/mock/${sessionId}/summary`);
            return;
        }

        setUserAnswer("");
        setShowFeedback(false);
        setEvaluation(null);
    };

    if (loading || !session) {
        return (
            <div className="mock-interview mock-interview--centered">
                <div className="mock-interview__loading">
                    <div className="mock-interview__spinner" />
                    <p>Loading mock interview...</p>
                </div>
            </div>
        );
    }

    if (error && !session.currentQuestion) {
        return (
            <div className="mock-interview mock-interview--centered">
                <div className="mock-interview__card mock-interview__error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button
                        type="button"
                        className="mock-interview__btn mock-interview__btn--primary"
                        onClick={() => navigate(`/interview/${interviewId}`)}
                    >
                        Back to Report
                    </button>
                </div>
            </div>
        );
    }

    const { currentQuestion, progress, totalQuestions } = session;
    const displayQuestion = showFeedback ? evaluation?.question : currentQuestion?.question;
    const displayType = showFeedback ? evaluation?.questionType : currentQuestion?.type;
    const questionNumber = showFeedback
        ? session.currentQuestionIndex
        : session.currentQuestionIndex + 1;
    const progressPercent = totalQuestions
        ? Math.round((progress.attempted / totalQuestions) * 100)
        : 0;

    return (
        <div className="mock-interview">
            <header className="mock-interview__header">
                <button
                    type="button"
                    className="mock-interview__back"
                    onClick={() => navigate(`/interview/${interviewId}`)}
                >
                    ← Back to Report
                </button>
                <div className="mock-interview__header-stats">
                    <span>Question {Math.min(questionNumber, totalQuestions)} of {totalQuestions}</span>
                    <span>Avg Score: {progress.averageScore}/10</span>
                </div>
            </header>

            <div className="mock-interview__progress">
                <div
                    className="mock-interview__progress-bar"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="mock-interview__layout">
                <div className="mock-interview__card mock-interview__question-panel">
                    <div className="mock-interview__badge">
                        {displayType === "technical" ? "Technical" : "Behavioral"}
                    </div>
                    <h1 className="mock-interview__question-title">
                        {displayQuestion}
                    </h1>

                    {!showFeedback ? (
                        <form onSubmit={handleSubmit} className="mock-interview__form">
                            <label htmlFor="userAnswer">Your Answer</label>
                            <textarea
                                id="userAnswer"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type your interview answer here..."
                                rows={8}
                                disabled={submitting}
                            />
                            {error ? <p className="mock-interview__form-error">{error}</p> : null}
                            <button
                                type="submit"
                                className="mock-interview__btn mock-interview__btn--primary"
                                disabled={submitting || !userAnswer.trim()}
                            >
                                {submitting ? "Evaluating..." : "Submit Answer"}
                            </button>
                        </form>
                    ) : (
                        <div className="mock-interview__feedback">
                            <div className="mock-interview__score-row">
                                <div className="mock-interview__score">
                                    {evaluation?.score}
                                    <span>/10</span>
                                </div>
                                <div className="mock-interview__levels">
                                    <p><strong>Confidence:</strong> {evaluation?.confidenceLevel}</p>
                                    <p><strong>Clarity:</strong> {evaluation?.clarityLevel}</p>
                                </div>
                            </div>

                            <p className="mock-interview__feedback-text">{evaluation?.feedback}</p>

                            <div className="mock-interview__feedback-grid">
                                <div>
                                    <h3>Strengths</h3>
                                    <ul>
                                        {(evaluation?.strengths || []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3>Weak Areas</h3>
                                    <ul>
                                        {(evaluation?.weaknesses || []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mock-interview__improved">
                                <h3>Suggested Improved Answer</h3>
                                <p>{evaluation?.improvedAnswer}</p>
                            </div>

                            <button
                                type="button"
                                className="mock-interview__btn mock-interview__btn--primary"
                                onClick={handleNext}
                            >
                                {session.status === "completed"
                                    ? "View Summary"
                                    : "Next Question →"}
                            </button>
                        </div>
                    )}
                </div>

                <aside className="mock-interview__card mock-interview__sidebar">
                    <h3>Session Progress</h3>
                    <div className="mock-interview__stat">
                        <span>Attempted</span>
                        <strong>{progress.attempted}/{totalQuestions}</strong>
                    </div>
                    <div className="mock-interview__stat">
                        <span>Average Score</span>
                        <strong>{progress.averageScore}/10</strong>
                    </div>
                    <div className="mock-interview__stat">
                        <span>Mode</span>
                        <strong>{session.mode}</strong>
                    </div>
                    <p className="mock-interview__tip">
                        Answer naturally as you would in a real interview. Detailed examples improve your score.
                    </p>
                </aside>
            </div>
        </div>
    );
};

export default MockInterviewSession;
