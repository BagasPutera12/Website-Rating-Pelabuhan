export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-text-dark text-gray-300 py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h4 className="font-bold text-lg mb-3 text-white">Tentang Kami</h4>
          <p className="text-sm">Platform rating untuk meningkatkan kualitas layanan di Pelabuhan Teluk Bayur.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-3 text-white">Kontak</h4>
          <p className="text-sm">Email: kontak@pelabuhan-kita.com</p>
          <p className="text-sm">Telepon: (021) 123-4567</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-3 text-white">Media Sosial</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-secondary-blue transition">Facebook</a>
            <a href="#" className="hover:text-secondary-blue transition">Instagram</a>
            <a href="#" className="hover:text-secondary-blue transition">Twitter</a>
          </div>
        </div>
      </div>
      <div className="text-center text-text-light text-sm mt-8 border-t border-gray-700 pt-6">
        <p>&copy; {currentYear} Pelabuhan Kita. All rights reserved.</p>
      </div>
    </footer>
  );
}