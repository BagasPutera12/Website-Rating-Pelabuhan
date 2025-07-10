// src/app/api/ships/route.js (DENGAN LOGGING DETAIL)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ship from '@/models/Ship';
import Rating from '@/models/Rating';
import { authenticateRequest } from '@/lib/auth';

export async function GET() {
  console.log("GET /api/ships: Memulai proses...");
  try {
    await dbConnect();
    console.log("GET /api/ships: Koneksi database berhasil.");

    console.log("GET /api/ships: Mencoba menjalankan agregasi data kapal...");
    const ships = await Ship.aggregate([
      { $lookup: { from: 'ratings', localField: '_id', foreignField: 'shipId', as: 'ratings' } },
      { $addFields: { avgRating: { $ifNull: [{ $avg: '$ratings.rating' }, 0] } } },
      { $project: { ratings: 0 } }
    ]);
    console.log(`GET /api/ships: Agregasi selesai. Ditemukan ${ships.length} kapal.`);

    return NextResponse.json(ships);

  } catch (error) {
    console.error("GET /api/ships: TERJADI ERROR!", error);
    return NextResponse.json({ error: 'Gagal mengambil data kapal.', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log("POST /api/ships: Memulai proses...");
  if (!authenticateRequest(request)) {
    console.log("POST /api/ships: Autentikasi GAGAL.");
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
  }
  console.log("POST /api/ships: Autentikasi BERHASIL.");

  try {
    await dbConnect();
    console.log("POST /api/ships: Koneksi database berhasil.");

    const data = await request.json();
    console.log("POST /api/ships: Mencoba membuat kapal baru dengan data:", data);
    const newShip = await Ship.create(data);
    console.log("POST /api/ships: Kapal baru berhasil dibuat dengan ID:", newShip._id);
    
    return NextResponse.json(newShip, { status: 201 });

  } catch (error) {
    console.error("POST /api/ships: TERJADI ERROR!", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}