import { useEffect, useState } from "react";

export interface PaymentMethod {
  id: string;
  name: string;
  accountHolder?: string;
  accountNumber?: string;
  imageData?: string;
  imageUrl?: string;
  currency?: string;
  enabled?: boolean;
}

export const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "seed-yape", name: "Yape (Perú)", currency: "PEN", enabled: true },
  { id: "seed-plin", name: "Plin (Perú)", currency: "PEN", enabled: true },
  { id: "seed-transferencia-pe", name: "Transferencia Bancaria (PE)", currency: "PEN", enabled: true },
  { id: "seed-oxxo", name: "OXXO (México)", currency: "MXN", enabled: true },
  { id: "seed-spei", name: "SPEI (México)", currency: "MXN", enabled: true },
  { id: "seed-transferencia-mx", name: "Transferencia Bancaria (MX)", currency: "MXN", enabled: true },
  { id: "seed-nequi", name: "Nequi (Colombia)", currency: "COP", enabled: true },
  { id: "seed-daviplata", name: "Daviplata (Colombia)", currency: "COP", enabled: true },
  { id: "seed-transferencia-co", name: "Transferencia Bancaria (CO)", currency: "COP", enabled: true },
  { id: "seed-otro", name: "Otro (a coordinar)", enabled: true },
];

const STORAGE_KEY = "blox-payment-methods";

const API_ENDPOINTS = [
  "/api/payment-methods",
  "https://nerostorepwa.onrender.com/admin/api/payment-methods",
  "http://localhost:3001/admin/api/payment-methods",
  "http://localhost:3000/api/payment-methods",
];

function readCached(): PaymentMethod[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as PaymentMethod[]) : null;
  } catch {
    return null;
  }
}

function writeCached(methods: PaymentMethod[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
  } catch {
    // ignore
  }
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[] | null> {
  for (const ep of API_ENDPOINTS) {
    try {
      const res = await fetch(ep, { cache: "no-store", signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.methods) && data.methods.length > 0) {
          return data.methods as PaymentMethod[];
        }
      }
    } catch {
      // probar siguiente
    }
  }
  return null;
}

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>(SEED_PAYMENT_METHODS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const remote = await fetchPaymentMethods();
      if (cancelled) return;
      if (remote && remote.length > 0) {
        setMethods(remote);
        writeCached(remote);
      } else {
        const cached = readCached();
        if (cached) setMethods(cached);
      }
      setLoading(false);
    }

    load();
    window.addEventListener("focus", load);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", load);
    };
  }, []);

  return { methods, loading };
}
