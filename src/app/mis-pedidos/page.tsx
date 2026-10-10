"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getOrders, statusLabels, statusColors, formatOrderDate, type Order } from "@/lib/orders";
import { formatCurrency } from "@/lib/format";
import type { Currency } from "@/lib/products";

export default function MisPedidosPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setOrders(getOrders(user.phone));
    } else {
      setOrders([]);
    }
    setLoaded(true);
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-scene-950 bg-grid">
        <section className="relative py-14 sm:py-28 px-4 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto relative z-10">
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-3 sm:mb-4 text-accent">
              Mis Pedidos
            </span>
            <h1
              className="text-3xl xs:text-4xl sm:text-5xl font-normal text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Tus pedidos
            </h1>
          </div>
        </section>
        <div className="py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-scene-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-4xl">
            🔒
          </div>
          <p className="text-white/60 mb-2 text-lg">Necesitas iniciar sesión</p>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Ingresa tu nombre y teléfono para ver tu historial de pedidos.
          </p>
          <Link
            href="/"
            className="inline-block bg-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors glow-red"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-scene-950 flex items-center justify-center">
        <div className="text-white/40 text-sm">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scene-950 bg-grid">
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-3 sm:mb-4 text-accent">
            Mis Pedidos
          </span>
          <h1
            className="text-3xl xs:text-4xl sm:text-5xl font-normal text-white mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Historial
          </h1>
          <p className="text-white/50 text-sm break-words">
            {user?.name} · {user?.countryFlag} {user?.countryCode} {user?.phone}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-scene-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-4xl">
                📋
              </div>
              <p className="text-white/60 mb-2 text-lg">Aún no tienes pedidos</p>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Cuando hagas tu primer pedido aparecerá aquí con su código de seguimiento.
              </p>
              <Link
                href="/productos"
                className="inline-block bg-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors glow-red"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/40 text-sm">
                  {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
                </p>
              </div>

              {orders.map((order) => {
                const currencies = Object.entries(order.totalsByCurrency || {});
                return (
                  <div
                    key={order.code}
                    className="bg-scene-900 border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-accent/20 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p
                            className="text-xl sm:text-2xl font-bold text-accent glow-text break-all"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                          >
                            {order.code}
                          </p>
                          <span
                            className={`text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded-full border ${statusColors[order.status]}`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs">{formatOrderDate(order.createdAt)}</p>
                      </div>
                      <div className="sm:text-right space-y-0.5">
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5 sm:mb-1">Total</p>
                        {currencies.length > 0 ? (
                          currencies.map(([c, total]) => (
                            <p
                              key={c}
                              className="text-lg sm:text-xl font-bold text-accent"
                              style={{ fontFamily: "var(--font-cormorant)" }}
                            >
                              {formatCurrency(total, c as Currency)}
                            </p>
                          ))
                        ) : (
                          <p
                            className="text-xl sm:text-2xl font-bold text-accent"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                          >
                            {formatCurrency(order.total, order.currency as Currency)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between text-sm py-1.5 gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-white/40 text-xs w-6 text-center flex-shrink-0">
                              {item.quantity}×
                            </span>
                            <span className="text-white truncate">{item.productName}</span>
                            <span className="text-[10px] uppercase text-white/40 ml-1 flex-shrink-0">{item.currency}</span>
                          </div>
                          <span className="text-white/50 text-xs whitespace-nowrap flex-shrink-0">
                            {formatCurrency(item.subtotal, item.currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">
                          Notas
                        </p>
                        <p className="text-white/70 text-xs break-words">{order.notes}</p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs gap-2">
                      <span className="text-white/40 truncate">
                        Pago: <span className="text-white/70">{order.paymentMethod.replace(/-/g, " ")}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
