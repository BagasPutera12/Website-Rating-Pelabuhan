import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ship from '@/models/Ship';
import Rating from '@/models/Rating';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const ship = await Ship.findById(params.id);
    if (!ship) {
      return NextResponse.json({ error: 'Kapal tidak ditemukan.' }, { status: 404 });
    }
    const ratings = await Rating.find({ shipId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json({ ship, ratings });
  } catch (error) {
    return NextResponse.json({ error: 'ID tidak valid atau server error.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const deletedShip = await Ship.findByIdAndDelete(params.id);
    if (!deletedShip) {
      return NextResponse.json({ error: 'Kapal tidak ditemukan untuk dihapus.' }, { status: 404 });
    }
    await Rating.deleteMany({ shipId: params.id });
    return NextResponse.json({ message: 'Kapal berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ error: 'ID tidak valid atau server error.' }, { status: 500 });
  }
}