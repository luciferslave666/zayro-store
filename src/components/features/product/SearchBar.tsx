// File: src/components/features/product/SearchBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // Ganti URL tanpa me-reload halaman, Next.js akan otomatis render ulang
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Jeda 300ms setelah user berhenti mengetik

return (
  <div className="w-full mt-4">
    <Input
      type="text"
      placeholder="Cari produk..."
      className="w-full max-w-md md:max-w-xl lg:max-w-2xl mb-5"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('q')?.toString()}
    />
  </div>
);
}