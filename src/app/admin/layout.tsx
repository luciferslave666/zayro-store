// File: src/app/admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ... (logic pengecekan admin tetap sama)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') { redirect('/'); }

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 border-r bg-muted/40 p-4">
        <div className="mb-8 text-center">
          <Link href="/admin">
            <h2 className="font-bold text-xl">Zayro Admin</h2>
          </Link>
        </div>
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <LayoutDashboard className="h-4 w-4" />
              Dasbor
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Package className="h-4 w-4" />
              Manajemen Produk
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <ShoppingCart className="h-4 w-4" />
              Lihat Pesanan
            </Link>
          </li>
          <li>
            <Link href="/admin/customers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Users className="h-4 w-4" />
              Pelanggan
            </Link>
          </li>
        </ul>        <div>
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Toko
          </Link>
        </div>
      </nav>
      <main className="flex-grow p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}