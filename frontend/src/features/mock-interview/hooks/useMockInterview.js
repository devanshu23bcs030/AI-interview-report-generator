import { useContext } from "react";
import { MockInterviewContext } from "../mock-interview.context";
import {
    startMockInterview,
    getMockInterviewSession,
    submitMockInterviewAnswer,
    getMockInterviewSummary,
} from "../services/mock-interview.api";

export const useMockInterview = () => {
    const context = useContext(MockInterviewContext);

    if (!context) {
        throw new Error("useMockInterview must be used within a MockInterviewProvider");
    }

    const {
        loading,
        setLoading,
        submitting,
        setSubmitting,
        session,
        setSession,
        evaluation,
        setEvaluation,
        summary,
        setSummary,
        error,
        setError,
    } = context;

    const startSession = async (interviewReportId, mode = "mixed") => {
        setLoading(true);
        setError(null);
        setEvaluation(null);

        try {
            const data = await startMockInterview({ interviewReportId, mode });
            setSession(data.session);
            return { success: true, session: data.session };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to start mock interview";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const loadSession = async (sessionId) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getMockInterviewSession(sessionId);
            setSession(data.session);
            return { success: true, session: data.session };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to load mock interview session";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (sessionId, userAnswer) => {
        setSubmitting(true);
        setError(null);

        try {
            const data = await submitMockInterviewAnswer(sessionId, userAnswer);
            setEvaluation(data.evaluation);
            setSession(data.session);
            return {
                success: true,
                evaluation: data.evaluation,
                progress: data.progress,
                session: data.session,
            };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to evaluate answer";
            setError(message);
            return { success: false, error: message };
        } finally {
            setSubmitting(false);
        }
    };

    const loadSummary = async (sessionId) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getMockInterviewSummary(sessionId);
            setSummary(data.summary);
            return { success: true, summary: data.summary };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to load summary";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const resetSession = () => {
        setSession(null);
        setEvaluation(null);
        setSummary(null);
        setError(null);
    };

    return {
        loading,
        submitting,
        session,
        evaluation,
        summary,
        error,
        startSession,
        loadSession,
        submitAnswer,
        loadSummary,
        resetSession,
        setEvaluation,
    };
};
