const { GoogleGenAI, Type } = require("@google/genai")
const { z, ZodTransform } = require("zod")
const puppeteer = require('puppeteer') ;

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// 1. ZOD SCHEMA: Used to strictly validate the final output in JavaScript
// const interviewreportSchema = z.object({
//   title: z.string(),
//   technicalQuestions: z.array(z.object({
//     question: z.string(),
//     answer: z.string(),
//     intention: z.string()
//   })),
//   behaviouralQuestions: z.array(z.object({
//     question: z.string(),
//     answer: z.string(),
//     intention: z.string()
//   })),
//   skillsGap: z.array(z.object({
//     skill: z.string(),
//     severity: z.enum(["low", "medium", "high"])
//   })),
//   preparationPlan: z.array(z.object({
//     day: z.number(),
//     focus: z.string(),
//     tasks: z.array(z.string())
//   })),
//   matchScore: z.number()
// });

const interviewreportSchema = z.object({
  title: z.string(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      intention: z.string(),
    })
  ),

  behaviouralQuestions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      intention: z.string(),
    })
  ),

  skillsGap: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),

  matchScore: z.number(),
});

// 2. GEMINI NATIVE SCHEMA
const geminiGenerationSchema = {
  type: Type.OBJECT,

  properties: {
    title: {
      type: Type.STRING,
      description:
        "A short professional title for this interview preparation report",
    },

    technicalQuestions: {
      type: Type.ARRAY,
      description:
        "A list of technical questions that can be asked in the interview.",

      items: {
        type: Type.OBJECT,

        properties: {
          question: {
            type: Type.STRING,
            description: "The technical question",
          },

          answer: {
            type: Type.STRING,
            description: "How to answer this question",
          },

          intention: {
            type: Type.STRING,
            description: "The intention behind the question",
          },
        },

        required: ["question", "answer", "intention"],
      },
    },

    behaviouralQuestions: {
      type: Type.ARRAY,
      description:
        "A list of behavioural questions that can be asked in the interview.",

      items: {
        type: Type.OBJECT,

        properties: {
          question: {
            type: Type.STRING,
            description: "The behavioural question",
          },

          answer: {
            type: Type.STRING,
            description: "How to answer this question",
          },

          intention: {
            type: Type.STRING,
            description: "The intention behind the question",
          },
        },

        required: ["question", "answer", "intention"],
      },
    },

    skillsGap: {
      type: Type.ARRAY,
      description: "A list of skills gaps that the candidate has.",

      items: {
        type: Type.OBJECT,

        properties: {
          skill: {
            type: Type.STRING,
            description: "The skill the candidate lacks",
          },

          severity: {
            type: Type.STRING,
            description: "The severity of the skill gap",
            enum: ["low", "medium", "high"],
          },
        },

        required: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: Type.ARRAY,
      description: "A day-wise preparation plan for the candidate.",

      items: {
        type: Type.OBJECT,

        properties: {
          day: {
            type: Type.INTEGER,
            description: "The day number",
          },

          focus: {
            type: Type.STRING,
            description: "The focus area for that day",
          },

          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },

        required: ["day", "focus", "tasks"],
      },
    },

    matchScore: {
      type: Type.NUMBER,
      description:
        "A score from 1 to 100 indicating job description match.",
    },
  },

  // 3. REQUIRED FIELDS
  required: [
    "title",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillsGap",
    "preparationPlan",
    "matchScore",
  ],
};
const resumePdfGeminiSchema = {
  type: Type.OBJECT,

  properties: {
    html: {
      type: Type.STRING,
      description:
        "Complete HTML document for an ATS-friendly professional resume.",
    },
  },

  required: ["html"],
};

// 2. GEMINI NATIVE SCHEMA: Used to strictly constrain the LLM output
// const geminiGenerationSchema = {
//   type: Type.OBJECT,
//   properties: {
//     title: {
//       type: Type.STRING,
//       description: "A short professional title for this interview preparation report"
//     },
//     technicalQuestions: {
//       type: Type.ARRAY,
//       description: "A list of technical questions that can be asked in the interview.",
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           question: { type: Type.STRING, description: "The technical question" },
//           answer: { type: Type.STRING, description: "How to answer this question" },
//           intention: { type: Type.STRING, description: "The intention behind the question" }
//         },
//         required: ["question", "answer", "intention"]
//       }
//     },
//     behaviouralQuestions: {
//       type: Type.ARRAY,
//       description: "A list of behavioural questions that can be asked in the interview.",
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           question: { type: Type.STRING, description: "The behavioural question" },
//           answer: { type: Type.STRING, description: "How to answer this question" },
//           intention: { type: Type.STRING, description: "The intention behind the question" }
//         },
//         required: ["question", "answer", "intention"]
//       }
//     },
//     skillsGap: {
//       type: Type.ARRAY,
//       description: "A list of skills gaps that the candidate has.",
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           skill: { type: Type.STRING, description: "The skill the candidate lacks" },
//           severity: {
//             type: Type.STRING,
//             description: "The severity of the skill gap",
//             enum: ["low", "medium", "high"]
//           }
//         },
//         required: ["skill", "severity"]
//       }
//     },
//     preparationPlan: {
//       type: Type.ARRAY,
//       description: "A day-wise preparation plan for the candidate.",
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           day: { type: Type.INTEGER, description: "The day number" },
//           focus: { type: Type.STRING, description: "The focus area for that day" },
//           tasks: {
//             type: Type.ARRAY,
//             items: { type: Type.STRING }
//           }
//         },
//         required: ["day", "focus", "tasks"]
//       }
//     },
//     matchScore: {
//       type: Type.NUMBER,
//       description: "A score from 1 and 100 indicating job description match."
//     }
//   },
//   // Ensure the model knows it MUST return every single one of these keys
//   required: ["technicalQuestions", "behaviouralQuestions", "skillsGap", "preparationPlan", "matchScore"]
// };

async function generateInterviewreport({ jobDescription, resume, selfDescription }) {
  const prompt = `You are an expert interviewer and career coach. Generate an interview report for a candidate based on the following details.
  
  Resume : ${resume}
  Job Description : ${jobDescription}
  Self Description : ${selfDescription}`;

  console.log("Calling Gemini API...");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // 3. Pass the Native Google Schema here
      responseSchema: geminiGenerationSchema,
    },
  });
  try { 
    const rawJson = JSON.parse(response.text);
    console.log("Raw JSON from Gemini:", rawJson);

    return rawJson; // Return the raw JSON for now, before validation

    // 4. Validate the resulting JSON against your Zod rules
    // const validatedReport = interviewreportSchema.parse(rawJson);

    // console.log("\n✅ SUCCESS! Schema strictly followed.\n");
    // console.log(JSON.stringify(validatedReport, null, 2));

    // return validatedReport;

  } catch (error) {
    console.error("\n❌ VALIDATION ERROR!");
    console.error("Zod Error:", error.message);
    console.log("Raw Output:", response.text);
  }
}

async function generatepdffromhtml({ html }) {
  const browser = await puppeteer.launch({
    headless: true,

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfbuffer = await page.pdf({
      format: "A4",

      printBackground: true,

      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return pdfbuffer;
  } finally {
    await browser.close();
  }
}

async function genearteresumepdf({
  resume,
  jobDescription,
  selfDescription,
}) {
  const prompt = `
You are an expert resume builder.

Generate a professional, ATS-friendly resume as a COMPLETE HTML document.

Requirements:
- Return ONLY valid JSON.
- The JSON must contain exactly one key: "html".
- The HTML should be a complete document including:
  - <!DOCTYPE html>
  - <html>
  - <head>
  - CSS styling inside <style>
  - <body>

Candidate Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: resumePdfGeminiSchema,
      },
    });

    const jsonResponse = JSON.parse(response.text);

    if (!jsonResponse.html) {
      throw new Error("Gemini did not return HTML.");
    }

    console.log("Gemini HTML Response:", jsonResponse.html);

    const pdfbuffer = await generatepdffromhtml({
      html: jsonResponse.html,
    });

    return pdfbuffer;
  } catch (error) {
    console.error(
      "Resume PDF Generation Error:",
      error
    );

    throw error;
  }
}

module.exports = { generateInterviewreport, genearteresumepdf };