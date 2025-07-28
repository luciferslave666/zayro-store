// File: src/app/(shop)/products/[slug]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/features/cart/AddToCartButton';

// --- Tipe Props Halaman Dinamis ---
export interface PageProps {
  params: {
    slug: string;
  };
}

// --- Ambil data produk dari Supabase berdasarkan slug ---
async function getProduct(id: string): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

// --- Halaman Detail Produk ---
export default async function ProductDetailPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const product = await getProduct(params.slug);

  return (
    <div className="container mx-auto my-12 p-4">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Gambar Produk */}
        <div className="relative aspect-square">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Detail Produk */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary mb-6">
            Rp{product.price.toLocaleString('id-ID')}
          </p>
          <p className="text-muted-foreground mb-8">
            Ini adalah deskripsi produk yang luar biasa. Anda akan menyukai kualitas dan desainnya. Dibuat dari bahan terbaik untuk kenyamanan maksimal.
          </p>
          <div className="flex flex-col items-center gap-4">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
