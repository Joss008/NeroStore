"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function ProductsList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-scene-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-3xl">
          📦
        </div>
        <p className="text-white/40 mb-2">No se encontraron productos.</p>
        <p className="text-white/30 text-xs">Intenta con otra búsqueda o categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const currency = useCurrency();
  const [added, setAdded] = useState(false);
  const price = product.prices[currency];
  const originalPrice = product.originalPrices?.[currency];
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  const hasPhysical = !!product.physicalPrices && Object.values(product.physicalPrices).some((v) => typeof v === "number" && v > 0);
  const physicalPrice = hasPhysical ? product.physicalPrices![currency] : undefined;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      price,
      currency,
      mode: "permanente",
      image: product.gradient,
      category: product.category,
      notes: "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const rarityClass = `rarity-${product.rarity.toLowerCase()}`;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className={`group relative bg-scene-900 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300 ${
        !product.inStock ? "opacity-60" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage product={product} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5">
          <span
            className={`text-[9px] sm:text-[10px] font-medium tracking-wider uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border backdrop-blur-sm ${rarityClass}`}
          >
            {product.rarity}
          </span>
          {hasPhysical && (
            <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-scene-950/80 text-white/80 border border-white/10 backdrop-blur-sm">
              Perm. · Físico
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-wider uppercase">
              Agotado
            </span>
          </div>
        )}

        {product.inStock && (
          <button
            onClick={handleAdd}
            className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              added
                ? "bg-green-500 text-white scale-110"
                : "bg-accent text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 glow-red"
            }`}
            aria-label="Agregar al carrito"
          >
            {added ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3
          className="text-white text-xs xs:text-sm sm:text-base font-semibold leading-tight mb-1 line-clamp-1"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {product.name}
        </h3>
        <p className="text-white/40 text-[11px] sm:text-xs line-clamp-1 mb-2 sm:mb-3 hidden xs:block">
          {product.shortDescription}
        </p>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-accent font-bold text-sm xs:text-base sm:text-lg">
              {formatCurrency(price, currency)}
            </span>
            {hasDiscount && (
              <span className="text-white/30 text-[10px] xs:text-xs line-through">
                {formatCurrency(originalPrice!, currency)}
              </span>
            )}
          </div>
          {hasPhysical && physicalPrice && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-white/40">Físico desde</span>
              <span className="text-orange-400 font-medium">{formatCurrency(physicalPrice, currency)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}