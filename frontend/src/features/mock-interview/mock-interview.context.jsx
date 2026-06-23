import { createContext, useState } from "react";

export const MockInterviewContext = createContext();

export const MockInterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [session, setSession] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);

    return (
        <MockInterviewContext.Provider
            value={{
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
            }}
        >
            {children}
        </MockInterviewContext.Provider>
    );
};
