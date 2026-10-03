import { supabase } from "@/lib/supabase";
import { Product } from "@/store/useStore";

// Fetch dynamic products from Supabase
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

// Fallback for static generation (build time) if needed
export const products: Product[] = [];
