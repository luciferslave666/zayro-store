// File: src/app/admin/products/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import { NewProductForm } from '@/components/features/product/NewProductForm';

export default async function NewProductPage() {
  const supabase = createClient();

  // Ambil semua data kategori dari database
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error.message);
    // Anda bisa menampilkan pesan error di sini jika mau
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>
      {/* Kirim data kategori sebagai props ke komponen form */}
      <NewProductForm categories={categories || []} />
    </div>
  );
}