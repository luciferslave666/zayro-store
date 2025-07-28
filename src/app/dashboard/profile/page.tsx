// File: src/app/dashboard/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/features/user/ProfileForm';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Ambil data profil saat ini dari database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun</h1>
      {/* Kirim data profil ke komponen form */}
      <ProfileForm profile={profile} />
    </div>
  );
}