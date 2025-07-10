import dbConnect from './dbConnect'; // <-- Gunakan dbConnect
import Ship from '@/models/Ship';
import AspectRating from '@/models/AspectRating';
import Rating from '@/models/Rating';

export async function getSummaryData() {
  try {
    await dbConnect(); // <-- Panggil di awal
    const aspectAverages = await AspectRating.aggregate([
      { $group: { _id: '$aspect', averageRating: { $avg: '$rating' } } },
      { $project: { aspect: '$_id', averageRating: 1, _id: 0 } }
    ]);

    let overallAverage = 0;
    if (aspectAverages.length > 0) {
      const sum = aspectAverages.reduce((sum, item) => sum + item.averageRating, 0);
      overallAverage = sum / aspectAverages.length;
    }

    const recentSuggestions = await AspectRating.find({
        suggestion: { $exists: true, $ne: '' }
    }).sort({ createdAt: -1 }).limit(3).select('suggestion createdAt _id');

    const uniqueSuggestions = [];
    const seenSuggestions = new Set();
    for (const item of recentSuggestions) {
        if (!seenSuggestions.has(item.suggestion)) {
            seenSuggestions.add(item.suggestion);
            uniqueSuggestions.push(item);
        }
    }

    return { overallAverage, aspectAverages, recentSuggestions: uniqueSuggestions };
  } catch (error) {
    console.error("Error di getSummaryData:", error);
    return { overallAverage: 0, aspectAverages: [], recentSuggestions: [] };
  }
}

export async function getAllShips() {
  try {
    await dbConnect(); // <-- Panggil di awal
    return Ship.aggregate([
      { $lookup: { from: 'ratings', localField: '_id', foreignField: 'shipId', as: 'ratings' } },
      { $addFields: { avgRating: { $ifNull: [{ $avg: '$ratings.rating' }, 0] } } },
      { $project: { ratings: 0 } }
    ]);
  } catch (error) {
    console.error("Error di getAllShips:", error);
    return [];
  }
}

export async function getShipDetailsById(id) {
  try {
    await dbConnect(); // <-- Panggil di awal
    const ship = await Ship.findById(id).lean();
    if (!ship) return null;
    const ratings = await Rating.find({ shipId: id }).sort({ createdAt: -1 }).lean();
    return { ship, ratings };
  } catch (error) {
    console.error("Error di getShipDetailsById:", error);
    return null;
  }
}