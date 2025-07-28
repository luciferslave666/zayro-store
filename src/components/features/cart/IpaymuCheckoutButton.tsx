// File: src/components/features/cart/IpaymuCheckoutButton.tsx
"use client";

import { Button } from '@/components/ui/button';
import { createIpaymuPayment } from '@/app/(shop)/checkout/actions';
import { useState } from 'react';

export function IpaymuCheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');
    const result = await createIpaymuPayment();

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success && result.paymentUrl) {
      // Arahkan pengguna ke halaman pembayaran iPaymu
      window.location.href = result.paymentUrl;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button onClick={handleCheckout} disabled={isLoading} className="w-full mt-6">
        {isLoading ? 'Memproses...' : 'Buat Pesanan'}
      </Button>
      {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
    </div>
  );
}