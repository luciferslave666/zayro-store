// File: src/app/(shop)/checkout/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IpaymuCheckoutButton } from '@/components/features/cart/IpaymuCheckoutButton';

export default async function CheckoutPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', user.id);

  if (!cartItems || cartItems.length === 0) {
    // Jika keranjang kosong, kembalikan ke halaman utama
    redirect('/');
  }

  const totalPrice = cartItems.reduce((total, item) => {
    // @ts-ignore
    return total + (item.products.price * item.quantity);
  }, 0);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Kolom Kiri: Form Pengiriman */}
        <div className="lg:col-span-2">
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Alamat Pengiriman</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" defaultValue={user.user_metadata?.full_name || ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" placeholder="Jalan, nomor rumah, kota..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" type="tel" placeholder="08123456789" />
              </div>
            </div>
          </div>
          <div className="border p-6 rounded-lg mt-8">
            <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
            <div className="p-4 bg-secondary rounded-md text-center">
              <p className="text-muted-foreground">Integrasi pembayaran akan datang!</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="border p-6 rounded-lg sticky top-28">
            <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  {/* @ts-ignore */}
                  <span>{item.products.name} x {item.quantity}</span>
                  {/* @ts-ignore */}
                  <span>Rp{(item.products.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
              <span>Total</span>
              <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <IpaymuCheckoutButton />
          </div>
        </div>

      </div>
    </div>
  );
}