// File: src/components/features/user/ProfileForm.tsx
"use client";

import { useState } from 'react';
import { updateProfile } from '@/app/dashboard/profile/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Profile = {
    id: string;
    full_name: string | null;
    role: string | null;
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setMessage(result.success);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={profile?.id ? '' : 'Memuat...'} disabled />
        {/* Note: In a real app, you would fetch the user's email here */}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input id="fullName" name="fullName" type="text" defaultValue={profile?.full_name || ''} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && <p className="text-sm text-green-500">{message}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}