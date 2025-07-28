// File: src/app/contact/actions.ts
'use server';

import { Resend } from 'resend';

export async function sendContactMessage(formData: FormData) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'Semua kolom harus diisi.' };
  }

  try {
    await resend.emails.send({
      from: 'Zayro Contact Form <onboarding@resend.dev>',
      to: 'luciferslave04@gmail.com', // Ganti dengan email Anda
      subject: `Pesan Baru dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
      headers: {
        'Reply-To': email, // <-- PERBAIKAN DI SINI
      },
    });
    return { success: 'Pesan Anda telah berhasil terkirim!' };
  } catch (error) {
    console.error("Resend error:", error);
    return { error: 'Gagal mengirim pesan.' };
  }
}