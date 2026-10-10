import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-scene-900 border-t border-white/5 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Page Blox" className="h-[67px] w-auto" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-4 max-w-sm">
              Catálogo especializado en frutas Blox Fruits, gamepasses y servicios profesionales de farmeo.
            </p>
            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span>🇵🇪</span> PEN
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span>🇲🇽</span> MXN
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span>🇨🇴</span> COP
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-scene-800 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/30 transition-all"
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L17.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-scene-800 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Discord"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Catálogo */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Catálogo</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/productos?categoria=Mythical+Fruits" className="text-white/40 hover:text-accent transition-colors">
                  Frutas Míticas
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=Legendary+Fruits" className="text-white/40 hover:text-accent transition-colors">
                  Frutas Legendarias
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=Rare+Fruits" className="text-white/40 hover:text-accent transition-colors">
                  Frutas Raras
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=Gamepasses" className="text-white/40 hover:text-accent transition-colors">
                  Gamepasses
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=Servicios" className="text-white/40 hover:text-accent transition-colors">
                  Servicios
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ayuda</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li>
                <Link href="/mis-pedidos" className="hover:text-accent transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-accent transition-colors">
                  Ver Catálogo
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Preguntas frecuentes</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Términos y condiciones</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Política de privacidad</a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                WhatsApp 24/7
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                contacto@pageblox.com
              </li>
              <li className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Lun - Dom: 9:00 - 22:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Page Blox. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/30">
            <span>No afiliado con Roblox Corp.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}