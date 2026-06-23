import React, { useState, useEffect } from "react";
import "../styles/interview.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate, useParams } from "react-router-dom";

// Reusable SVG Icons
const Icons = {
  Code: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
  Users: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Map: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
      <line x1="9" y1="3" x2="9" y2="18"></line>
      <line x1="15" y1="6" x2="15" y2="21"></line>
    </svg>
  ),
  ChevronDown: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  Target: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  Alert: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
};

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedIndices, setExpandedIndices] = useState({});
  const { report, loading, getreportbyid , getresumepdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  if (loading || !report) {
    return <div>Loading..</div>;
  }

  const toggleExpand = (index) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  const renderQuestions = (questions, prefix) => (
    <div className="interview__questions-list">
      {questions.map((item, index) => {
        const key = `${prefix}-${index}`;
        const isExpanded = expandedIndices[key];

        return (
          <div
            key={key}
            className={`interview__question-card ${isExpanded ? "expanded" : ""}`}
          >
            <button
              className="interview__question-button"
              onClick={() => toggleExpand(key)}
            >
              <span className="interview__question-number">Q{index + 1}</span>
              <span className="interview__question-text">{item.question}</span>
              <span className="interview__expand-icon">
                <Icons.ChevronDown />
              </span>
            </button>

            {isExpanded && (
              <div className="interview__answer">
                <div className="interview__answer-text">{item.answer}</div>
                <div className="interview__intention">
                  <strong>Intention:</strong> {item.intention}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="interview">
      {/* LEFT SIDEBAR */}
      <div className="interview__left interview__card">
        <div className="top">
          <div className="interview__section-title">Evaluation</div>

          <button
            className={`interview__nav-item ${activeSection === "technical" ? "active" : ""}`}
            onClick={() => setActiveSection("technical")}
          >
            <Icons.Code />
            Technical
          </button>

          <button
            className={`interview__nav-item ${activeSection === "behavioural" ? "active" : ""}`}
            onClick={() => setActiveSection("behavioural")}
          >
            <Icons.Users />
            Behavioral
          </button>

          <div
            className="interview__section-title"
            style={{ marginTop: "16px" }}
          >
            Action Plan
          </div>

          <button
            className={`interview__nav-item ${activeSection === "roadmap" ? "active" : ""}`}
            onClick={() => setActiveSection("roadmap")}
          >
            <Icons.Map />
            Road Map
          </button>
        </div>
        <div
          onClick={() => navigate(`/interview/${interviewId}/mock`)}
          className="bottom interview__nav-item genint"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate(`/interview/${interviewId}/mock`);
            }
          }}
        >
          Start Mock Interview
        </div>
        <div 
        onClick={()=>getresumepdf(interviewId)}
        className="bottom interview__nav-item genint">
          Download AI generated Resume
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="interview__center">
        <div className="interview__card interview__content">
          {activeSection === "technical" && (
            <>
              <div className="interview__content-header">
                <h2 className="interview__content-title">
                  Technical Assessment
                </h2>
                <span className="interview__question-count">
                  {report.technicalQuestions.length} Questions
                </span>
              </div>
              {renderQuestions(report.technicalQuestions, "tech")}
            </>
          )}

          {activeSection === "behavioural" && (
            <>
              <div className="interview__content-header">
                <h2 className="interview__content-title">
                  Behavioral Assessment
                </h2>
                <span className="interview__question-count">
                  {report.behaviouralQuestions.length} Questions
                </span>
              </div>
              {renderQuestions(report.behaviouralQuestions, "beh")}
            </>
          )}

          {activeSection === "roadmap" && (
            <>
              <div className="interview__content-header">
                <h2 className="interview__content-title">
                  Preparation Roadmap
                </h2>
                <span className="interview__question-count">
                  {report.preparationPlan.length} Days
                </span>
              </div>
              <div className="interview__roadmap-list">
                {report.preparationPlan.map((item, index) => (
                  <div key={index} className="interview__roadmap-item">
                    <div className="interview__roadmap-day">
                      <span>Day</span>
                      {item.day}
                    </div>
                    <div className="interview__roadmap-content">
                      <div className="interview__roadmap-focus">
                        {item.focus}
                      </div>
                      {item.tasks && (
                        <ul className="interview__roadmap-tasks">
                          {item.tasks.map((task, tIndex) => (
                            <li key={tIndex}>{task}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="interview__right">
        {/* Match Score */}
        <div className="interview__card interview__match-score">
          <h3 className="interview__card-title">
            <Icons.Target /> Match Score
          </h3>
          <div
            className="interview__score-circle"
            style={{
              background: `conic-gradient(var(--accent-success) ${report.matchScore}%, rgba(16, 185, 129, 0.1) 0)`,
            }}
          >
            <div className="interview__score-number">
              {report.matchScore}
              <span>%</span>
            </div>
          </div>
          <p className="interview__score-text">Strong candidate alignment</p>
        </div>

        {/* Skills Gap */}
        <div className="interview__card interview__skills-gap">
          <h3 className="interview__card-title">
            <Icons.Alert /> Identified Gaps
          </h3>
          <div className="interview__skills-list">
            {report.skillsGap.map((item, index) => (
              <div key={index} className="interview__skill-item">
                <div className="interview__skill-header">
                  <div className="interview__skill-name">{item.skill}</div>
                </div>
                <div
                  className="interview__skill-badge"
                  style={{
                    color: getSeverityColor(item.severity),
                    border: `1px solid ${getSeverityColor(item.severity)}`,
                  }}
                >
                  {item.severity} Priority
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
