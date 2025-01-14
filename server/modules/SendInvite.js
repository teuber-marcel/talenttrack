const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../modules/.env') });

const { connectToDatabase } = require('../config/database');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  invitations: [
    {
      date: String,
      time: String,
      sentAt: Date,
    },
  ],
  // ...other fields...
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

async function sendInvite(candidateId, date, time) {
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      console.error('Candidate not found');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: 'Interview Invitation',
      text: `Hello ${candidate.name},\n\nYou are invited to an interview on ${date} at ${time}.\n\nBest regards,\nYour Company`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Invitation sent successfully');

    // Log the invitation in the database
    candidate.invitations.push({
      date: date,
      time: time,
      sentAt: new Date(),
    });
    await candidate.save();
    console.log('Invitation logged in the database');
  } catch (error) {
    console.error('Error sending invitation:', error);
  }
}

module.exports = { sendInvite };