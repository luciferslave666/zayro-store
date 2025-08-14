// File: src/app/dashboard/layout.tsx
import Link from 'next/link';
import { CircleUser, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Kolom Kiri: Sidebar Navigasi */}
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Riwayat Pesanan
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard/profile">
                <CircleUser className="mr-2 h-4 w-4" />
                Pengaturan Akun
              </Link>
            </Button>
                    <div>
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Toko
          </Link>
        </div>
          </nav>
        </aside>

        {/* Kolom Kanan: Konten Halaman */}
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}