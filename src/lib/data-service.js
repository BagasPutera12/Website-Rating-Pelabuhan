// src/lib/data-service.js (VERSI PALING STABIL)

import mongoose from 'mongoose';
import Ship from '@/models/Ship';
import AspectRating from '@/models/AspectRating';
import Rating from '@/models/Rating';

const MONGO_URI = process.env.MONGO_URI;

// Fungsi untuk mengambil summary (digunakan oleh HomePage)
export async function getSummaryData() {
  try {
    await mongoose.connect(MONGO_URI);
    const aspectAverages = await AspectRating.aggregate([
      { $group: { _id: '$aspect', averageRating: { $avg: '$rating' } } },
      { $project: { aspect: '$_id', averageRating: 1, _id: 0 } }
    ]);

    let overallAverage = 0;
    if (aspectAverages.length > 0) {
      const sum = aspectAverages.reduce((sum, item) => sum + item.averageRating, 0);
      overallAverage = sum / aspectAverages.length;
    }
    return { overallAverage, aspectAverages };
  } catch (error) {
    console.error("Error di getSummaryData:", error);
    // Kembalikan data default jika error agar tidak crash
    return { overallAverage: 0, aspectAverages: [] };
  }
}

// Fungsi untuk mengambil semua kapal (digunakan oleh ShipListPage)
export async function getAllShips() {
  try {
    await mongoose.connect(MONGO_URI);
    return Ship.aggregate([
      { $lookup: { from: 'ratings', localField: '_id', foreignField: 'shipId', as: 'ratings' } },
      { $addFields: { avgRating: { $ifNull: [{ $avg: '$ratings.rating' }, 0] } } },
      { $project: { ratings: 0 } }
    ]);
  } catch (error) {
    console.error("Error di getAllShips:", error);
    return []; // Kembalikan array kosong jika error
  }
}

// Fungsi untuk mengambil detail satu kapal (digunakan oleh ShipDetailPage)
export async function getShipDetailsById(id) {
  try {
    await mongoose.connect(MONGO_URI);
    const ship = await Ship.findById(id).lean();
    if (!ship) return null;
    const ratings = await Rating.find({ shipId: id }).sort({ createdAt: -1 }).lean();
    return { ship, ratings };
  } catch (error)
  {
    console.error("Error di getShipDetailsById:", error);
    return null; // Kembalikan null jika error
  }
}