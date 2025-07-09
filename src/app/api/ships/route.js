// src/app/api/ships/route.js (dengan GET dan POST)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ship from '@/models/Ship';
import Rating from '@/models/Rating'; // Pastikan Rating diimpor
import mongoose from 'mongoose'; 
import { authenticateRequest } from '@/lib/auth'; // Impor "satpam"

// Fungsi GET (tidak berubah)
export async function GET() {
 await dbConnect(); 
  try {
    const ships = await Ship.aggregate([
      { $lookup: { from: 'ratings', localField: '_id', foreignField: 'shipId', as: 'ratings' } },
      { $addFields: { avgRating: { $ifNull: [{ $avg: '$ratings.rating' }, 0] } } },
      { $project: { ratings: 0 } }
    ]);
    return NextResponse.json(ships);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- FUNGSI BARU: POST UNTUK MEMBUAT KAPAL ---
export async function POST(request) {
  // 1. Periksa keamanan terlebih dahulu
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Akses ditolak. API Key tidak valid atau tidak ada.' }, { status: 401 });
  }

  await dbConnect(); 

  try {
    const data = await request.json(); // Ambil data dari body
    const newShip = await Ship.create(data); // Buat dokumen baru
    return NextResponse.json(newShip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}