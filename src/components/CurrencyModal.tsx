"use client";

import { useEffect } from "react";
import CircularCarousel from "./CircularCarousel";
import { CURRENCY_COUNTRIES, CURRENCY_FLAG_IMAGES, CURRENCY_LABELS } from "@/lib/format";
import type { Currency } from "@/lib/products";

const CURRENCIES: Currency[] = ["PEN", "MXN", "COP"];

interface CurrencyModalProps {
  open: boolean;
  currency: Currency;
  onSelect: (c: Currency) => void;
  onClose: () => void;
}

export default function CurrencyModal({ open, currency, onSelect, onClose }: CurrencyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const items = CURRENCIES.map((c) => ({
    src: CURRENCY_FLAG_IMAGES[c],
    alt: `Bandera de ${CURRENCY_COUNTRIES[c]}`,
    title: CURRENCY_COUNTRIES[c],
    subtitle: CURRENCY_LABELS[c],
  }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Elegir país"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-scene-950/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden fade-in-up">
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="text-white font-bold text-lg">Elige tu país</h2>
            <p className="text-white/50 text-sm mt-0.5">Los precios se mostrarán en tu moneda local</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-accent/40 transition-colors flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="h-[340px] sm:h-[380px] select-none">
          <CircularCarousel
            items={items}
            initialIndex={CURRENCIES.indexOf(currency)}
            label="Selector de país y moneda"
            preset="orbit"
            intro="rise"
            captions
            aspectRatio={1.5}
            cardWidth={220}
            gap={24}
            speed={10}
            autoplay="drift"
            pauseOnHover
            draggable
            snap
            focusOnClick
            fadeColor="#050505"
            cornerRadius={14}
            onItemClick={(_, index) => {
              onSelect(CURRENCIES[index]);
              onClose();
            }}
          />
        </div>

        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <p className="text-[11px] text-white/40">Arrastra para girar · toca una bandera para elegir</p>
          <span className="text-[11px] font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-1">
            Actual: {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
