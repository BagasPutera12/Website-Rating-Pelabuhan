// src/app/api/aspect-ratings/summary/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AspectRating from '@/models/AspectRating';
import mongoose from 'mongoose';
export async function GET() {
  await mongoose.connect(process.env.MONGO_URI); 
  try {
    const aspectAverages = await AspectRating.aggregate([
      { $group: { _id: '$aspect', averageRating: { $avg: '$rating' } } },
      { $project: { aspect: '$_id', averageRating: 1, _id: 0 } }
    ]);

    let overallAverage = 0;
    if (aspectAverages.length > 0) {
      const sumOfAverages = aspectAverages.reduce((sum, item) => sum + item.averageRating, 0);
      overallAverage = sumOfAverages / aspectAverages.length;
    }

    return NextResponse.json({
      overallAverage: overallAverage,
      aspectAverages: aspectAverages,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil ringkasan data.' }, { status: 500 });
  }
}