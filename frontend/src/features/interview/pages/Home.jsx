import "../styles/home.scss";
import { useInterview } from "../hooks/useinterview";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const { loading, generateReport , reports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const resumeinputref = useRef(null);


  const handleGenerateReport = async () => {
    const resumeFile = resumeinputref.current?.files?.[0];

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    navigate(`/interview/${data.data._id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Generating your interview report...</p>
      </div>
    );
  }

  return (
    <>
    <main className="home">
      <div className="left">
        <textarea
          name="jobDescription"
          value={jobDescription}
          id="jobDescription"
          placeholder="Enter the description of your job here"
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="right">
        <div className="input-group">
          <label htmlFor="resume">Upload resume</label>

          <input
            type="file"
            id="resume"
            accept=".pdf"
            name="resume"
            ref={resumeinputref}
          />
        </div>

        <div className="selfDescription">
          <label htmlFor="selfDescription">Self Description</label>

          <textarea
            id="selfDescription"
            name="selfDescription"
            placeholder="Tell us about yourself"
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
          />
        </div>

        <button className="genint" onClick={handleGenerateReport}>
          Generate Interview Report
        </button>
      </div>
    </main>
    <div className="allrepo">
  <h2>All generated reports</h2>
  <div className="repo-grid">
    {reports.map((report) => (
      <div className="repo-card" key={report._id}>
        <h1>{report.title || "Untitled position"}</h1>
        <p className="date">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
        <span className="score-badge">
          <i className="ti ti-chart-bar" aria-hidden="true"></i>
          Match score: {report.materialScore || "N/A"}
        </span>
        <a className="view-link" target="_blank" rel="noopener noreferrer" href={`/interview/${report._id}`}>
          View report <i className="ti ti-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    ))}
  </div>
</div>
    </>
  );
};

export default Home;