import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // <-- Impor mongoose langsung
import Ship from '@/models/Ship';
import Rating from '@/models/Rating';
import { authenticateRequest } from '@/lib/auth';

const MONGO_URI = process.env.MONGO_URI;

export async function GET() {
  try {
    await mongoose.connect(MONGO_URI); // <-- Gunakan koneksi langsung
    const ships = await Ship.aggregate([
      { $lookup: { from: 'ratings', localField: '_id', foreignField: 'shipId', as: 'ratings' } },
      { $addFields: { avgRating: { $ifNull: [{ $avg: '$ratings.rating' }, 0] } } },
      { $project: { ratings: 0 } }
    ]);
    return NextResponse.json(ships);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kapal.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
  }
  
  try {
    await mongoose.connect(MONGO_URI); // <-- Gunakan koneksi langsung
    const data = await request.json();
    const newShip = await Ship.create(data);
    return NextResponse.json(newShip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}