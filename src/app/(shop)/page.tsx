// File: src/app/(shop)/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import { ProductCard } from '@/components/features/product/ProductCard';

// Fungsi untuk mengambil semua data produk dari Supabase
async function getProducts() {
  console.log("--- Mencoba mengambil semua produk ---");
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Jika ada error dari Supabase, lemparkan error tersebut
  if (error) {
    console.error("Error dari Supabase saat select products:", error.message);
    throw new Error(error.message);
  }

  console.log("--- Berhasil mengambil produk ---");
  return data;
}

export default async function HomePage() {
  try {
    const products: Product[] = await getProducts();

    return (
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Produk Terbaru
        </h1>
        
        {products.length === 0 ? (
          <p className="text-center">Tidak ada produk untuk ditampilkan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    );
  } catch (error) {
    // Jika terjadi error saat mengambil data, tampilkan pesan ini di halaman
    // dan log error lengkap di terminal.
    console.error("ERROR FATAL SAAT MERENDER HALAMAN UTAMA:", error);
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h1>
        <p>Tidak dapat memuat data produk. Silakan periksa log di terminal.</p>
      </div>
    );
  }
}