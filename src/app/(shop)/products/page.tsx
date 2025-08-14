// File: src/app/(shop)/products/page.tsx

import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import { ProductCard } from '@/components/features/product/ProductCard';
import { SearchBar } from '@/components/features/product/SearchBar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ProductsPageProps {
  searchParams?: {
    q?: string;
    category?: string;
  };
}

// Fungsi ini sekarang secara eksplisit akan mengembalikan Promise<Product[]>
async function getProducts({ query, categoryId }: { query: string; categoryId: string; }): Promise<Product[]> {
  const supabase = createClient();
  
  if (categoryId) {
    const { data, error } = await supabase
      .from('product_categories')
      .select('products(*)')
      .eq('category_id', categoryId)
      .ilike('products.name', `%${query}%`);
    
    if (error) {
      console.error("Error fetching products by category:", error.message);
      throw new Error(error.message);
    }
    
    if (!data) return [];
    // Cara yang lebih aman untuk memastikan tipe data
    return data.flatMap(item => item.products).filter((p): p is Product => p !== null);

  } else {
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
    return data || []; // Kembalikan array kosong jika data null
  }
}

async function getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    return data || [];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = searchParams?.q || '';
  const categoryId = searchParams?.category || '';
  
  try {
    const products = await getProducts({ query, categoryId }); // Tidak perlu : Product[] lagi
    const categories = await getCategories();

    return (
      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-3xl font-bold">Semua Produk</h1>
           <SearchBar /> {/* Pastikan SearchBar di-import dan diletakkan di sini */}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-8">
            <Link href="/products">
                <Badge variant={!categoryId ? 'default' : 'outline'}>Semua</Badge>
            </Link>
            {categories.map(category => (
                <Link key={category.id} href={`/products?category=${category.id}&q=${query}`}>
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