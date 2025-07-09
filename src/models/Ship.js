import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String },
    description: { type: String },
    vessel_finder_url: { type: String },
    ticket_url: { type: String },
    gtLoa: { type: String },
    agen: { type: String },
    labuh: { type: String },
    rencanaSandar: { type: String },
    komoditi: { type: String },
    bongkarMuat: { type: String },
    asalTujuan: { type: String },
}, { timestamps: true });

export default mongoose.models.Ship || mongoose.model('Ship', shipSchema);