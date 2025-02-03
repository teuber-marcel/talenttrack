import Applicant from '../models/applicant.model.js';
import axios from "axios";

const getApplicants = async (req,res) => {
	try {
		const applicants = await Applicant.find({});
		res.status(200).json(applicants);
	} catch (e) {
		res.status(500).json({ message: "Error retrieving applicants", error: e.message });
	}
}

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

const createApplicant = async (req, res) => {
	const reqBody = req.body;
	try {
		const applicant = await Applicant.create(reqBody);
		res.status(201).json(applicant);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
};

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

const partialUpdateApplicant = async (req, res) => {
    const id = req.params.id;
    const updateFields = req.body; // Enthält nur die Felder, die aktualisiert werden sollen

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

const calculateSuitabilityScore = async (req, res) => {
	const id = req.params.id;
  
	try {
	  // 1️⃣ Hole den Bewerber aus der Datenbank
	  const applicant = await Applicant.findById(id).populate("vacancy");
	  if (!applicant) {
		return res.status(404).json({ message: "Applicant not found" });
	  }
  
	  // Prüfe, ob die benötigten Felder vorhanden sind
	  const { curriculumVitae, motivation, vacancy } = applicant;
	  if (!curriculumVitae || !motivation) {
		return res.status(400).json({ message: "CV and Motivation are required for suitability score calculation." });
	  }
	  if (!vacancy) {
		return res.status(400).json({ message: "Applicant is not associated with a vacancy." });
	  }
  
	  // 2️⃣ Hole die Felder der zugeordneten Stelle
	  const { description, requirements, other } = vacancy;
	  if (!description || !requirements || !other) {
		return res.status(400).json({ message: "Vacancy details are incomplete." });
	  }
  
	  // 3️⃣ Anfrage an die OpenAI API zur Berechnung des Suitability Scores
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
						\n\nThe MongoDB database expects the suitabilityscore in the form of the type number. Accordingly, please return the suitabiltyscore only in the form of a number between 0 and 100.`
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
  
	  // 4️⃣ Verarbeite die Antwort der OpenAI API
	  const suitabilityScore = parseFloat(openAIResponse.data.choices[0].message.content.trim());
  
	  // Validierung des Scores
	  if (isNaN(suitabilityScore) || suitabilityScore < 0 || suitabilityScore > 100) {
		throw new Error("Invalid suitability score received from OpenAI.");
	  }
  
	  // 5️⃣ Aktualisiere den Bewerber in der Datenbank
	  applicant.suitabilityScore = suitabilityScore;
	  await applicant.save();
  
	  // 6️⃣ Sende die aktualisierten Bewerberdaten zurück
	  res.status(200).json(applicant);
	} catch (e) {
	  console.error("Error calculating suitability score:", e.message);
	  res.status(400).json({ message: e.message });
	}
};  

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