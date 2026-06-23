const mongoose = require('mongoose');

/**
 * job description
 * resume text 
 * self decription 
 * 
 * matchscore : Number
 * 
 * Technical questions 
 * [{
 *      question:"" , 
 *      answer:"" , 
 *      intention : ""
 * }]
 * behavioural questions 
 * [{
 *      question:"" , 
 *      answer:"" , 
 *      intention : ""
 * }]
 * skills gap 
 * [{
 *      skill :"", 
 *      severity :{
 *         type : String }
 *          enum : ["low", "medium", "high"]    
 * }] 
 * preperaion plan [{
 * day : Number ,
 * foucs    : String ,
 * tasks : [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question : {
        type : String ,
        required : [true , "Question is req"]
    } ,
    intention : {
        type : String ,
        required : [true , "Intention is req"]
    } ,
    answer : {
        type : String ,
        required : [true , "Answer is req"]
    }
} , {
    _id : false
})
const behaviouralQuestionSchema = new mongoose.Schema({
    question : {
        type : String ,
        required : [true , "Question is req"]
    } ,
    intention : {
        type : String ,
        required : [true , "Intention is req"]
    } ,
    answer : {
        type : String ,
        required : [true , "Answer is req"]
    }
} , {
    _id : false
})
const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String ,
        required : [true , "Skill is req"]
    } ,
    severity : {
        type : String ,
        enum : ["low", "medium", "high"] ,
        required : [true , "Severity is req"]
    }
} , {
    _id : false 
})
const preparationPlanSchema = new mongoose.Schema({
    day : {
        type : Number ,
        required : [true , "Day is req"]
    } ,
    focus : {
        type : String ,
        required : [true , "Focus is req"]
    } ,
    tasks : [{
        type : String ,
        required : [true , "Tasks are req"]
    }]
} , {
    _id : false 
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min : 0 , 
        max : 100
    } , 
    technicalQuestions: [technicalQuestionSchema] , 
    behaviouralQuestions : [behaviouralQuestionSchema] ,
    skillsGap : [skillGapSchema] ,
    preparationPlan : [preparationPlanSchema]  , 
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "users" ,
        required : [true , "User is req"]
    } , 
    title : {
        type : String ,
        required : [true , "Title is req"]
    }
}, {
    timestamps: true
})

const InterviewReportmodel = mongoose.model('InterviewReport', interviewReportSchema)

module.exports = InterviewReportmodel