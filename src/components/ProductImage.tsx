"use client";

import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function ProductImage({ product, size = "md", className = "" }: Props) {
  const src = product.imageData || product.imageUrl;
  const fontSize =
    size === "sm" ? "text-4xl" : size === "md" ? "text-7xl sm:text-8xl" : size === "lg" ? "text-[140px]" : "text-[180px] sm:text-[220px]";

  if (src) {
    return (
      <img
        src={src}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{ background: product.gradient }}
    >
      <span className={`${fontSize} drop-shadow-2xl`}>{product.emoji}</span>
    </div>
  );
}
