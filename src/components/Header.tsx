"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useCurrencyContext } from "@/lib/currency";
import { CURRENCY_FLAGS, CURRENCY_LABELS } from "@/lib/format";
import type { Currency } from "@/lib/products";
import LoginModal from "./LoginModal";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Catálogo" },
  { href: "/mis-pedidos", label: "Mis Pedidos" },
];

const CURRENCIES: Currency[] = ["PEN", "MXN", "COP"];

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { currency, setCurrency } = useCurrencyContext();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 transition-all duration-300 ${
          scrolled
            ? "top-2 sm:top-3 md:top-4 mx-auto max-w-5xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-full h-14 sm:h-16"
            : "top-0 mx-0 max-w-full bg-transparent border border-transparent rounded-none h-20 sm:h-24"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <img
            src="/logo.png"
            alt="Page Blox"
            className={`h-10 sm:h-11 md:h-12 w-auto object-contain transition-opacity ${
              scrolled ? "opacity-100" : "opacity-90 group-hover:opacity-100"
            }`}
          />
        </Link>

        {/* Desktop nav centrado */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right cluster: currency + cart + user */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto md:ml-0">
          {/* Currency selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 bg-scene-900/70 border border-white/10 hover:border-accent/40 rounded-full pl-2 pr-2.5 py-1.5 text-xs text-white/80 transition-colors"
              aria-label="Cambiar moneda"
            >
              <span className="text-base leading-none">{CURRENCY_FLAGS[currency]}</span>
              <span className="font-semibold">{currency}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {currencyOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-scene-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider px-2 py-1">Moneda</p>
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                        currency === c
                          ? "bg-accent/15 text-accent"
                          : "text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">{CURRENCY_FLAGS[c]}</span>
                      <div className="flex-1">
                        <p className="font-medium">{c}</p>
                        <p className="text-[10px] text-white/40">{CURRENCY_LABELS[c]}</p>
                      </div>
                      {currency === c && <span className="text-accent text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/carrito"
            className="relative text-white/60 hover:text-accent transition-colors p-1.5 sm:p-2"
            aria-label="Carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center glow-red">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-scene-900/70 border border-white/10 hover:border-accent/40 rounded-full pl-1.5 pr-3 py-1.5 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden md:inline text-xs text-white/80 max-w-[80px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-scene-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-white font-medium text-sm truncate">{user.name}</p>
                      <p className="text-white/40 text-xs truncate">
                        {user.countryFlag} {user.countryCode} {user.phone}
                      </p>
                    </div>
                    <Link
                      href="/mis-pedidos"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-accent transition-colors"
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-red-400 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-accent text-white hover:bg-accent-light px-3 sm:px-4 py-1.5 rounded-full font-semibold text-xs sm:text-sm transition-colors hidden sm:inline-block"
            >
              Iniciar Sesión
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-auto flex items-center p-2 rounded-lg text-white/80 hover:text-white transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 transition-all duration-300 ${
                mobileOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 absolute transition-all duration-300 ${
                mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
              }`}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-30 w-[85%] max-w-sm bg-scene-950/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-semibold py-4 border-b border-white/10 text-left transition-all duration-500 ${
                    active ? "text-accent" : "text-white/70 hover:text-white"
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${150 + i * 70}ms` : "0ms",
                    transform: mobileOpen ? "translateX(0)" : "translateX(2rem)",
                    opacity: mobileOpen ? 1 : 0,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div
            className="mt-6 space-y-3 transition-all duration-500"
            style={{
              transitionDelay: mobileOpen ? `${150 + NAV_LINKS.length * 70}ms` : "0ms",
              transform: mobileOpen ? "translateX(0)" : "translateX(2rem)",
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            {/* Currency selector in drawer */}
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Moneda</p>
              <div className="flex gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      currency === c
                        ? "bg-accent text-white glow-red"
                        : "bg-scene-900 text-white/60 border border-white/10"
                    }`}
                  >
                    <span>{CURRENCY_FLAGS[c]}</span>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/carrito"
              onClick={() => setMobileOpen(false)}
              className="block bg-accent text-white text-center py-3 rounded-full font-semibold text-sm glow-red"
            >
              Carrito {totalItems > 0 && `(${totalItems})`}
            </Link>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setLoginOpen(true);
                }}
                className="block w-full border border-accent text-accent text-center py-3 rounded-full font-semibold text-sm"
              >
                Iniciar Sesión
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block w-full border border-white/10 text-white/70 text-center py-3 rounded-full text-sm"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}