import Interview from '../models/interview.model.js';
import Applicant from '../models/applicant.model.js';
import Vacancy from '../models/vacancy.model.js';
import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";

const getInterviews = async (req,res) => {
    try {
        const filter = {};
        if (req.query.applicant) {
            filter.applicant = req.query.applicant;
        }
        const interviews = await Interview.find(filter);
        res.status(200).json(interviews);
    } catch (e) {
        res.status(500).json({ message: "Error retrieving interviews", error: e.message });
    }
}

const getInterviewById = async (req,res) => {
	const id = req.params.id;
	try {
		const interview = await Interview.findById(id);
		if (!interview) {
			return res.status(404).json({ message: "Interview not found" });
		}
		res.status(200).json(interview);
	} catch (e) {
		res.status(400).json({ message: "Invalid ID Format", error: e.message });
	}
};

const createInterview = async (req, res) => {
	const reqBody = req.body;
	try {
		const interview = await Interview.create(reqBody);
		res.status(201).json(interview);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

const updateInterview = async (req, res) => {
	const id = req.params.id;
	const reqBody = req.body;
	try {
		const interview = await Interview.findOneAndUpdate({ _id: id }, reqBody, { new: true });
		if (!interview) {
			return res.status(404).json({ message: "Interview not found" });
		}
		res.status(200).json(interview);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

const deleteInterview = async (req, res) => {
	const id = req.params.id;
	try {
		const result = await Interview.deleteOne({ _id: id});
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Interview not found" });
		}
		res.status(200).json("Inteview deleted");
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

const generateInterviewQuestions = async (req, res) => {
    try {
        const interviewId = req.params.id;

        //Get interview by id
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        //Get linked applicant by id
        const applicant = await Applicant.findById(interview.applicant);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        //Get linked vacancy by id
        const vacancy = await Vacancy.findById(applicant.vacancy);
        if (!vacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        //Relevant information for API call
        const requestData = {
            curriculumVitae: applicant.curriculumVitae,
            motivation: applicant.motivation,
            jobDetails: {
                title: vacancy.title,
                department: vacancy.department,
                hierarchy: vacancy.hierarchy,
                description: vacancy.description,
                requirements: vacancy.requirements,
                other: vacancy.other
            }
        };

        //Send request to OpenAI API
        const openAIResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI that generates ten possible interview questions based on a candidate's CV, motivation letter, and job description."
                    },
                    {
                        role: "user",
                        content: `Generate ten possible interview questions for the following candidate and job position:
                        - **Candidate CV**: ${requestData.curriculumVitae}
                        - **Candidate Motivation**: ${requestData.motivation}
                        - **Job Title**: ${requestData.jobDetails.title}
                        - **Department**: ${requestData.jobDetails.department}
                        - **Hierarchy Level**: ${requestData.jobDetails.hierarchy}
                        - **Job Description**: ${requestData.jobDetails.description}
                        - **Job Requirements**: ${requestData.jobDetails.requirements}
                        - **Other Information**: ${requestData.jobDetails.other}

                        Return the response in the following JSON format:
                        {
                            "questions": [
                                "Question 1",
                                "Question 2",
                                "Question 3",
                                ...
                            ]
                        }`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        //Save generated questions to interview
        const generatedQuestions = JSON.parse(openAIResponse.data.choices[0].message.content).questions;

        interview.questions = generatedQuestions;
        await interview.save();

        res.status(200).json({ message: "Interview questions generated successfully", questions: generatedQuestions });

    } catch (error) {
        console.error("Error when generating the interview questions:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const downloadInterviewQuestions = async (req, res) => {
    try {
        const interviewId = req.params.id;

        //Get interview by id
        const interview = await Interview.findById(interviewId).populate("applicant");
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        if (!interview.questions || interview.questions.length === 0) {
            return res.status(400).json({ message: "No questions available for this interview" });
        }

        //Get applicant information the PDF file
        const applicantName = interview.applicant
            ? `${interview.applicant.prename} ${interview.applicant.surname}`
            : "Unknown Applicant";

        //Define path for PDF file
        const pdfPath = `./interview_questions_${interviewId}.pdf`;

        //Create PDF file
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // 🔹 5. Titel und Bewerberinformationen hinzufügen
        doc.fontSize(18).text("Interview Questions", { align: "center" }).moveDown();
        doc.fontSize(14).text(`Applicant: ${applicantName}`).moveDown(2);

        //Write questions to PDF
        doc.fontSize(12);
        interview.questions.forEach((question, index) => {
            doc.text(`${index + 1}. ${question}`).moveDown();
        });

        //End PDF file creation
        doc.end();

        //End stream and send PDF file
        stream.on("finish", () => {
            res.download(pdfPath, `interview_questions_${interviewId}.pdf`, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    res.status(500).json({ message: "Error sending file" });
                }
                //Delete PDF file after sending
                fs.unlinkSync(pdfPath);
            });
        });

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Error generating PDF" });
    }
};

export {
	getInterviews,
	getInterviewById,
	createInterview,
	updateInterview,
	deleteInterview,
	generateInterviewQuestions,
	downloadInterviewQuestions
}