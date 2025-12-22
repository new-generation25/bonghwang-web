import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "봉황대협동조합 | Bonghwangdae Cooperative",
  description: "로컬의 시간을 잇다, 봉황대협동조합. CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE",
  openGraph: {
    title: "봉황대협동조합 | Bonghwangdae Cooperative",
    description: "로컬의 시간을 잇다, 봉황대협동조합. CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE",
    type: "website",
    locale: "ko_KR",
    siteName: "봉황대협동조합",
  },
  twitter: {
    card: "summary_large_image",
    title: "봉황대협동조합 | Bonghwangdae Cooperative",
    description: "로컬의 시간을 잇다, 봉황대협동조합. CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE",
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
