'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // 초기 테마 설정
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(newTheme);
        html.style.colorScheme = newTheme;
        
        // 커스텀 이벤트 발생 (ThemeProvider가 감지하도록)
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }));
    };

    if (!mounted) {
        return (
            <header className={cn(
                "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-colors duration-300",
                isHome ? "text-white mix-blend-difference" : "text-foreground bg-background/80 backdrop-blur-md border-b border-border"
            )}>
                <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
                    BONGHWANGDAE
                </Link>
                <nav className="flex items-center gap-6">
                    <div className="w-8 h-8" /> {/* 플레이스홀더 */}
                </nav>
            </header>
        );
    }

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-colors duration-300",
            isHome ? "text-white mix-blend-difference" : "text-foreground bg-background/80 backdrop-blur-md border-b border-border"
        )}>
            <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
                BONGHWANGDAE
            </Link>

            <nav className="flex items-center gap-6">
                <Link href="/projects" className={cn("text-sm font-medium tracking-wide hover:text-accent transition-colors", pathname === '/projects' && "text-accent")}>
                    Projects
                </Link>
                <Link href="/contact" className={cn("text-[13px] font-medium tracking-wide hover:text-accent transition-colors", pathname === '/contact' && "text-accent")}>
                    Contact
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className={cn(
                        "h-8 w-8 rounded-full transition-colors",
                        isHome ? "text-white hover:bg-white/20" : "hover:bg-secondary"
                    )}
                    aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
                >
                    {theme === 'light' ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            </nav>
        </header>
    );
}
