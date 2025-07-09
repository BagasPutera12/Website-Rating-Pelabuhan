// src/models/AspectRating.js
import mongoose from 'mongoose';

const AspectRatingSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurveySubmission', required: true },
  aspect: { type: String, required: true },
  indicator: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

export default mongoose.models.AspectRating || mongoose.model('AspectRating', AspectRatingSchema);