// File: src/app/admin/products/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EditProductForm } from '@/components/features/product/EditProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = createClient();

  // Ambil data produk DAN kategori yang terhubung
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (
        category_id
      )
    `)
    .eq('id', params.id)
    .single();

  // Ambil semua kategori yang tersedia
  const { data: categories } = await supabase.from('categories').select('*');

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>
      <EditProductForm product={product} categories={categories || []} />
    </div>
  );
}