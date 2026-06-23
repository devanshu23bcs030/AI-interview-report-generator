import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const startMockInterview = async ({ interviewReportId, mode = "mixed" }) => {
    const response = await api.post("/api/mock-interview/start", {
        interviewReportId,
        mode,
    });
    return response.data;
};

export const getMockInterviewSession = async (sessionId) => {
    const response = await api.get(`/api/mock-interview/session/${sessionId}`);
    return response.data;
};

export const submitMockInterviewAnswer = async (sessionId, userAnswer) => {
    const response = await api.post(`/api/mock-interview/session/${sessionId}/answer`, {
        userAnswer,
    });
    return response.data;
};

export const getMockInterviewSummary = async (sessionId) => {
    const response = await api.get(`/api/mock-interview/session/${sessionId}/summary`);
    return response.data;
};

export const getMockInterviewSessionsByReport = async (interviewId) => {
    const response = await api.get(`/api/mock-interview/report/${interviewId}/sessions`);
    return response.data;
};
