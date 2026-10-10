"use client";

import { useMemo } from "react";
import Link from "next/link";
import { products as allStaticProducts, type Product } from "@/lib/products";
import { useMergedProducts } from "@/lib/useProducts";
import { formatCurrency } from "@/lib/format";
import { useCurrency } from "@/lib/currency";
import ProductImage from "@/components/ProductImage";

interface Props {
  products: Product[];
  type?: "offers" | "popular" | "newArrivals" | "custom";
}

export default function FeaturedProducts({ products: initialProducts, type = "custom" }: Props) {
  const { products: mergedProducts, loaded } = useMergedProducts(allStaticProducts);
  const currency = useCurrency();

  const displayProducts = useMemo(() => {
    if (!loaded) return initialProducts;

    if (type === "offers") {
      const discounted = mergedProducts.filter(
        (p) => p.originalPrices && Object.values(p.originalPrices).some((v) => typeof v === "number" && v > 0)
      );
      return discounted.slice(0, 8);
    }

    if (type === "popular") {
      const popular = mergedProducts.filter((p) => p.popular);
      const discounted = mergedProducts.filter(
        (p) => p.originalPrices && Object.values(p.originalPrices).some((v) => typeof v === "number" && v > 0)
      );
      const combined = [...popular, ...discounted];
      const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
      return unique.slice(0, 8);
    }

    if (type === "newArrivals") {
      return [...mergedProducts].slice(-8).reverse();
    }

    // Por defecto: mapea los productos iniciales a su versión actualizada en tiempo real
    const mergedMap = new Map(mergedProducts.map((p) => [p.id, p]));
    return initialProducts
      .filter((p) => mergedMap.has(p.id))
      .map((p) => mergedMap.get(p.id)!);
  }, [loaded, mergedProducts, initialProducts, type]);

  if (displayProducts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {displayProducts.map((product) => {
        const price = product.prices[currency];
        const originalPrice = product.originalPrices?.[currency];
        const hasDiscount = originalPrice && originalPrice > price;
        const discount = hasDiscount
          ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
          : 0;

        return (
          <Link
            key={product.id}
            href={`/productos/${product.slug}`}
            className="group relative bg-scene-800 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden">
              <ProductImage product={product} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {hasDiscount && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <span className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-500 text-white">
                    -{discount}%
                  </span>
                </div>
              )}

              {product.popular && !hasDiscount && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-accent text-white glow-red">
                    Popular
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4">
              <h3
                className="text-white text-xs xs:text-sm sm:text-base font-semibold leading-tight mb-1 line-clamp-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-accent font-bold text-xs xs:text-sm sm:text-base">
                  {formatCurrency(price, currency)}
                </span>
                {hasDiscount && (
                  <span className="text-white/30 text-[10px] xs:text-[11px] line-through">
                    {formatCurrency(originalPrice!, currency)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
