// File: src/app/admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("\n--- MEMERIKSA AKSES ADMIN (DEBUG) ---");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("Hasil: Tidak ada pengguna yang login. Mengalihkan ke /login...");
    redirect('/login');
  }

  console.log(`Pengguna ditemukan: ${user.email} (ID: ${user.id})`);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
      console.error("Error saat mengambil profil:", error.message);
      console.log("Mengalihkan ke / karena ada error saat query.");
      redirect('/');
  }

  if (!profile) {
      console.log("Hasil: Profil TIDAK DITEMUKAN. Mengalihkan ke /...");
      redirect('/');
  }

  console.log(`Profil ditemukan dengan peran: '${profile.role}'`);

  if (profile.role !== 'admin') {
    console.log(`Hasil: Peran BUKAN 'admin'. Mengalihkan ke /...`);
    redirect('/');
  }

  console.log("Hasil: Akses DIIZINKAN. Menampilkan halaman admin.");

  return (
    <div className="flex">
      <nav className="w-64 border-r p-4 min-h-screen">
        <h2 className="font-bold text-lg mb-4">Admin Menu</h2>
        <ul>
          <li><Link href="/admin" className="hover:underline">Dasbor</Link></li>
          <li><Link href="/admin/products" className="hover:underline">Manajemen Produk</Link></li>
          <li><Link href="/admin/orders" className="hover:underline">Lihat Pesanan</Link></li>
        </ul>
      </nav>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
}