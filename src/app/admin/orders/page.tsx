// File: src/app/admin/orders/page.tsx
import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export default async function AdminOrdersPage() {
  const supabase = createClient();

  // Ambil data pesanan dan gabungkan (join) dengan data email dari tabel profiles
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Gagal memuat pesanan: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Semua Pesanan</h1>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Email Pelanggan</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.reference_id}</TableCell>
                {/* @ts-ignore */}
                <TableCell>{order.profiles?.email || 'N/A'}</TableCell>
                <TableCell>Rp{order.total_price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'success' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}