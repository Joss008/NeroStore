import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { CurrencyProvider } from "@/lib/currency";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Page Blox | Catálogo de Frutas, Gamepasses y Servicios",
  description:
    "Catálogo digital de frutas Blox Fruits, gamepasses y servicios de farmeo. Frutas míticas, legendarias, raras y servicios profesionales para tu cuenta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="min-h-screen pt-24">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
