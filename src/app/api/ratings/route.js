import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Rating from '@/models/Rating';
import Ship from '@/models/Ship';

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { shipId, rating, comment } = await request.json();
    if (!shipId || !rating) {
      return NextResponse.json({ error: 'ID Kapal dan rating wajib diisi.' }, { status: 400 });
    }
    const shipExists = await Ship.findById(shipId);
    if (!shipExists) {
      return NextResponse.json({ error: 'Kapal tidak ditemukan.' }, { status: 404 });
    }
    const newRating = await Rating.create({ shipId, rating, comment });
    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}