import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SurveySubmission from '@/models/SurveySubmission';
import AspectRating from '@/models/AspectRating';
import { sendNotificationEmail } from '@/lib/email-service'; // Kita akan buat ini

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { userName, userEmail, ratings, suggestion } = await request.json();

    if (!userName || !userEmail || !ratings || !Array.isArray(ratings)) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }
    
    const newSubmission = new SurveySubmission({ userName, userEmail, suggestion });
    const savedSubmission = await newSubmission.save();
    
    const ratingsToInsert = ratings.map(r => ({
      submissionId: savedSubmission._id,
      aspect: r.aspect,
      indicator: r.indicator,
      rating: r.rating
    }));
        
    await AspectRating.insertMany(ratingsToInsert);
        
    sendNotificationEmail(savedSubmission, ratings);

    return NextResponse.json({ message: 'Terima kasih! Survei Anda berhasil dikirimkan.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}