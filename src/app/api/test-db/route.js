// src/app/api/test-db/route.js

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    return NextResponse.json(
      { status: 'error', message: 'MONGO_URI tidak ditemukan di environment variables.' },
      { status: 500 }
    );
  }

  try {
    console.log("Mencoba menghubungkan ke MongoDB...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 }); // Coba hubungkan dengan timeout 5 detik
    console.log("Koneksi berhasil!");
    
    // Jika berhasil, tutup koneksi dan kirim pesan sukses
    await mongoose.connection.close();

    return NextResponse.json({
      status: 'success',
      message: 'Berhasil terhubung ke MongoDB Atlas!',
    });

  } catch (error) {
    console.error("Koneksi Database GAGAL:", error);
    
    // Jika gagal, kirim kembali pesan error yang detail
    return NextResponse.json(
      {
        status: 'error',
        message: 'Gagal terhubung ke database.',
        // 'error.reason' seringkali berisi detail kenapa koneksi gagal (misal: auth gagal, timeout)
        details: error.message,
        reason: error.reason?.toString() 
      },
      { status: 500 }
    );
  }
}