import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./components/navbar";
import { ShopProvider } from "@/context/shop-context";
import CartDrawer from "./components/cart-drawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Masters Pool | Break Feeling",
  description: "Premium billiard lounge and professional pro-shop experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "font-sans antialiased bg-black text-white")}>
        <ShopProvider>
          <Navbar />
          {/* Add a main wrapper with padding-top to prevent navbar overlap on all pages */}
          <main className="pt-20 min-h-screen">
            {children}
          </main>
          <CartDrawer />
        </ShopProvider>
      </body>
    </html>
  );
}