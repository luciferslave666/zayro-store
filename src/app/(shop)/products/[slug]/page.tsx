// File: src/app/(shop)/products/[slug]/page.tsx

import { createClient } from '@/lib/supabase/server'; // <-- Gunakan client server yang benar
import { Product } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/components/features/cart/AddToCartButton';

// Fungsi untuk mengambil data diletakkan di luar komponen
async function getProduct(id: string): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound(); // Jika produk tidak ditemukan, tampilkan halaman 404
  }
  return data;
}

// Hanya ada SATU export default untuk komponen halaman
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  return (
    <div className="container mx-auto my-12 p-4">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Kolom untuk Gambar Produk */}
        <div className="relative aspect-square">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Kolom untuk Detail dan Aksi */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <p className="text-3xl font-semibold text-primary mb-6">
            Rp{product.price.toLocaleString('id-ID')}
          </p>
          
          <p className="text-muted-foreground mb-8">
            Ini adalah deskripsi produk yang luar biasa. Anda akan menyukai kualitas dan desainnya. Dibuat dari bahan terbaik untuk kenyamanan maksimal dan gaya yang tak lekang oleh waktu.
          </p>
          
          <div className="flex items-center gap-4">
            <AddToCartButton productId={product.id} />
            <Button size="lg" variant="outline">
              Beli Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
