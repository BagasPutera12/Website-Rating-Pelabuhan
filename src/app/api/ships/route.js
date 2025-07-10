import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ship from '@/models/Ship';
import { authenticateRequest } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
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
    await dbConnect();
    const data = await request.json();
    const newShip = await Ship.create(data);
    return NextResponse.json(newShip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}