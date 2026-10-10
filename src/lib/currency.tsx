"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Currency } from "./products";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);
const STORAGE_KEY = "blox-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("PEN");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "PEN" || saved === "MXN" || saved === "COP") {
        setCurrencyState(saved);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): Currency {
  const ctx = useContext(CurrencyContext);
  if (!ctx) return "PEN";
  return ctx.currency;
}

export function useCurrencySetter(): (c: Currency) => void {
  const ctx = useContext(CurrencyContext);
  if (!ctx) return () => {};
  return ctx.setCurrency;
}

export function useCurrencyContext(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return { currency: "PEN", setCurrency: () => {} };
  }
  return ctx;
}
