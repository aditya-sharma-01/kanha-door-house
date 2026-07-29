import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kanha Door House | WPVC, UPVC, Aluminium & Flush Doors Jamalpur Bihar',
  description: 'Kanha Door House by Sonu Sharma (Estd 2016). Premier precision machine manufacturer and installer of WPVC doors, UPVC windows, Aluminium doors, and Flush doors in Marwadi Mohalla, Jamalpur, Bihar (GSTIN: 10EOTP5377R1ZR).',
  keywords: 'WPVC Door Jamalpur, UPVC Door Window Munger Bihar, Flush Door Manufacture, Aluminium Window Contractor, Kanha Door House, Sonu Sharma GSTIN 10EOTP5377R1ZR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen antialiased bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
