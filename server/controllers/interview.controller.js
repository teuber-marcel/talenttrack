import Interview from '../models/interview.model.js';

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

export {
	getInterviews,
	getInterviewById,
	createInterview,
	updateInterview,
	deleteInterview
}