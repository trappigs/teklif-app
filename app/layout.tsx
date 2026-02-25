import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://teklif.bereketlitopraklar.com.tr"),
  title: "Bereketli Topraklar | Güvenilir Arsa Yatırımı",
  description: "Doğayla iç içe, geleceğe değer katan arsa fırsatları.",
  icons: {
    icon: "/32x32.png",
    apple: "/192x192.png",
  },
  openGraph: {
    title: "Bereketli Topraklar | Güvenilir Arsa Yatırımı",
    description: "Doğayla iç içe, geleceğe değer katan arsa fırsatları.",
    url: "https://teklif.bereketlitopraklar.com.tr", // Generic domain placeholder
    siteName: "Bereketli Topraklar",
    images: [
      {
        url: "/192x192.png",
        width: 192,
        height: 192,
        alt: "Bereketli Topraklar Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Bereketli Topraklar | Güvenilir Arsa Yatırımı",
    description: "Doğayla iç içe, geleceğe değer katan arsa fırsatları.",
    images: ["/192x192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-stone-50 text-stone-800 antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}