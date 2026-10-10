import { products, categories, type Category } from "@/lib/products";
import ProductosClient from "./ProductosClient";

export const dynamic = "force-dynamic";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; buscar?: string }>;
}) {
  const params = await searchParams;
  const categoria = params.categoria as Category | undefined;
  const buscar = params.buscar;

  return (
    <ProductosClient
      staticProducts={products}
      categoria={categoria}
      buscar={buscar}
      categories={categories}
    />
  );
}