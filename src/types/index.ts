// src/types/index.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  created_at: string; // Supabase otomatis menambahkan ini
};