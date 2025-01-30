import express from "express";
import {
    getVacancies,
	getVacancyById,
	getVacancyWithApplicantsById,
	createVacancy,
	updateVacancy,
	deleteVacancy
} from '../controllers/vacancy.controller.js';
import {
    getApplicants,
	getApplicantById,
	createApplicant,
	updateApplicant,
	calculateSuitabilityScore,
	deleteApplicant
} from '../controllers/applicant.controller.js';
import {
    getInterviews,
	getInterviewById,
	createInterview,
	updateInterview,
	deleteInterview,
	generateInterviewQuestions,
	downloadInterviewQuestions
} from '../controllers/interview.controller.js';

const router = express.Router();

router.route('/api/vacancies')
	.get(getVacancies)
	.post(createVacancy);
router.route('/api/vacancies/:id')
	.get(getVacancyById)
	.put(updateVacancy)
	.delete(deleteVacancy);
router.route('/api/vacancies/:id/details')
	.get(getVacancyWithApplicantsById);

router.route('/api/applicants')
	.get(getApplicants)
	.post(createApplicant);
router.route('/api/applicants/:id')
	.get(getApplicantById)
	.put(updateApplicant)
	.delete(deleteApplicant);
router.route('/api/applicants/:id/suitability')
	.put(calculateSuitabilityScore);

router.route('/api/interviews')
	.get(getInterviews)
	.post(createInterview);
router.route('/api/interviews/:id')
	.get(getInterviewById)
	.put(updateInterview)
	.delete(deleteInterview);
router.route('/api/interviews/:id/generate-questions')
	.post(generateInterviewQuestions);
router.route('/api/interviews/:id/download-questions')
	.get(downloadInterviewQuestions);

router.use('/', (req, res) => {
	res.status(200).send("Program is running");
})

export default router