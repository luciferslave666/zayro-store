// File: src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return <p className="text-center text-red-500">Gagal memuat riwayat pesanan.</p>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Dasbor Anda</h1>
      <h2 className="text-xl font-semibold mb-4">Riwayat Pesanan</h2>

      {orders.length === 0 ? (
        <div className="text-center border-2 border-dashed rounded-lg p-12">
          <p className="text-muted-foreground mb-4">Anda belum memiliki pesanan.</p>
          <Button asChild>
            <Link href="/products">Mulai Belanja</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">Order ID: <span className="font-mono text-sm">{order.reference_id}</span></p>
                <p className="text-sm text-muted-foreground">
                  Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}
                </p>
                <p className="font-bold mt-2">
                  Total: Rp{order.total_price.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <Badge variant={order.status === 'success' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}