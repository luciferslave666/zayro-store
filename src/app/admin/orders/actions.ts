// File: src/app/admin/orders/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: number, newStatus: string) {
  const supabase = createClient();

  // Anda bisa menambahkan pengecekan admin di sini jika perlu

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { error: 'Gagal memperbarui status.' };
  }

  revalidatePath('/admin/orders');
  revalidatePath('/dashboard'); // Revalidasi dasbor pengguna juga
  return { success: 'Status berhasil diperbarui!' };
}