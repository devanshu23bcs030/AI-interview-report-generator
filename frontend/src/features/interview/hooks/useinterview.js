import {
  generateInterviewReport,
  getallInterviewReports,
  getInterviewReportbyid,
  generateResumePDF
} from "../services/interview.api";

import { useContext , useEffect } from "react";
import { useParams } from "react-router";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setloading,
    report,
    setreport,
    reports,
    setreports,
  } = context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setloading(true);

    let response = null;

    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      // ✅ FIXED
      setreport(response.data);

    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setloading(false);
    }

    return response;
  };

  const getreportbyid = async (interviewId) => {
    setloading(true);

    let response = null;

    try {
      response = await getInterviewReportbyid(interviewId);

      setreport(response.interviewReport);

    } catch (error) {
      console.error("Error fetching interview report:", error);
    } finally {
      setloading(false);
    }

    return response;
  };

  const getallreports = async () => {
    setloading(true);

    let response = null;

    try {
      response = await getallInterviewReports();

      setreports(response.interviewReports);

    } catch (error) {
      console.error("Error fetching interview reports:", error);
    } finally {
      setloading(false);
    }

    return response;
  };

  const getresumepdf = async (interviewId) => {
    setloading(true);

    let response = null;
    try {
      response = await generateResumePDF(interviewId);
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${interviewId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
    catch (error) {
      console.error("Error generating resume PDF:", error);
    }
    finally {
      setloading(false);
    }
    return response;
  }

      // Handle the PDF Blob response
  
  useEffect(() => {
    if (interviewId) {
      getreportbyid(interviewId);
    }
    else{
      getallreports();
    }
  }, [interviewId]);


  return {
    loading,
    report,
    reports,
    generateReport,
    getreportbyid,
    getallreports,
    getresumepdf
  };
}; 