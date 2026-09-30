import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = products.find(p => p.id === resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
