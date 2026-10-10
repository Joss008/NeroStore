"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products as staticProducts, getRelated, type Product, type Currency } from "@/lib/products";
import { useMergedProducts } from "@/lib/useProducts";
import { useCurrency } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "@/components/ProductImage";
import type { ProductMode } from "@/lib/cart";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { products, loaded } = useMergedProducts(staticProducts);
  const currency = useCurrency();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const hasPhysical = useMemo(() => {
    if (!product?.physicalPrices) return false;
    return Object.values(product.physicalPrices).some((v) => typeof v === "number" && v > 0);
  }, [product]);

  const [mode, setMode] = useState<ProductMode>("permanente");

  useEffect(() => {
    if (!loaded) return;
    const found = products.find((p) => p.slug === slug);
    setProduct(found);
    setMode("permanente");
  }, [products, loaded, slug]);

  if (!loaded || !product) {
    return (
      <div className="min-h-screen bg-scene-950 flex items-center justify-center">
        <div className="text-white/40 text-sm">
          {!loaded ? "Cargando..." : "Producto no encontrado"}
        </div>
        {loaded && !product && (
          <Link href="/productos" className="ml-3 text-accent text-sm hover:underline">
            Volver al catálogo
          </Link>
        )}
      </div>
    );
  }

  const isFruit = product.category.endsWith("Fruits");
  const permanentPrice = product.prices[currency];
  const physicalPrice = product.physicalPrices?.[currency];

  const selectedPrice = mode === "permanente" || !physicalPrice ? permanentPrice : physicalPrice;

  const hasDiscount = product.originalPrices && product.originalPrices[currency] && product.originalPrices[currency]! > selectedPrice;
  const originalPrice = product.originalPrices?.[currency];
  const discount = hasDiscount
    ? Math.round(((originalPrice! - selectedPrice) / originalPrice!) * 100)
    : 0;

  const related = getRelated(product.id, 4);
  const rarityClass = `rarity-${product.rarity.toLowerCase()}`;

  return (
    <div className="min-h-screen bg-scene-950 bg-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-white/40">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-accent transition-colors">Catálogo</Link>
          <span>/</span>
          <Link
            href={`/productos?categoria=${encodeURIComponent(product.category)}`}
            className="hover:text-accent transition-colors truncate max-w-[120px] sm:max-w-none"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white/60 truncate">{product.name}</span>
        </nav>
      </div>

      <section className="pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 glow-red">
                <ProductImage product={product} size="xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                {hasDiscount && (
                  <div className="absolute top-4 right-4">
                    <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-red-500 text-white">
                      -{discount}%
                    </span>
                  </div>
                )}

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl tracking-wider uppercase">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center"
                    style={{ background: product.gradient, opacity: 0.6 + i * 0.1 }}
                  >
                    <span className="text-3xl">{product.emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`text-[10px] font-medium tracking-wider uppercase px-3 py-1 rounded-full border ${rarityClass}`}
                >
                  {product.rarity}
                </span>
                <span className="text-[10px] font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {product.category}
                </span>
                {product.popular && (
                  <span className="text-[10px] font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                    🔥 Popular
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-4"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-3 text-xs">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-white/60">4.9</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60">+500 vendidos</span>
              </div>

              {/* Mode selector for fruits */}
              {isFruit && hasPhysical && physicalPrice ? (
                <div className="mb-4 bg-scene-900 border border-white/10 rounded-xl p-1 inline-flex">
                  <button
                    type="button"
                    onClick={() => setMode("permanente")}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      mode === "permanente"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    ♾️ Permanente
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("fisico")}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      mode === "fisico"
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    🕐 Físico
                  </button>
                </div>
              ) : null}

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-bold text-accent glow-text">
                  {formatCurrency(selectedPrice, currency)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-white/30 line-through">
                    {formatCurrency(originalPrice!, currency)}
                  </span>
                )}
              </div>

              {/* Show both prices if available */}
              {isFruit && hasPhysical && physicalPrice ? (
                <div className="mb-6 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Permanente:</span>
                    <span className="text-white font-medium">{formatCurrency(permanentPrice, currency)}</span>
                    <span className="text-white/30">(queda en tu cuenta para siempre)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>Físico:</span>
                    <span className="text-white font-medium">{formatCurrency(physicalPrice, currency)}</span>
                    <span className="text-white/30">(temporal, vía trade)</span>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-xs mb-6">
                  Precio en {currency}. Pago por métodos acordados.
                </p>
              )}

              <div className="bg-scene-900 border border-white/5 rounded-xl p-4 mb-6">
                <p className="text-white/70 leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-medium tracking-wider uppercase text-accent mb-3">
                    Características
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-scene-900 border border-white/5 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-white text-xs font-semibold">Soporte directo</p>
                    <p className="text-white/40 text-[10px]">Por WhatsApp</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                {product.inStock ? (
                  <AddToCartButton
                    productId={product.id}
                    productName={product.name}
                    slug={product.slug}
                    price={selectedPrice}
                    currency={currency}
                    mode={mode}
                    image={product.gradient}
                    category={product.category}
                  />
                ) : (
                  <div className="bg-scene-900 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-white/60 text-sm">
                      Este producto está agotado temporalmente.
                    </p>
                    <Link
                      href="/productos"
                      className="inline-block mt-3 text-accent text-sm hover:text-accent-light"
                    >
                      Ver productos similares →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-normal text-white mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              También te podría interesar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => {
                const pPrice = p.prices[currency];
                const pOriginal = p.originalPrices?.[currency];
                const pHasDiscount = pOriginal && pOriginal > pPrice;
                return (
                  <Link
                    key={p.id}
                    href={`/productos/${p.slug}`}
                    className="group relative bg-scene-900 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <ProductImage product={p} />
                      {pHasDiscount && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">
                            -{Math.round(((pOriginal! - pPrice) / pOriginal!) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3
                        className="text-white text-sm font-semibold truncate"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {p.name}
                      </h3>
                      <span className="text-accent font-bold text-sm">
                        {formatCurrency(pPrice, currency)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}