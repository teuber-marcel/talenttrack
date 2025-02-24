import mongoose from 'mongoose';

const LinkedInJobPostingSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  externalJobPostingId: String,
  listedAt: Number,
  
});

export default mongoose.model('LinkedInJobPosting', LinkedInJobPostingSchema);