// File: src/app/admin/products/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { DeleteProductButton } from '@/components/features/product/DeleteProductButton';

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Gagal memuat produk: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Produk Baru
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono">{product.id}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>Rp{product.price.toLocaleString('id-ID')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild className="mr-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteProductButton productId={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}