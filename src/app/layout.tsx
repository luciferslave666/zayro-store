// File: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zayro Store',
  description: 'Toko online modern dibuat dengan Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Tag <body> ini sekarang lebih sederhana,
        tanpa Navbar dan Footer secara langsung.
      */}
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        {children}
      </body>
    </html>
  );
}