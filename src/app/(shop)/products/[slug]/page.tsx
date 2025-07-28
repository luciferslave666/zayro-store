// File: src/app/(shop)/products/[slug]/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/components/features/cart/AddToCartButton';

// Mendefinisikan tipe untuk props yang diterima halaman ini
interface ProductDetailPageProps {
  params: {
    slug: string; // 'slug' ini sesuai dengan nama folder dinamis: [slug]
  };
}

// Fungsi untuk mengambil satu produk spesifik dari Supabase dengan debugging
async function getProduct(id: string) {
  // 1. Log saat fungsi dipanggil
  console.log(`--- Mencoba mengambil produk dengan ID: ${id} ---`);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id) // Mencari produk yang ID-nya cocok dengan yang ada di URL
    .single();   // Mengharapkan hanya satu hasil

  // 2. Log jika ada error dari Supabase
  if (error) {
    console.error('ERROR DARI SUPABASE:', error.message);
    notFound();
  }

  // 3. Log jika data tidak ditemukan
  if (!data) {
    console.log(`HASIL: Data tidak ditemukan untuk ID: ${id}. Memicu notFound().`);
    notFound();
  }

  // 4. Log jika data berhasil ditemukan
  console.log('HASIL: Produk ditemukan:', data);
  return data;
}

// Komponen Halaman
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product: Product = await getProduct(params.slug);

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