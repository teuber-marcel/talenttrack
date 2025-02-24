import crypto from 'crypto';
import axios from 'axios';
import LinkedInJobPosting from '../models/linkedinJobPosting.model.js';
import LinkedInApplicant from '../models/linkedinApplicant.model.js';
import Vacancy from '../models/vacancy.model.js';

export const postJobToLinkedIn = async (req, res) => {
  try {
    const { vacancyId } = req.body;
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    // 1) Get access token
    const authResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
      grant_type: 'client_credentials',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });
    if (authResponse.status !== 200) {
      return res.status(400).json({ message: 'Error retrieving LinkedIn token', detail: authResponse.data });
    }
    const accessToken = authResponse.data.access_token;

    // 2) Create jobPosting object from vacancy data
    const jobPosting = {
      jobPostingOperationType: 'CREATE',
      externalJobPostingId: vacancyId,
      title: vacancy.title,
      description: `<p>${vacancy.description}</p>`,
      listedAt: Date.now() + 86400000, 
      location: 'Your City, Country',
      companyApplyUrl: 'https://yourcompany.com/careers',
      companyName: 'Your Company Inc.',
    };

    // 3) Send job posting to LinkedIn
    const apiUrl = 'https://api.linkedin.com/v2/simpleJobPostings';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const responseLinkedIn = await axios.post(apiUrl, jobPosting, { headers });

    if (responseLinkedIn.status === 202) {
      // Optionally store in DB
      const newPosting = await LinkedInJobPosting.create({
        title: vacancy.title,
        location: 'Your City, Country',
        description: vacancy.description,
        // ...any additional fields...
      });
      return res.status(201).json({ message: 'Job posted to LinkedIn', newPosting });
    } else {
      return res.status(400).json({ message: 'Error creating LinkedIn job', detail: responseLinkedIn.data });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const receiveLinkedInApplicants = async (req, res) => {
  try {
    // ...logic for receiving applicants...
    const dummyApplicants = [{ fullName: 'John Doe', profileUrl: 'https://linkedin.com/in/johndoe' }];
    await LinkedInApplicant.insertMany(dummyApplicants);
    return res.status(200).json({ message: 'Applicants received', dummyApplicants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const receiveLinkedInWebhook = (req, res) => {
  const secretKey = process.env.LINKEDIN_SECRET_KEY;
  const signature = req.headers['x-li-signature'];

  if (!signature) {
    return res.status(400).send('No signature provided');
  }

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(JSON.stringify(req.body));
  const computedSignature = hmac.digest('hex');

  if (!crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
  )) {
    return res.status(400).send('Invalid signature');
  }

  // ...process req.body (jobApplicationId, jobApplicant, etc.)...
  return res.status(200).json({ status: 'success' });
};