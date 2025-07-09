// src/app/kapal/page.js

import Link from 'next/link';

// Fungsi untuk mengambil daftar kapal dari API
// Di dalam src/app/kapal/page.js
// Di dalam src/app/kapal/page.js
// Di dalam src/app/kapal/page.js
async function getShips() {
  try {
    const apiUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${apiUrl}/api/ships`, { 
      next: { revalidate: 60 } 
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch ships:", error);
    return [];
  }
}

export default async function ShipListPage() {
  const ships = await getShips();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10 pb-5 border-b">
        <h1 className="text-4xl font-extrabold text-primary-blue">Daftar Aktivitas Kapal</h1>
        <p className="text-lg text-text-light mt-2">Informasi Kapal di Area Pelabuhan Teluk Bayur</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ships.length > 0 ? (
          ships.map((ship) => (
            <Link 
              href={`/kapal/${ship._id}`} 
              key={ship._id} 
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-secondary-blue hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 block"
            >
              <h3 className="text-xl font-bold text-primary-blue mb-2 truncate">{ship.name}</h3>
              <p className="text-text-dark"><strong>Agen:</strong> {ship.agen || 'N/A'}</p>
              <p className="text-text-light"><strong>Status:</strong> {ship.rencanaSandar || 'N/A'}</p>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Belum ada data kapal yang tersedia.</p>
        )}
      </div>
    </div>
  );
}