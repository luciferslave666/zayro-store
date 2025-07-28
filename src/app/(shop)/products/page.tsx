// File: src/app/(shop)/products/page.tsx

import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import { ProductCard } from '@/components/features/product/ProductCard';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ProductsPageProps {
  searchParams?: {
    q?: string;
    category?: string;
  };
}

// Fungsi ini sekarang menerima parameter 'query' dan 'categoryId'
async function getProducts({ query, categoryId }: { query: string; categoryId: string; }) {
  const supabase = createClient();
  
  if (categoryId) {
    // Jika ada filter kategori, lakukan JOIN
    const { data, error } = await supabase
      .from('product_categories')
      .select('products(*)') // Ambil semua data dari tabel products yang terhubung
      .eq('category_id', categoryId)
      .ilike('products.name', `%${query}%`); // Terapkan search di dalam JOIN
    
    if (error) {
      console.error("Error fetching products by category:", error.message);
      throw new Error(error.message);
    }
    // Ubah struktur data agar sesuai
    return data.map(item => item.products) as Product[];
  } else {
    // Jika tidak ada filter kategori, lakukan query biasa
    let queryBuilder = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    const { data, error } = await queryBuilder;
    if (error) {
      console.error("Error fetching products:", error.message);
      throw new Error(error.message);
    }
    return data;
  }
}

// Fungsi untuk mengambil semua kategori
async function getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    return data;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = searchParams?.q || '';
  const categoryId = searchParams?.category || '';
  
  try {
    const products: Product[] = await getProducts({ query, categoryId });
    const categories = await getCategories();

    return (
      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-3xl font-bold">Semua Produk</h1>
        </div>
        
        {/* Tampilkan Filter Kategori di Sini */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
            <Link href="/products">
                <Badge variant={!categoryId ? 'default' : 'outline'}>Semua</Badge>
            </Link>
            {categories.map(category => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                    <Badge variant={categoryId === String(category.id) ? 'default' : 'outline'}>
                        {category.name}
                    </Badge>
                </Link>
            ))}
        </div>
        
        {products.length === 0 ? (
          <p className="text-center mt-12 text-muted-foreground">
            Produk tidak ditemukan.
          </p>
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
    return <p className="text-center text-red-500">Gagal memuat produk.</p>;
  }
}