import Vacancy from '../models/vacancy.model.js';
import Applicant from '../models/applicant.model.js';

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
    const id = req.params;
    try {
        // 1. Vakanzdetails abrufen
        const vacancy = await Vacancy.findById(id);
        if (!vacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        // 2. Bewerber abrufen, die der Vakanz zugeordnet sind
        const applicants = await Applicant.find({ vacancy: id });

        // 3. Kombinierte Antwort zurückgeben
        res.status(200).json({
            vacancy,
            applicants
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vacancy details.", error: error.message });
    }
};

const createVacancy = async (req, res) => {
	const reqBody = req.body;
	try {
		const vacancy = await Vacancy.create(reqBody);
		res.status(201).json(vacancy);
	} catch (e) {
		res.status(400).json({ message: e.message });
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
	deleteVacancy
}