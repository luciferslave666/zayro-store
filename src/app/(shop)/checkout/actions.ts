// File: src/app/(shop)/checkout/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import * as crypto from 'crypto';

export async function createIpaymuPayment() {
  // ... (kode untuk mengambil user dan cartItems) ...
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu.' };
  }

  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { error: "Keranjang Anda kosong." };
  }

  const va = process.env.IPAYMU_VA!;
  const apiKey = process.env.IPAYMU_API_KEY!;
  const url = 'https://sandbox.ipaymu.com/api/v2/payment';

  // ================== LANGKAH DEBUGGING ==================
  console.log("--- MEMERIKSA VARIABEL UNTUK IPAYMU ---");
  console.log("VA yang terbaca:", va);
  console.log("API Key yang terbaca:", apiKey ? '*** DITEMUKAN ***' : '!!! KOSONG !!!');
  console.log("-----------------------------------------");
  // =======================================================

  const products = cartItems.map(item => item.products.name);
  const quantities = cartItems.map(item => item.quantity);
  const prices = cartItems.map(item => item.products.price);

  const body = {
    product: products,
    qty: quantities,
    price: prices,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
    notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ipaymu-notify`,
    referenceId: `zayro-${user.id.substring(0, 5)}-${Date.now()}`,
    buyerName: user.user_metadata?.full_name || user.email,
    buyerEmail: user.email,
  };

  const bodyString = JSON.stringify(body);
  const stringToSign = `POST:${va}:${crypto.createHash('sha256').update(bodyString).digest('hex')}:${apiKey}`;
  const signature = crypto.createHmac('sha256', apiKey).update(stringToSign).digest('hex');
  const timestamp = new Date().toISOString().slice(0, 19) + "Z";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'va': va,
        'signature': signature,
        'timestamp': timestamp,
      },
      body: bodyString,
    });

    const data = await response.json();

    if (data.Status === 200) {
      return { success: true, paymentUrl: data.Data.Url };
    } else {
      console.error("iPaymu Error:", data.Message);
      return { error: data.Message || "Gagal membuat pembayaran." };
    }
  } catch (e: unknown) {
    console.error("Fetch Error:", e.message);
    return { error: "Gagal terhubung ke iPaymu." };
  }
}
