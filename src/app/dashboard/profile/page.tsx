// File: src/app/dashboard/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/features/user/ProfileForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Akun</CardTitle>
        <CardDescription>
          Perbarui informasi pribadi Anda di sini.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm profile={profile} />
      </CardContent>
    </Card>
  );
}