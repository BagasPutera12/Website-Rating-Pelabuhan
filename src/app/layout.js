import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Rating Pelabuhan Teluk Bayur",
  description: "Survei kepuasan dan rating pelayanan di Pelabuhan Teluk Bayur.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen bg-light-blue-bg">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}