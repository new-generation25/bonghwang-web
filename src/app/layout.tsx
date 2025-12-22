import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bonghwang-web.vercel.app'),
  title: {
    default: "봉황대협동조합",
    template: "%s | 봉황대협동조합"
  },
  description: "로컬의 시간을 잇다, 봉황대협동조합. CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE",
  keywords: ["봉황대협동조합", "Bonghwangdae Cooperative", "협동조합", "지역관광", "김해"],
  authors: [{ name: "봉황대협동조합" }],
  openGraph: {
    title: "봉황대협동조합",
    description: "로컬의 시간을 잇다, 봉황대협동조합. CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE",
    type: "website",
    locale: "ko_KR",
    siteName: "봉황대협동조합",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "봉황대협동조합",
    description: "로컬의 시간을 잇다, 봉황대협동조합. CONNECTING LOCAL TIME, BONGHWANGDAE COOPERATIVE",
  },
  alternates: {
    canonical: "/",
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
