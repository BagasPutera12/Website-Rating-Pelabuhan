// src/components/Header.jsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary-blue text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold hover:text-accent-gold transition">
          🚢 Pelabuhan Teluk Bayur
        </Link>
        <div className="space-x-6">
          <Link href="/" className="hover:text-accent-gold transition">Home</Link>
          {/* --- LINK DAFTAR KAPAL DIKEMBALIKAN --- */}
          <Link href="/kapal" className="hover:text-accent-gold transition">Daftar Kapal</Link>
          <a href="#" className="hover:text-accent-gold transition">About Us</a>
        </div>
      </nav>
    </header>
  );
}