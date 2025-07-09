// src/lib/data-service.js
import dbConnect from './dbConnect';
import Ship from '@/models/Ship';
import AspectRating from '@/models/AspectRating';

export async function getSummaryData() {
  await dbConnect();
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
}

export async function getAllShips() {
  await dbConnect();
  return Ship.aggregate([
    { $lookup: { from: 'ratings', localField: '_id', foreignField: 'shipId', as: 'ratings' } },
    { $addFields: { avgRating: { $ifNull: [{ $avg: '$ratings.rating' }, 0] } } },
    { $project: { ratings: 0 } }
  ]);
}

export async function getShipDetailsById(id) {
  await dbConnect();
  const ship = await Ship.findById(id).lean(); // .lean() untuk performa lebih baik
  if (!ship) return null;
  const ratings = await Rating.find({ shipId: id }).sort({ createdAt: -1 }).lean();
  return { ship, ratings };
}