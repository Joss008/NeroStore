"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product, Category } from "@/lib/products";
import { useMergedProducts } from "@/lib/useProducts";
import { useCurrency } from "@/lib/currency";
import ProductsList from "./ProductsList";

type SortOption = "popular" | "precio-asc" | "precio-desc" | "nombre";

interface Props {
  staticProducts: Product[];
  categoria?: Category;
  buscar?: string;
  categories: { slug: Category; label: string; emoji: string; description: string }[];
}

export default function ProductosClient({ staticProducts, categoria, buscar, categories }: Props) {
  const { products, loaded } = useMergedProducts(staticProducts);
  const currency = useCurrency();
  const [search, setSearch] = useState(buscar || "");
  const [sort, setSort] = useState<SortOption>("popular");

  const filtered = useMemo(() => {
    let result = [...products];

    if (categoria) {
      result = result.filter((p) => p.category === categoria);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "precio-asc":
        result.sort((a, b) => a.prices[currency] - b.prices[currency]);
        break;
      case "precio-desc":
        result.sort((a, b) => b.prices[currency] - a.prices[currency]);
        break;
      case "nombre":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
      default:
        result.sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
        break;
    }

    return result;
  }, [products, categoria, search, sort, currency]);

  const currentCategory = categories.find((c) => c.slug === categoria);

  return (
    <div className="min-h-screen bg-scene-950 bg-grid">
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-3 sm:mb-4 text-accent">
            {categoria ? currentCategory?.label || categoria : "Catálogo Completo"}
          </span>
          <h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-normal text-white mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {currentCategory?.emoji && <span className="mr-2 sm:mr-3">{currentCategory.emoji}</span>}
            {currentCategory?.label || (categoria ? categoria : "Todos los Productos")}
          </h1>
          <p className="text-white/50 max-w-lg text-sm sm:text-base">
            {currentCategory?.description ||
              "Explora nuestra oferta completa de frutas, gamepasses y servicios."}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="-mx-4 sm:mx-0 mb-5 sm:mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 sm:px-0 min-w-max">
              <Link
                href="/productos"
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  !categoria
                    ? "bg-accent text-white glow-red"
                    : "bg-scene-900 text-white/50 border border-white/10 hover:border-accent/30"
                }`}
              >
                Todos
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/productos?categoria=${encodeURIComponent(cat.slug)}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    categoria === cat.slug
                      ? "bg-accent text-white glow-red"
                      : "bg-scene-900 text-white/50 border border-white/10 hover:border-accent/30"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full bg-scene-900 border border-white/10 rounded-full pl-4 pr-9 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-scene-900 border border-white/10 rounded-full px-3 py-2.5 text-xs text-white/60 focus:outline-none focus:border-accent/50 transition-colors flex-shrink-0"
            >
              <option value="popular">Populares</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
              <option value="nombre">Nombre</option>
            </select>
          </div>

          <p className="text-white/30 text-xs mb-6">
            {loaded ? (
              <>
                {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
                {categoria && ` en ${currentCategory?.label || categoria}`}
                {search && ` para "${search}"`}
              </>
            ) : (
              "Cargando..."
            )}
          </p>

          <ProductsList products={filtered} />
        </div>
      </section>
    </div>
  );
}