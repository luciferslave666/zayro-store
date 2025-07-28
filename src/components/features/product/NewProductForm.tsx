// File: src/components/features/product/NewProductForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { addProduct } from '@/app/admin/products/actions';

type Category = {
  id: number;
  name: string;
}

export function NewProductForm({ categories }: { categories: Category[] }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await addProduct(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/admin/products');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input id="name" name="name" type="text" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Harga</Label>
        <Input id="price" name="price" type="number" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input id="imageUrl" name="image_url" type="url" required />
      </div>
      <div className="grid gap-2">
        <Label>Kategori</Label>
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
            {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox id={`category-${category.id}`} name="category_ids" value={String(category.id)} />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
            ))}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
      </Button>
    </form>
  );
}