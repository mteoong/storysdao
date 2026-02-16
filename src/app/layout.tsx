import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletProvider from "@/components/WalletProvider";
import { InventoryProvider } from "@/context/InventoryContext";
import { WorldsProvider } from "@/context/WorldsContext";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Storysdao — Onchain 3D Game Engine",
  description:
    "A Roblox-style 3D game platform with an onchain $SDAO economy on Monad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <WalletProvider>
          <InventoryProvider>
            <WorldsProvider>
              <Navbar />
              <main className="pt-16 min-h-screen">{children}</main>
            </WorldsProvider>
          </InventoryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
