// File: src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = createClient();

// Ambil data statistik secara paralel
  const [
    { data: salesData, error: salesError },
    // Tambahkan 'count' saat mengambil data
    { count: productsCount, error: productsError },
    { count: usersCount, error: usersError }
  ] = await Promise.all([
    supabase.from('orders').select('total_price').eq('status', 'success'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ]);

  const totalRevenue = salesData?.reduce((sum, order) => sum + order.total_price, 0) || 0;
  const totalSales = salesData?.length || 0;
  // Gunakan variabel baru
  const totalProducts = productsCount || 0;
  const totalUsers = usersCount || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dasbor Admin</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp{totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Dari {totalSales} penjualan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">Jumlah transaksi berhasil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produk aktif di toko</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total pengguna terdaftar</p>
          </CardContent>
        </Card>
      </div>
      {/* Di sini Anda bisa menambahkan komponen lain seperti grafik penjualan */}
    </div>
  );
}