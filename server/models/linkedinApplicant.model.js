
import mongoose from 'mongoose';

const LinkedInApplicantSchema = new mongoose.Schema({
  fullName: String,
  profileUrl: String,
  
});

export default mongoose.model('LinkedInApplicant', LinkedInApplicantSchema);