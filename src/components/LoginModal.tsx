"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { COUNTRY_CODES, type CountryCode } from "@/lib/countries";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Tu nombre es requerido";
    else if (name.trim().length < 2) e.name = "Ingresa un nombre válido";
    if (!phone.trim()) e.phone = "Tu teléfono es requerido";
    else {
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length < 7) e.phone = "Ingresa un teléfono válido (mínimo 7 dígitos)";
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setTimeout(() => {
      login(name, phone, country.dial, country.flag);
      setSubmitting(false);
      setName("");
      setPhone("");
      setErrors({});
      onClose();
      onSuccess?.();
    }, 500);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay" onClick={onClose}>
      <div
        className="bg-scene-900 border border-white/10 rounded-2xl max-w-md w-full p-7 shadow-2xl glow-red"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fade-in-up 0.3s ease-out" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Iniciar Sesión
            </h2>
            <p className="text-white/40 text-xs mt-1">Necesario para hacer pedidos</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-base">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="Tu nombre completo"
              className="input-base"
              autoFocus
            />
            {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="label-base">Teléfono *</label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCountryOpen(!countryOpen)}
                  className="h-full bg-scene-900 border border-white/10 rounded-xl px-3 py-3 text-sm text-white flex items-center gap-2 hover:border-accent/40 transition-colors min-w-[110px]"
                  aria-label="Seleccionar código de país"
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="font-medium">{country.dial}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 ml-auto">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {countryOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCountryOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-64 max-h-72 overflow-y-auto bg-scene-900 border border-white/10 rounded-xl shadow-2xl z-50">
                      <div className="p-2 border-b border-white/5 sticky top-0 bg-scene-900">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider px-2 py-1">País</p>
                      </div>
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setCountryOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                            country.code === c.code
                              ? "bg-accent/15 text-accent"
                              : "text-white/70 hover:bg-white/5"
                          }`}
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="font-medium">{c.dial}</span>
                          <span className="text-white/50 text-xs flex-1">{c.label}</span>
                          {country.code === c.code && <span className="text-accent text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((p) => ({ ...p, phone: "" }));
                }}
                placeholder="987654321"
                className="input-base flex-1"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
            <p className="text-white/30 text-[10px] mt-1.5">
              {country.flag} {country.label} · {country.dial} {phone || "987654321"}
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-white py-3 rounded-full font-semibold text-sm hover:bg-accent-light transition-colors disabled:opacity-50 glow-red mt-2"
          >
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-white/30 text-xs text-center pt-2">
            No guardamos contraseñas. Tu sesión se mantiene en este dispositivo.
          </p>
        </form>
      </div>
    </div>
  );
}