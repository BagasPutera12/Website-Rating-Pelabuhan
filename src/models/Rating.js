import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    shipId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ship' }
}, { timestamps: true });

export default mongoose.models.Rating || mongoose.model('Rating', ratingSchema);