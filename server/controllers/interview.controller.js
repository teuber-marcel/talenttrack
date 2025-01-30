import Interview from '../models/interview.model.js';
import Applicant from '../models/applicant.model.js';
import Vacancy from '../models/vacancy.model.js';
import axios from "axios";

const getInterviews = async (req,res) => {
	try {
		const interviews = await Interview.find({});
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

        //Find interview by id
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        //Find linked applicant by id
        const applicant = await Applicant.findById(interview.applicant);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        //Find linked vacancy by id
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

export {
	getInterviews,
	getInterviewById,
	createInterview,
	updateInterview,
	deleteInterview,
	generateInterviewQuestions
}