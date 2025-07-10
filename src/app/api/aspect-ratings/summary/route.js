import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AspectRating from '@/models/AspectRating';

export async function GET() {
  try {
    await dbConnect();
    const aspectAverages = await AspectRating.aggregate([
      { $group: { _id: '$aspect', averageRating: { $avg: '$rating' } } },
      { $project: { aspect: '$_id', averageRating: 1, _id: 0 } }
    ]);

    let overallAverage = 0;
    if (aspectAverages.length > 0) {
      const sumOfAverages = aspectAverages.reduce((sum, item) => sum + item.averageRating, 0);
      overallAverage = sumOfAverages / aspectAverages.length;
    }

    const recentSuggestions = await AspectRating.find({
        suggestion: { $exists: true, $ne: '' }
    }).sort({ createdAt: -1 }).limit(3).select('suggestion createdAt _id');

    const uniqueSuggestions = [];
    const seenSuggestions = new Set();
    for (const item of recentSuggestions) {
        if (item.suggestion && !seenSuggestions.has(item.suggestion)) {
            seenSuggestions.add(item.suggestion);
            uniqueSuggestions.push(item);
        }
    }

    return NextResponse.json({
      overallAverage,
      aspectAverages,
      recentSuggestions: uniqueSuggestions
    });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil ringkasan data.' }, { status: 500 });
  }
}