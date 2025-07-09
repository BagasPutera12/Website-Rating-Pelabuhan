// src/app/kapal/[id]/page.js

import Link from 'next/link';

// Fungsi untuk mengambil detail satu kapal
async function getShipDetails(id) {
  const apiUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const res = await fetch(`${apiUrl}/api/ships/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    // Anda bisa Arahkan ke halaman not-found jika perlu
    return null;
  }
  return res.json();
}

export default async function ShipDetailPage({ params }) {
  const data = await getShipDetails(params.id);

  // Jika data tidak ditemukan, tampilkan pesan
  if (!data || !data.ship) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Data Kapal Tidak Ditemukan</h1>
        <Link href="/kapal" className="text-blue-600 hover:underline mt-4 inline-block">&larr; Kembali ke Daftar Kapal</Link>
      </div>
    );
  }

  const { ship, ratings } = data;

  return (
    <div className="bg-white max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl shadow-xl">
      {/* Bagian Header */}
      <div className="text-center mb-6 pb-6 border-b">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-blue">{ship.name}</h1>
        <Link href="/kapal" className="text-secondary-blue hover:underline mt-2 inline-block">&larr; Kembali ke Daftar</Link>
      </div>

      {/* Bagian Konten Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Foto */}
        <div className="md:col-span-1">
          <img 
            src={ship.photo || 'https://placehold.co/600x400?text=Foto+Kapal'}
            alt={`Foto ${ship.name}`}
            className="w-full h-auto rounded-lg shadow-md aspect-video object-cover"
          />
        </div>
        {/* Kolom Kanan: Detail Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">GT / LOA</strong><span className="text-lg">{ship.gtLoa || 'N/A'}</span></div>
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Agen</strong><span className="text-lg">{ship.agen || 'N/A'}</span></div>
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Waktu Labuh</strong><span className="text-lg">{ship.labuh || 'N/A'}</span></div>
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Rencana Sandar</strong><span className="text-lg">{ship.rencanaSandar || 'N/A'}</span></div>
          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Komoditi</strong><span className="text-lg">{ship.komoditi || 'N/A'}</span></div>
          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Asal - Tujuan</strong><span className="text-lg">{ship.asalTujuan || 'N/A'}</span></div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition">
          Pesan Tiket
        </a>
        <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-secondary-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
          Lacak Kapal
        </a>
      </div>

      {/* Bagian Rating (jika ada) */}
      <div className="mt-10 pt-6 border-t">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">Rating Pengguna</h2>
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating._id} className="border-l-4 border-accent-gold pl-4 py-2 bg-gray-50 rounded">
                <p className="font-bold text-lg text-yellow-500">{'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}</p>
                {rating.comment && <p className="text-text-dark mt-1 italic">"{rating.comment}"</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-light">Belum ada penilaian untuk kapal ini.</p>
        )}
      </div>
    </div>
  );
}