// File: src/components/features/product/EditProductForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/types';
import { updateProduct } from '@/app/admin/products/actions';
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from '@/lib/supabase/client';

type Category = {
  id: number;
  name: string;
}

interface EditProductFormProps {
  product: Product & { product_categories: { category_id: number }[] };
  categories: Category[];
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const productCategoryIds = new Set(product.product_categories.map(pc => pc.category_id));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await updateProduct(product.id, formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input id="name" name="name" type="text" required defaultValue={product.name} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Harga</Label>
        <Input id="price" name="price" type="number" required defaultValue={product.price} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input id="imageUrl" name="image_url" type="url" required defaultValue={product.image_url} />
      </div>
      <div className="grid gap-2">
        <Label>Kategori</Label>
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                name="category_ids"
                value={String(category.id)}
                defaultChecked={productCategoryIds.has(category.id)}
              />
              <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Menyimpan...' : 'Update Produk'}
      </Button>
    </form>
  );
}