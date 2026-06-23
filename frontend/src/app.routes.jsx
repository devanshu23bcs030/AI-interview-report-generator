import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/home";
import Interview from "./features/interview/pages/interview";
import MockInterviewStart from "./features/mock-interview/pages/MockInterviewStart";
import MockInterviewSession from "./features/mock-interview/pages/MockInterviewSession";
import MockInterviewSummary from "./features/mock-interview/pages/MockInterviewSummary";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId/mock",
    element: (
      <Protected>
        <MockInterviewStart />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId/mock/:sessionId",
    element: (
      <Protected>
        <MockInterviewSession />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId/mock/:sessionId/summary",
    element: (
      <Protected>
        <MockInterviewSummary />
      </Protected>
    ),
  },
]);
