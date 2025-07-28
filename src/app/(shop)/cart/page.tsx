// File: src/app/(shop)/cart/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/features/cart/CartItem';
import Link from 'next/link';

export default async function CartPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching cart items:", error);
    return <p className="text-center text-red-500">Gagal memuat keranjang.</p>;
  }

  const totalPrice = cartItems.reduce((total, item) => {
    // @ts-ignore
    return total + (item.products.price * item.quantity);
  }, 0);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Keranjang Anda</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Keranjang Anda kosong.</p>
          <Button asChild>
            <Link href="/products">Mulai Belanja</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                // @ts-ignore
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border p-6 rounded-lg sticky top-28">
              <h2 className="text-xl font-bold mb-4">Ringkasan</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                <span>Total</span>
                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
                <Button className="w-full mt-6" asChild>
                <Link href="/checkout">Lanjut ke Checkout</Link>
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}