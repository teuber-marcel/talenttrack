import Vacancy from '../models/vacancy.model.js';
import Applicant from '../models/applicant.model.js';
import axios from "axios";

const getVacancies = async (req,res) => {
	try {
		const vacancies = await Vacancy.find({});
		res.status(200).json(vacancies);
	} catch (e) {
		res.status(500).json({ message: "Error retrieving vacancies", error: e.message });
	}
}

const getVacancyById = async (req,res) => {
	const id = req.params.id;
	try {
		const vacancy = await Vacancy.findById(id);
		if (!vacancy) {
			return res.status(404).json({ message: "Vacancy not found" });
		}
		res.status(200).json(vacancy);
	} catch (e) {
		res.status(400).json({ message: "Invalid ID Format", error: e.message });
	}
};

const getVacancyWithApplicantsById = async (req, res) => {
    const id = req.params.id;  // ✅ Extracts the ID as a string.

    try {
        console.log("Fetching vacancy and applicants for ID:", id);

        if (!id || id.length !== 24) {  // ✅ Ensure ID is valid
            return res.status(400).json({ message: "Invalid Vacancy ID" });
        }

        // Fetch the vacancy
        const vacancy = await Vacancy.findById(id);
        if (!vacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        // Fetch applicants linked to this vacancy
        const applicants = await Applicant.find({ vacancy: id });

        console.log("Fetched Vacancy:", vacancy);
        console.log("Fetched Applicants:", applicants);

        res.status(200).json({
            vacancy,
            applicants
        });
    } catch (error) {
        console.error("Error retrieving vacancy details:", error.message);
        res.status(500).json({ message: "Error retrieving vacancy details", error: error.message });
    }
};

const createVacancy = async (req, res) => {

	const { title, hierarchy, department } = req.body;

	if (!process.env.OPENAI_API_KEY) {
		return res.status(500).json({ message: "OpenAI API key is missing" });
	}
  
	try {
	  	const openAIResponse = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{
						"role": "system",
						"content": "You are an assistant that generates job descriptions."
					},
					{
						"role": "user",
						"content": `Generate a job description for the following position: Title: ${title}, Hierarchy Level: ${hierarchy}, Department: ${department}. Provide three fields: Description, Requirements, and Other Information. Please return the information in the form of a JSON object with the three fields description, requirements and other. Ensure the response is a valid JSON object.`
					}
				],
				max_tokens: 500,
				temperature: 0.7,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
	  	);
		
		const generatedContent = openAIResponse.data.choices[0].message.content;

		let generatedVacancyDetails;

		try {
	  		generatedVacancyDetails = JSON.parse(generatedContent);
			
			if (
				!generatedVacancyDetails.description ||
				!generatedVacancyDetails.requirements ||
				!generatedVacancyDetails.other
			  ) {
				throw new Error("Incomplete job details in OpenAI response");
			  }
		} catch (error) {
			console.error("Error parsing OpenAI response:", error.message);
			return res.status(500).json({ message: "Invalid JSON response from OpenAI" });
		}

	  	const vacancy = await Vacancy.create({
			title,
			hierarchy,
			department,
			description: generatedVacancyDetails.description,
			requirements: generatedVacancyDetails.requirements,
			other: generatedVacancyDetails.other,
	  	});

	  	res.status(201).json(vacancy);
	} catch (e) {
		if (e.response) {
			console.error("OpenAI API Error:", e.response.data);
      		return res.status(e.response.status).json({ message: e.response.data.error.message });
    	} else {
			console.error("Error creating vacancy:", e.message);
      		return res.status(400).json({ message: e.message });
    	}
  	}
};

const updateVacancy = async (req, res) => {
	const id = req.params.id;
	const reqBody = req.body;
	try {
		const vacancy = await Vacancy.findOneAndUpdate({ _id: id }, reqBody, { new: true });
		if (!vacancy) {
			return res.status(404).json({ message: "Vacancy not found" });
		}
		res.status(200).json(vacancy);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

const partialUpdateVacancy = async (req, res) => {
    const id = req.params.id;
    const updateFields = req.body; // Enthält nur die Felder, die aktualisiert werden sollen

    try {
        const updatedVacancy = await Vacancy.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

        if (!updatedVacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        res.status(200).json(updatedVacancy);
    } catch (error) {
        res.status(400).json({ message: "Error updating vacancy", error: error.message });
    }
};

const deleteVacancy = async (req, res) => {
	const id = req.params.id;
	try {
		const result = await Vacancy.deleteOne({ _id: id});
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Vacancy not found" });
		}
		res.status(200).json("Vacancy deleted");
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

export {
	getVacancies,
	getVacancyById,
	getVacancyWithApplicantsById,
	createVacancy,
	updateVacancy,
	partialUpdateVacancy,
	deleteVacancy
}