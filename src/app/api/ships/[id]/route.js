// src/app/api/ships/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ship from '@/models/Ship';
import Rating from '@/models/Rating';
import { authenticateRequest } from '@/lib/auth';

// Fungsi GET untuk satu kapal (tidak berubah dari rencana)
export async function GET(request, { params }) {
  await dbConnect();
  try {
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

// --- FUNGSI BARU: DELETE UNTUK MENGHAPUS KAPAL ---
export async function DELETE(request, { params }) {
  // 1. Periksa keamanan
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const deletedShip = await Ship.findByIdAndDelete(params.id);
    if (!deletedShip) {
      return NextResponse.json({ error: 'Kapal tidak ditemukan untuk dihapus.' }, { status: 404 });
    }
    // Hapus juga semua rating terkait
    await Rating.deleteMany({ shipId: params.id });
    return NextResponse.json({ message: 'Kapal berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ error: 'ID tidak valid atau server error.' }, { status: 500 });
  }
}