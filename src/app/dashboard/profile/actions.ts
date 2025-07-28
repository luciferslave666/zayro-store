// File: src/app/dashboard/profile/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login untuk memperbarui profil.' };
  }

  const fullName = formData.get('fullName') as string;

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { error: 'Gagal memperbarui profil.' };
  }

  revalidatePath('/dashboard/profile');
  return { success: 'Profil berhasil diperbarui!' };
}