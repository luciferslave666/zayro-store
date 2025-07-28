'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- AKSI UNTUK MENAMBAH PRODUK BARU ---
export async function addProduct(formData: FormData) {
  const supabase = createClient();

  const productData = {
    name: formData.get('name') as string,
    price: Number(formData.get('price')),
    image_url: formData.get('image_url') as string,
  };

  // 1. Masukkan data produk baru dan ambil ID-nya
  const { data: newProduct, error: productError } = await supabase
    .from('products')
    .insert(productData)
    .select('id')
    .single();

  if (productError || !newProduct) {
    console.error('Error adding product:', productError);
    return { error: 'Gagal menambahkan produk.' };
  }
  
  // 2. Siapkan dan masukkan data kategori yang dipilih
  const categoryIds = formData.getAll('category_ids');
  if (categoryIds && categoryIds.length > 0) {
    const productCategories = categoryIds.map(catId => ({
      product_id: newProduct.id,
      category_id: Number(catId),
    }));

    const { error: categoryError } = await supabase
      .from('product_categories')
      .insert(productCategories);
    
    if (categoryError) {
      console.error('Error adding product categories:', categoryError);
      return { error: 'Gagal menambahkan kategori produk.' };
    }
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// --- AKSI UNTUK MEMPERBARUI PRODUK ---
export async function updateProduct(productId: number, formData: FormData) {
  const supabase = createClient();

  const productData = {
    name: formData.get('name') as string,
    price: Number(formData.get('price')),
    image_url: formData.get('image_url') as string,
  };

  // 1. Update detail produk dasar
  const { error: productError } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId);
  
  if (productError) {
    console.error('Error updating product:', productError);
    return { error: 'Gagal memperbarui produk.' };
  }

  // 2. Hapus semua relasi kategori yang ada untuk produk ini
  const { error: deleteCatError } = await supabase
    .from('product_categories')
    .delete()
    .eq('product_id', productId);

  if (deleteCatError) {
    console.error('Error deleting old categories:', deleteCatError);
    return { error: 'Gagal memperbarui kategori produk.' };
  }

  // 3. Masukkan relasi kategori yang baru
  const categoryIds = formData.getAll('category_ids');
  if (categoryIds && categoryIds.length > 0) {
    const productCategories = categoryIds.map(catId => ({
      product_id: productId,
      category_id: Number(catId),
    }));

    const { error: insertCatError } = await supabase
      .from('product_categories')
      .insert(productCategories);

    if (insertCatError) {
      console.error('Error inserting new categories:', insertCatError);
      return { error: 'Gagal memperbarui kategori produk.' };
    }
  }
  
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect('/admin/products');
}


// --- AKSI UNTUK MENGHAPUS PRODUK ---
export async function deleteProduct(productId: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { error: 'Gagal menghapus produk.' };
  }

  revalidatePath('/admin/products');
  return { success: 'Produk berhasil dihapus.' };
}