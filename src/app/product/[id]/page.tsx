import { notFound } from "next/navigation";
import { fetchProducts } from "@/data/products";
import ProductClient from "./ProductClient";

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const products = await fetchProducts();
  const product = products.find(p => p.id === resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  // Pass all products so related products logic still works
  return <ProductClient product={product} allProducts={products} />;
}
