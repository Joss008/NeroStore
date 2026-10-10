"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type ProductMode } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";
import type { Currency } from "@/lib/products";

interface Props {
  productId: string;
  productName: string;
  slug: string;
  price: number;
  currency: Currency;
  mode?: ProductMode;
  image: string;
  category: string;
}

export default function AddToCartButton({
  productId,
  productName,
  slug,
  price,
  currency,
  mode = "permanente",
  image,
  category,
}: Props) {
  const { addItem, items } = useCart();
  const currentCurrency = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === productId && i.mode === mode);

  function handleAdd() {
    addItem({ productId, productName, slug, price, currency, mode, image, category, notes: "", quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function buyNow() {
    addItem({ productId, productName, slug, price, currency, mode, image, category, notes: "", quantity });
    window.location.href = "/carrito";
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Cantidad</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-scene-900 border border-white/10 flex items-center justify-center text-white/60 hover:border-accent/40 hover:text-accent transition-all"
            aria-label="Disminuir"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="w-12 text-center text-white font-medium text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full bg-scene-900 border border-white/10 flex items-center justify-center text-white/60 hover:border-accent/40 hover:text-accent transition-all"
            aria-label="Aumentar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-scene-900 border border-white/5 rounded-xl px-4 py-3">
        <span className="text-white/50 text-sm">Subtotal</span>
        <span className="text-accent font-bold text-lg">
          {formatCurrency(price * quantity, currentCurrency)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleAdd}
          className={`py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            added
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-scene-800 border border-white/10 text-white hover:bg-scene-700"
          }`}
        >
          {added ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Agregado
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Agregar
            </>
          )}
        </button>
        <button
          onClick={buyNow}
          className="bg-accent text-white py-3 rounded-full font-semibold text-sm hover:bg-accent-light glow-red transition-colors"
        >
          Comprar ya
        </button>
      </div>

      {inCart && (
        <Link
          href="/carrito"
          className="block w-full text-center text-accent text-sm hover:text-accent-light transition-colors py-2"
        >
          Ya tienes {inCart.quantity} en tu carrito. Ver carrito →
        </Link>
      )}
    </div>
  );
}