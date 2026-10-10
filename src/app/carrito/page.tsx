"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useCurrency } from "@/lib/currency";
import { createOrder, formatOrderDate } from "@/lib/orders";
import { formatCurrency, CURRENCY_CODES } from "@/lib/format";
import type { Currency } from "@/lib/products";
import LoginModal from "@/components/LoginModal";

const paymentMethods = [
  { value: "yape", label: "Yape (Perú)" },
  { value: "plin", label: "Plin (Perú)" },
  { value: "transferencia-pe", label: "Transferencia Bancaria (PE)" },
  { value: "oxxo", label: "OXXO (México)" },
  { value: "spei", label: "SPEI (México)" },
  { value: "transferencia-mx", label: "Transferencia Bancaria (MX)" },
  { value: "nequi", label: "Nequi (Colombia)" },
  { value: "daviplata", label: "Daviplata (Colombia)" },
  { value: "transferencia-co", label: "Transferencia Bancaria (CO)" },
  { value: "otro", label: "Otro (a coordinar)" },
];

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, updateNotes, clearCart, totalItems, totalPriceByCurrency } = useCart();
  const { isAuthenticated, user } = useAuth();
  const currency = useCurrency();
  const [loginOpen, setLoginOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("yape");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ code: string } | null>(null);

  const hasItems = items.length > 0;
  const cartCurrency: Currency = hasItems ? items[0].currency : currency;
  const totalForCurrency = totalPriceByCurrency[cartCurrency];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || !user) return;
    setSubmitting(true);

    setTimeout(() => {
      try {
        const order = createOrder(
          {
            name: user.name,
            phone: user.phone,
            countryCode: user.countryCode,
            countryFlag: user.countryFlag,
          },
          items,
          paymentMethod,
          notes
        );
        setResult({ code: order.code });
        clearCart();
        setNotes("");
      } catch {
        // ignore
      } finally {
        setSubmitting(false);
      }
    }, 800);
  }

  if (result) {
    return (
      <div className="min-h-screen bg-scene-950 flex items-center justify-center px-4 bg-grid">
        <div className="max-w-lg w-full text-center">
          <div className="bg-scene-900 border border-accent/20 rounded-2xl p-6 sm:p-10 glow-red" style={{ animation: "fade-in-up 0.5s ease-out" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-accent/10 border border-accent/30 glow-red">
              <span className="text-accent text-4xl">✓</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              ¡Pedido Enviado!
            </h1>
            <p className="text-white/60 mb-6 text-sm">
              Tu pedido ha sido registrado. Nos pondremos en contacto contigo pronto para confirmar el pago y la entrega.
            </p>
            <div className="bg-scene-950 border border-white/10 rounded-xl p-4 sm:p-5 mb-6">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Tu código de seguimiento</p>
              <p
                className="text-3xl sm:text-4xl font-bold text-accent glow-text mb-2 break-all"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {result.code}
              </p>
              <p className="text-xs text-white/40">
                Guarda este código para consultar tu pedido
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/mis-pedidos"
                className="bg-accent text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors glow-red"
              >
                Ver Mis Pedidos
              </Link>
              <Link
                href="/productos"
                className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/5 transition-colors"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-scene-950 bg-grid">
        <section className="relative py-14 sm:py-28 px-4 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto relative z-10">
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-3 sm:mb-4 text-accent">
              Carrito
            </span>
            <h1
              className="text-3xl xs:text-4xl sm:text-5xl font-normal text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Tu carrito está vacío
            </h1>
          </div>
        </section>
        <div className="py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-scene-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-4xl">
            🛒
          </div>
          <p className="text-white/60 mb-2 text-lg">No tienes items en tu carrito</p>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Explora nuestro catálogo y agrega frutas, gamepasses o servicios para hacer tu pedido.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors glow-red"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const multipleCurrencies = Object.values(totalPriceByCurrency).filter((v) => v > 0).length > 1;

  return (
    <div className="min-h-screen bg-scene-950 bg-grid">
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-3 sm:mb-4 text-accent">
            Carrito
          </span>
          <h1
            className="text-3xl xs:text-4xl sm:text-5xl font-normal text-white mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Tu Carrito
            <span className="text-accent ml-2 sm:ml-3">({totalItems})</span>
          </h1>
          <p className="text-white/40 text-sm">
            {totalItems} {totalItems === 1 ? "item seleccionado" : "items seleccionados"}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {!isAuthenticated && (
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 justify-between">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  🔒
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">Necesitas iniciar sesión</p>
                  <p className="text-white/50 text-xs mt-0.5">
                    Ingresa tu nombre y teléfono para hacer el pedido
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLoginOpen(true)}
                className="bg-accent text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors glow-red w-full sm:w-auto"
              >
                Iniciar Sesión
              </button>
            </div>
          )}

          {multipleCurrencies && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 text-sm">
              <p className="text-yellow-200 font-medium mb-2">Tu carrito tiene items en varias monedas</p>
              <div className="space-y-1 text-xs text-white/70">
                {Object.entries(totalPriceByCurrency).map(([c, total]) =>
                  total > 0 ? (
                    <div key={c} className="flex justify-between">
                      <span>{CURRENCY_CODES[c as Currency]}:</span>
                      <span className="font-semibold text-white">{formatCurrency(total, c as Currency)}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-3">
{items.map((item) => (
                  <div
                    key={`${item.productId}-${item.mode}`}
                    className="bg-scene-900 border border-white/5 rounded-2xl p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <div
                          className="w-full h-full flex items-center justify-center text-4xl"
                          style={{ background: item.image }}
                        >
                          {item.productName.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={`/productos/${item.slug}`}
                            className="text-white font-medium text-sm sm:text-base hover:text-accent transition-colors truncate"
                          >
                            {item.productName}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.mode)}
                            className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                            aria-label="Eliminar"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            {item.category}
                          </span>
                          <span className="inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-scene-800 text-white/60 border border-white/10">
                            {item.currency}
                          </span>
                          <span
                            className={`inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                              item.mode === "permanente"
                                ? "bg-green-500/10 text-green-400 border-green-500/30"
                                : "bg-orange-500/10 text-orange-400 border-orange-500/30"
                            }`}
                          >
                            {item.mode === "permanente" ? "♾️ Permanente" : "🕐 Físico"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.mode, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 rounded-full bg-scene-950 border border-white/10 flex items-center justify-center text-white/50 hover:border-accent/40 hover:text-accent transition-all disabled:opacity-30"
                              aria-label="Disminuir"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                            <span className="w-8 text-center text-white text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.mode, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-scene-950 border border-white/10 flex items-center justify-center text-white/50 hover:border-accent/40 hover:text-accent transition-all"
                              aria-label="Aumentar"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                          </div>

                          <span className="text-accent font-bold text-sm sm:text-base">
                            {formatCurrency(item.price * item.quantity, item.currency)}
                          </span>
                        </div>

                        <div className="mt-3">
                          <textarea
                            rows={1}
                            value={item.notes}
                            onChange={(e) => updateNotes(item.productId, item.mode, e.target.value)}
                            className="w-full bg-scene-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-white/20"
                            placeholder="Notas para este item (ej: nombre de tu personaje)..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-white/30 hover:text-red-400 text-xs transition-colors mt-2"
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-scene-900 border border-white/5 rounded-2xl p-5 space-y-3">
                    <h3
                      className="text-base font-semibold text-white"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Resumen
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/50">
                        <span>Items ({totalItems})</span>
                        <span>{formatCurrency(totalForCurrency, cartCurrency)}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Entrega</span>
                        <span className="text-accent">A coordinar</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                        <span className="text-white font-bold">Total</span>
                        <span
                          className="text-2xl font-bold text-accent glow-text"
                          style={{ fontFamily: "var(--font-cormorant)" }}
                        >
                          {formatCurrency(totalForCurrency, cartCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isAuthenticated && user && (
                    <div className="bg-scene-900 border border-white/5 rounded-2xl p-5 space-y-4">
                      <div>
                        <h3
                          className="text-base font-semibold text-white"
                          style={{ fontFamily: "var(--font-cormorant)" }}
                        >
                          Confirmar Pedido
                        </h3>
                        <p className="text-xs text-white/40 mt-1">
                          Enviando como{" "}
                          <span className="text-white">{user.name}</span> · {user.countryFlag} {user.countryCode} {user.phone}
                        </p>
                      </div>

                      <div>
                        <label className="label-base">Método de pago</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-scene-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                        >
                          {paymentMethods.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label-base">Notas del pedido (opcional)</label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-scene-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors resize-none"
                          placeholder="Detalles adicionales, tu nombre de Roblox, etc..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-accent text-white py-3.5 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors disabled:opacity-50 glow-red"
                      >
                        {submitting ? "Enviando..." : "Enviar Pedido"}
                      </button>
                      <p className="text-white/30 text-xs text-center">
                        Al enviar aceptas nuestros términos y condiciones
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
