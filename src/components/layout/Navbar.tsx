'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-colors duration-300",
            isHome ? "text-white mix-blend-difference" : "text-black bg-white/80 backdrop-blur-md border-b border-gray-100"
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
            </nav>
        </header>
    );
}
