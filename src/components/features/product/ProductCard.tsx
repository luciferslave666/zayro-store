// File: src/components/features/product/ProductCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="flex flex-col h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="h-12">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="relative aspect-square">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            Rp{product.price.toLocaleString('id-ID')}
          </p>
          <Button variant="outline">Lihat Detail</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}