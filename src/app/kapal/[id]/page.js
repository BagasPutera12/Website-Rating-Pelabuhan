// src/app/kapal/[id]/page.js (FINAL DENGAN PERBAIKAN ESLINT)

import Link from 'next/link';

// Di dalam src/app/kapal/[id]/page.js
// Di dalam src/app/kapal/[id]/page.js
async function getShipDetails(id) {
  try {
    const res = await fetch(`/api/ships/${id}`, { 
      next: { revalidate: 10 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ship ${id}:`, error);
    return null;
  }
}

export default async function ShipDetailPage({ params }) {
  const data = await getShipDetails(params.id);

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
      <div className="text-center mb-6 pb-6 border-b">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-blue">{ship.name}</h1>
        <Link href="/kapal" className="text-secondary-blue hover:underline mt-2 inline-block">&larr; Kembali ke Daftar</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img 
            src={ship.photo || 'https://placehold.co/600x400?text=Foto+Kapal'}
            alt={`Foto ${ship.name}`}
            className="w-full h-auto rounded-lg shadow-md aspect-video object-cover"
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">GT / LOA</strong><span className="text-lg">{ship.gtLoa || 'N/A'}</span></div>
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Agen</strong><span className="text-lg">{ship.agen || 'N/A'}</span></div>
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Waktu Labuh</strong><span className="text-lg">{ship.labuh || 'N/A'}</span></div>
          <div className="bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Rencana Sandar</strong><span className="text-lg">{ship.rencanaSandar || 'N/A'}</span></div>
          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Komoditi</strong><span className="text-lg">{ship.komoditi || 'N/A'}</span></div>
          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg"><strong className="block text-sm text-text-light">Asal - Tujuan</strong><span className="text-lg">{ship.asalTujuan || 'N/A'}</span></div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition">
          Pesan Tiket
        </a>
        <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-secondary-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
          Lacak Kapal
        </a>
      </div>

      <div className="mt-10 pt-6 border-t">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">Rating Pengguna</h2>
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating._id} className="border-l-4 border-accent-gold pl-4 py-2 bg-gray-50 rounded">
                <p className="font-bold text-lg text-yellow-500">{'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}</p>
                {/* --- BAGIAN YANG DIPERBAIKI --- */}
                {/* Kita tidak lagi menggunakan kutip ganda secara langsung */}
                {rating.comment && <p className="text-text-dark mt-1 italic">&ldquo;{rating.comment}&rdquo;</p>}
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