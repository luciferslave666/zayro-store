// File: src/components/features/cart/CartItem.tsx
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { removeCartItem, updateCartItemQuantity } from '@/app/(shop)/cart/actions';
import { useTransition } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

// Definisikan tipe data untuk props
type CartItemProps = {
  item: {
    id: number;
    quantity: number;
    products: {
      id: number;
      name: string;
      price: number;
      image_url: string;
    };
  };
};

export function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (newQuantity: number) => {
    startTransition(() => {
      updateCartItemQuantity(item.id, newQuantity);
    });
  };

  const handleRemoveItem = () => {
    startTransition(() => {
      removeCartItem(item.id);
    });
  };

  return (
    <div className="flex items-center gap-4 border p-4 rounded-lg">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover rounded-md" />
      </div>
      <div className="flex-grow">
        <h2 className="font-semibold">{item.products.name}</h2>
        <p className="text-muted-foreground">Rp{item.products.price.toLocaleString('id-ID')}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isPending}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-bold w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-600"
        onClick={handleRemoveItem}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}