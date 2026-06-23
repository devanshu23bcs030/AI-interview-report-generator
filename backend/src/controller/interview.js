const pdfParse = require('pdf-parse');
const {generateInterviewreport , genearteresumepdf} = require('../services/ai.service') 
const InterviewReportmodel = require('../models/interviewreport.model') ;

async function generateInterviewReport(req, res) {
    const resumecontent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText() ;
    const {selfDescription , jobDescription} = req.body ;

    const response = await generateInterviewreport({
        jobDescription,
        resume : resumecontent.text ,
        selfDescription
    }) ;

    const interviewReport = await InterviewReportmodel.create({
        user : req.user.id ,
        resume : resumecontent.text ,
        jobDescription ,
        selfDescription ,
        ...response 
    })

    res.status(200).json({
        message : "Interview Report generated successfully" ,
        data : interviewReport
    })
    
}
const getInterviewReport = async (req, res) => {
    const {interviewId} = req.params ;
    const interviewReport = await InterviewReportmodel.findById(interviewId) ;

    if(!interviewReport) {  
        return res.status(404).json({
            message : "Interview Report not found"
        })
    }
    res.status(200).json({
        message : "Interview Report fetched successfully" ,
        interviewReport
    })
}

const getAllInterviewReports = async (req, res) => {
    const interviewReports = await InterviewReportmodel.find({user : req.user.id}).sort({createdAt : -1}).select("-__v -resume -technicalQuestions -behaviouralQuestions -skillsGap -preparationPlan -jobDescription -selfDescription") ;
    res.status(200).json({
        message : "Interview Reports fetched successfully" ,
        interviewReports
    })
}

const generateResumePDF = async (req, res) => { 
    console.log("Generating Resume PDF for interviewId:", req.params.interviewId);
    const {interviewId} = req.params ;
    const interviewReport = await InterviewReportmodel.findById(interviewId) ;
    if(!interviewReport) {
        return res.status(404).json({
            message : "Interview Report not found"
        })
    }

    const {resume , jobDescription , selfDescription} = interviewReport ;

    const pdfBuffer = await genearteresumepdf({resume , jobDescription , selfDescription}) ;

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=resume_${interviewId}.pdf`,
        'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
}

module.exports = {generateInterviewReport , getInterviewReport , getAllInterviewReports , generateResumePDF} ;