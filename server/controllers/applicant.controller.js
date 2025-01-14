import Applicant from '../models/applicant.model.js';

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
	deleteApplicant
}