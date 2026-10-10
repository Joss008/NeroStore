import Link from "next/link";
import { getFeatured, categories, products as allProducts } from "@/lib/products";
import FeaturedProducts from "./FeaturedProducts";

export default function Home() {
  const featured = getFeatured();
  const newArrivals = [...allProducts].slice(-8).reverse();

  return (
    <div className="bg-grid">
      {/* HERO - estilo e-commerce */}
      <section className="relative w-full overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-scene-950 to-scene-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.1),transparent_50%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />

              </div>
              <h1
                className="font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                <span className="text-white block">Frutas, gamepasses</span>
                <span className="block mt-1 text-accent glow-text">
                  y servicios al instante
                </span>
              </h1>
              <p className="text-white/60 text-sm sm:text-base max-w-xl leading-relaxed pt-2">
                Catálogo profesional de frutas Blox Fruits, gamepasses y servicios de farmeo. Atención personalizada y precios justos.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                <Link
                  href="/productos"
                  className="bg-accent hover:bg-accent-light text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-full transition-all active:scale-[0.97] glow-red"
                >
                  VER CATÁLOGO COMPLETO
                </Link>
                <Link
                  href="/productos?categoria=Servicios"
                  className="border border-white/20 text-white hover:bg-white/5 font-semibold text-sm sm:text-base px-6 py-3 rounded-full transition-all"
                >
                  Ver servicios
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
              <div className="relative w-96 h-96">
                {/* Glow de fondo */}
                <div className="absolute inset-0 rounded-full bg-accent/30 blur-3xl animate-pulse" />

                {/* Centro: Dragon (el más notorio) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 to-red-900/40 blur-2xl" />
                    <img
                      src="/hero-dragon.png"
                      alt="Dragon fruit"
                      className="relative w-full h-full object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                    />
                  </div>
                </div>

                {/* Top-right: Kitsune */}
                <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-legendary/30 border border-legendary/50 flex items-center justify-center backdrop-blur-sm overflow-hidden p-1">
                  <img src="/hero-kitsune.png" alt="Kitsune fruit" className="w-full h-full object-contain" />
                </div>

                {/* Bottom-left: Magnet */}
                <div className="absolute -bottom-2 -left-2 w-20 h-20 rounded-full bg-rare/30 border border-rare/50 flex items-center justify-center backdrop-blur-sm overflow-hidden p-1">
                  <img src="/hero-magnet.png" alt="Magnet fruit" className="w-full h-full object-contain" />
                </div>

                {/* Top-left: Rumble */}
                <div className="absolute top-16 -left-10 w-16 h-16 rounded-full bg-mythic/30 border border-mythic/50 flex items-center justify-center backdrop-blur-sm overflow-hidden p-1">
                  <img src="/hero-rumble.png" alt="Rumble fruit" className="w-full h-full object-contain" />
                </div>

                {/* Bottom-right: Kitsune (segundo) */}
                <div className="absolute -bottom-4 right-4 w-14 h-14 rounded-full bg-accent/30 border border-accent/50 flex items-center justify-center backdrop-blur-sm overflow-hidden p-1">
                  <img src="/hero-kitsune.png" alt="Kitsune fruit" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-accent">
                Categorías
              </span>
              <h2
                className="text-2xl sm:text-3xl font-normal text-white"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Explora el catálogo
              </h2>
            </div>
            <Link
              href="/productos"
              className="text-accent text-sm hover:text-accent-light transition-colors hidden sm:block"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/productos?categoria=${encodeURIComponent(cat.slug)}`}
                className="group relative bg-scene-900 border border-white/5 hover:border-accent/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-500" />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {cat.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="text-white text-sm font-semibold mb-0.5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {cat.label}
                    </h3>
                    <p className="text-white/40 text-[11px] line-clamp-1">{cat.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTAS - productos con descuento */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-scene-900/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-yellow-400">
                🔥 Ofertas
              </span>
              <h2
                className="text-2xl sm:text-3xl font-normal text-white"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Precios imperdibles
              </h2>
            </div>
            <Link
              href="/productos"
              className="text-accent text-sm hover:text-accent-light transition-colors hidden sm:block"
            >
              Ver todas →
            </Link>
          </div>
          <FeaturedProducts products={allProducts.filter((p) => p.originalPrices && Object.values(p.originalPrices).some((v) => v && v > 0)).slice(0, 8)} />
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      {featured.length > 0 && (
        <section className="py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-accent">
                  Más vendidos
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-normal text-white"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Los favoritos de la comunidad
                </h2>
              </div>
              <Link
                href="/productos"
                className="text-accent text-sm hover:text-accent-light transition-colors hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>
            <FeaturedProducts products={featured} />
          </div>
        </section>
      )}

      {/* NUEVOS INGRESOS */}
      {newArrivals.length > 0 && (
        <section className="py-10 sm:py-14 px-4 sm:px-6 bg-scene-900/30 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-green-400">
                  ✨ Recientes
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-normal text-white"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Novedades del catálogo
                </h2>
              </div>
            </div>
            <FeaturedProducts products={newArrivals} />
          </div>
        </section>
      )}

      {/* POR QUÉ COMPRAR AQUÍ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-accent/10 via-transparent to-transparent border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase block mb-2 text-accent">
              Por qué elegirnos
            </span>
            <h2
              className="text-3xl sm:text-4xl font-normal text-white max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              La forma más segura de comprar en Blox Fruits
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <div className="bg-scene-900 border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>100% seguro</h3>
              <p className="text-white/50 text-xs leading-relaxed">Trabajamos con métodos verificados y cuentas profesionales. Cero estafas.</p>
            </div>
            <div className="bg-scene-900 border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>Soporte directo</h3>
              <p className="text-white/50 text-xs leading-relaxed">Atención personalizada por WhatsApp. Resolvemos cualquier duda.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}