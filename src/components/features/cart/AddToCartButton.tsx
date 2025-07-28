// File: src/components/features/cart/AddToCartButton.tsx
"use client";

import { Button } from '@/components/ui/button';
import { addToCart } from '@/app/(shop)/cart/actions';
import { useState } from 'react';

interface AddToCartButtonProps {
  productId: number;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    setIsLoading(true);
    setMessage('');
    const result = await addToCart(productId);
    if (result.message) {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000); // Hilangkan pesan setelah 3 detik
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
        <Button size="lg" onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Menambahkan...' : '+ Tambah ke Keranjang'}
        </Button>
        {message && <p className="text-sm text-green-600 text-center">{message}</p>}
    </div>
  );
}