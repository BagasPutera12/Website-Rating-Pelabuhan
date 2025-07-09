// src/models/SurveySubmission.js
import mongoose from 'mongoose';

const surveySubmissionSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, trim: true, lowercase: true },
  suggestion: { type: String, required: false, trim: true }
}, { timestamps: true });

export default mongoose.models.SurveySubmission || mongoose.model('SurveySubmission', surveySubmissionSchema);