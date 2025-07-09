import Link from 'next/link';

// Helper component untuk Bintang
const StarRatingDisplay = ({ rating, size = 'text-2xl' }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);
  return (
    <div className={`${size} text-gray-300`}>
      {[...Array(totalStars)].map((_, index) => (
        <span key={index} className={index < filledStars ? 'text-accent-gold' : 'text-white/40'}>★</span>
      ))}
    </div>
  );
};

// Fungsi untuk mengambil data summary (Server-side)
// Di dalam src/app/page.js
// Di dalam src/app/page.js
// Di dalam src/app/page.js
async function getSummary() {
  try {
    // --- PERBAIKAN ---
    // Vercel menyediakan process.env.VERCEL_URL saat build
    const apiUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'; // Fallback untuk development lokal

    const res = await fetch(`${apiUrl}/api/aspect-ratings/summary`, { 
      next: { revalidate: 60 } // Revalidasi data setiap 60 detik
    });
    // --- AKHIR PERBAIKAN ---

    if (!res.ok) return { overallAverage: 0, aspectAverages: [] };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return { overallAverage: 0, aspectAverages: [] };
  }
}

// Data Aspek bisa kita simpan di sini atau di file terpisah
const ASPECTS = [
    { name: "Keamanan & Keselamatan" }, { name: "Fasilitas" },
    { name: "Kebersihan & Kenyamanan" }, { name: "Informasi & Komunikasi" },
    { name: "Aksesibilitas & Proses" }, { name: "Pelayanan Petugas" }
];

export default async function HomePage() {
  const summary = await getSummary();
  const overallAverage = summary.overallAverage || 0;

  return (
    <>
      {/* Hero Section */}
      <section 
        className="text-white text-center py-20 px-4" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(10, 77, 104, 0.85), rgba(10, 77, 104, 0.85)), url('https://maritimnews.com/wp-content/uploads/2022/11/IMG-20221125-WA0031-1024x576.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Website Rating Pelabuhan Teluk Bayur</h1>
        <p className="max-w-3xl mx-auto mb-6 text-lg opacity-90">
          Pelabuhan Teluk Bayur, yang terletak di Kota Padang, Sumatera Barat, merupakan salah satu pelabuhan tertua di Indonesia dan pintu gerbang utama arus barang ekspor-impor di wilayah barat Sumatera. Dibangun sejak 1893 dan kini dikelola oleh PT Pelindo (Persero), pelabuhan ini telah menerapkan standar pelayanan berbasis ISO 9002. Survei ini disusun berdasarkan Peraturan Menteri Perhubungan Nomor PM 37 Tahun 2015 tentang Indeks Kepuasan Pengguna Jasa, guna mengukur dan meningkatkan kualitas pelayanan pelabuhan secara berkelanjutan.
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block border border-white/20">
          <StarRatingDisplay rating={overallAverage} size="text-4xl" />
          <p className="mt-2 text-lg">
            Rating Keseluruhan: <strong>{overallAverage.toFixed(2)}</strong> dari 5
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-10">Penilaian per Aspek</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ASPECTS.map((aspect) => {
            const aspectData = (summary.aspectAverages || []).find(a => a.aspect === aspect.name);
            const rating = aspectData ? aspectData.averageRating : 0;
            return (
              <div key={aspect.name} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary-blue hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-xl font-bold text-primary-blue mb-3">{aspect.name}</h3>
                <StarRatingDisplay rating={rating} />
                <p className="text-text-light font-semibold mt-1">({rating.toFixed(2)})</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <section className="mt-20 text-center bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-primary-blue">Bantu Kami Menjadi Lebih Baik</h2>
          <p className="max-w-2xl mx-auto my-4 text-text-dark">Ikuti survei kepuasan lengkap untuk semua aspek pelayanan melalui tombol di bawah ini.</p>
          <Link href="/survei-lengkap" className="inline-block bg-accent-gold text-primary-blue font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-all duration-300 text-lg shadow-md hover:shadow-lg">
            Mulai Isi Survei
          </Link>
        </section>
      </div>
    </>
  );
}