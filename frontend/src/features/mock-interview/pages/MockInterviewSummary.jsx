import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMockInterview } from "../hooks/useMockInterview";
import "../styles/mock-interview.scss";

const MockInterviewSummary = () => {
    const { interviewId, sessionId } = useParams();
    const navigate = useNavigate();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { loading, summary, error, loadSummary } = useMockInterview();

    useEffect(() => {
        if (sessionId) {
            loadSummary(sessionId);
        }
    }, [sessionId]);

    if (loading || !summary) {
        return (
            <div className="mock-interview mock-interview--centered">
                <div className="mock-interview__loading">
                    <div className="mock-interview__spinner" />
                    <p>Loading performance summary...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mock-interview mock-interview--centered">
                <div className="mock-interview__card mock-interview__error">
                    <h2>Unable to load summary</h2>
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
                <h1>Mock Interview Complete</h1>
            </header>

            <div className="mock-interview__summary-grid">
                <div className="mock-interview__card mock-interview__summary-hero">
                    <p className="mock-interview__summary-label">Average Score</p>
                    <div className="mock-interview__summary-score">
                        {summary.averageScore}
                        <span>/10</span>
                    </div>
                    <p>{summary.overallFeedback}</p>
                </div>

                <div className="mock-interview__card">
                    <h3>Questions Attempted</h3>
                    <p className="mock-interview__summary-big">
                        {summary.attempted}/{summary.totalQuestions}
                    </p>
                </div>

                <div className="mock-interview__card">
                    <h3>Strong Topics</h3>
                    {summary.strongTopics?.length ? (
                        <ul className="mock-interview__topic-list mock-interview__topic-list--strong">
                            {summary.strongTopics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mock-interview__empty">No strong topics yet. Keep practicing.</p>
                    )}
                </div>

                <div className="mock-interview__card">
                    <h3>Weak Topics</h3>
                    {summary.weakTopics?.length ? (
                        <ul className="mock-interview__topic-list mock-interview__topic-list--weak">
                            {summary.weakTopics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mock-interview__empty">No major weak areas detected.</p>
                    )}
                </div>
            </div>

            <div className="mock-interview__card mock-interview__breakdown">
                <h2>Question Breakdown</h2>
                <div className="mock-interview__breakdown-list">
                    {(summary.answers || []).map((item, index) => {
                        const isExpanded = expandedIndex === index;

                        return (
                            <div key={index} className="mock-interview__breakdown-item">
                                <button
                                    type="button"
                                    className="mock-interview__breakdown-toggle"
                                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                >
                                    <span>Q{index + 1} · {item.questionType}</span>
                                    <span className="mock-interview__breakdown-score">{item.score}/10</span>
                                </button>
                                {isExpanded ? (
                                    <div className="mock-interview__breakdown-content">
                                        <p><strong>Question:</strong> {item.question}</p>
                                        <p><strong>Your answer:</strong> {item.userAnswer}</p>
                                        <p><strong>Feedback:</strong> {item.feedback}</p>
                                        <p><strong>Improved answer:</strong> {item.improvedAnswer}</p>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mock-interview__actions">
                <button
                    type="button"
                    className="mock-interview__btn mock-interview__btn--secondary"
                    onClick={() => navigate(`/interview/${interviewId}/mock`)}
                >
                    Practice Again
                </button>
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
};

export default MockInterviewSummary;
