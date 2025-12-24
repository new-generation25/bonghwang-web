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
import { ThemeProvider } from "@/components/NoDarkMode";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 즉시 실행하여 깜빡임 방지 - 라이트 모드를 기본값으로 강제 설정
                  const html = document.documentElement;
                  
                  // 1단계: 먼저 라이트 모드를 기본값으로 강제 설정
                  html.classList.remove('dark');
                  html.classList.add('light');
                  html.style.colorScheme = 'light';
                  html.style.setProperty('--background', '0 0% 100%');
                  html.style.setProperty('--foreground', '0 0% 0%');
                  
                  // 2단계: 저장된 테마가 있으면 적용 (없으면 라이트 모드 유지)
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'dark') {
                    html.classList.remove('light');
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                    html.style.setProperty('--background', '0 0% 10%');
                    html.style.setProperty('--foreground', '0 0% 98%');
                  } else {
                    // 저장된 테마가 없거나 'light'이면 라이트 모드 유지
                    html.classList.remove('dark');
                    html.classList.add('light');
                    html.style.colorScheme = 'light';
                    html.style.setProperty('--background', '0 0% 100%');
                    html.style.setProperty('--foreground', '0 0% 0%');
                  }
                } catch(e) {
                  // 에러 발생 시에도 라이트 모드 유지
                  const html = document.documentElement;
                  html.classList.remove('dark');
                  html.classList.add('light');
                  html.style.colorScheme = 'light';
                  html.style.setProperty('--background', '0 0% 100%');
                  html.style.setProperty('--foreground', '0 0% 0%');
                }
              })();
            `,
          }}
        />
        <ThemeProvider />
        <Navbar />
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
