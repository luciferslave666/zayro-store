"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // <-- Gunakan klien baru
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(); // <-- Buat instance klien

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Daftar Akun Baru</h1>
          <p className="text-balance text-muted-foreground">
            Buat akun untuk memulai belanja
          </p>
        </div>
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="anda@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
             <p className="text-xs text-muted-foreground">Password minimal 6 karakter.</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <Button type="submit" className="w-full">
            Daftar
          </Button>
        </form>
         <div className="mt-4 text-center text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}