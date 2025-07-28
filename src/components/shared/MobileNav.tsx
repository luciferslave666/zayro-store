"use client";

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink } from './NavLink';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Buka Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="text-left mb-8">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <span onClick={() => setIsOpen(false)} className="text-lg">
            <NavLink href="/products">Produk</NavLink>
          </span>
          <span onClick={() => setIsOpen(false)} className="text-lg">
            <NavLink href="/about">Tentang Kami</NavLink>
          </span>
          <span onClick={() => setIsOpen(false)} className="text-lg">
            <NavLink href="/contact">Kontak</NavLink>
          </span>
        </div>
      </SheetContent>
    </Sheet>
  );
}