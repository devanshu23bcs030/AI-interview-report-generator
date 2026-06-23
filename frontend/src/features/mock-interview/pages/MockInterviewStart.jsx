import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMockInterview } from "../hooks/useMockInterview";
import "../styles/mock-interview.scss";

const MockInterviewStart = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { loading, error, startSession } = useMockInterview();
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) {
            return;
        }

        startedRef.current = true;

        const initSession = async () => {
            const result = await startSession(interviewId);

            if (result.success) {
                navigate(`/interview/${interviewId}/mock/${result.session._id}`, {
                    replace: true,
                });
            }
        };

        initSession();
    }, [interviewId]);

    if (error) {
        return (
            <div className="mock-interview mock-interview--centered">
                <div className="mock-interview__card mock-interview__error">
                    <h2>Unable to start mock interview</h2>
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
        <div className="mock-interview mock-interview--centered">
            <div className="mock-interview__loading">
                <div className="mock-interview__spinner" />
                <p>{loading ? "Starting your mock interview..." : "Preparing session..."}</p>
            </div>
        </div>
    );
};

export default MockInterviewStart;
