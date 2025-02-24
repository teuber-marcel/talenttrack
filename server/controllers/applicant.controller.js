import Applicant from '../models/applicant.model.js';
import axios from "axios";

// Get all applicants
const getApplicants = async (req,res) => {
	try {
		const applicants = await Applicant.find({});
		res.status(200).json(applicants);
	} catch (e) {
		res.status(500).json({ message: "Error retrieving applicants", error: e.message });
	}
};

// Get an applicant by ID
const getApplicantById = async (req,res) => {
	const id = req.params.id;
	try {
		const applicant = await Applicant.findById(id);
		if (!applicant) {
			return res.status(404).json({ message: "Applicant not found" });
		}
		res.status(200).json(applicant);
	} catch (e) {
		res.status(400).json({ message: "Invalid ID Format", error: e.message });
	}
};

// Create a new applicant
const createApplicant = async (req, res) => {
	const reqBody = req.body;
	try {
		const applicant = await Applicant.create(reqBody);
		res.status(201).json(applicant);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

// Update an applicant
const updateApplicant = async (req, res) => {
	const id = req.params.id;
	const reqBody = req.body;
	try {
		const applicant = await Applicant.findOneAndUpdate({ _id: id }, reqBody, { new: true });
		if (!applicant) {
			return res.status(404).json({ message: "Applicant not found" });
		}
		res.status(200).json(applicant);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

// Partially update an applicant
const partialUpdateApplicant = async (req, res) => {
	const id = req.params.id;
    const updateFields = req.body;
    try {
    	const updatedApplicant = await Applicant.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
        if (!updatedApplicant) {
        	return res.status(404).json({ message: "Applicant not found" });
        }
        res.status(200).json(updatedApplicant);
    } catch (error) {
        res.status(400).json({ message: "Error updating vacancy", error: error.message });
    }
};

// Calculate the suitability score for an applicant
const calculateSuitabilityScore = async (req, res) => {
	const id = req.params.id;
	try {
		// Get the applicant by ID
	  	const applicant = await Applicant.findById(id).populate("vacancy");
	  	if (!applicant) {
			return res.status(404).json({ message: "Applicant not found" });
	  	}
		
		// Check whether the vacancy details are present
	  	const { curriculumVitae, motivation, vacancy } = applicant;
	  	if (!curriculumVitae || !motivation) {
			return res.status(400).json({ message: "CV and Motivation are required for suitability score calculation." });
	  	}
	  	if (!vacancy) {
			return res.status(400).json({ message: "Applicant is not associated with a vacancy." });
	  	}
	  	const { description, requirements, other } = vacancy;
	  	if (!description || !requirements || !other) {
			return res.status(400).json({ message: "Vacancy details are incomplete." });
	  	}
  
	  	// Send a request to the OpenAI API to calculate the suitability score
	  	const openAIResponse = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
		  		model: "gpt-3.5-turbo",
		  		messages: [
					{
			  			role: "system",
			  			content: "You are an assistant that calculates suitability scores for job applicants."
					},
					{
			  			role: "user",
			  			content: `Based on the following details, calculate a suitability score from 0 to 100 for the applicant. 0 means the applicant does not fit the vacancy and 100 means the applicant fits the vacancy perfectly. Use the following data for the calculation::
							\n\nApplicant's CV:\n${curriculumVitae}
							\n\nApplicant's Motivation:\n${motivation}
							\n\nJob Description:\n${description}
							\n\nJob Requirements:\n${requirements}
							\n\nOther Information:\n${other}
							\n\nThe MongoDB database expects the suitabilityscore in the form of the type number. Accordingly, please return the suitabilty score only in the form of a number between 0 and 100. Ensure that you only return the number and no additional text.`
					}
		  		],
		  		max_tokens: 50,
		  		temperature: 0.7
			},
			{
		  		headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
		  		}
			}
	  	);
  
		// Extract the suitability score from the OpenAI response
		const responseText = openAIResponse.data.choices[0].message.content;
		const match = responseText.match(/(\d+(\.\d+)?)/);
		if (!match) {
			throw new Error("Invalid suitability score received from OpenAI.");
		}
    	const suitabilityScore = parseFloat(match[0]);
  
	  	// Check if the suitability score is valid
	  	if (isNaN(suitabilityScore) || suitabilityScore < 0 || suitabilityScore > 100) {
			throw new Error("Invalid suitability score received from OpenAI.");
	  	}
  
	  	// Update the applicant with the suitability score
	  	applicant.suitabilityScore = suitabilityScore;
	  	await applicant.save();
	  	res.status(200).json(applicant);
		
	} catch (e) {
		console.error("Error calculating suitability score:", e.message);
		res.status(400).json({ message: e.message });
	}
};  

// Delete an applicant
const deleteApplicant = async (req, res) => {
	const id = req.params.id;
	try {
		const result = await Applicant.deleteOne({ _id: id});
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Applicant not found" });
		}
		res.status(200).json("Applicant deleted");
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

export {
	getApplicants,
	getApplicantById,
	createApplicant,
	updateApplicant,
	partialUpdateApplicant,
	calculateSuitabilityScore,
	deleteApplicant
}