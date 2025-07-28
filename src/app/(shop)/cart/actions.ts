// File: src/app/(shop)/cart/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addToCart(productId: number) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Jika tidak ada user, arahkan ke halaman login
    return redirect('/login');
  }

  // Cek apakah item sudah ada di keranjang
  const { data: existingItem, error: existingError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existingError && existingError.code !== 'PGRST116') {
    // Abaikan error 'PGRST116' (no rows found), tapi tampilkan error lain
    console.error('Error checking for existing item:', existingError);
    return { success: false, message: 'Gagal memeriksa keranjang.' };
  }

  if (existingItem) {
    // Jika item sudah ada, tambah kuantitasnya
    const newQuantity = existingItem.quantity + 1;
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id);

    if (updateError) {
      console.error('Error updating quantity:', updateError);
      return { success: false, message: 'Gagal memperbarui kuantitas.' };
    }
  } else {
    // Jika item belum ada, tambahkan item baru
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: productId, quantity: 1 });

    if (insertError) {
      console.error('Error adding to cart:', insertError);
      return { success: false, message: 'Gagal menambahkan ke keranjang.' };
    }
  }

  // Revalidasi path untuk memperbarui UI (misal: ikon keranjang di navbar)
  revalidatePath('/');
  revalidatePath(`/products/${productId}`);

  return { success: true, message: 'Berhasil ditambahkan ke keranjang!' };
}

export async function updateCartItemQuantity(itemId: number, newQuantity: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Anda harus login.' };

  if (newQuantity <= 0) {
    // Jika kuantitas 0 atau kurang, hapus item
    return await removeCartItem(itemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity: newQuantity })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    console.error("Error updating quantity:", error);
    return { error: 'Gagal memperbarui kuantitas.' };
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function removeCartItem(itemId: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Anda harus login.' };

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    console.error("Error removing item:", error);
    return { error: 'Gagal menghapus item.' };
  }

  revalidatePath('/cart');
  return { success: true };
}