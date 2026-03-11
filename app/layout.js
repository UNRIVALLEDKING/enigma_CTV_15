import { Inter } from "next/font/google";
import "./globals.css";
import { FuturisticBackground } from "@/components/FuturisticBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "FutureTwin | Meet Your 2035 Self",
  description: "Explore your future life and career in 2035 with AI simulation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        <FuturisticBackground />
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
