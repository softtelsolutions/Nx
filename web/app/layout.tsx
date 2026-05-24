import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Retail Store | E-commerce',
  description: 'Modern shopping experience built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Retail Store Inc. All rights reserved.
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}