// File: src/app/contact/page.tsx
"use client";

import { useState } from 'react';
import { sendContactMessage } from './actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [status, setStatus] = useState({ success: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ success: '', error: '' });

    const formData = new FormData(event.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.error) {
      setStatus({ success: '', error: result.error });
    } else if (result.success) {
      setStatus({ error: '', success: result.success });
      (event.target as HTMLFormElement).reset(); // Kosongkan form setelah sukses
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Hubungi Kami</h1>
      <p className="mb-6">Punya pertanyaan atau ingin kerja sama? Hubungi kami melalui form di bawah ini atau langsung lewat kontak berikut:</p>

      <ul className="mb-6 space-y-2">
        <li><strong>Email:</strong> support@zayro.com</li>
        <li><strong>WhatsApp:</strong> 0812-3456-7890</li>
        <li><strong>Instagram:</strong> @zayro.store</li>
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" name="name" type="text" placeholder="Nama Anda" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Email Anda" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Pesan</Label>
          <Textarea id="message" name="message" placeholder="Pesan Anda" rows={4} required />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
        </Button>

        {status.success && <p className="text-green-600">{status.success}</p>}
        {status.error && <p className="text-red-600">{status.error}</p>}
      </form>
    </div>
  );
}