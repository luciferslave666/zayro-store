// File: src/components/shared/Navbar.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { SearchBar } from '@/components/features/product/SearchBar';
import { UserNav } from './UserNav';
import { MobileNav } from './MobileNav';
import { NavLink } from './NavLink';

export async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let cartCount = 0;
  let userRole = 'user';

  if (user) {
    const { count } = await supabase.from('cart_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    cartCount = count ?? 0;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile) { userRole = profile.role; }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        {/* Grup Kiri: Hamburger (Mobile) & Logo */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Zayro</span>
          </Link>
        </div>

        {/* Grup Tengah: Navigasi & Search (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLink href="/products">Produk</NavLink>
            <NavLink href="/about">Tentang Kami</NavLink>
            <NavLink href="/contact">Kontak</NavLink>
          </nav>
          <div className="w-full max-w-xs">
            <SearchBar />
          </div>
        </div>

        {/* Grup Kanan: Ikon Aksi */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <UserNav user={user} userRole={userRole} />
        </div>

      </div>
    </header>
  );
}